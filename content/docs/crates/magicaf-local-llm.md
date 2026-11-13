---
title: "magicaf-local-llm"
description: "A client for any OpenAI-compatible LLM server, plus Anthropic, gateways with fallback, streaming telemetry, and speech services."
weight: 2
---

{{< crate-header "magicaf-local-llm" >}}

`magicaf-local-llm` talks to the model. `LocalLlmService` works with any server that speaks the OpenAI chat-completions API — vLLM, llama.cpp, Ollama, TGI — and streams by default. The crate also provides `AnthropicLlmService`, an `LlmGateway` that adds token budgets and JSON mode, a `FallbackGateway` that fails over between providers, stream timing (time to first byte and first token), and Whisper, Kokoro, and Deepgram speech clients.

## Documentation

| Page | Covers |
|---|---|
| [LLM service](/docs/api-reference/core/llm-service/) | Chat requests, messages, tools, thinking |
| [Streaming](/docs/api-reference/core/streaming/) | Stream chunks, telemetry, fallback |
| [Speech](/docs/api-reference/core/asr/) | Speech recognition clients |
