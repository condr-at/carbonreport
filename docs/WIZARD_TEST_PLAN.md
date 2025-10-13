# Wizard Conditional Logic - Test Scenarios

## Test Plan

### Scenario 1: CBAM Path (Should show 3 questions)
**Steps:**
1. Go to http://localhost:3001/projects/new
2. Enter project name: "Test CBAM Steel EU"
3. Click Next → Goes to questionnaire

**Question 1: Assessment Goal**
- Select: "EU CBAM Compliance"
- Click Next

**Question 2: Product Type** (should appear)
- Select: "Iron & Steel"
- Click Next

**Question 3: Target Region** (should appear)
- Select: "European Union"
- Click Next

**Expected Result:**
- Should go to Select Reports page
- **CBAM should be pre-selected** ✅
- Total steps should show: "Step X of 4" (name + 3 questions + select reports)

---

### Scenario 2: CBAM Non-Covered Product (Should show 2 questions, NO CBAM)
**Steps:**
1. New project: "Test CBAM Other"
2. Question 1: Select "EU CBAM Compliance"
3. Question 2: Select "Other Product Type"
4. Should skip Question 3 (no region question for non-CBAM products)

**Expected Result:**
- Goes directly to Select Reports
- **ISO 14067 should be pre-selected** ✅
- **CBAM should NOT be pre-selected** ❌

---

### Scenario 3: CBAM Product to Non-EU (Should show 3 questions, NO CBAM)
**Steps:**
1. New project: "Test Steel USA"
2. Question 1: Select "EU CBAM Compliance"
3. Question 2: Select "Iron & Steel"
4. Question 3: Select "Outside EU"

**Expected Result:**
- **ISO 14067 should be pre-selected** ✅
- **CBAM should NOT be pre-selected** ❌

---

### Scenario 4: ISO Only Path (Should show 1 question)
**Steps:**
1. New project: "Test ISO Only"
2. Question 1: Select "ISO 14067 Certification"
3. Should skip Questions 2 & 3 (no conditional questions)

**Expected Result:**
- Goes directly to Select Reports
- **ISO 14067 should be pre-selected** ✅
- Total steps: "Step 2 of 3" (name + 1 question + select reports)

---

### Scenario 5: Multiple Standards + CBAM Product + EU (Should show 3 questions, BOTH)
**Steps:**
1. New project: "Test Multiple Cement EU"
2. Question 1: Select "Multiple Standards"
3. Question 2: Select "Cement"
4. Question 3: Select "European Union"

**Expected Result:**
- **BOTH CBAM and ISO 14067 should be pre-selected** ✅✅

---

### Scenario 6: Multiple Standards + Non-CBAM (Should show 2 questions, ISO only)
**Steps:**
1. New project: "Test Multiple Other"
2. Question 1: Select "Multiple Standards"
3. Question 2: Select "Other Product Type"

**Expected Result:**
- **ISO 14067 should be pre-selected** ✅
- **CBAM should NOT be pre-selected** ❌

---

### Scenario 7: Not Sure (Should show 1 question, NO pre-selection)
**Steps:**
1. New project: "Test Unsure"
2. Question 1: Select "Not Sure"

**Expected Result:**
- Goes directly to Select Reports
- **NO templates pre-selected** (empty checkboxes)
- User can manually select any template

---

## Validation Checklist

### Conditional Logic
- [ ] Question 2 (Product Type) only shows if goal = CBAM or Multiple
- [ ] Question 3 (Target Region) only shows if product is CBAM-covered
- [ ] ISO path shows only 1 question
- [ ] CBAM path shows 3 questions

### Recommendations
- [ ] CBAM only recommended when: CBAM product + EU region
- [ ] ISO 14067 fallback for non-CBAM scenarios
- [ ] Multiple Standards shows both when applicable
- [ ] "Not Sure" shows no pre-selection

### UI/UX
- [ ] Progress bar reflects actual number of steps (dynamic)
- [ ] Step counter updates correctly (e.g., "Step 2 of 4" vs "Step 2 of 3")
- [ ] Back button works through all conditional questions
- [ ] Skip button works from any question
- [ ] All questions use wizard-config.ts (not hardcoded)

### Data Flow
- [ ] Answers saved to sessionStorage as 'wizardAnswers'
- [ ] getRecommendedTemplates() called with all answers
- [ ] Select Reports page loads recommendations correctly
- [ ] Can clear sessionStorage and restart wizard

---

## How to Test

1. **Manual Testing:**
   - Open http://localhost:3001/projects/new
   - Follow each scenario above
   - Verify expected results

2. **Console Debugging:**
   ```javascript
   // In browser console
   JSON.parse(sessionStorage.getItem('wizardAnswers'))
   JSON.parse(sessionStorage.getItem('recommendedTemplates'))
   ```

3. **Reset Between Tests:**
   ```javascript
   sessionStorage.clear()
   location.reload()
   ```

---

## Expected Files Modified

✅ `/src/lib/questionnaires/wizard-config.ts` - Configuration with 3 questions
✅ `/src/app/projects/new/questionnaire/page.tsx` - Dynamic question renderer
✅ `/src/app/projects/new/select-reports/page.tsx` - Uses getRecommendedTemplates()

---

## Success Criteria

All 7 scenarios pass with correct:
1. ✅ Number of questions shown
2. ✅ Template recommendations
3. ✅ UI feedback (progress, steps)
4. ✅ Navigation (back/next/skip)
