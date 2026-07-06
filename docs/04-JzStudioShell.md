# JZ Studio Shell

## Overview

The JZ Studio Shell is the top-level application host responsible for providing a consistent user experience across all applications.

Rather than each application implementing its own navigation, layout, and common user interface elements, these responsibilities are centralized within the Shell.

Applications execute inside the Shell and inherit its navigation framework, layout system, themes, and shared services.

---

# Responsibilities

The Shell is responsible for:

- Hosting applications
- Global layout
- Application routing
- Navigation
- Theme management
- Shared UI components
- Menu state management

The Shell is **not** responsible for application-specific business logic.

---

# Layout

The Shell provides a consistent application layout consisting of three primary regions.

```text
+------------------------------------------------------+
| Header                                               |
+------------------------------------------------------+
|                                                      |
| Module Menu | Application View                       |
|             |                                        |
|             |                                        |
|             |                                        |
|                                                      |
+------------------------------------------------------+
| Footer                                               |
+------------------------------------------------------+
```

Applications are rendered inside the Application View.

---

# Navigation Architecture

Navigation is hierarchical.

```text
Solution
    │
    ├── Module
    │       │
    │       ├── Application
    │       │        │
    │       │        └── View
```

Each level has a distinct responsibility.

---

## Solution Menu

The Solution Menu provides access to the major functional areas of JZ Studio.

Examples include:

- Home
- Visualization
- Back Office
- Sandbox
- Architecture
- Administration

The Solution Menu occupies the highest level of navigation.

---

## Module Menu

The Module Menu displays the applications available within the currently selected solution area.

For example, the Visualization module contains applications such as:

- Choro Dashboard
- Technical Analysis

Selecting a module updates the Module Menu without affecting the global layout.

---

## Application Navigation

Applications may provide their own navigation between views.

Examples include:

- Dashboard
- Administration
- Settings

Application navigation is local to the application.

---

# Routing

JZ Studio uses route-based navigation.

Routes represent the authoritative state of the user interface.

Navigation components reflect the active route rather than maintaining their own independent state.

This ensures:

- Deep linking
- Browser history support
- Bookmarkable URLs
- Consistent menu selection

---

# Menu State

The Shell owns the state of shared navigation elements.

Examples include:

- Solution menu visibility
- Module menu visibility
- Shell collapse state

Individual applications should request changes to shell state through shared services rather than manipulating shell components directly.

This separation keeps ownership of shared UI state within the Shell.

---

# Shared Components

The Shell hosts reusable user interface components that are shared across applications.

Examples include:

- Navigation menus
- Buttons
- Popovers
- Layout containers
- Dialogs
- Common styling

These components provide a consistent user experience throughout the platform.

---

# Theme Management

The Shell provides centralized theme management.

Applications inherit the active theme and should not implement independent visual themes.

This ensures a consistent appearance across the platform.

---

# Design Principles

The Shell architecture is guided by several principles.

## Single Host

There is one Shell responsible for hosting all applications.

---

## Shared Navigation

Navigation belongs to the Shell.

Applications participate in navigation but do not own it.

---

## Route-Driven State

The current route is the authoritative representation of the active application and view.

Navigation components reflect routing rather than creating independent state.

---

## Reusable Components

Common functionality belongs in reusable framework components rather than being duplicated by individual applications.

---

## Separation of Responsibilities

The Shell provides infrastructure.

Applications provide business functionality.

Keeping these responsibilities separate allows the platform to grow while maintaining a consistent architecture.