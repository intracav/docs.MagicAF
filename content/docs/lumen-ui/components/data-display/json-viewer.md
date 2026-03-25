---
title: "JsonViewer"
description: "Syntax-highlighted JSON viewer with copy support."
weight: 6
tags: [lumen-ui, json-viewer, data-display]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `JsonViewer` component displays JSON data with syntax highlighting — keys, strings, numbers, booleans, and punctuation are each colored distinctly. It includes a header with a title and copy-to-clipboard button. Unlike `CodeBlock`, it takes structured data (an object or array) as input rather than a raw code string, and pretty-prints it automatically.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | `object` | *required* | The JSON data to display. Accepts any JSON-serializable value (object, array, etc.). |
| `title` | `string` | `"JSON"` | Header title displayed above the JSON content. |
| `collapsed` | `bool` | `false` | Whether to start in a collapsed state. |

## DSL Example

```
JsonViewer(
  title="FHIR Resource",
  data={
    resourceType: "Patient",
    id: "pt-00412",
    name: [{family: "Doe", given: ["Jane"]}],
    birthDate: "1985-04-12",
    gender: "female"
  },
  collapsed=false
)
```

## Live Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">JsonViewer — FHIR Resource</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-code-block">
        <div class="lm-code-block__header">
          <span class="lm-code-block__lang">FHIR Resource</span>
          <button class="lm-code-block__copy">Copy</button>
        </div>
        <div class="lm-code-block__body"><div class="lm-json-viewer"><span class="lm-json-viewer__bracket">{</span>
  <span class="lm-json-viewer__key">"resourceType"</span>: <span class="lm-json-viewer__string">"Patient"</span>,
  <span class="lm-json-viewer__key">"id"</span>: <span class="lm-json-viewer__string">"pt-00412"</span>,
  <span class="lm-json-viewer__key">"name"</span>: [<span class="lm-json-viewer__bracket">{</span>
    <span class="lm-json-viewer__key">"family"</span>: <span class="lm-json-viewer__string">"Doe"</span>,
    <span class="lm-json-viewer__key">"given"</span>: [<span class="lm-json-viewer__string">"Jane"</span>]
  <span class="lm-json-viewer__bracket">}</span>],
  <span class="lm-json-viewer__key">"birthDate"</span>: <span class="lm-json-viewer__string">"1985-04-12"</span>,
  <span class="lm-json-viewer__key">"gender"</span>: <span class="lm-json-viewer__string">"female"</span>
<span class="lm-json-viewer__bracket">}</span></div></div>
      </div>
    </div>
  </div>
</div>

## JSON Example

```json
{
  "type": "json_viewer",
  "props": {
    "title": "Lab Order Payload",
    "data": {
      "orderId": "ORD-2026-1847",
      "patient": "pt-00412",
      "tests": ["CBC", "BMP", "TSH"],
      "priority": "routine",
      "fasting": true
    },
    "collapsed": false
  }
}
```

## Composition

Displaying a FHIR API response alongside a summary:

```
Card(title="EHR Lookup Result",
  KeyValue(
    items=[
      {key:"Patient", value:"Jane Doe"},
      {key:"MRN", value:"MRN-00412389"},
      {key:"Source", value:"Epic FHIR R4"}
    ],
    layout="inline"
  ),
  JsonViewer(
    title="Raw FHIR Response",
    data={
      resourceType: "Patient",
      id: "pt-00412",
      active: true,
      name: [{use: "official", family: "Doe", given: ["Jane"]}],
      telecom: [{system: "phone", value: "555-012-3456"}]
    }
  )
)
```

## Composition Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Composition Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Card + KeyValue + JsonViewer — EHR Lookup</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header"><div class="lm-card__title">EHR Lookup Result</div></div>
        <div class="lm-card__body">
          <div class="lm-kv" style="margin-bottom:16px;">
            <span class="lm-kv__key">Patient</span>
            <span class="lm-kv__value">Jane Doe</span>
            <span class="lm-kv__key">MRN</span>
            <span class="lm-kv__value">MRN-00412389</span>
            <span class="lm-kv__key">Source</span>
            <span class="lm-kv__value">Epic FHIR R4</span>
          </div>
          <div class="lm-code-block">
            <div class="lm-code-block__header">
              <span class="lm-code-block__lang">Raw FHIR Response</span>
              <button class="lm-code-block__copy">Copy</button>
            </div>
            <div class="lm-code-block__body"><div class="lm-json-viewer"><span class="lm-json-viewer__bracket">{</span>
  <span class="lm-json-viewer__key">"resourceType"</span>: <span class="lm-json-viewer__string">"Patient"</span>,
  <span class="lm-json-viewer__key">"id"</span>: <span class="lm-json-viewer__string">"pt-00412"</span>,
  <span class="lm-json-viewer__key">"active"</span>: <span class="lm-json-viewer__bool">true</span>,
  <span class="lm-json-viewer__key">"name"</span>: [<span class="lm-json-viewer__bracket">{</span>
    <span class="lm-json-viewer__key">"use"</span>: <span class="lm-json-viewer__string">"official"</span>,
    <span class="lm-json-viewer__key">"family"</span>: <span class="lm-json-viewer__string">"Doe"</span>,
    <span class="lm-json-viewer__key">"given"</span>: [<span class="lm-json-viewer__string">"Jane"</span>]
  <span class="lm-json-viewer__bracket">}</span>],
  <span class="lm-json-viewer__key">"telecom"</span>: [<span class="lm-json-viewer__bracket">{</span>
    <span class="lm-json-viewer__key">"system"</span>: <span class="lm-json-viewer__string">"phone"</span>,
    <span class="lm-json-viewer__key">"value"</span>: <span class="lm-json-viewer__string">"555-012-3456"</span>
  <span class="lm-json-viewer__bracket">}</span>]
<span class="lm-json-viewer__bracket">}</span></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Notes

- **Structured input**: The `data` prop expects a parsed object or array, not a JSON string. The component serializes it with 2-space indentation for display.
- **Syntax coloring**: Keys, string values, numbers, booleans/null, and punctuation are each rendered in distinct colors, with separate palettes for dark and light mode.
- **Copy button**: The header includes a copy icon that copies the pretty-printed JSON string to the clipboard, with a 2-second checkmark confirmation.
- **CodeBlock vs. JsonViewer**: Use `CodeBlock` with `language="json"` when you have a raw JSON string. Use `JsonViewer` when you have structured data and want automatic pretty-printing and typed syntax highlighting.
