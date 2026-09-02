# Terminology

This document defines the architectural vocabulary used throughout the JZ Studio project. Consistent terminology ensures that discussions, documentation, and code all describe the system using the same language.

---

# Platform Architecture

## Solution

The highest-level software container.

Within this project, the solution is **JZ Studio**.

A solution contains one or more projects that collectively implement the platform.

---

## Project

A deployable or buildable software component within the solution.

Examples include:

- Jz.Studio.Client
- Jz.Studio.Server
- JZ.Studio.DataManager

Projects are organized by responsibility rather than feature.

---

## Framework

A collection of reusable components and services shared throughout the platform.

The framework provides common functionality such as:

- Navigation
- Routing
- Layout
- UI components
- Shared services
- Common models

The framework establishes consistency across all applications hosted by JZ Studio.

---

# User Interface

## Shell

The top-level application host.

The Shell provides:

- Global layout
- Navigation
- Routing
- Shared user interface
- Theme management

Applications execute inside the Shell.

---

## Suite

A major functional family within the platform.

Examples include:

- Visualization
- Back Office
- Sandbox
- Architecture

Each suite groups related applications.

---

## Application

A self-contained feature hosted within a suite.

Examples include:

- Choro Dashboard
- Technical Analysis

Applications share the Shell while remaining independently developed.

---

## View

A routed screen displayed within an application.

A view represents a specific user task or presentation.

Examples include:

- Home
- Dashboard
- Administration
- Settings

---

## Component

A reusable user interface building block.

Components encapsulate presentation and user interaction.

Examples include:

- MenuBaseComponent
- JzButtonComponent
- JzPopoverComponent

---

# Navigation

JZ Studio uses a hierarchical navigation model.

## Suite Menu

Level 1 navigation.

Provides access to the platform's suites.

---

## Module Menu

Level 2 navigation.

Displays the applications available within the selected suite.

---

## Application Navigation

Level 3 navigation.

Provides navigation between views inside an application.

---

## Route

A URL that identifies the current location within the application.

Routes are the authoritative mechanism used for application navigation.

---

# Business Organization

## Domain

A domain is a major area of responsibility within JZ Studio that represents a cohesive set of business concepts, data, services, and applications.

Domains organize the platform around business capabilities rather than technical implementation.

Examples include:

- Market
- Choro
- Geo
- SystemData

A domain may contain:

- One or more database schemas
- Data import pipelines
- Services
- Controllers
- Models
- Applications
- User interface components

Domains provide the conceptual boundary for organizing functionality throughout the platform.

---

# Data Architecture

## Data Manager

The subsystem responsible for acquiring, validating, transforming, and importing data into the platform.

The Data Manager acts as a **Data Vacuum**, capable of ingesting information from many different sources.

Examples include:

- CSV files
- Text files
- Excel spreadsheets
- REST APIs
- Public datasets
- Web scraping

---

## Pipeline

A complete sequence of operations that moves data from its source into the JZ Studio database.

Typical stages include:

```text
Acquire
    ↓
Validate
    ↓
Normalize
    ↓
Transform
    ↓
Import
```

---

## Pipeline Stage

A single operation within a pipeline.

Each stage has one clearly defined responsibility.

Examples include:

- Download
- Extract
- Validate
- Normalize
- Import
- Verify

---

## Source

The origin of imported data.

Examples include:

- CSV
- TXT
- Excel
- REST API
- Public dataset
- Web page

---

# Database

## Database

The persistent storage layer used by JZ Studio.

The database stores normalized information for use throughout the platform.

---

## Schema

A logical grouping of related database tables within a domain.

A schema organizes persistent storage for a particular business area.

Current schemas include:

- Market
- Choro
- Geo
- SystemData

Hierarchy:

```text
Database
    └── Schema
            └── Table
```

---

## Table

A relational structure used to persist data within a schema.

Tables store information but do not define business rules.

Examples include:

- DailyPrices
- Securities
- ImportBatches

---

## Model

A class that represents structured data.

Models describe data exchanged between layers of the application.

Examples include:

- Security
- DailyPrice
- CensusDataset
- JzNavItem

---

## Service

A reusable class responsible for implementing business functionality.

Services coordinate operations but do not present user interfaces.

Examples include:

- Navigation Service
- Chart Data Service
- Census Dataset Catalog Service

---

## Controller

A server-side endpoint that exposes functionality to client applications.

Controllers receive requests, coordinate processing, and return responses.

Business logic should be delegated to services whenever practical.

---

# Design Principles

## Source of Truth

The authoritative implementation of business rules.

Within JZ Studio:

- C# application code is the source of truth.
- The database is primarily a persistence layer.
- Business logic should not be hidden in stored procedures or database objects.

---

## Separation of Responsibilities

Each class, component, service, and subsystem should have one clearly defined purpose.

---

## Living Documentation

Documentation evolves alongside the implementation.

The architecture documentation should always describe the current system and the design decisions that produced it.