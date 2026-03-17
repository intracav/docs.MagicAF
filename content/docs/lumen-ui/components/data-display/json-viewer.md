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

## Notes

- **Structured input**: The `data` prop expects a parsed object or array, not a JSON string. The component serializes it with 2-space indentation for display.
- **Syntax coloring**: Keys, string values, numbers, booleans/null, and punctuation are each rendered in distinct colors, with separate palettes for dark and light mode.
- **Copy button**: The header includes a copy icon that copies the pretty-printed JSON string to the clipboard, with a 2-second checkmark confirmation.
- **CodeBlock vs. JsonViewer**: Use `CodeBlock` with `language="json"` when you have a raw JSON string. Use `JsonViewer` when you have structured data and want automatic pretty-printing and typed syntax highlighting.
