---
title: "magicaf-knowledge"
description: "Pure primitives for a markdown knowledge vault: note parsing, safe paths, link and entity resolution, typed relations, provenance rules, an AI-autonomy policy, and graph analytics."
weight: 62
keywords: [magicaf-knowledge, Obsidian-compatible, wikilinks, knowledge graph, entity resolution, provenance, second brain]
---

{{< crate-header "magicaf-knowledge" >}}

`magicaf-knowledge` is the rulebook for an assistant that maintains a personal or team knowledge base made of markdown notes. It parses notes in the format Obsidian popularized — YAML frontmatter, `[[wikilinks]]`, `![[embeds]]`, `#tags`, `^block-ids` — resolves links and entities, records where every fact came from, and decides how much an AI may change on its own.

Everything is a pure function over strings and structs: no file access, no async, no model. Your host owns storage, models, and permissions.

## Example

```rust
use magicaf_knowledge::{decide, parse_note, resolve_entity, AutonomySettings, EntityKind, EntityRef, EntityResolution, LinkIndex, Operation, Target};

fn main() {
    let note = parse_note("---\ntitle: Daily\ntags: [log]\n---\nSee [[Project A]] and ![[pic.png]] #todo\n");
    let mut index = LinkIndex::new();
    index.insert("Projects/Alpha.md", &["Project A".into()]);
    index.insert("assets/pic.png", &[]);
    for link in &note.links {
        println!("{} -> {:?}", link.target, index.resolve(&link.target, "Notes/Daily.md").path());
    }
    let existing = vec![EntityRef { id: "e1".into(), kind: EntityKind::Organization, canonical_name: "Acme Corporation".into(), aliases: vec!["Acme".into()] }];
    match resolve_entity("acme", EntityKind::Organization, &existing) {
        EntityResolution::Same { id } => println!("same {id}"),
        EntityResolution::Candidates { ids } => println!("candidates {ids:?}"),
        EntityResolution::New => println!("new"),
    }
    let d = decide(Operation::MergeNotes, 0.99, Target::default(), &AutonomySettings::default());
    println!("{d:?} tags={:?}", note.tags);
}
```

## Modules

| Area | Items |
|---|---|
| Notes | `parse_note(text)` → title, aliases, tags, links (with exact byte positions), headings, block ids, word count. `rewrite_links` edits links in place. |
| Frontmatter | `frontmatter::set_scalar`, `set_list`, `remove_key` — change one key and leave every other byte of the file untouched. |
| Paths | `validate_vault_path` rejects traversal and oversize paths; `file_name_for_title` and `unique_name` make safe new names. |
| Links | `LinkIndex::resolve(target, from)` → `Resolved`, `Ambiguous` (with candidates), or `Unresolved`. |
| Entities | `resolve_entity(name, kind, existing)` → `Same`, `Candidates` (with similarity scores), or `New`. It never merges on similarity alone. 15 entity kinds, including Medication, Condition, Procedure, and Device. |
| Relations | 24 typed relations, each with its inverse label and symmetry. |
| Provenance | `Provenance::check` enforces, among other rules, that an inference is never marked verified without a named person. |
| Autonomy | `decide(operation, confidence, target, settings)` → `Apply`, `Propose`, or `Skip`. |
| Analytics | Co-mention strength, community detection, bounded shortest paths, near-duplicate scores. |

## The autonomy policy

Each of the 22 operations an AI might perform — tag a note, add a link, merge two notes, delete — carries a risk level. With the default `Balanced` setting, low-risk operations at confidence 0.75 or above apply automatically; everything else becomes a proposal for a person to accept. High-risk operations require the `Trusted` setting *and* explicit authorization, and never apply automatically to shared notes. Some operations are reserved for people regardless of settings.

## Related

- [`magicaf-routing`](/docs/crates/magicaf-routing/) and [`magicaf-research`](/docs/crates/magicaf-research/) — the same decide-don't-execute design
