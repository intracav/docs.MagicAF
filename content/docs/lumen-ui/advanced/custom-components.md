---
title: "Custom Components"
description: "How to create, register, and expose new Lumen UI components to the LLM."
weight: 3
tags: [lumen-ui, custom-components, extension, registry]
categories: [guide]
difficulty: advanced
prerequisites:
  - /docs/lumen-ui/core-concepts/rendering/
  - /docs/lumen-ui/integration/llm-integration/
estimated_reading_time: "8 min"
last_reviewed: "2026-03-17"
---

Lumen UI's component system is extensible. You can create new components, register them in the `ComponentRegistry`, and they will automatically appear in the LLM's component catalog.

<div class="lumen-demo">
  <div class="lumen-demo__label">Component Definition Anatomy</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">What Makes a Custom Component</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-pipeline">
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon" style="color: #5865F2;">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M6 7h8M6 10h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="lm-pipeline__label">ComponentDefinition</div>
          <div class="lm-pipeline__sublabel">type, category, description, props, examples</div>
        </div>
        <div class="lm-pipeline__arrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M10 16l4-4M10 16l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>builder function</span>
        </div>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon" style="color: #3BA55C;">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l-4 6 4 6M13 4l4 6-4 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="lm-pipeline__label">Builder Function</div>
          <div class="lm-pipeline__sublabel">(node, theme, context) -> Widget</div>
        </div>
        <div class="lm-pipeline__arrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M10 16l4-4M10 16l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>register()</span>
        </div>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon" style="color: #FAA61A;">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M10 6v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="lm-pipeline__label">Registry</div>
          <div class="lm-pipeline__sublabel">Renderer + catalog updated</div>
        </div>
        <div class="lm-pipeline__arrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M10 16l4-4M10 16l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>auto-generated</span>
        </div>
        <div class="lm-pipeline__step" style="border-color: var(--accent);">
          <div class="lm-pipeline__icon" style="color: #E91E63;">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M8 8c0-1.1.9-2 2-2s2 .9 2 2c0 1.5-2 2-2 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="14" r="0.75" fill="currentColor"/></svg>
          </div>
          <div class="lm-pipeline__label">LLM Catalog</div>
          <div class="lm-pipeline__sublabel">LLM can now emit VitalsStrip(...)</div>
        </div>
      </div>
    </div>
  </div>
</div>

## Step 1: Define the Component

Create a `ComponentDefinition` with a type, props schema, and builder function:

```dart
import 'package:lumen_ui/lumen_ui.dart';

final vitalsStripDefinition = ComponentDefinition(
  type: 'vitals_strip',
  category: ComponentCategory.clinical,
  description: 'Compact horizontal strip of vital signs with sparklines',
  allowsChildren: false,
  props: [
    const PropSchema(
      name: 'hr',
      type: PropType.number,
      required: true,
      description: 'Heart rate in bpm',
    ),
    const PropSchema(
      name: 'bp_systolic',
      type: PropType.number,
      required: true,
      description: 'Systolic blood pressure',
    ),
    const PropSchema(
      name: 'bp_diastolic',
      type: PropType.number,
      required: true,
      description: 'Diastolic blood pressure',
    ),
    const PropSchema(
      name: 'spo2',
      type: PropType.number,
      required: true,
      description: 'Oxygen saturation percentage',
    ),
    const PropSchema(
      name: 'temp',
      type: PropType.number,
      description: 'Temperature in degrees F',
    ),
  ],
  builder: _buildVitalsStrip,
  examples: [
    ComponentExample(
      description: 'Basic vital signs',
      dsl: 'VitalsStrip(hr=72, bp_systolic=120, bp_diastolic=80, spo2=98, temp=98.6)',
    ),
  ],
);
```

## Step 2: Implement the Builder

The builder function takes a `LumenNode`, `LumenThemeData`, and `LumenRenderContext`, and returns a Flutter `Widget`:

