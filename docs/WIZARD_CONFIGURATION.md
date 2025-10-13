# Wizard Configuration Guide

This guide explains how to customize the Project Creation Wizard by editing the centralized configuration file.

## 📁 Configuration Location

All wizard logic is defined in:
```
/src/lib/questionnaires/wizard-config.ts
```

This file contains:
- ✅ Question definitions with options
- ✅ **Conditional logic (dependsOn rules)**
- ✅ **Multi-criteria recommendation logic**
- ✅ Report template recommendations
- ✅ Wizard step flow
- ✅ Helper functions for navigation

## 🎯 Real Example: CBAM Conditional Logic

### Problem
**CBAM (Carbon Border Adjustment Mechanism) should only be recommended when:**
1. ✅ User goal is CBAM compliance or multiple standards
2. ✅ Product type is one of: cement, steel, aluminum, fertilizers, electricity, hydrogen
3. ✅ Target region includes EU

### Solution
The wizard now has **3 conditional questions**:

```typescript
// Question 1: Always shown
assessment_goal: {
  id: 'assessment_goal',
  question: 'What is your primary goal?',
  options: [
    { value: 'cbam', label: 'EU CBAM Compliance' },
    { value: 'iso14067', label: 'ISO 14067 Certification' },
    // ...
  ]
}

// Question 2: Only if goal = 'cbam' OR 'multiple'
product_type: {
  id: 'product_type',
  question: 'What type of product?',
  dependsOn: {
    questionId: 'assessment_goal',
    values: ['cbam', 'multiple']  // ← Conditional rule
  },
  options: [
    { value: 'cement', label: 'Cement' },
    { value: 'iron_steel', label: 'Iron & Steel' },
    { value: 'other', label: 'Other Product Type' },
    // ...
  ]
}

// Question 3: Only if product is CBAM-relevant
target_region: {
  id: 'target_region',
  question: 'Where will this product be sold?',
  dependsOn: {
    questionId: 'product_type',
    values: ['cement', 'iron_steel', 'aluminum', 'fertilizers', 'electricity', 'hydrogen']
  },
  options: [
    { value: 'eu', label: 'European Union' },
    { value: 'non_eu', label: 'Outside EU' },
    // ...
  ]
}
```

### Smart Recommendation Logic

```typescript
export function getRecommendedTemplates(answers: Record<string, string>): string[] {
  const goal = answers['assessment_goal'];
  const productType = answers['product_type'];
  const targetRegion = answers['target_region'];

  // CBAM only if ALL conditions met
  if (goal === 'cbam' || goal === 'multiple') {
    const cbamProducts = ['cement', 'iron_steel', 'aluminum', ...];
    const isCbamProduct = productType && cbamProducts.includes(productType);
    const isEuTarget = targetRegion === 'eu' || targetRegion === 'both';

    if (isCbamProduct && isEuTarget) {
      templates.add('CBAM'); // ← Only add CBAM when ALL conditions true
    }
  }

  // Always add ISO 14067 for other cases
  if (goal !== 'cbam' || productType === 'other' || targetRegion === 'non_eu') {
    templates.add('ISO14067');
  }

  return Array.from(templates);
}
```

### Example Flows

**Scenario 1: CBAM for Steel to EU** ✅
1. Goal: "EU CBAM Compliance"
2. Product: "Iron & Steel" 
3. Region: "European Union"
→ **Result**: CBAM template pre-selected

**Scenario 2: CBAM for Electronics** ❌
1. Goal: "EU CBAM Compliance"
2. Product: "Other Product Type"
→ **Result**: ISO 14067 template (CBAM not applicable)

**Scenario 3: Steel to USA** ❌
1. Goal: "EU CBAM Compliance"
2. Product: "Iron & Steel"
3. Region: "Outside EU"
→ **Result**: ISO 14067 template (CBAM only for EU imports)

---

## 📝 How to Add New Conditional Questions

### Step 1: Add Question to WIZARD_QUESTIONNAIRE

