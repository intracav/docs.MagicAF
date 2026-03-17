---
title: "Forms & Input"
description: "Interactive form components — text inputs, selectors, checkboxes, sliders, and date pickers. All dispatch actions to the host application."
weight: 4
---

Form components collect user input within Lumen UI artifacts. Every interactive element carries an `id` prop that identifies it when dispatching actions back to the host application via `LumenRenderContext`. Most form components dispatch `submitForm` with `{id, value}` on change; binary controls (Checkbox, Toggle) dispatch `toggleState` with `{id, value}`.

Because artifacts render inside a sandboxed panel, form state is not managed internally. The host application receives each action and decides how to process it — saving to a draft, calling an API, or feeding the value back into a subsequent LLM turn.

---

<div class="card-grid">
<div class="card">

### [Input →](/docs/lumen-ui/components/forms/input/)
Single-line text input with label, placeholder, and validation error display.

</div>
<div class="card">

### [Select →](/docs/lumen-ui/components/forms/select/)
Dropdown selector for choosing from a list of predefined options.

</div>
<div class="card">

### [Checkbox →](/docs/lumen-ui/components/forms/checkbox/)
Checkbox toggle with label and optional help text.

</div>
<div class="card">

### [RadioGroup →](/docs/lumen-ui/components/forms/radio-group/)
Radio button group for single selection from multiple options.

</div>
<div class="card">

### [Slider →](/docs/lumen-ui/components/forms/slider/)
Numeric range slider with configurable min, max, and step.

</div>
<div class="card">

### [DatePicker →](/docs/lumen-ui/components/forms/date-picker/)
Date selection field with ISO-format output.

</div>
<div class="card">

### [Toggle →](/docs/lumen-ui/components/forms/toggle/)
Switch component for binary on/off state.

</div>
<div class="card">

### [TextArea →](/docs/lumen-ui/components/forms/text-area/)
Multi-line text input for longer-form content.

</div>
</div>
