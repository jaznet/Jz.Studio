# Decision Log

## 2026-06-15

### DataManager Philosophy

Decision

Code becomes the source of truth.

Reason

Business rules should be visible and version controlled.

Status

Accepted

---

## 2026-06-24

### Solution Analysis Hierarchy

Decision

```text
Solution
    Project
        Directory
            File
```

Reason

Developers think in terms of solutions and projects rather than file extensions.

Status

Implemented

---

## 2026-06-24

### Directory Grouping

Decision

Group directory statistics by project.

Reason

Directory statistics are more meaningful when viewed in project context.

Status

Implemented

---

## 2026-06-24

### Documentation Structure

Decision

Create a solution-level documentation repository.

```text
docs
├── 00-Vision.md
├── 01-Architecture.md
├── 02-Terminology.md
├── 03-SolutionAnalysis.md
├── 04-JzStudioShell.md
├── 05-ChoroDash.md
├── 06-DataManager.md
├── 07-UI-Principles.md
└── 99-DecisionLog.md
```

Reason

Capture architectural decisions while development is ongoing.

Status

Implemented
