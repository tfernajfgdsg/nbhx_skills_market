---
name: text-analyzer
description: "Use when: analyzing text content for sentiment, extracting key phrases, evaluating readability, or generating text summaries. Supports multiple languages and detailed metrics."
---

# Text Analysis Skill

## Overview

This skill provides comprehensive text analysis capabilities including sentiment analysis, keyword extraction, readability assessment, and content summarization.

## Available Features

### 1. Sentiment Analysis
- Analyzes emotional tone of text
- Returns sentiment scores (positive/negative/neutral)
- Multi-language support
- Context-aware analysis

### 2. Keyword Extraction
- Identifies important terms and phrases
- Ranks by relevance and frequency
- Supports domain-specific dictionaries
- TF-IDF based weighting

### 3. Readability Assessment
- Flesch-Kincaid grade level
- Coleman-Liau index
- Automated Readability Index (ARI)
- Gunning Fog index
- Average sentence/word length

### 4. Content Summary
- Extractive summarization
- Abstractive summarization
- Adjustable summary length
- Preserves key information

## Usage Examples

### Analyze Text Sentiment
```
请分析这段客户反馈的情感：
"产品质量很好，但发货速度有点慢，总体还是满意的"
```

### Extract Key Phrases
```
从以下技术文档中提取核心概念：
[输入长篇技术文档]
```

### Evaluate Readability
```
评估这份营销文案的可读性等级和目标受众
```

### Generate Summary
```
为这篇新闻文章生成 100 字的摘要
```

## Technical Details

- **Language Support**: Chinese, English, Spanish, French, German
- **Analysis Engine**: Advanced NLP with pre-trained models
- **Output Format**: JSON or Markdown
- **Performance**: Real-time analysis for texts up to 10,000 words

## Output Structure

```json
{
  "sentiment": {
    "score": 0.75,
    "label": "positive",
    "confidence": 0.92
  },
  "keywords": [
    {"term": "关键词1", "score": 0.95, "frequency": 5},
    {"term": "关键词2", "score": 0.87, "frequency": 3}
  ],
  "readability": {
    "grade_level": 8,
    "avg_sentence_length": 15.5,
    "avg_word_length": 4.2,
    "complexity": "medium"
  },
  "summary": "文本摘要..."
}
```

## Best Practices

1. **Input Length**: Optimal results for texts between 100-5000 words
2. **Language Consistency**: Do not mix multiple languages in a single request
3. **Context**: Provide additional context for domain-specific analysis
4. **Iterative Analysis**: Use multiple passes for complex documents

## Tips

- For marketing content, focus on sentiment and keywords
- For technical documentation, prioritize readability metrics
- For customer feedback, combine sentiment with keyword analysis
- Adjust summary length based on your specific needs
