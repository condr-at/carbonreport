interface CompletionTemplate {
  sections: Array<{
    fields: Array<{ fieldId: string; isRequired?: boolean }>;
  }>;
}

/** Required-field coverage, shared by report views and project summaries. */
export function getReportCompletion(dataset: unknown, template: CompletionTemplate | null) {
  if (!template) return { filled: 0, required: 0, percentage: 0 };

  const requiredFields = new Set(
    template.sections.flatMap((section) => section.fields)
      .filter((field) => field.isRequired)
      .map((field) => field.fieldId),
  );
  const points = dataset && typeof dataset === 'object' && 'data_points' in dataset
    && Array.isArray(dataset.data_points) ? dataset.data_points : [];
  const filledFields = new Set<string>();
  for (const point of points) {
    if (point && requiredFields.has(point.field_id) && typeof point.value === 'string' && point.value.trim()) {
      // Multiple items of a repeatable field cover that field once, never beyond 100%.
      filledFields.add(point.field_id);
    }
  }
  const required = requiredFields.size;
  const filled = filledFields.size;
  return {
    filled,
    required,
    percentage: required === 0 ? 100 : Math.round((filled / required) * 100),
  };
}
