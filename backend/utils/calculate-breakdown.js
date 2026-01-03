/**
 * Computes aggregate scoring breakdown.
 */
export function calculateBreakdown(rubric, evidence) {
  let met = 0,
      partial = 0,
      missing = 0,
      critical_failures = 0;

  evidence.forEach((e, i) => {
    if (e.status === 'PASS') met++;
    else if (e.status === 'PARTIAL') partial++;
    else {
      missing++;
      if (rubric[i]?.critical) critical_failures++;
    }
  });

  const overall_score =
      rubric.reduce((sum, req, i) => {
        const status = evidence[i]?.status ?? 'UNKNOWN';
        const points = status === 'PASS' ? 1.0 : status === 'PARTIAL' ? 0.5 : 0.0;
        return sum + req.weight * points;
      }, 0) * 100;

  return {
    overall_score: Math.round(overall_score * 10) / 10,
    requirements_met: met,
    requirements_partial: partial,
    requirements_missing: missing,
    critical_failures,
  };
}