---
name: data-transformer
description: "Use when: converting between data formats (JSON/CSV/XML/YAML), cleaning data, transforming structures, mapping fields, or preparing data for integration."
---

# Data Transform Skill

## Overview

Comprehensive data transformation toolset for converting, cleaning, and restructuring data across multiple formats and use cases.

## Supported Transformations

### 1. Format Conversion
- JSON ↔ CSV
- JSON ↔ XML
- JSON ↔ YAML
- CSV ↔ Excel
- XML ↔ JSON
- Custom delimited formats

### 2. Data Cleaning
- Remove duplicates
- Handle missing values
- Normalize whitespace
- Standardize formatting
- Remove invalid entries
- Validate data integrity

### 3. Structure Transformation
- Flatten nested objects
- Pivot tables
- Merge datasets
- Split columns
- Reorganize hierarchies
- Map field names

### 4. Data Validation
- Schema validation
- Type checking
- Format verification
- Constraint enforcement
- Audit trail generation

## Feature Comparison

| Feature | Capability | Performance |
|---------|-----------|-------------|
| Batch Processing | Up to 100MB | <5s |
| Real-time Streaming | Partial support | <100ms |
| Custom Formatting | Via templates | High |
| Error Handling | Detailed logging | Comprehensive |
| Data Validation | Schema-based | Strict |

## Usage Examples

### Convert CSV to JSON
```
将以下CSV文件转换为JSON格式：
customers.csv 
- 包含：姓名、邮箱、电话、地址
- 需要：驼峰式字段名，移除空行
```

### Clean and Standardize Data
```
清理用户数据：
- 移除重复记录
- 标准化电话号码格式
- 补充缺失的城市代码
- 验证邮箱格式
输出：清理后的CSV
```

### Transform Nested Data
```
转换API响应数据：
- 扁平化嵌套的用户对象
- 提取关键字段
- 创建关联映射表
输出：结构化的Excel文件
```

### Merge Multiple Sources
```
合并三个数据源：
- 用户表（user_id作为key）
- 订单表（user_id）
- 支付表（order_id）
产生：完整的客户交易记录
```

## Data Format Specifications

### JSON Structure
```json
{
  "metadata": {
    "source": "filename.csv",
    "rows": 1000,
    "columns": 5,
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "schema": {
    "id": "number",
    "name": "string",
    "email": "email"
  },
  "data": [
    {"id": 1, "name": "John", "email": "john@example.com"}
  ],
  "quality": {
    "missing_values": 0,
    "duplicates": 0,
    "validation_passed": true
  }
}
```

### CSV Format
```csv
id,name,email,status
1,John Doe,john@example.com,active
2,Jane Smith,jane@example.com,inactive
```

### XML Format
```xml
<?xml version="1.0"?>
<records>
  <record>
    <id>1</id>
    <name>John Doe</name>
    <email>john@example.com</email>
  </record>
</records>
```

## Transformation Options

### Mapping Rules
```yaml
mappings:
  - source: "CustomerID"
    target: "customerId"
    type: "number"
  - source: "Full Name"
    target: "fullName"
    type: "string"
  - source: "Contact Email"
    target: "email"
    type: "email"
    validate: "must_be_valid"
```

### Cleaning Rules
```yaml
cleaning:
  - remove_duplicates: true
  - remove_empty_rows: true
  - trim_whitespace: true
  - normalize_case: "title_case"
  - handle_missing: "skip_row"
```

## Best Practices

1. **Validate Before Transform**
   - Check data quality
   - Verify format compatibility
   - Test with sample data

2. **Document Mappings**
   - Maintain mapping documentation
   - Version control transformations
   - Track data lineage

3. **Error Handling**
   - Log transformation errors
   - Create error reports
   - Preserve raw data

4. **Performance Optimization**
   - Batch large transformations
   - Use streaming for big data
   - Cache intermediate results

## Advanced Features

### Custom Mapping Templates
Define reusable transformation templates for common patterns.

### Scheduled Transformations
Automate recurring data transformations with scheduling.

### Audit Trail
Track all transformations with timestamps and user details.

### Data Validation Rules
Enforce business rules and data quality standards.

## Common Use Cases

- 🔄 API response normalization
- 📊 Report data preparation
- 🗄️ Database migration
- 📈 Analytics data pipeline
- 🔗 System integration
- 📨 EDI/B2B data exchange
- 🎯 Data warehouse loading
