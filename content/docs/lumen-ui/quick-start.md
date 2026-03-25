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

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Rendered Output</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Patient Vitals</div>
        </div>
        <div class="lm-card__body">
          <table class="lm-table lm-table--striped">
            <thead>
              <tr>
                <th>Vital</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Heart Rate</td>
                <td>72 bpm</td>
              </tr>
              <tr>
                <td>Blood Pressure</td>
                <td>120/80 mmHg</td>
              </tr>
              <tr>
                <td>SpO2</td>
                <td>98%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Rendered Output</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Patient Vitals</div>
        </div>
        <div class="lm-card__body">
          <table class="lm-table lm-table--striped">
            <thead>
              <tr>
                <th>Vital</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Heart Rate</td>
                <td>72 bpm</td>
              </tr>
              <tr>
                <td>Blood Pressure</td>
                <td>120/80 mmHg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Rendered Output — Follow-Up Buttons</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Treatment Options</div>
          <div class="lm-card__description">Based on the patient's presentation, consider the following next steps.</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-alert lm-alert--info" style="margin-bottom: 14px;">
            <span class="lm-alert__icon">&#8505;</span>
            <div class="lm-alert__content">
              <div class="lm-alert__title">Recommendation</div>
              <div class="lm-alert__message">Order a comprehensive metabolic panel and lipid profile for baseline assessment.</div>
            </div>
          </div>
          <div class="lm-follow-up">
            <button class="lm-follow-up__btn">Order lab panel</button>
            <button class="lm-follow-up__btn">Review medications</button>
            <button class="lm-follow-up__btn">Schedule follow-up</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

When a user taps one of these follow-up buttons, the `onAction` callback fires with `LumenAction.sendMessage` and the button's label in `data['message']`. Your app can then feed that text back into the LLM conversation.

## Streaming

For real-time rendering during LLM streaming, parse and render on every token update:

```dart
LumenRenderer(
  nodes: result.nodes,
  isStreaming: true,  // Enables streaming-aware rendering
)
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Rendered Output — Streaming</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated" style="margin-bottom: 14px;">
        <div class="lm-card__header">
          <div class="lm-card__title">Clinical Summary</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-streaming-text">
            The patient is a 67-year-old male presenting with exertional dyspnea and bilateral lower extremity edema over the past two weeks. Cardiac biomarkers are within normal limits. Echocardiogram shows preserved ejection fraction at 55% with mild diastolic<span class="lm-streaming-text__cursor"></span>
          </div>
        </div>
      </div>
      <div class="lm-alert lm-alert--info">
        <span class="lm-alert__icon">&#8505;</span>
        <div class="lm-alert__content">
          <div class="lm-alert__message">When <code>isStreaming</code> is true, partial trees render progressively. The blinking cursor indicates content is still arriving.</div>
        </div>
      </div>
    </div>
  </div>
</div>

When `isStreaming` is true, partial trees render with placeholders and the parser's recovery mode fills in missing brackets and braces.

## Next Steps

- **[DSL Syntax](/docs/lumen-ui/core-concepts/dsl-syntax/)** — learn the full DSL grammar
- **[Theming](/docs/lumen-ui/core-concepts/theming/)** — customize colors, typography, and chart palettes
- **[Component Reference](/docs/lumen-ui/components/)** — browse all 72 components
- **[LLM Integration](/docs/lumen-ui/integration/llm-integration/)** — inject the component catalog into LLM prompts
