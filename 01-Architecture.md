# JZ Studio Architecture

## Overview

JZ Studio is a modular platform for acquiring, managing, analyzing, and visualizing data.

Rather than being a single application, JZ Studio provides a common architecture that hosts multiple applications within a unified shell. Each application shares common navigation, routing, user interface components, and data services while remaining independently developed.

The architecture is designed around separation of responsibilities, reusable components, and clearly defined boundaries between presentation, application logic, and data management.

---

# Architectural Layers

JZ Studio is organized into several logical layers.

```text
┌──────────────────────────────────────────────┐
│                  JZ Studio                   │
├──────────────────────────────────────────────┤
│ Shell                                        │
├──────────────────────────────────────────────┤
│ Applications                                 │
├──────────────────────────────────────────────┤
│ Shared Framework                             │
├──────────────────────────────────────────────┤
│ Data Manager                                 │
├──────────────────────────────────────────────┤
│ Database                                     │
└──────────────────────────────────────────────┘
```

Each layer has a distinct responsibility.

---

# Shell

The Shell is the application's primary host.

Responsibilities include:

- Global layout
- Routing
- Navigation
- Shared UI
- Theme management
- Hosting applications

Applications execute inside the shell rather than creating their own top-level layout.

---

# Applications

Applications provide user-facing functionality.

Current applications include:

- Choro Dashboard
- Technical Analysis

Future applications can be added without changing the shell architecture.

Applications are independent but leverage common services and infrastructure.

---

# Shared Framework

The shared framework contains reusable functionality used throughout the platform.

Examples include:

- Navigation
- UI components
- Popovers
- Layout components
- Routing helpers
- Common models
- Shared services

This minimizes duplication and establishes consistent behavior across applications.

---

# Data Manager

The Data Manager is responsible for acquiring and preparing data.

Responsibilities include:

- Downloading datasets
- Importing files
- Validation
- Normalization
- Transformation
- Database import

Business rules are implemented in application code rather than database objects.

---

# Database

The database serves as the platform's persistent storage layer.

Data is organized into schemas representing functional domains.

Examples include:

- Market
- Choro
- Geo
- SystemData

The database stores data but is not considered the source of business logic.

---

# Design Principles

The architecture follows several guiding principles.

## Separation of Responsibilities

Each subsystem has a clearly defined purpose.

## Reuse Before Duplication

Common functionality belongs in shared components and services.

## Code Becomes the Source of Truth

Business rules are implemented in source code rather than hidden inside stored procedures.

## Modular Growth

Applications should be added without requiring significant changes to the existing platform.

## Living Documentation

Documentation evolves alongside the implementation and reflects the current architecture.

---

# High-Level System View

```text
                     JZ Studio
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
      Shell                          Data Manager
        │                                   │
        │                             Import Pipelines
        │                                   │
        ├──────────────┬──────────────┐      │
        │              │              │      │
   ChoroDash     Technical Analysis   ...    │
        │              │                     │
        └──────────────┴─────────────────────┘
                       │
                 JzStudioDb
```

This modular organization allows the platform to evolve by adding new applications and new data sources while preserving a consistent architecture.