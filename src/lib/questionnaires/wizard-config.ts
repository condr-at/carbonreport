/**
 * Wizard Configuration
 * 
 * Centralized configuration for the project creation wizard.
 * Edit this file to change questionnaire logic, add new questions,
 * modify report recommendations, or add conditional steps.
 * 
 * SUPPORTS CONDITIONAL LOGIC:
 * - Questions can depend on previous answers
 * - Report recommendations based on multiple criteria
 * - Dynamic wizard flow
 */

// ============================================
// STEP 2: QUESTIONNAIRE CONFIGURATION
// ============================================

export interface QuestionnaireOption {
  value: string;
  label: string;
  description: string;
  recommendedTemplates?: string[]; // Optional: direct template recommendation
}

export interface ConditionalRule {
  questionId: string; // Which previous question to check
  values: string[]; // Show this question only if previous answer is one of these
}

export interface QuestionConfig {
  id: string;
  question: string;
  description: string;
  type: 'single-choice' | 'multi-choice';
  required: boolean;
  dependsOn?: ConditionalRule; // Conditional logic
  options: QuestionnaireOption[];
}

/**
 * Main questionnaire questions
 * 
 * Questions are shown in order. If a question has `dependsOn`,
 * it will only show if the condition matches.
 * 
 * CURRENT FLOW (revised):
 * 1. target_region → Always shown (EU import relevance first)
 * 2. product_type → Only if target_region involves EU
 * 3. reporting_purpose → Always shown (to decide ISO relevance)
 */
export const WIZARD_QUESTIONNAIRE: Record<string, QuestionConfig> = {
  // ============================================
  // QUESTION 1: Target Region (always shown)
  // ============================================
  target_region: {
    id: 'target_region',
    question: 'Where will this product be sold or imported?',
    description: 'CBAM applies to imports into the European Union',
    type: 'single-choice',
    required: true,
    options: [
      { value: 'eu', label: 'European Union', description: 'Importing to EU countries' },
      { value: 'non_eu', label: 'Outside EU', description: 'No imports into the EU' },
      { value: 'both', label: 'Both EU and Non-EU', description: 'Multiple markets' },
    ],
  },

  // ============================================
  // QUESTION 2: Product Type (conditional)
  // Shown only if: target_region involves EU
  // ============================================
  product_type: {
    id: 'product_type',
    question: 'What type of product are you assessing?',
    description: 'CBAM applies only to specific product categories',
    type: 'single-choice',
    required: true,
    dependsOn: {
      questionId: 'target_region',
      values: ['eu', 'both'], // Show only when EU is a target
    },
    options: [
      {
        value: 'cement',
        label: 'Cement',
        description: 'Portland cement, clinker, and similar',
      },
      {
        value: 'iron_steel',
        label: 'Iron & Steel',
        description: 'Iron, steel products, and alloys',
      },
      {
        value: 'aluminum',
        label: 'Aluminum',
        description: 'Aluminum and aluminum products',
      },
      {
        value: 'fertilizers',
        label: 'Fertilizers',
        description: 'Nitrogen-based fertilizers',
      },
      {
        value: 'electricity',
        label: 'Electricity',
        description: 'Imported electrical energy',
      },
      {
        value: 'hydrogen',
        label: 'Hydrogen',
        description: 'Hydrogen and hydrogen-based products',
      },
      {
        value: 'other',
        label: 'Other Product Type',
        description: 'Not covered by CBAM',
      },
    ],
  },

  // ============================================
  // QUESTION 3: Reporting Purpose (always shown)
  // Helps decide ISO relevance without naming report types in UI
  // ============================================
  reporting_purpose: {
    id: 'reporting_purpose',
    question: 'What is the purpose of this assessment?',
    description: 'We will recommend suitable reporting standards based on your purpose',
    type: 'single-choice',
    required: true,
    options: [
      { value: 'certification', label: 'Certification', description: 'Obtain a recognized standard' },
      { value: 'regulation', label: 'Regulatory compliance', description: 'Meet regulatory requirements' },
      { value: 'customer', label: 'Customer requirements', description: 'Requested by clients or partners' },
      { value: 'internal', label: 'Internal reporting', description: 'Company sustainability goals' },
      { value: 'unsure', label: 'Not sure', description: 'Let me browse all options' },
    ],
  },
};

// ============================================
// WIZARD STEPS CONFIGURATION
// ============================================

export interface WizardStep {
  id: string;
  path: string;
  title: string;
  description: string;
  canSkip: boolean;
  skipDestination?: string;
}

/**
 * Wizard navigation flow
 * 
 * To add/remove/reorder steps:
 * 1. Modify this array
 * 2. Create corresponding page components
 * 3. Progress bar will auto-adjust
 */
