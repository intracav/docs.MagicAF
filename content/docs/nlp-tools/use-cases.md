---
title: "Use Cases & Examples"
description: "Real-world examples using MagicAF NLP pipelines: document analysis, entity extraction, sentiment monitoring, and more."
weight: 5
keywords: [NLP examples, use cases, code samples, real-world applications]
---

This page provides complete, working examples for common NLP tasks using MagicAF pipelines.

---

## Document Q&A Pipeline

Extract answers from a document using question answering:

```rust
use magicaf_nlp::qa::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = QuestionAnsweringPipeline::new(QaConfig::default()).await?;

    let document = r#"
        MagicAF is a modular, production-grade Rust framework for AI-powered systems.
        It provides embeddings, vector search, LLM orchestration, and RAG workflows.
        Designed for air-gapped, on-premises environments with no cloud dependencies.
    "#;

    let questions = vec![
        "What is MagicAF?",
        "What does MagicAF provide?",
        "Where is MagicAF designed to run?",
    ];

    for question in questions {
        let answers = pipeline.predict(&[QaInput {
            question: question.into(),
            context: document.into(),
        }], 1, 50).await?;

        if let Some(answer) = answers[0].first() {
            println!("Q: {question}");
            println!("A: {} (confidence: {:.2}%)\n", 
                     answer.answer, answer.score * 100.0);
        }
    }

    Ok(())
}
```

---

## Entity Extraction from Text

Extract persons, locations, and organizations from text:

```rust
use magicaf_nlp::ner::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = NerPipeline::new(NerConfig::default()).await?;

    let texts = vec![
        "Apple Inc. was founded by Steve Jobs in Cupertino, California.",
        "Elon Musk is the CEO of Tesla, which is based in Austin, Texas.",
        "The United Nations headquarters is located in New York City.",
    ];

    let all_entities = pipeline.predict(
        &texts.iter().map(|s| s.as_str()).collect::<Vec<_>>()
    ).await?;

    for (i, entities) in all_entities.iter().enumerate() {
        println!("Text {}: {}", i + 1, texts[i]);
        
        let persons: Vec<_> = entities.iter()
            .filter(|e| e.label.starts_with("I-PER"))
            .collect();
        let locations: Vec<_> = entities.iter()
            .filter(|e| e.label.starts_with("I-LOC"))
            .collect();
        let orgs: Vec<_> = entities.iter()
            .filter(|e| e.label.starts_with("I-ORG"))
            .collect();

        if !persons.is_empty() {
            println!("  Persons: {}", 
                     persons.iter().map(|e| &e.word).collect::<Vec<_>>().join(", "));
        }
        if !locations.is_empty() {
            println!("  Locations: {}", 
                     locations.iter().map(|e| &e.word).collect::<Vec<_>>().join(", "));
        }
        if !orgs.is_empty() {
            println!("  Organizations: {}", 
                     orgs.iter().map(|e| &e.word).collect::<Vec<_>>().join(", "));
        }
        println!();
    }

    Ok(())
}
```

---

## Sentiment Analysis Dashboard

Analyze sentiment across multiple texts:

```rust
use magicaf_nlp::sentiment::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = SentimentPipeline::new(SentimentConfig::default()).await?;

    let reviews = vec![
        "This product is amazing! Highly recommend.",
        "Terrible quality, waste of money.",
        "It's okay, nothing special.",
        "Best purchase I've made this year!",
        "Disappointed with the service.",
    ];

    let results = pipeline.predict(
        &reviews.iter().map(|s| s.as_str()).collect::<Vec<_>>()
    ).await?;

    println!("Sentiment Analysis Results:\n");
    for (i, result) in results.iter().enumerate() {
        let emoji = match result.polarity {
            SentimentPolarity::Positive => "😊",
            SentimentPolarity::Negative => "😞",
        };
        println!("{} Review {}: {} (confidence: {:.2}%)",
                 emoji, i + 1, result.polarity, result.score * 100.0);
    }

    let positive_count = results.iter()
        .filter(|r| r.polarity == SentimentPolarity::Positive)
        .count();
    let negative_count = results.len() - positive_count;

    println!("\nSummary: {} positive, {} negative", positive_count, negative_count);

    Ok(())
}
```

---

## Multi-Language Translation

Translate text between multiple languages:

```rust
use magicaf_nlp::translation::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = TranslationPipeline::new(TranslationConfig {
        source_languages: vec![Language::English],
        target_languages: vec![Language::French, Language::Spanish, Language::German],
        ..Default::default()
    }).await?;

    let texts = vec![
        "Hello, how are you?",
        "The weather is nice today.",
        "I love programming in Rust.",
    ];

    let languages = vec![Language::French, Language::Spanish, Language::German];

    for lang in languages {
        println!("\nTranslating to {:?}:", lang);
        let results = pipeline.translate(
            &texts.iter().map(|s| s.as_str()).collect::<Vec<_>>(),
            None,
            Some(lang),
        ).await?;

        for (i, result) in results.iter().enumerate() {
            println!("  {} → {}", texts[i], result.text);
        }
    }

    Ok(())
}
```

---

## Document Summarization

Generate concise summaries of long documents:

