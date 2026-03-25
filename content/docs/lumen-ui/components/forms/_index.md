---
title: "Forms & Input"
description: "Interactive form components — text inputs, selectors, checkboxes, sliders, and date pickers. All dispatch actions to the host application."
weight: 4
---

Form components collect user input within Lumen UI artifacts. Every interactive element carries an `id` prop that identifies it when dispatching actions back to the host application via `LumenRenderContext`. Most form components dispatch `submitForm` with `{id, value}` on change; binary controls (Checkbox, Toggle) dispatch `toggleState` with `{id, value}`.

Because artifacts render inside a sandboxed panel, form state is not managed internally. The host application receives each action and decides how to process it — saving to a draft, calling an API, or feeding the value back into a subsequent LLM turn.

<div class="lumen-demo">
  <div class="lumen-demo__label">Interactive Preview — all elements are live</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Patient Intake Form</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Patient Intake Form</div>
          <div class="lm-card__description">Demonstrates all 8 form components working together</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-stack lm-stack--vertical" style="gap:16px;">
            <!-- Input -->
            <div class="lm-stack lm-stack--horizontal" style="gap:12px;">
              <div class="lm-form-group" style="flex:1;">
                <label class="lm-form-label">Patient Name</label>
                <input class="lm-input" type="text" placeholder="Last, First MI">
              </div>
              <div class="lm-form-group" style="flex:1;">
                <label class="lm-form-label">MRN</label>
                <input class="lm-input" type="text" placeholder="Medical record number">
              </div>
            </div>
            <!-- Select -->
            <div class="lm-stack lm-stack--horizontal" style="gap:12px;">
              <div class="lm-form-group" style="flex:1;">
                <label class="lm-form-label">Blood Type</label>
                <select class="lm-select">
                  <option value="" disabled selected>Select blood type</option>
                  <option>A+</option><option>A-</option>
                  <option>B+</option><option>B-</option>
                  <option>AB+</option><option>AB-</option>
                  <option>O+</option><option>O-</option>
                </select>
              </div>
              <div class="lm-form-group" style="flex:1;">
                <label class="lm-form-label">Admission Date</label>
                <div class="lm-date-picker">
                  <input class="lm-input" type="date">
                  <span class="lm-date-picker__icon">&#128197;</span>
                </div>
              </div>
            </div>
            <!-- RadioGroup -->
            <div class="lm-form-group">
              <label class="lm-form-label">Priority</label>
              <div class="lm-radio-group" data-radio-group="intake_priority" style="flex-direction:row;gap:16px;">
                <div class="lm-radio" data-value="routine">
                  <div class="lm-radio__circle"><div class="lm-radio__dot"></div></div>
                  <span>Routine</span>
                </div>
                <div class="lm-radio selected" data-value="urgent">
                  <div class="lm-radio__circle"><div class="lm-radio__dot"></div></div>
                  <span>Urgent</span>
                </div>
                <div class="lm-radio" data-value="emergent">
                  <div class="lm-radio__circle"><div class="lm-radio__dot"></div></div>
                  <span>Emergent</span>
                </div>
              </div>
            </div>
            <!-- Slider -->
            <div class="lm-form-group">
              <label class="lm-form-label">Pain Score (0 - 10)</label>
              <div class="lm-slider">
                <div class="lm-slider__track">
                  <div class="lm-slider__fill" style="width:30%;"></div>
                  <div class="lm-slider__thumb" style="left:30%;"></div>
                </div>
                <div class="lm-slider__labels">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>
            </div>
            <!-- TextArea -->
            <div class="lm-form-group">
              <label class="lm-form-label">Chief Complaint</label>
              <textarea class="lm-textarea" rows="3" placeholder="Describe the reason for visit..."></textarea>
            </div>
            <!-- Toggle + Checkbox -->
            <div style="height:1px;background:var(--border);"></div>
            <div class="lm-stack lm-stack--horizontal" style="justify-content:space-between;align-items:center;">
              <div>
                <div style="font-size:14px;font-weight:600;color:var(--text-primary);">Continuous Monitoring</div>
                <div style="font-size:12px;color:var(--text-tertiary);">Enable real-time vital sign tracking</div>
              </div>
              <div class="lm-toggle on">
                <div class="lm-toggle__track"><div class="lm-toggle__thumb"></div></div>
              </div>
            </div>
            <div class="lm-checkbox">
              <div class="lm-checkbox__box"><span class="lm-checkbox__check">&#10003;</span></div>
              <span>Patient consent obtained for treatment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

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
