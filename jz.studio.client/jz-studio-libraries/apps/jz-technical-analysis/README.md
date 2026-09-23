# JZ Technical Analysis

`jz-technical-analysis` is the charting application library used by the JZ Studio
Visualization suite. It owns technical-indicator calculation, chart-panel
composition, panel interaction, and the persisted indicator workspace.

## Panel Workspace

The workspace always contains one fixed Price panel followed by three indicator
slots. Price cannot be replaced, hidden, or moved through the indicator selector.

The factory indicator layout is:

| Position | Panel |
| --- | --- |
| Price | OHLC price chart |
| Slot 1 | Volume |
| Slot 2 | MACD |
| Slot 3 | RSI 14 |

Each indicator slot can display one of nine registered panels:

- Volume
- MACD
- RSI 14
- ATR 14
- Stochastic
- ADX 14
- Aroon 25
- Williams %R
- Bollinger Band Width 20

Selecting an indicator already assigned to another slot swaps the two panels.
This preserves three unique panel assignments instead of duplicating an
indicator. Only one indicator selector can be open at a time. Opening a selector
hides the crosshair until pointer interaction returns to the chart.

## Layout Settings

The toolbar settings button owns layout-level actions:

- **Save Current as Default** stores the current slot assignments and visibility.
- **Restore Default Layout** restores the saved user default. If none exists, it
  restores the factory layout.
- **Restore Factory Layout** restores Volume, MACD, and RSI without deleting the
  saved user default.

The current layout and user default are intentionally independent. A user can
temporarily restore the factory layout and later restore their saved default.

## Persistence

Browser-local preferences use versioned keys:

| Key | Purpose |
| --- | --- |
| `jz.technical-analysis.panel-slots.v1` | Current slot assignments and visibility |
| `jz.technical-analysis.panel-slot-defaults.v1` | User-defined default layout |
| `jz.technical-analysis.panel-visibility.v1` | Legacy visibility migration source |
| `jz.technical-analysis.sma-visibility.v1` | Price-panel SMA visibility |
| `jz.technical-analysis.macd-visibility.v1` | MACD series visibility |

Storage failures are non-fatal. The application falls back to its in-memory or
factory state when browser storage is unavailable or contains invalid data.

## Integration Boundaries

An indicator panel crosses these seams:

1. `INDICATOR_PANEL_CHOICES` exposes its chart type and menu label.
2. `ChartComponentMap` registers the panel component.
3. `IndicatorCatalogService` describes calculated indicator metadata.
4. `TechnicalIndicatorCalculatorService` calculates indicator points.
5. `TechnicalAnalysisDataPreparer` filters calculated points to the visible range.
6. `ChartPanelRendererService` injects the registered panel into its assigned slot.

Volume, MACD, and RSI are established core panels. The remaining six selectable
calculated panels link their menu entry to an indicator-catalog definition and a
positive default period.

## Regression Tests

From `jz.studio.client`, run:

```powershell
npm run test:technical-analysis:regression
```

The focused regression command currently runs 22 tests covering:

- ATR, Stochastic, and ADX calculations
- Factory, current, persisted, and user-default layouts
- Indicator assignment and occupied-slot swapping
- Indicator-menu opening, dismissal, selection, and crosshair suppression
- Selectable-label uniqueness, component registration, and catalog integrity

The production library build remains:

```powershell
npx ng build jz-technical-analysis
```
