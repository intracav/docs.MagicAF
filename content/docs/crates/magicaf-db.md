---
title: "magicaf-db"
description: "A repository-pattern data layer over PostgreSQL or SQLite for MagicAF server entities, with optional AES-256-GCM encryption of chat titles and messages."
weight: 60
keywords: [magicaf-db, sqlx, repository pattern, SQLite, PostgreSQL, field-level encryption]
---

{{< crate-header "magicaf-db" >}}

`magicaf-db` stores what an assistant server needs to remember — users, chats and messages, documents, spaces, artifacts, memories, agent sessions, and an audit log — behind repository traits, so the same server code runs on PostgreSQL in a data center or a single SQLite file on an isolated machine.

## Example

```rust
use magicaf_db::pagination::Pagination;
use magicaf_db::types::UpsertUserRequest;
use magicaf_db::{EncryptedChatRepo, FieldCipher, RepoSet};
use std::sync::Arc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let pool = sqlx::SqlitePool::connect("sqlite::memory:").await?;
    magicaf_db::sqlite::run_migrations(&pool).await?;
    let mut repos: RepoSet = magicaf_db::sqlite::build_repo_set(pool);

    // Optional field-level encryption of chat titles (key: base64 of 32 bytes).
    let cipher = FieldCipher::from_base64("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=")?;
    repos.chats = Arc::new(EncryptedChatRepo::new(Arc::clone(&repos.chats), cipher));

    let user = repos.users.upsert(&UpsertUserRequest {
        external_id: "ext-001".into(),
        email: "alice@example.com".into(),
        role: "user".into(),
    }).await?;
    let chat = repos.chats.create(user.id, "First chat").await?;
    let page = repos.chats.list_by_user(user.id, &Pagination::new(0, 20)).await?;
    println!("{} {}", chat.id, page.total);
    Ok(())
}
```

## Shape

| Item | What it is |
|---|---|
| `sqlite::run_migrations(&pool)` / `postgres::run_migrations(&pool)` | Creates the 11 tables if they do not exist |
| `sqlite::build_repo_set(pool)` / `postgres::build_repo_set(pool)` | A `RepoSet` with one `Arc<dyn …Repo>` per entity |
| `RepoSet` | `users`, `chats`, `messages`, `documents`, `spaces`, `artifacts`, `audit`, `sessions`, `memories`, `agents` |
| `DatabaseConfig` | URL and pool settings (10 max connections, timeouts); `DatabasePool::connect` builds a pool from it |
| `Pagination::new(offset, limit)` | Limits are clamped to 1–1000 (default 50); results come back as `Page<T>` with a total |

Because each repository is a trait object, you can wrap one — for caching, metrics, or encryption — without touching the others.

## Field encryption

`FieldCipher` encrypts individual columns with AES-256-GCM. Wrap the chat and message repositories to encrypt chat titles and message content and metadata:

- The key is 32 bytes, base64-encoded. Losing it makes encrypted rows unreadable.
- Each value is bound to its table, column, and owner as additional authenticated data, so a ciphertext copied into another row fails to decrypt.
- Rows written before encryption was enabled are still readable.

Only those columns are encrypted. Documents, memories, the audit log, and the other tables are stored as plaintext unless your database or disk encrypts them.

## Things to know

- Migrations are a single idempotent SQL file, not a versioned migration history. Plan schema changes accordingly.
- The schema is shaped for MagicAF's assistant server (users carry a role, specialty, and subscription tier). Use it as-is with [`magicaf-server`](/docs/crates/magicaf-server/), or as a reference for your own.
- The SQLite backend has an integration test suite; the PostgreSQL backend is exercised by the products that use it rather than by tests in this crate.
- `ChatRepo::delete_by_user` and the document deletes are hard deletes, which is what an erasure request needs.

## Related

- [`magicaf-auth`](/docs/crates/magicaf-auth/) — produces the `external_id` that `UserRepo::find_by_external_id` looks up