```typescript
export const WIZARD_QUESTIONNAIRE: Record<string, QuestionConfig> = {
  // ... existing questions ...
  
  // New question: Company Size (conditional)
  company_size: {
    id: 'company_size',
    question: 'What is your company size?',
    description: 'Helps tailor reporting requirements',
    type: 'single-choice',
    required: true,
    dependsOn: {
      questionId: 'assessment_goal',
      values: ['internal', 'regulation'],  // Show only for these goals
    },
    options: [
      { value: 'small', label: 'Small (1-50 employees)' },
      { value: 'medium', label: 'Medium (51-250 employees)' },
      { value: 'large', label: 'Large (250+ employees)' },
    ],
  },
};
```

### Step 2: Update Question Order

```typescript
// In helper functions
const questionOrder = [
  'assessment_goal',
  'product_type',
  'target_region',
  'company_size',  // ← Add new question here
];
```

### Step 3: Update Recommendation Logic (if needed)

```typescript
export function getRecommendedTemplates(answers: Record<string, string>): string[] {
  const templates = new Set<string>();
  
  // ... existing logic ...
  
  // New logic for company size
  if (answers['company_size'] === 'large') {
    templates.add('DetailedCarbonReport');
  }
  
  return Array.from(templates);
}
```

---

## 🔄 Conditional Logic Patterns

### Pattern 1: Show if Answer Matches One Value

```typescript
dependsOn: {
  questionId: 'assessment_goal',
  values: ['cbam'],  // Show only if goal is CBAM
}
```

### Pattern 2: Show if Answer Matches Multiple Values

```typescript
dependsOn: {
  questionId: 'assessment_goal',
  values: ['cbam', 'multiple', 'regulation'],  // Show if any of these
}
```

### Pattern 3: Chain Multiple Conditions

```typescript
// Question 1: Always shown
question_a: { /* ... */ }

// Question 2: Depends on Question 1
question_b: {
  dependsOn: {
    questionId: 'question_a',
    values: ['option1', 'option2'],
  }
}

// Question 3: Depends on Question 2
question_c: {
  dependsOn: {
    questionId: 'question_b',
    values: ['optionX'],
  }
}
```

### Pattern 4: Complex Multi-Criteria Logic

For very complex logic, use the `getRecommendedTemplates()` function:

```typescript
export function getRecommendedTemplates(answers: Record<string, string>): string[] {
  const templates = new Set<string>();

  // Complex condition: (A AND B) OR (C AND D)
  const conditionA = answers['goal'] === 'cbam';
  const conditionB = answers['region'] === 'eu';
  const conditionC = answers['goal'] === 'multiple';
  const conditionD = answers['company_size'] === 'large';

  if ((conditionA && conditionB) || (conditionC && conditionD)) {
    templates.add('CBAM');
  }

  return Array.from(templates);
}
```

---

## 🎨 Customization Examples

### Example 1: Add "Industry Type" Question

Only shown if user selects ISO 14067:

```typescript
industry_type: {
  id: 'industry_type',
  question: 'What industry sector?',
  description: 'Helps select relevant calculation methods',
  type: 'single-choice',
  required: true,
  dependsOn: {
    questionId: 'assessment_goal',
    values: ['iso14067', 'internal'],
  },
  options: [
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'services', label: 'Services' },
    { value: 'energy', label: 'Energy' },
  ],
},
```

### Example 2: Add "Certification Body" Question

Only shown if user needs ISO 14067 AND is a large company:

```typescript
// This requires custom logic in shouldShowQuestion() or use multi-step conditionals
certification_body: {
  id: 'certification_body',
  question: 'Which certification body will audit?',
  type: 'single-choice',
  required: false,
  // Note: Current system supports single-level conditions
  // For multi-level, implement custom logic in getNextQuestion()
  dependsOn: {
    questionId: 'assessment_goal',
    values: ['iso14067'],
  },
  options: [
    { value: 'tuv', label: 'TÜV' },
    { value: 'sgs', label: 'SGS' },
    { value: 'dnv', label: 'DNV' },
  ],
},
```

