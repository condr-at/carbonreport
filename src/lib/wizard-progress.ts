export function clearWizardProgress() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('projectData');
  sessionStorage.removeItem('wizardAnswers');
  sessionStorage.removeItem('recommendedTemplates');
}

interface WizardProgressState {
  hasProjectInfo: boolean;
  hasAnswers: boolean;
  hasRecommendations: boolean;
}

export function getWizardProgressState(): WizardProgressState {
  if (typeof window === 'undefined') {
    return {
      hasProjectInfo: false,
      hasAnswers: false,
      hasRecommendations: false,
    };
  }

  let hasProjectInfo = false;
  const projectRaw = sessionStorage.getItem('projectData');
  if (projectRaw) {
    try {
      const project = JSON.parse(projectRaw) as { name?: string; description?: string };
      hasProjectInfo = Boolean(project?.name?.trim() || project?.description?.trim());
    } catch {
      hasProjectInfo = true;
    }
  }

  let hasAnswers = false;
  const answersRaw = sessionStorage.getItem('wizardAnswers');
  if (answersRaw) {
    try {
      const answers = JSON.parse(answersRaw) as Record<string, string>;
      hasAnswers = Object.values(answers || {}).some((value) => typeof value === 'string' && value.trim().length > 0);
    } catch {
      hasAnswers = true;
    }
  }

  let hasRecommendations = false;
  const recommendedRaw = sessionStorage.getItem('recommendedTemplates');
  if (recommendedRaw) {
    try {
      const recommended = JSON.parse(recommendedRaw) as string[];
      hasRecommendations = Array.isArray(recommended) && recommended.length > 0;
    } catch {
      hasRecommendations = true;
    }
  }

  return {
    hasProjectInfo,
    hasAnswers,
    hasRecommendations,
  };
}

export function hasAnyWizardProgress(): boolean {
  const state = getWizardProgressState();
  return state.hasProjectInfo || state.hasAnswers || state.hasRecommendations;
}
