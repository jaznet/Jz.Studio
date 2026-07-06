# Data Manager Philosophy

## Core Principle

Code becomes the source of truth.

---

## Database Role

The database is primarily:

* Storage
* Retrieval
* Historical warehouse

The database should not become the primary location for business rules.

---

## Business Logic

The following belongs in C#:

* Validation
* Normalization
* Interpretation
* Import Rules
* Data Shaping

---

## Data Vacuum Concept

The Data Manager acts as a data vacuum.

Sources may include:

* CSV
* TXT
* Excel
* Web Data
* APIs

The Data Manager is responsible for transforming external data into a consistent internal representation.

---

## Historical Motivation

This design was influenced by prior experiences where business rules became hidden inside large Oracle stored procedures.

The preferred architecture places business logic in source-controlled C# code where it is easier to locate, test, and maintain.
