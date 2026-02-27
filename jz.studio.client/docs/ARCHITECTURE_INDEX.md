# JZ Studio Architecture Index

Last Updated: 2026-02-26

---

## 1. Solution Overview

JZ Studio is a modular host-shell architecture built with:

- Angular (standalone-first architecture)
- ASP.NET Core backend
- Lazy-loaded injected applications
- Visualization engines (D3-based)
- Custom UI framework (JZ Components)

The system is designed for long-term extensibility through injection contracts and architectural separation of concerns.

---

## 2. Core Layers

### 2.1 Shell
Location: `_shell/`

Responsibilities:
- Application host
- Global navigation
- Route management
- App injection
- Security gates
- Shared layout scaffold

The shell must not depend on internal implementation details of injected apps.

---

### 2.2 Framework Layer
Location: `_framework/` (planned consolidation)

Responsibilities:
- App injection contracts
- Lifecycle coordination
- Shared services
- Base abstractions
- Injection registry
- Cross-app policy enforcement

This layer defines rules. Apps implement them.

---

### 2.3 Injected Applications

| App Name     | Route Base | Status        | Notes |
|--------------|------------|---------------|-------|
| TechanTs     | /dataviz   | Active Dev    | Technical analysis engine |
| Choropleth   | /maps      | Early Dev     | Geo visualization engine |
| BubbleEngine | /bubble    | Design Phase  | Layout-driven visualization engine |

Each injected application:
- Owns its internal routes
- Implements injection contracts
- Must remain decoupled from shell logic

---

## 3. Injection Model

All injected apps must:

- Expose route configuration
- Follow `InjectedAppContract`
- Remain decoupled from shell implementation
- Use shared services only through the framework layer
- Support clean initialization and teardown

Future direction:
- Manifest-driven registration
- Runtime enable/disable
- Permission-aware injection

---

## 4. Rendering Architecture (TechanTs Example)

- Master SVG scaffold defined in host
- Panels injected dynamically
- Charts extend `BaseChartComponent`
- Data centralized in `ChartDataService`
- Lifecycle synchronization required before draw
- Layout deterministic and panel-driven

Rendering must never rely on implicit DOM timing.

---

## 5. Color System

Managed by:
`PaletteMgrService`

Supports:
- Dark mode-first design
- Protan-safe palette variants
- CSS variable binding
- Cross-app theme consistency

Accessibility is a first-class requirement.

---

## 6. Long-Term Goals

- True plug-in registration system
- Runtime app enable/disable
- Permission-driven routing
- App manifest registry
- UI component library isolation
- Decoupled visualization engines

---

## 7. Architectural Principles

1. Shell does not know implementation details of apps.
2. Apps do not control routing outside their scope.
3. Framework defines contracts and policy.
4. Rendering must be lifecycle-safe.
5. All layout is explicit and deterministic.
6. Injection must be reversible and clean.