export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'project-info',
    path: '/projects/new',
    title: 'Project Information',
    description: 'Give your project a name and description',
    canSkip: false,
  },
  {
    id: 'questionnaire',
    path: '/projects/new/questionnaire',
    title: 'Questionnaire',
    description: 'Answer a few questions so we can recommend the right reports',
    canSkip: true,
    skipDestination: '/projects/new/select-reports',
  },
  {
    id: 'select-reports',
    path: '/projects/new/select-reports',
    title: 'Select Report Types',
    description: 'Choose reporting standards',
    canSkip: false,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get recommended report templates based on wizard answers
 * 
 * This uses CONDITIONAL LOGIC to determine recommendations:
 * - Checks assessment goal
 * - If CBAM-related, also checks product type and target region
 * - Returns appropriate templates based on ALL answers
 */
export function getRecommendedTemplates(answers: Record<string, string>): string[] {
  const templates = new Set<string>();

  const productType = answers['product_type'];
  const targetRegion = answers['target_region'];
  const purpose = answers['reporting_purpose'];

  const cbamProducts = ['cement', 'iron_steel', 'aluminum', 'fertilizers', 'electricity', 'hydrogen'];
  const isCbamProduct = !!productType && cbamProducts.includes(productType);
  const isEuTarget = targetRegion === 'eu' || targetRegion === 'both';

  // Recommend CBAM strictly if EU-related and product is in CBAM scope
  if (isEuTarget && isCbamProduct) {
    templates.add('CBAM');
  }

  // ISO 14067 is broadly applicable: certification/regulatory/customer/internal,
  // or when not EU or not a CBAM product.
  const wantsIso = ['certification', 'regulation', 'customer', 'internal'].includes(purpose || '');
  if (wantsIso || !isEuTarget || (isEuTarget && !isCbamProduct)) {
    templates.add('ISO14067');
  }

  // If unsure, don't auto-recommend — let user pick on next step
  if (purpose === 'unsure') {
    return [];
  }

  return Array.from(templates);
}

/**
 * Get the next question to show based on current answers
 * 
 * Implements CONDITIONAL FLOW:
 * - Checks each question's dependsOn rules
 * - Returns next unanswered question that matches conditions
 * - Returns null if all questions answered
 */
export function getNextQuestion(
  currentQuestionId: string,
  answers: Record<string, string>
): QuestionConfig | null {
  const questionOrder = ['target_region', 'product_type', 'reporting_purpose'];
  const currentIndex = questionOrder.indexOf(currentQuestionId);

  // Look for next question that should be shown
  for (let i = currentIndex + 1; i < questionOrder.length; i++) {
    const questionId = questionOrder[i];
    const question = WIZARD_QUESTIONNAIRE[questionId];

    if (!question) continue;

    // Check if question should be shown based on conditions
    if (shouldShowQuestion(question, answers)) {
      return question;
    }
  }

  return null; // No more questions
}

/**
 * Check if a question should be shown based on conditional rules
 */
export function shouldShowQuestion(
  question: QuestionConfig,
  answers: Record<string, string>
): boolean {
  if (!question.dependsOn) {
    return true; // No conditions, always show
  }

  const { questionId, values } = question.dependsOn;
  const previousAnswer = answers[questionId];

  return Boolean(previousAnswer && values.includes(previousAnswer));
}

/**
 * Get all questions that should be shown for given answers
 */
export function getVisibleQuestions(answers: Record<string, string>): QuestionConfig[] {
  const questionOrder = ['target_region', 'product_type', 'reporting_purpose'];
  const visible: QuestionConfig[] = [];

  for (const questionId of questionOrder) {
    const question = WIZARD_QUESTIONNAIRE[questionId];
    if (question && shouldShowQuestion(question, answers)) {
      visible.push(question);
    }
  }

  return visible;
}

/**
 * Get current step info
 */
export function getCurrentStepInfo(pathname: string): WizardStep | null {
  return WIZARD_STEPS.find((step) => step.path === pathname) || null;
}

/**
 * Get step number (1-indexed)
 */
export function getStepNumber(pathname: string): number {
  const index = WIZARD_STEPS.findIndex((step) => step.path === pathname);
  return index >= 0 ? index + 1 : 1;
}

/**
 * Get total number of steps
 */
export function getTotalSteps(): number {
  return WIZARD_STEPS.length;
}

/**
 * Get next step path
 */
export function getNextStepPath(currentPath: string): string | null {
  const currentIndex = WIZARD_STEPS.findIndex((step) => step.path === currentPath);
  if (currentIndex >= 0 && currentIndex < WIZARD_STEPS.length - 1) {
    return WIZARD_STEPS[currentIndex + 1].path;
  }
  return null;
}

/**
 * Get previous step path
 */
export function getPreviousStepPath(currentPath: string): string | null {
  const currentIndex = WIZARD_STEPS.findIndex((step) => step.path === currentPath);
  if (currentIndex > 0) {
    return WIZARD_STEPS[currentIndex - 1].path;
  }
  return null;
}

// ============================================
// EXPORTS
// ============================================

// Types are exported inline above
