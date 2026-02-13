---
title: "Pipelines"
description: "Complete reference for all MagicAF NLP pipelines: Question Answering, NER, Sentiment Analysis, Translation, Summarization, and more."
weight: 3
keywords: [NLP pipelines, question answering, NER, sentiment, translation, summarization]
---

This page provides a complete reference for all available NLP pipelines. Each pipeline runs entirely in-process with no external service dependencies.

---

## Question Answering

**Module:** `magicaf_nlp::qa`  
**Default Model:** DistilBERT fine-tuned on SQuAD  
**Task:** Extract answer spans from a context passage

### How This Differs from RAG

| | Extractive QA | RAG (`magicaf_core::rag`) |
|-|---------------|---------------------------|
| **Input** | Question + known context passage | Question only |
| **Model** | Small classifier (DistilBERT) | Large generative LLM |
| **Output** | Exact text span from context | Free-form generated text |
| **Runtime** | In-process, no server needed | Requires external LLM server |
| **Use case** | Known document, precise extraction | Open-ended knowledge retrieval |

### Example

```rust
use magicaf_nlp::qa::*;

let pipeline = QuestionAnsweringPipeline::new(QaConfig::default()).await?;

let answers = pipeline.predict(&[QaInput {
    question: "Where does Amy live?".into(),
    context: "Amy lives in Amsterdam.".into(),
}], 1, 32).await?;

println!("Answer: {} (score: {:.4})", answers[0][0].answer, answers[0][0].score);
// → Answer: Amsterdam (score: 0.9976)
```

### API

- **`QaInput`**: `{ question: String, context: String }`
- **`Answer`**: `{ answer: String, score: f64, start: usize, end: usize }`
- **`predict(inputs, top_k, max_answer_len)`**: Returns `Vec<Vec<Answer>>`

See [Question Answering →](/docs/nlp-tools/question-answering/) for complete documentation.

---

## Named Entity Recognition (NER)

**Module:** `magicaf_nlp::ner`  
**Default Model:** BERT cased large fine-tuned on CoNLL-03  
**Task:** Extract persons, locations, organisations, and miscellaneous entities

### Example

```rust
use magicaf_nlp::ner::*;

let pipeline = NerPipeline::new(NerConfig::default()).await?;

let entities = pipeline.predict(&[
    "My name is Amy. I live in Paris.",
    "Paris is a city in France.",
]).await?;

for entity in &entities[0] {
    println!("{}: {} ({:.4})", entity.label, entity.word, entity.score);
}
// → I-PER: Amy (0.9986)
//   I-LOC: Paris (0.9985)
```

### Entity Labels

- `I-PER`: Person
- `I-LOC`: Location
- `I-ORG`: Organisation
- `I-MISC`: Miscellaneous

### API

- **`Entity`**: `{ word: String, score: f64, label: String, start: usize, end: usize }`
- **`predict(texts)`**: Returns `Vec<Vec<Entity>>`

See [Named Entity Recognition →](/docs/nlp-tools/named-entity-recognition/) for complete documentation.

---

## Sentiment Analysis

**Module:** `magicaf_nlp::sentiment`  
**Default Model:** DistilBERT fine-tuned on SST-2  
**Task:** Classify text into positive/negative sentiment

### Example

```rust
use magicaf_nlp::sentiment::*;

let pipeline = SentimentPipeline::new(SentimentConfig::default()).await?;

let results = pipeline.predict(&[
    "This framework is amazing!",
    "Worst experience of my life.",
]).await?;

for r in &results {
    println!("{:?}: {:.4}", r.polarity, r.score);
}
// → Positive: 0.9984
//   Negative: 0.9967
```

### API

- **`SentimentPolarity`**: `Positive | Negative`
- **`SentimentResult`**: `{ polarity: SentimentPolarity, score: f64 }`
- **`predict(texts)`**: Returns `Vec<SentimentResult>`

See [Sentiment Analysis →](/docs/nlp-tools/sentiment-analysis/) for complete documentation.

---

## Zero-Shot Classification

**Module:** `magicaf_nlp::zero_shot`  
**Default Model:** BART large fine-tuned on MNLI  
**Task:** Classify text into arbitrary categories without fine-tuning

### Example

```rust
use magicaf_nlp::zero_shot::*;

let pipeline = ZeroShotPipeline::new(ZeroShotConfig::default()).await?;

let results = pipeline.classify(
    &["Who are you voting for in 2024?"],
    &["politics", "sports", "technology", "science"],
    None,
    128,
).await?;

for r in &results[0] {
    println!("{}: {:.4}", r.label, r.score);
}
// → politics: 0.9723
//   technology: 0.0134
//   science: 0.0087
//   sports: 0.0056
```

### API

- **`ClassificationResult`**: `{ label: String, score: f64 }`
- **`classify(texts, labels, hypothesis_template, max_length)`**: Returns `Vec<Vec<ClassificationResult>>`

