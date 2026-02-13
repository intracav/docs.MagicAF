---
title: "VectorStore"
description: "API reference for the VectorStore trait, QdrantVectorStore, InMemoryVectorStore, and SearchResult."
weight: 2
tags: [api, vector-store, qdrant, in-memory, search]
categories: [reference]
difficulty: intermediate
prerequisites: [/docs/core-concepts/traits-and-interfaces/]
estimated_reading_time: "10 min"
last_reviewed: "2026-02-12"
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

let store = QdrantVectorStore::new(VectorStoreConfig {
    base_url: "http://localhost:6333".into(),
    api_key: None,
    timeout_secs: 30,
}).await?;
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
