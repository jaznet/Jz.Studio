using System.Globalization;
using JZ.Studio.DataManager.Infrastructure.Data.JzStudioDb;
using JZ.Studio.DataManager.Infrastructure.EodData;
using Microsoft.EntityFrameworkCore;

namespace JZ.Studio.DataManager.Infrastructure.jobs;

public sealed class EodDataCorporateActionImportJob {
    private const string DividendActionType = "Dividend";
    private const string SplitActionType = "Split";

    private readonly JzStudioDbContext db;
    private readonly IEodDataClient eodDataClient;

    public EodDataCorporateActionImportJob(
        JzStudioDbContext db,
        IEodDataClient eodDataClient) {
        this.db = db;
        this.eodDataClient = eodDataClient;
    }

    public async Task<EodDataCorporateActionImportResult> ExecuteAsync(
        string exchangeCode,
        string symbolCode,
        CancellationToken cancellationToken = default) {
        exchangeCode = NormalizeCode(exchangeCode, nameof(exchangeCode));
        symbolCode = NormalizeCode(symbolCode, nameof(symbolCode));

        var importBatch = await StartImportBatchAsync(
            exchangeCode,
            symbolCode,
            cancellationToken);

        try {
            var splits = await eodDataClient.GetSplitsAsync(
                exchangeCode,
                symbolCode,
                cancellationToken);

            var dividends = await eodDataClient.GetDividendsAsync(
                exchangeCode,
                symbolCode,
                cancellationToken);

            var existingActions = await db.CorporateActions
                .Where(action =>
                    action.ExchangeCode == exchangeCode &&
                    action.Ticker == symbolCode)
                .Select(action => new {
                    action.ActionType,
                    action.ActionDate
                })
                .ToListAsync(cancellationToken);

            var existingKeys = existingActions
                .Select(action => CreateKey(action.ActionType, action.ActionDate))
                .ToHashSet(StringComparer.Ordinal);

            var splitsImported = AddSplits(
                splits,
                importBatch.ImportBatchId,
                existingKeys);

            var dividendsImported = AddDividends(
                dividends,
                importBatch.ImportBatchId,
                existingKeys);

            importBatch.Status = "Completed";
            importBatch.CompletedAt = DateTime.UtcNow;

            await db.SaveChangesAsync(cancellationToken);

            var duplicatesSkipped =
                splits.Count + dividends.Count - splitsImported - dividendsImported;

            return new EodDataCorporateActionImportResult(
                splitsImported,
                dividendsImported,
                duplicatesSkipped);
        }
        catch {
            importBatch.Status = "Failed";
            importBatch.CompletedAt = DateTime.UtcNow;

            await db.SaveChangesAsync(CancellationToken.None);
            throw;
        }
    }

    private async Task<ImportBatch> StartImportBatchAsync(
        string exchangeCode,
        string symbolCode,
        CancellationToken cancellationToken) {
        var importBatch = new ImportBatch {
            SourceName = "EODData",
            FileName = $"API:{exchangeCode}/{symbolCode}/corporate-actions",
            StartedAt = DateTime.UtcNow,
            Status = "Started"
        };

        db.ImportBatches.Add(importBatch);
        await db.SaveChangesAsync(cancellationToken);

        return importBatch;
    }

    private int AddSplits(
        IReadOnlyList<EodDataSplit> splits,
        long importBatchId,
        ISet<string> existingKeys) {
        var imported = 0;

        foreach (var split in splits) {
            var actionDate = ParseRequiredDate(split.DateStamp);
            var key = CreateKey(SplitActionType, actionDate);

            if (!existingKeys.Add(key)) {
                continue;
            }

            db.CorporateActions.Add(new CorporateAction {
                Ticker = split.SymbolCode.Trim().ToUpperInvariant(),
                ExchangeCode = split.ExchangeCode.Trim().ToUpperInvariant(),
                ActionType = SplitActionType,
                ActionDate = actionDate,
                Ratio = split.Ratio,
                Multiplier = split.Multiplier,
                Source = split.Source,
                ImportBatchId = importBatchId
            });

            imported++;
        }

        return imported;
    }

    private int AddDividends(
        IReadOnlyList<EodDataDividend> dividends,
        long importBatchId,
        ISet<string> existingKeys) {
        var imported = 0;

        foreach (var dividend in dividends) {
            var actionDate = ParseRequiredDate(dividend.DateStamp);
            var key = CreateKey(DividendActionType, actionDate);

            if (!existingKeys.Add(key)) {
                continue;
            }

            db.CorporateActions.Add(new CorporateAction {
                Ticker = dividend.SymbolCode.Trim().ToUpperInvariant(),
                ExchangeCode = dividend.ExchangeCode.Trim().ToUpperInvariant(),
                ActionType = DividendActionType,
                ActionDate = actionDate,
                PaymentDate = ParseOptionalDate(dividend.PaymentDateStamp),
                Amount = dividend.Amount,
                Source = dividend.Source,
                ImportBatchId = importBatchId
            });

            imported++;
        }

        return imported;
    }

    private static string CreateKey(string actionType, DateOnly actionDate) {
        return $"{actionType}|{actionDate:yyyy-MM-dd}";
    }

    private static DateOnly ParseRequiredDate(string value) {
        return DateOnly.ParseExact(
            value,
            "yyyy-MM-dd",
            CultureInfo.InvariantCulture);
    }

    private static DateOnly? ParseOptionalDate(string? value) {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : ParseRequiredDate(value);
    }

    private static string NormalizeCode(string value, string parameterName) {
        if (string.IsNullOrWhiteSpace(value)) {
            throw new ArgumentException("A value is required.", parameterName);
        }

        return value.Trim().ToUpperInvariant();
    }
}