---

## 🛠️ Helper Functions Reference

### `getRecommendedTemplates(answers)`
Returns array of template codes based on all answers.

```typescript
const templates = getRecommendedTemplates({
  assessment_goal: 'cbam',
  product_type: 'cement',
  target_region: 'eu',
});
// Returns: ['CBAM']
```

### `shouldShowQuestion(question, answers)`
Checks if a question should be displayed based on conditions.

```typescript
const show = shouldShowQuestion(
  WIZARD_QUESTIONNAIRE.product_type,
  { assessment_goal: 'cbam' }
);
// Returns: true (because goal is 'cbam')
```

### `getNextQuestion(currentQuestionId, answers)`
Gets the next question to show in the flow.

```typescript
const next = getNextQuestion('assessment_goal', { assessment_goal: 'cbam' });
// Returns: QuestionConfig for 'product_type'
```

### `getVisibleQuestions(answers)`
Gets all questions that should be shown for given answers.

```typescript
const visible = getVisibleQuestions({
  assessment_goal: 'iso14067',
});
// Returns: [assessment_goal_question] (only one, no conditional questions shown)
```

---

## 📊 Testing Your Configuration

### Test Case 1: CBAM Path
```
Input: goal='cbam', product='cement', region='eu'
Expected: ['CBAM']
```

### Test Case 2: ISO Path
```
Input: goal='iso14067'
Expected: ['ISO14067']
```

### Test Case 3: Non-CBAM Product
```
Input: goal='cbam', product='other'
Expected: ['ISO14067']
```

### Test Case 4: Non-EU Region
```
Input: goal='cbam', product='cement', region='non_eu'
Expected: ['ISO14067']
```

---

## 🚀 Deploying Configuration Changes

1. ✅ Edit `/src/lib/questionnaires/wizard-config.ts`
2. ✅ Save file (TypeScript will auto-compile)
3. ✅ Test in browser: http://localhost:3000/projects/new
4. ✅ No deployment needed - changes are immediate!

**Key Points:**
- ✅ All logic is **local TypeScript/JSON** - no database
- ✅ Changes apply **immediately** in dev mode
- ✅ Can be **version controlled** with Git
- ✅ Easy to **review** and **test**

---

## 📚 Related Files

- `/src/lib/questionnaires/wizard-config.ts` - Main configuration
- `/src/app/projects/new/questionnaire/page.tsx` - Question UI (needs update to use config)
- `/src/app/projects/new/select-reports/page.tsx` - Uses getRecommendedTemplates()
- `/src/lib/report-templates/index.ts` - Available report templates

---

## 💡 Best Practices

1. **Keep questions focused** - One concept per question
2. **Use clear labels** - User-friendly descriptions
3. **Chain logically** - Questions should flow naturally
4. **Test all paths** - Verify each conditional branch
5. **Document assumptions** - Add comments for complex logic
6. **Version control** - Commit configuration changes with clear messages

---

## ❓ FAQ

**Q: Can I have multiple dependencies?**
A: Currently single-level. For complex logic, use custom logic in `getRecommendedTemplates()`.

**Q: Can I change question order dynamically?**
A: Yes! Edit the `questionOrder` array in helper functions.

**Q: How do I remove CBAM?**
A: Remove 'cbam' option from `assessment_goal.options` and related questions.

**Q: Can I add a multi-select question?**
A: Yes! Set `type: 'multi-choice'` and handle array values in recommendation logic.

---

## 🔥 Summary

✅ **CBAM logic now works correctly:**
- Only shows product/region questions when needed
- Only recommends CBAM when ALL conditions are met
- Gracefully falls back to ISO 14067 otherwise

✅ **Easy to extend:**
- Add new questions with conditional rules
- Change recommendation logic in one place
- No database changes needed

✅ **Production-ready:**
- Type-safe with TypeScript
- Documented with examples
- Testable and maintainable
