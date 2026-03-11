---
title: "Compliance"
description: "API reference for GDPR right-to-erasure workflows — entity deletion, verification, cache purging, and audit trail generation."
weight: 11
tags: [api, compliance, gdpr, right-to-erasure, data-deletion, hipaa]
categories: [reference]
difficulty: intermediate
prerequisites: [/docs/api-reference/core/vector-store/, /docs/api-reference/core/observability/]
estimated_reading_time: "8 min"
last_reviewed: "2026-03-10"
---

MagicAF provides first-class GDPR right-to-erasure support through the `GdprService`, which orchestrates vector deletion, post-deletion verification, cache purging, and audit logging.

**Module:** `magicaf_core::compliance::gdpr`

---

## `GdprDeletionRequest`

```rust
pub struct GdprDeletionRequest {
    pub entity_id: Uuid,
    pub collections: Vec<String>,
    pub purge_cache: bool,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `entity_id` | `Uuid` | The entity identifier whose data should be erased |
| `collections` | `Vec<String>` | Vector store collections to delete from |
| `purge_cache` | `bool` | Whether to also clear the embedding cache |

---

## `GdprDeletionReport`

```rust
pub struct GdprDeletionReport {
    pub entity_id: Uuid,
    pub collections_cleared: Vec<String>,
    pub collections_failed: Vec<(String, String)>,
    pub cache_purged: bool,
    pub completed_at: DateTime<Utc>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `entity_id` | `Uuid` | The entity that was erased |
| `collections_cleared` | `Vec<String>` | Collections successfully purged |
| `collections_failed` | `Vec<(String, String)>` | Collections that failed with `(collection, reason)` |
| `cache_purged` | `bool` | Whether the cache was cleared |
| `completed_at` | `DateTime<Utc>` | Timestamp of completion |

---

## `GdprService<V>`

```rust
pub struct GdprService<V: VectorStore> { /* ... */ }
```

### Constructor

```rust
pub fn new(store: Arc<V>) -> Self
```

### Builder Methods

```rust
/// Attach a cache service for embedding cache purging.
pub fn with_cache(self, cache: Arc<dyn CacheService>) -> Self

/// Attach an audit logger for deletion event recording.
pub fn with_audit_logger(self, logger: Arc<dyn AuditLogger>) -> Self
```

### `delete`

```rust
pub async fn delete(&self, req: GdprDeletionRequest) -> Result<GdprDeletionReport>
```

Executes the full deletion workflow:

1. **Delete** — calls `VectorStore::delete_by_entity(entity_id)` for each collection
2. **Verify** — searches with a zero vector to confirm no results match the entity
3. **Purge cache** — if `purge_cache` is true and a `CacheService` is attached, clears the embedding cache
4. **Audit** — if an `AuditLogger` is attached, emits a `GdprDeletion` audit event

Collections that fail deletion are recorded in `collections_failed` but do not halt the workflow.

---

## `CacheService` Trait

```rust
#[async_trait]
pub trait CacheService: Send + Sync {
    async fn clear(&self);
}
```

Implemented by `CachedEmbeddingService` to allow the GDPR service to purge cached embeddings.

---

## Example

```rust
use magicaf_core::compliance::gdpr::{GdprService, GdprDeletionRequest};

let gdpr = GdprService::new(vector_store.clone())
    .with_cache(embedding_cache.clone())
    .with_audit_logger(audit_logger.clone());

let report = gdpr.delete(GdprDeletionRequest {
    entity_id: uuid::Uuid::parse_str("550e8400-e29b-41d4-a716-446655440000")?,
    collections: vec!["documents".into(), "notes".into()],
    purge_cache: true,
}).await?;

println!("Cleared: {:?}", report.collections_cleared);
println!("Failed:  {:?}", report.collections_failed);
println!("Cache purged: {}", report.cache_purged);
```

---

## Audit Trail

When an `AuditLogger` is attached, the GDPR service emits an `AuditEvent` with:

```rust
AuditEventType::GdprDeletion {
    entity_id: String,          // UUID as string
    collections_cleared: usize, // count of successful deletions
    collections_failed: usize,  // count of failures
}
```

This provides a tamper-evident record for compliance audits.
