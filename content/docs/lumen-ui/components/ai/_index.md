---
title: "AI / Chat"
description: "Components for rendering AI agent interactions — tool calls, reasoning blocks, source citations, follow-up suggestions, and streaming text."
weight: 8
tags: [lumen-ui, ai, chat, components]
categories: [component]
difficulty: beginner
estimated_reading_time: "2 min"
last_reviewed: "2026-03-17"
---

AI / Chat components render the interactive elements of an AI agent conversation. They surface tool invocations, reasoning traces, citation sources, suggested follow-ups, and streaming text output. These components are designed for real-time clinical assistant workflows where transparency into the agent's process is critical.

## Component Showcase

<div class="lumen-demo">
<div class="lumen-demo__label">Interactive Showcase</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">AI / Chat Components</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">

<!-- ToolCall mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">ToolCall</div>
<div class="lm-stack lm-stack--vertical lm-stack--gap-4">
<div class="lm-tool-call">
<span class="lm-tool-call__icon lm-tool-call__icon--completed">&#10003;</span>
<span class="lm-tool-call__name">rxnorm_lookup</span>
<span class="lm-tool-call__primary-arg">Lisinopril</span>
<span class="lm-tool-call__duration">0.8s</span>
</div>
<div class="lm-tool-call">
<span class="lm-tool-call__icon lm-tool-call__icon--running"></span>
<span class="lm-tool-call__name">drug_interactions</span>
<span class="lm-tool-call__primary-arg">Metformin</span>
</div>
</div>
</div>

<!-- ToolResult mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">ToolResult</div>
<div class="lm-tool-result">
<div class="lm-tool-result__label" style="color:#3BA55C;">&#10003; rxnorm_lookup &mdash; Found 3 results</div>
</div>
</div>

<!-- ThinkingBlock mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">ThinkingBlock</div>
<div class="lm-thinking">
<div class="lm-thinking__trigger">
<span class="lm-thinking__trigger-icon">&#9654;</span>
Clinical Reasoning
</div>
<div class="lm-thinking__body">Patient presents with risk factors for ACS. Recommend troponin, ECG, and chest X-ray workup.</div>
</div>
</div>

<!-- FollowUp mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">FollowUp</div>
<div class="lm-follow-up">
<button class="lm-follow-up__btn">Side effects?</button>
<button class="lm-follow-up__btn">Drug interactions</button>
<button class="lm-follow-up__btn">Dosing info</button>
</div>
</div>

<!-- SourceCard mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">SourceCard</div>
<div class="lm-source-card">
<div class="lm-source-card__content">
<div class="lm-source-card__title">ACC/AHA Hypertension Guidelines 2024</div>
<div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
<span class="lm-source-card__source">AHA</span>
<span class="lm-source-card__relevance">95%</span>
</div>
</div>
</div>
</div>

<!-- StreamingText mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">StreamingText</div>
<div class="lm-streaming-text" style="font-size:13px;">Based on the lab results, the patient's renal function<span class="lm-streaming-text__cursor"></span></div>
</div>

</div>
</div>
</div>
</div>

---

<div class="card-grid">
<div class="card">

### [ToolCall →](/docs/lumen-ui/components/ai/tool-call/)
Compact badge/card displaying an AI tool invocation with status, arguments, and duration.

</div>
<div class="card">

### [ToolResult →](/docs/lumen-ui/components/ai/tool-result/)
Labeled container wrapping tool output content with status and summary.

</div>
<div class="card">

### [ThinkingBlock →](/docs/lumen-ui/components/ai/thinking-block/)
Collapsible block showing AI reasoning and chain-of-thought text.

</div>
<div class="card">

### [FollowUp →](/docs/lumen-ui/components/ai/follow-up/)
Row of tappable suggestion buttons for follow-up questions.

</div>
<div class="card">

### [SourceCard →](/docs/lumen-ui/components/ai/source-card/)
Citation card displaying a source document with title, snippet, and relevance score.

</div>
<div class="card">

### [StreamingText →](/docs/lumen-ui/components/ai/streaming-text/)
Text display with blinking cursor for streaming AI responses.

</div>
</div>
