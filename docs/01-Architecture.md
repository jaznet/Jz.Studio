# Architectural Principles

The architecture follows a small set of guiding principles that influence every design decision throughout JZ Studio.

---

## Separation of Concerns (SoC)

Every class, service, component, and subsystem should have a single, well-defined concern.

Responsibilities should be assigned to the component that naturally owns them rather than accumulated in orchestration or presentation classes.

Examples:

| Concern | Owner |
|---------|-------|
| Presentation | MainViewModel |
| Analysis workflow | AnalysisPipeline |
| Solution analysis | SolutionAnalyzer |
| Solution tree construction | SolutionTreeBuilder |
| Project node construction | ProjectTreeBuilder |
| Directory node construction | DirectoryNodeBuilder |
| File node construction | FileNodeBuilder |
| Directory statistics | DirectoryStatisticsBuilder |
| Extension statistics | ExtensionStatisticsBuilder |
| Exclusion rules | ExclusionService |

Separation of Concerns is the primary architectural principle governing the organization of the codebase.

---

## Single Responsibility Principle (SRP)

Each class should have one primary reason to change.

When a class begins changing for unrelated reasons, it should be reviewed for responsibility extraction.

---

## Responsibility Extraction

Responsibility Extraction is the preferred refactoring technique used throughout JZ Studio.

Responsibility extraction is the primary mechanism used to improve Separation of Concerns while preserving existing behavior.

The preferred process is:

1. Identify a cohesive responsibility.
2. Create the destination class.
3. Copy the implementation.
4. Compile and verify.
5. Redirect callers.
6. Compile and verify.
7. Remove the original implementation.
8. Compile and verify.

Architectural improvements should be implemented incrementally rather than through large rewrites.

---

## Pipeline-Oriented Processing

When an operation consists of multiple sequential stages, prefer expressing the workflow as a pipeline rather than a large orchestration method.

Example:

```text
Load Solution

↓

Analyze Solution

↓

Build Tree

↓

Generate Statistics

↓

Return Analysis Result
```

The pipeline owns the workflow.

Presentation layers initiate pipelines and consume their results but do not own processing logic.

---

## Reuse Before Duplication

Shared functionality belongs in reusable services, builders, and framework components.

Prefer improving an existing reusable component over duplicating logic.

---

## 300-Line Heuristic

The 300-line heuristic is not a hard limit.

It is a review trigger.

When a class approaches approximately 300 lines, review whether it is accumulating multiple concerns.

If so, consider responsibility extraction.

This heuristic encourages architectural review rather than arbitrary decomposition.

---

## Code Becomes the Source of Truth

Business rules, processing logic, and architectural intent belong in source code rather than hidden inside databases, stored procedures, or configuration whenever practical.

Documentation explains intent.

Code expresses behavior.

Tests verify behavior.

The codebase remains the authoritative source of truth.

---

## Modular Growth

Applications should be added without requiring significant architectural changes to the existing platform.

The shell hosts applications.

Applications own application behavior.

Shared services provide common infrastructure.

---

## Living Documentation

Documentation evolves alongside the implementation.

Documentation should explain architectural intent and design decisions rather than duplicate implementation details.

Code remains the authoritative description of system behavior.