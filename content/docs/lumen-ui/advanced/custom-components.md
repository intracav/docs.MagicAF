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
