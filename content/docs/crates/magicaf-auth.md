---
title: "magicaf-auth"
description: "A pluggable AuthProvider trait with JWT, local-password, client-certificate, and LDAP providers that all produce the same claims, plus role-based permissions, token revocation, and TOTP."
weight: 61
keywords: [magicaf-auth, Rust authentication, JWT, Argon2, TOTP, RBAC, LDAP, client certificates]
---

{{< crate-header "magicaf-auth" >}}

`magicaf-auth` puts every way a user can prove who they are behind one trait. Whichever provider validates the credentials, your server receives the same `AuthClaims` — a user id, role, permissions, organization, and expiry — and checks permissions against one role matrix.

## Example

With `features = ["auth-jwt", "auth-local", "auth-mfa"]`:

```rust
use magicaf_auth::config::{JwtConfig, LocalAuthConfig};
use magicaf_auth::jwt::JwtProvider;
use magicaf_auth::local::LocalProvider;
use magicaf_auth::mfa::{generate_totp_secret, verify_totp};
use magicaf_auth::{AuthProvider, Credentials, RbacMatrix, UserRole};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let jwt = JwtProvider::new(
        JwtConfig { secret: Some("dev-secret".into()), issuer: Some("https://issuer.example".into()), ..Default::default() },
        vec!["root@example.com".into()],
    )?;
    let _ = jwt.validate(&Credentials::BearerToken("eyJ...".into())).await;

    let local = LocalProvider::new(LocalAuthConfig::default());
    local.register_user("alice", "correct horse", Some("alice@example.com".into()), UserRole::User).await?;
    let claims = local.validate(&Credentials::UsernamePassword { username: "alice".into(), password: "correct horse".into() }).await?;

    let rbac = RbacMatrix::default();
    println!("{} chat:write={}", claims.role, rbac.has_permission(claims.role, "chat:write"));

    let setup = generate_totp_secret("MagicAF", "alice@example.com", 30, 6)?;
    let ok = verify_totp(&setup.secret, "123456", 30, 6)?;
    println!("{} {}", setup.uri, ok);
    Ok(())
}
```

## Providers

| Provider | Feature | Use it for | Notes |
|---|---|---|---|
| `JwtProvider` | `auth-jwt` (default) | Tokens from your identity provider | Validates signature and expiry, plus issuer and audience when configured, against a static HMAC secret or RSA/EC public key. The constructor fails unless a key matching one of the configured `algorithms` is present. The role comes from the token's `role` claim, so only trust issuers that control it. |
| `LocalProvider` | `auth-local` | Development and single-node | Argon2id hashes (64 MiB, 3 iterations), lockout after 5 failures for 15 minutes. Accounts live in memory. |
| `LdapProvider` | `auth-ldap` | Directory bind | Searches for the user with an escaped filter, then binds as them. Empty credentials are refused before any connection, and a search matching more than one entry is refused. Supports `ldaps://` or StartTLS, and `timeout_secs` bounds the connection and each operation. |
| `PkiProvider` | `auth-pki` | Behind an mTLS-terminating proxy | Reads identity — including DoD-style EDIPI — from certificate fields the proxy forwards. It performs **no certificate validation itself**; the proxy must validate the client certificate and strip any client-supplied copies of the forwarded headers. |

Also included: `RbacMatrix` (cumulative permissions up the `User` → `VerifiedUser` → `Admin` → `SuperAdmin` hierarchy), `RevocationStore` (revoke by token id), and TOTP (`generate_totp_secret`, `verify_totp`) with the `auth-mfa` feature.

## Configuration checks

Providers refuse configuration that promises something they do not do, rather than accepting it and silently ignoring it:

| Provider | Rejected at construction |
|---|---|
| `JwtProvider` | No `secret` or `public_key_pem` for the configured algorithms; JWKS-only configuration (JWKS is not implemented) |
| `LdapProvider` | `starttls` with an `ldaps://` URL; `timeout_secs = 0`; a `user_filter` without `{username}` |
| `PkiProvider` | `DirectTls` mode, or any `ca_cert_path`, `crl_path`, or `ocsp_url` — certificate validation belongs at the proxy |

## Limits you need to know

- **No JWKS.** Configure a static secret or public key; rotate it with a redeploy.
- **Revocation is per process.** `RevocationStore` is in memory; revocations do not reach other instances or survive a restart.
- **Local sessions.** `LocalProvider` creates a session token on login but does not return it through the public API, so authenticate local users per request or issue your own JWT after login. `refresh` is not supported by any provider.
- **`PkiProvider` sets `mfa_verified`** on the assumption that client certificates live on PIN-protected hardware tokens. If yours do not, do not rely on that flag.
- **LDAP has no live-directory tests** in the crate. Test it against your directory before you depend on it.

## Related

- [`magicaf-server`](/docs/crates/magicaf-server/) — wires a provider in by build profile
- [`magicaf-db`](/docs/crates/magicaf-db/) — stores users by the `external_id` providers produce
- [Security hardening](/docs/deployment/security/)