See [Zero-Shot Classification →](/docs/nlp-tools/zero-shot-classification/) for complete documentation.

---

## Translation

**Module:** `magicaf_nlp::translation`  
**Default Model:** Marian / M2M100  
**Task:** Translate text between 100+ languages

### Example

```rust
use magicaf_nlp::translation::*;

let pipeline = TranslationPipeline::new(TranslationConfig {
    source_languages: vec![Language::English],
    target_languages: vec![Language::French],
    ..Default::default()
}).await?;

let results = pipeline.translate(&[
    "Hello, how are you?",
    "The weather is nice today.",
], None, None).await?;

for r in &results {
    println!("{}", r.text);
}
// → "Bonjour, comment allez-vous?"
//   "Le temps est beau aujourd'hui."
```

### Supported Languages

English, French, German, Spanish, Portuguese, Italian, Dutch, Russian, Chinese, Japanese, Korean, Arabic, Hindi, Turkish, Polish, Swedish, Czech, Romanian, Finnish, Vietnamese, Thai, Indonesian, Hebrew, Greek, Ukrainian, and 75+ more.

### API

- **`Language`**: Enum of supported languages
- **`TranslationOutput`**: `{ text: String }`
- **`translate(texts, source_language, target_language)`**: Returns `Vec<TranslationOutput>`

See [Translation →](/docs/nlp-tools/translation/) for complete documentation.

---

## Summarization

**Module:** `magicaf_nlp::summarization`  
**Default Model:** BART large fine-tuned on CNN/DailyMail  
**Task:** Abstractive text summarization

### Example

```rust
use magicaf_nlp::summarization::*;

let pipeline = SummarizationPipeline::new(SummaryConfig::default()).await?;

let summaries = pipeline.summarize(&[
    "In findings published Tuesday in Cornell University's arXiv by a team \
     of scientists from combating combating combating … (long article) …",
]).await?;

for s in &summaries {
    println!("{}", s.text);
}
```

### API

- **`Summary`**: `{ text: String }`
- **`summarize(texts)`**: Returns `Vec<Summary>`
- **Config options**: `min_length`, `max_length`, `num_beams`, `length_penalty`

See [Summarization →](/docs/nlp-tools/summarization/) for complete documentation.

---

## Dialogue / Conversation

**Module:** `magicaf_nlp::dialogue`  
**Default Model:** DialoGPT (medium)  
**Task:** Multi-turn conversational AI with built-in state management

### How This Differs from `LlmService::chat`

| | Dialogue (this module) | `LlmService::chat` |
|-|------------------------|---------------------|
| **Runtime** | In-process DialoGPT model | External API call to LLM server |
| **State** | Built-in `ConversationManager` | Stateless — caller manages history |
| **Model** | Conversation-specific (DialoGPT) | General-purpose LLM |
| **Dependencies** | libtorch / ONNX Runtime | HTTP server running |

### Example

```rust
use magicaf_nlp::dialogue::*;

let mut pipeline = DialoguePipeline::new(DialogueConfig::default()).await?;

let conv_id = pipeline.create_conversation("Hello! How are you?").await?;
let response = pipeline.generate_response(&conv_id).await?;
println!("Bot: {response}");

pipeline.add_user_message(&conv_id, "Tell me a joke.").await?;
let joke = pipeline.generate_response(&conv_id).await?;
println!("Bot: {joke}");
```

### API

- **`ConversationRole`**: `User | Assistant`
- **`ConversationTurn`**: `{ role: ConversationRole, content: String }`
- **`create_conversation(initial_message)`**: Returns `Uuid` (conversation ID)
- **`add_user_message(conversation_id, message)`**
- **`generate_response(conversation_id)`**: Returns `String`
- **`get_history(conversation_id)`**: Returns `Vec<ConversationTurn>`

See [Dialogue →](/docs/nlp-tools/dialogue/) for complete documentation.

---

## Text Generation

**Module:** `magicaf_nlp::generation`  
**Default Model:** GPT-2 (medium)  
**Task:** Auto-regressive language generation

### How This Differs from `LlmService::generate`

| | Text Generation (this module) | `LlmService::generate` |
|-|-------------------------------|------------------------|
| **Runtime** | In-process GPT-2 model | External API call to LLM server |
| **Model** | GPT-2 / GPT-Neo (124M–1.5B params) | Any LLM (Mistral-7B, Llama-70B, etc.) |
| **Decoding** | Full control (beam, top-k, top-p) | Server-side decoding |
| **Dependencies** | libtorch / ONNX Runtime | HTTP server running |

### Example

```rust
use magicaf_nlp::generation::*;

let pipeline = TextGenerationPipeline::new(GenerationNlpConfig::default()).await?;

let texts = pipeline.generate(&["The future of AI is"]).await?;
for text in texts {
    println!("{text}");
}
```

### API

