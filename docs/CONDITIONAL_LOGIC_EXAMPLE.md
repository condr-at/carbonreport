# Conditional Wizard Logic - Quick Reference

## 🎯 CBAM Example: Multi-Criteria Logic

### The Rule
CBAM report should **ONLY** be recommended when **ALL** conditions are true:
1. ✅ Goal: CBAM compliance OR multiple standards
2. ✅ Product: cement, steel, aluminum, fertilizers, electricity, or hydrogen
3. ✅ Region: European Union

### The Implementation

```typescript
// wizard-config.ts

// Question 1: Always shown
assessment_goal: {
  id: 'assessment_goal',
  question: 'What is your primary goal?',
  options: [
    { value: 'cbam', label: 'EU CBAM Compliance' },
    { value: 'iso14067', label: 'ISO 14067' },
    // ...
  ]
}

// Question 2: Only if goal includes CBAM
product_type: {
  id: 'product_type',
  question: 'What type of product?',
  dependsOn: {
    questionId: 'assessment_goal',
    values: ['cbam', 'multiple']  // ← Conditional
  },
  options: [
    { value: 'cement', label: 'Cement' },
    { value: 'iron_steel', label: 'Iron & Steel' },
    { value: 'other', label: 'Other' },
  ]
}

// Question 3: Only if product is CBAM-covered
target_region: {
  id: 'target_region',
  question: 'Where will this be sold?',
  dependsOn: {
    questionId: 'product_type',
    values: ['cement', 'iron_steel', 'aluminum', 'fertilizers', 'electricity', 'hydrogen']
  },
  options: [
    { value: 'eu', label: 'European Union' },
    { value: 'non_eu', label: 'Outside EU' },
  ]
}

// Smart recommendation function
export function getRecommendedTemplates(answers: Record<string, string>): string[] {
  const templates = new Set<string>();
  
  const goal = answers['assessment_goal'];
  const productType = answers['product_type'];
  const targetRegion = answers['target_region'];

  // CBAM: Check ALL conditions
  if (goal === 'cbam' || goal === 'multiple') {
    const cbamProducts = ['cement', 'iron_steel', 'aluminum', 'fertilizers', 'electricity', 'hydrogen'];
    const isCbamProduct = productType && cbamProducts.includes(productType);
    const isEuTarget = targetRegion === 'eu' || targetRegion === 'both';

    if (isCbamProduct && isEuTarget) {
      templates.add('CBAM');  // ✅ All conditions met
    }
  }

  // Fallback to ISO 14067
  if (goal !== 'cbam' || productType === 'other' || targetRegion === 'non_eu') {
    templates.add('ISO14067');
  }

  return Array.from(templates);
}
```

## 📋 Test Scenarios

| Scenario | Goal | Product | Region | Result |
|----------|------|---------|--------|--------|
| ✅ Valid CBAM | `cbam` | `cement` | `eu` | `[CBAM]` |
| ❌ Wrong product | `cbam` | `other` | `eu` | `[ISO14067]` |
| ❌ Wrong region | `cbam` | `cement` | `non_eu` | `[ISO14067]` |
| ✅ ISO only | `iso14067` | - | - | `[ISO14067]` |

## 🔄 How Questions Flow

```
START
  ↓
[Goal?] ←─── Always shown
  ↓
  ├─ If 'cbam' or 'multiple'
  │   ↓
  │  [Product Type?] ←─── Conditional #1
  │   ↓
  │   ├─ If CBAM-covered product
  │   │   ↓
  │   │  [Target Region?] ←─── Conditional #2
  │   │   ↓
  │   └─ Calculate recommendation
  │
  └─ Else: Direct to templates
```

## 🛠️ Key Functions

### `shouldShowQuestion(question, answers)`
Checks if question should be displayed based on `dependsOn` rules.

### `getNextQuestion(currentId, answers)`
Returns next question in flow (skips hidden questions).

### `getVisibleQuestions(answers)`
Returns all questions that should be shown for current answers.

### `getRecommendedTemplates(answers)`
**Main logic function** - determines which templates to pre-select.

## 📁 Files

- `/src/lib/questionnaires/wizard-config.ts` - **Main config file**
- `/docs/WIZARD_CONFIGURATION.md` - Full documentation

## 🚀 Quick Start

1. Edit `wizard-config.ts` to add/modify questions
2. Update `questionOrder` array for new questions
3. Modify `getRecommendedTemplates()` for custom logic
4. Test at: http://localhost:3000/projects/new

**No database changes needed** - all logic is local TypeScript/JSON!
