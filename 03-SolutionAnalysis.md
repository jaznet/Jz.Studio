# Solution Analysis

## Purpose

Solution Analysis is a WPF desktop application used to analyze a .NET solution and provide metrics about:

* Solutions
* Projects
* Directories
* Files
* Extensions

The project was also used as a vehicle for refreshing C# and WPF skills.

---

## Hierarchy

The analysis hierarchy evolved from extension-centric reporting to a structure that mirrors how developers think about code.

### Initial Approach

File Extension Statistics

```text
Extension
    File Count
    Line Count
    Size
```

### Current Approach

```text
Solution
    Project
        Directory
            File
```

This structure more closely matches Visual Studio Solution Explorer and provides more useful insight into large solutions.

---

## Project Discovery

Projects are not hard-coded.

Projects are discovered from the solution file.

```text
Jz.Studio.sln
    ├── jz.studio.client
    ├── JZ.Studio.DataManager.Core
    ├── JZ.Studio.DataManager.Infrastructure
    ├── JZ.Studio.DataManager.Worker
    └── Jz.Studio.Server
```

Project names are extracted from the solution file and used to group directory statistics.

---

## Directory Analysis

Directory statistics are grouped by project.

Each directory tracks:

* File Count
* Line Count
* Total Size

Directories are displayed under collapsible project groups.

---

## Excluded Directories

The following directories are excluded from analysis:

* .git
* .vs
* bin
* obj
* node_modules
* .angular
* dist

These folders contain generated or temporary content and would distort the statistics.
