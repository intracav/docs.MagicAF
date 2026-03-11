---
title: "Embedding Cache"
description: "API reference for the LRU embedding cache with TTL, GDPR-aware purging, and transparent EmbeddingService wrapping."
weight: 14
tags: [api, cache, embeddings, lru, performance, gdpr]
categories: [reference]
difficulty: beginner
prerequisites: [/docs/api-reference/core/embedding-service/]
estimated_reading_time: "6 min"
last_reviewed: "2026-03-10"
---

`CachedEmbeddingService` wraps any `EmbeddingService` with an LRU cache, eliminating redundant embedding calls for repeated text. It implements both `EmbeddingService` and `CacheService` for GDPR integration.

**Module:** `magicaf_core::embeddings::cache`

---

## `EmbeddingCacheConfig`

```rust
pub struct EmbeddingCacheConfig {
    pub max_entries: usize,         // default: 1024
    pub ttl_secs: Option<u64>,      // default: Some(3600)
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `max_entries` | `usize` | `1024` | Maximum cached embeddings (LRU eviction) |
| `ttl_secs` | `Option<u64>` | `Some(3600)` | Time-to-live in seconds; `None` disables expiry |

---

## `CachedEmbeddingService<S>`

```rust
pub struct CachedEmbeddingService<S: EmbeddingService> { /* ... */ }
```

### Constructor

```rust
pub fn new(inner: S, config: EmbeddingCacheConfig) -> Self
```

Wraps `inner` with an LRU cache. The cache key is the SHA-256 hash of the input text.

### Trait Implementations

**`EmbeddingService`** — cache-aware:
- `embed(&[String])` — returns cached vectors for cache hits, calls `inner.embed()` only for misses
- `embed_single(&str)` — single-text convenience, uses the same cache
- `health_check()` — delegates to `inner.health_check()`

**`CacheService`** — for GDPR integration:
- `clear()` — purges all cached entries

### Cache Behavior

- **Key:** SHA-256 hash of input text (not the raw text)
- **Eviction:** LRU — least recently used entries evicted when `max_entries` is reached
- **Expiry:** Entries older than `ttl_secs` are treated as misses on read (lazy expiration)
- **Thread safety:** `Arc<RwLock<LruCache>>` — concurrent reads, exclusive writes

---

## Example

```rust
use magicaf_core::embeddings::cache::{CachedEmbeddingService, EmbeddingCacheConfig};

let inner = LocalEmbeddingService::new(embedding_config)?;

let cached = CachedEmbeddingService::new(inner, EmbeddingCacheConfig {
    max_entries: 2048,
    ttl_secs: Some(1800), // 30-minute TTL
});

// First call — hits the embedding server
let vec1 = cached.embed_single("What is MagicAF?").await?;

// Second call — served from cache (zero network I/O)
let vec2 = cached.embed_single("What is MagicAF?").await?;

assert_eq!(vec1, vec2);
```

---

## GDPR Integration

The `CachedEmbeddingService` implements `CacheService`, which means the `GdprService` can purge the cache as part of a right-to-erasure workflow:

```rust
use magicaf_core::compliance::gdpr::GdprService;

let cached = Arc::new(CachedEmbeddingService::new(inner, config));

let gdpr = GdprService::new(vector_store)
    .with_cache(cached.clone()); // Purges embeddings during deletion
```