```rust
use magicaf_nlp::summarization::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = SummarizationPipeline::new(SummaryConfig {
        min_length: Some(30),
        max_length: Some(150),
        num_beams: Some(4),
        length_penalty: Some(1.2),
        ..Default::default()
    }).await?;

    let long_article = r#"
        In findings published Tuesday in Cornell University's arXiv by a team
        of scientists from the University of California, researchers discovered
        that transformer models can achieve remarkable performance on a wide
        variety of natural language processing tasks. The study, which analyzed
        over 100 different model architectures, found that attention mechanisms
        are crucial for understanding long-range dependencies in text. The
        research team trained models on datasets spanning multiple languages
        and domains, demonstrating the versatility of the transformer architecture.
        These findings have significant implications for the future of AI research
        and could lead to more efficient and capable language models.
    "#;

    let summaries = pipeline.summarize(&[long_article]).await?;

    println!("Original ({} chars):\n{}\n", long_article.len(), long_article);
    println!("Summary ({} chars):\n{}", 
             summaries[0].text.len(), summaries[0].text);

    Ok(())
}
```

---

## Zero-Shot Text Classification

Classify text into arbitrary categories without training:

```rust
use magicaf_nlp::zero_shot::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = ZeroShotPipeline::new(ZeroShotConfig::default()).await?;

    let texts = vec![
        "Who are you voting for in the upcoming election?",
        "The Lakers won the championship last night.",
        "Scientists discover new exoplanet in habitable zone.",
        "New iPhone release date announced for next month.",
    ];

    let categories = vec!["politics", "sports", "science", "technology", "entertainment"];

    let results = pipeline.classify(
        &texts.iter().map(|s| s.as_str()).collect::<Vec<_>>(),
        &categories.iter().map(|s| s.as_str()).collect::<Vec<_>>(),
        None,
        128,
    ).await?;

    for (i, classifications) in results.iter().enumerate() {
        println!("Text: {}", texts[i]);
        println!("Top categories:");
        for (j, result) in classifications.iter().take(3).enumerate() {
            println!("  {}. {} ({:.2}%)", 
                     j + 1, result.label, result.score * 100.0);
        }
        println!();
    }

    Ok(())
}
```

---

## Keyword Extraction from Documents

Extract key terms from documents:

```rust
use magicaf_nlp::keywords::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = KeywordExtractionPipeline::new(KeywordConfig {
        top_n: 10,
        diversity: 0.6,
        max_ngram_size: 2,
        ..Default::default()
    }).await?;

    let documents = vec![
        "Rust is a multi-paradigm, general-purpose programming language. \
         Rust emphasizes performance, type safety, and concurrency. \
         The language is designed for systems programming and memory safety.",
        "Machine learning is a subset of artificial intelligence. \
         It involves training algorithms on data to make predictions. \
         Deep learning uses neural networks with multiple layers.",
    ];

    let results = pipeline.extract(
        &documents.iter().map(|s| s.as_str()).collect::<Vec<_>>()
    ).await?;

    for (i, keywords) in results.iter().enumerate() {
        println!("Document {} keywords:", i + 1);
        for (j, kw) in keywords.iter().enumerate() {
            println!("  {}. {} (relevance: {:.2})", j + 1, kw.text, kw.score);
        }
        println!();
    }

    Ok(())
}
```

---

## Combined Pipeline: Document Analysis

Combine multiple pipelines for comprehensive document analysis:

```rust
use magicaf_nlp::prelude::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize all pipelines
    let ner = NerPipeline::new(NerConfig::default()).await?;
    let sentiment = SentimentPipeline::new(SentimentConfig::default()).await?;
    let keywords = KeywordExtractionPipeline::new(KeywordConfig::default()).await?;

    let document = r#"
        Apple Inc., led by CEO Tim Cook, announced record-breaking sales
        in Cupertino, California today. The company's innovative products
        continue to delight customers worldwide. This is fantastic news for
        investors and technology enthusiasts alike.
    "#;

    // Extract entities
    let entities = ner.predict(&[document]).await?;
    println!("Entities found:");
    for entity in &entities[0] {
        println!("  {}: {} ({:.2})", entity.label, entity.word, entity.score);
    }

    // Analyze sentiment
    let sentiments = sentiment.predict(&[document]).await?;
    println!("\nSentiment: {:?} (confidence: {:.2}%)",
             sentiments[0].polarity, sentiments[0].score * 100.0);

    // Extract keywords
    let keywords_result = keywords.extract(&[document]).await?;
    println!("\nTop keywords:");
    for kw in &keywords_result[0] {
        println!("  {} (relevance: {:.2})", kw.text, kw.score);
    }

    Ok(())
}
```

---

## Batch Processing for Performance

Process multiple documents efficiently:

```rust
use magicaf_nlp::ner::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = NerPipeline::new(NerConfig::default()).await?;

    // Large batch of texts
    let texts: Vec<&str> = (0..100)
        .map(|i| format!("Document {}: This is sample text with entities.", i))
        .map(|s| Box::leak(s.into_boxed_str()))
        .collect();

    // Process all at once (more efficient than individual calls)
    let all_entities = pipeline.predict(&texts).await?;

    println!("Processed {} documents", all_entities.len());
    println!("Total entities found: {}",
             all_entities.iter().map(|v| v.len()).sum::<usize>());

    Ok(())
}
```

---

## Next Steps

- **Quick Start:** Get running in minutes with the [Quick Start Guide](/docs/nlp-tools/quickstart/)
- **Pipelines:** Explore all available [Pipelines](/docs/nlp-tools/pipelines/)
- **Configuration:** Learn about [Setup & Configuration](/docs/nlp-tools/setup/)
