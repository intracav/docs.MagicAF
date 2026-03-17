---
title: "Quick Start"
description: "Render your first Lumen UI component in under 20 lines of Dart code."
weight: 2
tags: [lumen-ui, quick-start, getting-started]
categories: [tutorial]
difficulty: beginner
estimated_reading_time: "5 min"
last_reviewed: "2026-03-17"
---

## Installation

Add `lumen_ui` to your `pubspec.yaml`:

```yaml
dependencies:
  lumen_ui:
    path: packages/lumen_ui
```

The package depends on `flutter_markdown`, `fl_chart`, `flutter_highlight`, and `collection`. These will be pulled in automatically.

## Render a Component from DSL

```dart
import 'package:flutter/material.dart';
import 'package:lumen_ui/lumen_ui.dart';

class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final input = '''
      Card(title="Patient Vitals",
        Table(
          columns=[{key:"vital", label:"Vital"}, {key:"value", label:"Value"}],
          rows=[
            {vital:"Heart Rate", value:"72 bpm"},
            {vital:"Blood Pressure", value:"120/80 mmHg"},
            {vital:"SpO2", value:"98%"}
          ],
          striped=true
        )
      )
    ''';

    final result = LumenParser.parse(input);

    return LumenRenderer(nodes: result.nodes);
  }
}
```

That's it. No theme configuration, no registry setup, no context wrappers. `LumenRenderer` handles initialization and theme detection automatically.

## Render from JSON

The same renderer accepts JSON input:

```dart
final json = '''
{
  "type": "card",
  "props": {"title": "Patient Vitals"},
  "children": [
    {
      "type": "table",
      "columns": [
        {"key": "vital", "label": "Vital"},
        {"key": "value", "label": "Value"}
      ],
      "rows": [
        {"vital": "Heart Rate", "value": "72 bpm"},
        {"vital": "Blood Pressure", "value": "120/80 mmHg"}
      ],
      "striped": true
    }
  ]
}
''';

final result = LumenParser.parse(json);
return LumenRenderer(nodes: result.nodes);
```

The parser auto-detects the format — if the input starts with `{` or `[`, it uses the JSON parser; otherwise, it uses the DSL parser.

## Handle Actions

Components like forms and follow-up buttons dispatch actions. Handle them with the `onAction` callback:

```dart
LumenRenderer(
  nodes: result.nodes,
  onAction: (action, data) {
    switch (action) {
      case LumenAction.sendMessage:
        // User tapped a follow-up suggestion
        print('Send: ${data['message']}');
        break;
      case LumenAction.submitForm:
        // User changed a form field
        print('Field ${data['id']}: ${data['value']}');
        break;
      case LumenAction.openUrl:
        // User tapped a link
        launchUrl(Uri.parse(data['url']));
        break;
      default:
        break;
    }
  },
)
```

## Streaming

For real-time rendering during LLM streaming, parse and render on every token update:

```dart
LumenRenderer(
  nodes: result.nodes,
  isStreaming: true,  // Enables streaming-aware rendering
)
```

When `isStreaming` is true, partial trees render with placeholders and the parser's recovery mode fills in missing brackets and braces.

## Next Steps

- **[DSL Syntax](/docs/lumen-ui/core-concepts/dsl-syntax/)** — learn the full DSL grammar
- **[Theming](/docs/lumen-ui/core-concepts/theming/)** — customize colors, typography, and chart palettes
- **[Component Reference](/docs/lumen-ui/components/)** — browse all 72 components
- **[LLM Integration](/docs/lumen-ui/integration/llm-integration/)** — inject the component catalog into LLM prompts