```dart
Widget _buildVitalsStrip(
  LumenNode node,
  LumenThemeData theme,
  LumenRenderContext context,
) {
  final hr = node.numProp('hr', 0);
  final bpSys = node.numProp('bp_systolic', 0);
  final bpDia = node.numProp('bp_diastolic', 0);
  final spo2 = node.numProp('spo2', 0);
  final temp = node.numProp('temp');

  return Container(
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: theme.colors.card,
      borderRadius: BorderRadius.circular(8),
      border: Border.all(color: theme.colors.border),
    ),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        _vitalChip('HR', '$hr', 'bpm', theme),
        _vitalChip('BP', '$bpSys/$bpDia', 'mmHg', theme),
        _vitalChip('SpO2', '$spo2', '%', theme),
        if (temp != null)
          _vitalChip('Temp', '$temp', 'F', theme),
      ],
    ),
  );
}

Widget _vitalChip(String label, String value, String unit, LumenThemeData theme) {
  return Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      Text(label, style: theme.typography.caption),
      const SizedBox(height: 4),
      Text(value, style: theme.typography.headingLg),
      Text(unit, style: theme.typography.captionRegular),
    ],
  );
}
```

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__label">Output of VitalsStrip Builder</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">VitalsStrip(hr=72, bp_systolic=120, bp_diastolic=80, spo2=98, temp=98.6)</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card" style="padding: 12px;">
        <div class="lm-stack lm-stack--horizontal" style="justify-content: space-around;">
          <div class="lm-stat" style="align-items: center;">
            <span class="lm-stat__label">HR</span>
            <div class="lm-stat__value-row"><span class="lm-stat__value" style="font-size: 22px;">72</span></div>
            <span style="font-size: 11px; color: var(--text-tertiary);">bpm</span>
          </div>
          <div class="lm-stat" style="align-items: center;">
            <span class="lm-stat__label">BP</span>
            <div class="lm-stat__value-row"><span class="lm-stat__value" style="font-size: 22px;">120/80</span></div>
            <span style="font-size: 11px; color: var(--text-tertiary);">mmHg</span>
          </div>
          <div class="lm-stat" style="align-items: center;">
            <span class="lm-stat__label">SpO2</span>
            <div class="lm-stat__value-row"><span class="lm-stat__value" style="font-size: 22px;">98</span></div>
            <span style="font-size: 11px; color: var(--text-tertiary);">%</span>
          </div>
          <div class="lm-stat" style="align-items: center;">
            <span class="lm-stat__label">Temp</span>
            <div class="lm-stat__value-row"><span class="lm-stat__value" style="font-size: 22px;">98.6</span></div>
            <span style="font-size: 11px; color: var(--text-tertiary);">&#176;F</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

### Guidelines for Builders

- Always use `theme.colors` and `theme.typography` — never hardcode colors
- Use `node.stringProp()`, `node.numProp()`, `node.boolProp()`, etc. with defaults for optional props
- Wrap interactive elements with `context.dispatch()` for action handling
- Keep builders stateless — no `StatefulWidget` unless absolutely necessary
- Handle missing/null props gracefully — the LLM may omit optional fields

## Step 3: Register the Component

Add your component to the registry. The best place is inside the `registerAll()` method, or call `register()` after it:

```dart
// After ComponentRegistry.instance.registerAll()
ComponentRegistry.instance.register(vitalsStripDefinition);
```

Once registered:
- `LumenRenderer` can render `vitals_strip` nodes
- The component appears in the generated component catalog
- The LLM can emit `VitalsStrip(hr=72, ...)` in `<lumen>` blocks

## Step 4: Update the Catalog (Automatic)

The component catalog is regenerated from the registry. After registering a new component, the catalog will include it on the next generation:

```
#### Clinical
...
- VitalsStrip(hr: number, bp_systolic: number, bp_diastolic: number, spo2: number, temp?: number)
  Example: VitalsStrip(hr=72, bp_systolic=120, bp_diastolic=80, spo2=98, temp=98.6)
```

The `PromptGenerator` uses the `description` and `examples` from the `ComponentDefinition` to generate contextual documentation for the LLM.

## PropSchema Reference

| PropType | Dart Type | Used For |
|----------|-----------|----------|
| `string` | `String` | Text, identifiers, enum-like values |
| `number` | `num` | Integers, floats, measurements |
| `bool` | `bool` | Toggles, flags |
| `array` | `List` | Lists of items, data series |
| `object` | `Map<String, dynamic>` | Nested structured data |
| `enums` | `String` | Constrained string with `enumValues` |
| `color` | `String` | CSS-like color values |

### Enum Props

For props with a fixed set of values, use `PropType.enums` with `enumValues`:

```dart
const PropSchema(
  name: 'variant',
  type: PropType.enums,
  enumValues: ['default', 'outlined', 'elevated', 'ghost'],
  defaultValue: 'default',
  description: 'Visual style variant',
)
```

## File Organization

Follow the existing pattern — one file per component in the appropriate category directory:

```
packages/lumen_ui/lib/src/components/
├── clinical/
│   └── vitals_strip_component.dart    ← your new component
├── layout/
├── data_display/
└── ...
```

Export from the barrel file:

```dart
// In lumen_ui.dart
export 'src/components/clinical/vitals_strip_component.dart';
```

## Next Steps

- **[Rendering](/docs/lumen-ui/core-concepts/rendering/)** — how the registry and renderer work
- **[LLM Integration](/docs/lumen-ui/integration/llm-integration/)** — how the catalog reaches the LLM
- **[API Reference: ComponentRegistry](/docs/lumen-ui/api-reference/component-registry/)** — registry API
