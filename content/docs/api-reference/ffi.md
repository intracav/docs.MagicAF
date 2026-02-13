---
title: "FFI"
description: "FFI preparation, error code strategy, and planned language bindings."
weight: 8
---

MagicAF's public API is designed with future FFI (Foreign Function Interface) bindings in mind. While bindings are not yet shipped, the architecture choices make them straightforward to implement.

## Design Decisions

### 1. Flat DTO Structs

All public types (`ChatRequest`, `ChatResponse`, `SearchResult`, `GenerationConfig`, etc.) are plain structs with owned fields. They map directly to C structs or language-native objects.

```rust
// Example: SearchResult is a flat, owned struct
pub struct SearchResult {
    pub id: String,
    pub score: f32,
    pub payload: serde_json::Value,
}
```

### 2. Numeric Error Codes

`MagicError::error_code()` returns a `u32` that can be passed across an FFI boundary. The human-readable message is available via `Display`.

```rust
let code: u32 = error.error_code(); // 1000, 2000, ..., 9000
let message: String = error.to_string();
```

### 3. Opaque Handles

`RAGWorkflow` and service types would be exposed as opaque pointers (`*mut c_void`) with constructor/destructor functions.

### 4. No Deeply Nested Generics at Boundary

Generic type parameters are resolved at construction time. The FFI layer would expose concrete, type-erased wrappers.

## Planned FFI Surface

```c
// C header (generated via cbindgen)
typedef struct MagicWorkflow MagicWorkflow;
typedef struct MagicResult MagicResult;

MagicWorkflow* magic_workflow_create(const char* config_json);
void           magic_workflow_destroy(MagicWorkflow* wf);

MagicResult*   magic_workflow_run(MagicWorkflow* wf, const char* query);
const char*    magic_result_text(const MagicResult* r);
uint32_t       magic_result_error_code(const MagicResult* r);
void           magic_result_destroy(MagicResult* r);
```

## Language Binding Strategy

| Language | Binding Approach |
|----------|-----------------|
| **C / C++** | `cbindgen` → C header; link as static or dynamic library |
| **Python** | `pyo3` + `maturin`; expose workflow as a Python class |
| **Swift** | `swift-bridge` or raw C FFI via the generated header |
| **Java** | JNI via `jni` crate; or GraalVM native-image integration |

Each binding wraps the opaque handle pattern and translates `MagicError` codes into language-native exceptions or error types.

## Error Code Reference

| Code | Variant | Category |
|------|---------|----------|
| `1000` | `EmbeddingError` | Embedding service |
| `2000` | `VectorStoreError` | Vector database |
| `3000` | `LlmError` | Language model |
| `4000` | `ConfigError` | Configuration |
| `5000` | `AdapterError` | Domain adapters |
| `6000` | `HttpError` | HTTP / network |
| `7000` | `SerializationError` | JSON / serde |
| `8000` | `HealthCheckFailed` | Service health |
| `9000` | `Internal` | Unexpected errors |