- **`generate(prompts)`**: Returns `Vec<String>`
- **Config options**: `max_length`, `temperature`, `top_k`, `top_p`, `num_beams`, `repetition_penalty`, `num_return_sequences`

See [Text Generation →](/docs/nlp-tools/text-generation/) for complete documentation.

---

## Keyword Extraction

**Module:** `magicaf_nlp::keywords`  
**Default Model:** Sentence embeddings (all-MiniLM-L12-v2) + TF-IDF  
**Task:** Extract the most relevant keywords and keyphrases from documents

### Example

```rust
use magicaf_nlp::keywords::*;

let pipeline = KeywordExtractionPipeline::new(KeywordConfig::default()).await?;

let results = pipeline.extract(&[
    "Rust is a multi-paradigm, general-purpose programming language. \
     Rust emphasizes performance, type safety, and concurrency."
]).await?;

for kw in &results[0] {
    println!("{}: {:.4}", kw.text, kw.score);
}
// → rust: 0.5091
//   concurrency: 0.3383
//   …
```

### API

- **`Keyword`**: `{ text: String, score: f64 }`
- **`extract(documents)`**: Returns `Vec<Vec<Keyword>>`
- **Config options**: `top_n`, `diversity`, `max_ngram_size`

See [Keyword Extraction →](/docs/nlp-tools/keyword-extraction/) for complete documentation.

---

## POS Tagging

**Module:** `magicaf_nlp::pos`  
**Default Model:** BERT fine-tuned on English Penn Treebank  
**Task:** Assign grammatical categories to each word

### Tag Set

Uses Penn Treebank tags:
- `NN` (noun), `VB` (verb), `JJ` (adjective), `RB` (adverb)
- `PRP` (pronoun), `DT` (determiner), `IN` (preposition), etc.

### Example

```rust
use magicaf_nlp::pos::*;

let pipeline = PosPipeline::new(PosConfig::default()).await?;

let results = pipeline.predict(&["My name is Bob"]).await?;

for tag in &results[0] {
    println!("{}: {} ({:.4})", tag.word, tag.label, tag.score);
}
// → My: PRP (0.1560)
//   name: NN (0.6565)
//   is: VBZ (0.3697)
//   Bob: NNP (0.7460)
```

### API

- **`PosTag`**: `{ word: String, score: f64, label: String }`
- **`predict(texts)`**: Returns `Vec<Vec<PosTag>>`

See [POS Tagging →](/docs/nlp-tools/pos-tagging/) for complete documentation.

---

## Masked Language Model

**Module:** `magicaf_nlp::masked_lm`  
**Default Model:** BERT base (uncased)  
**Task:** Predict masked words in context (fill-in-the-blank)

### Mask Token

- BERT models: Use `[MASK]`
- RoBERTa models: Use `<mask>`

### Example

```rust
use magicaf_nlp::masked_lm::*;

let pipeline = MaskedLmPipeline::new(MaskedLmConfig::default()).await?;

let results = pipeline.predict(&[
    "Hello I am a [MASK] student",
    "Paris is the [MASK] of France. It is [MASK] in Europe.",
]).await?;

for (i, sentence_results) in results.iter().enumerate() {
    for token in sentence_results {
        println!("[{i}] {} (score: {:.4})", token.text, token.score);
    }
}
// → [0] college (score: 8.0910)
//   [1] capital (score: 16.7249)
//   [1] located (score: 9.0452)
```

### API

- **`MaskedToken`**: `{ text: String, id: i64, score: f64 }`
- **`predict(texts)`**: Returns `Vec<Vec<MaskedToken>>`

See [Masked Language Model →](/docs/nlp-tools/masked-language-model/) for complete documentation.

---

## Pipeline Comparison

| Pipeline | Model Size | Use Case | Output Type |
|----------|-----------|----------|-------------|
| **QA** | ~250MB | Extract answers from known context | Text span |
| **NER** | ~1.3GB | Extract entities (person, location, etc.) | Structured entities |
| **Sentiment** | ~250MB | Classify positive/negative | Binary classification |
| **Zero-Shot** | ~1.6GB | Classify into arbitrary labels | Multi-label classification |
| **Translation** | ~600MB–2GB | Translate between languages | Translated text |
| **Summarization** | ~1.6GB | Condense long documents | Abstractive summary |
| **Dialogue** | ~350MB | Multi-turn conversation | Conversational response |
| **Generation** | ~500MB | Generate text from prompt | Generated text |
| **Keywords** | ~90MB | Extract key terms | Ranked keywords |
| **POS** | ~1.3GB | Tag grammatical categories | POS tags |
| **Masked LM** | ~440MB | Predict masked words | Predicted tokens |

---

## Next Steps

- **Quick Start:** Get running in minutes with the [Quick Start Guide](/docs/nlp-tools/quickstart/)
- **Configuration:** Learn about [Setup & Configuration](/docs/nlp-tools/setup/)
- **Examples:** See [Use Cases & Examples](/docs/nlp-tools/use-cases/) for real-world use cases
