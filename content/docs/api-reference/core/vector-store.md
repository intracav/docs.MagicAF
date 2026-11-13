---
title: "VectorStore"
description: "API reference for the VectorStore trait, QdrantVectorStore, InMemoryVectorStore, and SearchResult."
weight: 2
tags: [api, vector-store, qdrant, in-memory, search]
categories: [reference]
difficulty: intermediate
prerequisites: [/docs/core-concepts/traits-and-interfaces/]
---

## Trait Definition

```rust
#[async_trait]
pub trait VectorStore: Send + Sync {
    async fn index(
        &self,
        collection: &str,
        embeddings: Vec<Vec<f32>>,
        payloads: Vec<serde_json::Value>,
    ) -> Result<()>;

    async fn search(
        &self,
        collection: &str,
        query_vector: Vec<f32>,
        limit: usize,
        filter: Option<serde_json::Value>,
    ) -> Result<Vec<SearchResult>>;

    async fn delete_by_entity(
        &self,
        collection: &str,
        entity_id: Uuid,
    ) -> Result<()>;

    async fn ensure_collection(
        &self,
        collection: &str,
        vector_size: usize,
    ) -> Result<()>;
}
```

**Module:** `magicaf_core::vector_store`

The four methods above are required. The trait also provides six more with default implementations, so a minimal backend stays small and a full one can do more:

| Method | Default behavior | `QdrantVectorStore` |
|---|---|---|
| `search_scoped(collection, vector, limit, filter)` | Calls `search` with the filter — use it where a filter is mandatory (tenant or user scoping) | Same |
| `set_payload(collection, filter, payload)` | Does nothing and returns `Ok` | Merges `payload` into every matching point |
| `delete_by_filter(collection, filter) -> u64` | Returns a `VectorStoreError` | Deletes matching points, returns the count |
| `scroll_paginated(collection, filter, limit, offset) -> ScrollPage` | Returns a `VectorStoreError` | Pages through points with their vectors and payloads |
| `count_by_filter(collection, filter) -> u64` | Returns a `VectorStoreError` | Counts matching points |
| `recreate_with_quantization(collection, size, quantization)` | Returns a `VectorStoreError` | Drops and recreates the collection with scalar (int8), product, or binary quantization |

```rust
pub struct ScrollPage { pub points: Vec<ScrolledPoint>, pub next_offset: Option<String> }
pub struct ScrolledPoint { pub id: String, pub vector: Vec<f32>, pub payload: serde_json::Value }
pub struct QuantizationConfig { pub mode: QuantizationMode, pub always_ram: bool }
pub enum QuantizationMode { Scalar, Product { compression_ratio: u32 }, Binary }
```

`InMemoryVectorStore` implements all of these except `recreate_with_quantization`. That method **deletes the collection's data**; re-index afterwards.

---

## Methods

### `index`

```rust
async fn index(
    &self,
    collection: &str,
    embeddings: Vec<Vec<f32>>,
    payloads: Vec<serde_json::Value>,
) -> Result<()>
```

Index a batch of embeddings with their associated JSON payloads.

| Parameter | Type | Description |
|-----------|------|-------------|
| `collection` | `&str` | Collection name |
| `embeddings` | `Vec<Vec<f32>>` | Dense vectors to store |
| `payloads` | `Vec<serde_json::Value>` | JSON payloads — one per vector |

**Constraints:** `embeddings.len()` must equal `payloads.len()`.

**Errors:** `MagicError::VectorStoreError`, `MagicError::HttpError`

---

### `search`

```rust
async fn search(
    &self,
    collection: &str,
    query_vector: Vec<f32>,
    limit: usize,
    filter: Option<serde_json::Value>,
) -> Result<Vec<SearchResult>>
```

Perform a nearest-neighbor similarity search.

| Parameter | Type | Description |
|-----------|------|-------------|
| `collection` | `&str` | Collection to search |
| `query_vector` | `Vec<f32>` | The query embedding |
| `limit` | `usize` | Maximum results to return |
| `filter` | `Option<serde_json::Value>` | Backend-specific filter (optional) |

**Returns:** `Vec<SearchResult>` sorted by descending similarity score.

---

### `delete_by_entity`

```rust
async fn delete_by_entity(
    &self,
    collection: &str,
    entity_id: Uuid,
) -> Result<()>
```

Delete all vectors associated with a given entity ID.

**Convention:** The entity ID is stored in the payload under the key `"entity_id"`.

---

### `ensure_collection`

```rust
async fn ensure_collection(
    &self,
    collection: &str,
    vector_size: usize,
) -> Result<()>
```

Ensure a collection exists with the specified vector dimensionality. If the collection already exists, this is a no-op.

---

## `SearchResult`

```rust
pub struct SearchResult {
    /// Unique identifier of the indexed point.
    pub id: String,

    /// Similarity score (higher = more similar).
    pub score: f32,

    /// The JSON payload stored alongside the vector.
    pub payload: serde_json::Value,
}
```

Derives: `Debug`, `Clone`, `Serialize`, `Deserialize`

---

## `QdrantVectorStore`

**Crate:** `magicaf-qdrant`

Connects to a Qdrant instance over its REST API (default port 6333).

### Constructor

```rust
impl QdrantVectorStore {
    pub async fn new(config: VectorStoreConfig) -> Result<Self>
}
```

### Example

```rust
use magicaf_core::config::VectorStoreConfig;
use magicaf_qdrant::QdrantVectorStore;

let config: VectorStoreConfig = serde_json::from_value(serde_json::json!({
    "base_url": "http://localhost:6333"
}))?;
let store = QdrantVectorStore::new(config).await?;

// QdrantVectorStore also has an inherent readiness check:
store.health_check().await?;
```

### Qdrant Filter Syntax

Pass Qdrant-native filters via the `filter` parameter:

```rust
let filter = serde_json::json!({
    "must": [{
        "key": "category",
        "match": { "value": "technical" }
    }]
});

let results = store.search("my_collection", query_vec, 10, Some(filter)).await?;
```

---

## `InMemoryVectorStore`

**Crate:** `magicaf-core`
**Module:** `magicaf_core::vector_store`

Zero-dependency, in-process vector store using brute-force cosine similarity. Ideal for:

- **Edge / mobile** — no external database needed
- **Unit tests** — no Docker or network
- **Prototyping** — instant setup
- **Small datasets** — thousands to tens of thousands of vectors

### Constructor

```rust
impl InMemoryVectorStore {
    pub fn new() -> Self
    pub fn load(path: &Path) -> Result<Self>
}
```

### Persistence

```rust
// Save to disk
store.save(Path::new("store.json"))?;

// Load from disk
let store = InMemoryVectorStore::load(Path::new("store.json"))?;
```

### Utility Methods

```rust
// Total points across all collections
store.total_points() -> usize

// List all collection names
store.collection_names() -> Vec<String>
```

### Performance

| Points | Search Latency | Memory (1024-dim) |
|--------|----------------|-------------------|
| 1,000 | < 1ms | ~10 MB |
| 10,000 | ~5ms | ~100 MB |
| 100,000 | ~50ms | ~1 GB |

### Thread Safety

`InMemoryVectorStore` is `Send + Sync`. Reads are concurrent (via `RwLock`); writes acquire an exclusive lock.
