[CmdletBinding()]
param(
    [string]$RepositoryPath = 'D:\JzStudio\Jz.Studio'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$integrationBranch = 'JzStudio'
$featureBranches = @(
    'jzshell',
    'chorodash',
    'technical-analysis'
)

function Invoke-Git {
    param(
        [Parameter(Mandatory)]
        [string[]]$Arguments
    )

    & git @Arguments

    if ($LASTEXITCODE -ne 0) {
        throw "Git failed: git $($Arguments -join ' ')"
    }
}

function Get-GitValue {
    param(
        [Parameter(Mandatory)]
        [string[]]$Arguments
    )

    $value = & git @Arguments

    if ($LASTEXITCODE -ne 0) {
        throw "Git failed: git $($Arguments -join ' ')"
    }

    return ($value | Out-String).Trim()
}

function Assert-CleanWorkingTree {
    $status = Get-GitValue -Arguments @('status', '--porcelain')

    if ($status) {
        throw 'The working tree is not clean. Commit or preserve the changes before converging.'
    }
}

function Request-TestGate {
    param(
        [Parameter(Mandatory)]
        [string]$BranchName
    )

    $stopAngularServer = Get-Command Stop-AngularServer -ErrorAction SilentlyContinue

    if ($stopAngularServer) {
        Stop-AngularServer
    }

    Write-Host ''
    Write-Host "Test the '$BranchName' seam from Visual Studio on '$integrationBranch'." -ForegroundColor Cyan
    Write-Host "Enter 'passed' only after the integrated solution works." -ForegroundColor Cyan

    $result = Read-Host 'Test result'

    if ($result.Trim() -ne 'passed') {
        throw "The '$BranchName' seam was not approved. Nothing from this seam was pushed."
    }
}

try {
    if (-not (Test-Path -LiteralPath $RepositoryPath -PathType Container)) {
        throw "Repository path not found: $RepositoryPath"
    }

    Set-Location -LiteralPath $RepositoryPath

    $repositoryRoot = Get-GitValue -Arguments @('rev-parse', '--show-toplevel')
    $repositoryName = Split-Path -Leaf $repositoryRoot

    if ($repositoryName -ne 'Jz.Studio') {
        throw "Expected the Jz.Studio repository, but found: $repositoryRoot"
    }

    Assert-CleanWorkingTree

    Write-Host 'Fetching origin...' -ForegroundColor Cyan
    Invoke-Git -Arguments @('fetch', 'origin', '--prune')

    Write-Host ''
    Write-Host 'Publishing local feature branch commits before integration...' -ForegroundColor Cyan

    foreach ($featureBranch in $featureBranches) {
        Invoke-Git -Arguments @('switch', $featureBranch)
        Assert-CleanWorkingTree
        Invoke-Git -Arguments @('pull', '--ff-only', 'origin', $featureBranch)
        Invoke-Git -Arguments @('push', 'origin', $featureBranch)
    }

    Invoke-Git -Arguments @('switch', $integrationBranch)
    Invoke-Git -Arguments @('pull', '--ff-only', 'origin', $integrationBranch)

    $localIntegrationCommit = Get-GitValue -Arguments @('rev-parse', $integrationBranch)
    $remoteIntegrationCommit = Get-GitValue -Arguments @('rev-parse', "origin/$integrationBranch")

    if ($localIntegrationCommit -ne $remoteIntegrationCommit) {
        throw "Local '$integrationBranch' contains unpushed commits. Review and push them before converging."
    }

    foreach ($featureBranch in $featureBranches) {
        Assert-CleanWorkingTree

        $beforeMerge = Get-GitValue -Arguments @('rev-parse', 'HEAD')

        Write-Host ''
        Write-Host "Integrating '$featureBranch' into '$integrationBranch'..." -ForegroundColor Cyan

        Invoke-Git -Arguments @(
            'merge',
            '--no-ff',
            "origin/$featureBranch",
            '-m',
            "Merge $featureBranch into $integrationBranch"
        )

        $afterMerge = Get-GitValue -Arguments @('rev-parse', 'HEAD')

        if ($afterMerge -eq $beforeMerge) {
            Write-Host "'$featureBranch' is already contained in '$integrationBranch'." -ForegroundColor DarkGray
            continue
        }

        Request-TestGate -BranchName $featureBranch
        Assert-CleanWorkingTree

        Invoke-Git -Arguments @('push', 'origin', $integrationBranch)
        Write-Host "The tested '$featureBranch' seam was pushed." -ForegroundColor Green
    }

    Write-Host ''
    Write-Host 'Synchronizing feature branches from the tested integration branch...' -ForegroundColor Cyan

    foreach ($featureBranch in $featureBranches) {
        Invoke-Git -Arguments @('switch', $featureBranch)
        Assert-CleanWorkingTree
        Invoke-Git -Arguments @('pull', '--ff-only', 'origin', $featureBranch)
        Invoke-Git -Arguments @('merge', '--ff-only', $integrationBranch)
        Invoke-Git -Arguments @('push', 'origin', $featureBranch)
    }

    Invoke-Git -Arguments @('switch', $integrationBranch)
    Assert-CleanWorkingTree

    $expectedCommit = Get-GitValue -Arguments @('rev-parse', $integrationBranch)
    $allBranches = @($integrationBranch) + $featureBranches

    Write-Host ''
    Write-Host 'Final branch tips:' -ForegroundColor Cyan

    foreach ($branch in $allBranches) {
        $localCommit = Get-GitValue -Arguments @('rev-parse', $branch)
        $remoteCommit = Get-GitValue -Arguments @('rev-parse', "origin/$branch")
        $shortCommit = $localCommit.Substring(0, 8)

        Write-Host ("{0,-20} {1}" -f $branch, $shortCommit)

        if ($localCommit -ne $expectedCommit -or $remoteCommit -ne $expectedCommit) {
            throw "Branch verification failed for '$branch'."
        }
    }

    Write-Host ''
    Write-Host "Convergence complete at $($expectedCommit.Substring(0, 8))." -ForegroundColor Green
}
catch {
    Write-Host ''
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host 'Convergence stopped. Review git status before taking another action.' -ForegroundColor Yellow
    exit 1
}
