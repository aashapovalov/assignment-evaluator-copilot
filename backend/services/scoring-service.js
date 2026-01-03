import {calculateBreakdown, calculatePoints} from "../utils/index.js";

/**
   * Builds final report object returned to the client.
   */
  export function scoringService({ rubric, evidenceResults }) {
    const breakdown = calculateBreakdown(rubric, evidenceResults);

    const report = {
      overall_score: breakdown.overall_score,
      breakdown,
      per_requirement_status: rubric.map((req, index) => {
        const evidence = evidenceResults[index] ?? {};

        return {
          requirement_id: req.id,
          description: req.description,
          category: req.category,
          status: evidence.status ?? 'UNKNOWN',
          confidence: evidence.confidence ?? 0,
          evidence_quote: evidence.evidence_quote ?? '',
          feedback: evidence.reasoning ?? '',
          points_earned: calculatePoints(req.weight, evidence.status ?? 'UNKNOWN'),
          points_possible: req.weight * 100,
        };
      }),
      timestamp: new Date().toISOString(),
    };

    console.log('✅ Evaluation complete!');
    return report;
  }
