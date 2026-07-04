# Choro Dashboard

## Overview

The Choro Dashboard (ChoroDash) is JZ Studio's first visualization application. It provides an interactive geographic interface for exploring data through choropleth maps.

ChoroDash demonstrates the architectural principles of JZ Studio by combining reusable framework components, route-based navigation, shared services, and a modular application design.

Although the initial implementation focuses on the United States, the architecture is intended to support additional geographic regions and datasets in the future.

---

# Purpose

The primary objectives of ChoroDash are:

- Display geographic data visually.
- Support multiple datasets.
- Navigate between geographic levels.
- Provide reusable mapping infrastructure.
- Demonstrate the JZ Studio application architecture.

---

# Architecture

ChoroDash is hosted within the Visualization module of the JZ Studio Shell.

```text
JZ Studio
    │
    └── Visualization Module
            │
            └── Choro Dashboard
                    │
                    ├── USA Map
                    ├── State Map
                    ├── Data Panels
                    └── Administration
```

The Shell provides navigation, layout, and shared services while ChoroDash supplies the visualization functionality.

---

# Major Components

The application is composed of several functional areas.

## USA Map

Displays a choropleth map of the United States.

Responsibilities include:

- Rendering state boundaries
- Displaying thematic data
- Responding to user selection
- Navigating to state-level views

---

## State Map

Displays a detailed map for an individual state.

Responsibilities include:

- Rendering county boundaries
- Displaying county-level data
- Supporting county selection

---

## Data Panels

Data panels present information related to the selected geographic feature.

Examples include:

- Population
- Demographics
- Economic indicators
- Future statistical datasets

Panels are independent of the map rendering components.

---

## Administration

The Administration view provides tools for managing the data used by ChoroDash.

Responsibilities include:

- Managing available datasets
- Importing data
- Monitoring import status
- Maintaining reference data

Administrative functionality is separated from the visualization experience.

---

# Data Flow

ChoroDash consumes data prepared by the Data Manager.

```text
External Sources
        │
        ▼
Data Manager
        │
        ▼
JzStudioDb
        │
        ▼
API
        │
        ▼
Choro Dashboard
```

The application does not perform data acquisition directly.

---

# Geographic Hierarchy

The current navigation hierarchy is:

```text
United States
        │
        ▼
State
        │
        ▼
County
```

The architecture is designed to support additional geographic levels in the future.

---

# Routing

ChoroDash uses route-based navigation provided by the JZ Studio Shell.

Example routes:

```text
/visualization/chorodash
/visualization/chorodash/admin
```

Navigation state is determined by the current route.

---

# Design Principles

The Choro Dashboard follows several architectural principles.

## Separation of Responsibilities

Mapping, data management, and administration are implemented as independent concerns.

---

## Reusable Components

Mapping components should be reusable wherever possible.

---

## Data Independence

Visualization components display data but do not acquire or transform it.

All data preparation is performed by the Data Manager.

---

## Extensibility

The architecture is designed to support:

- Additional datasets
- Additional geographic regions
- New visualization techniques
- Future administrative capabilities

without requiring fundamental architectural changes.