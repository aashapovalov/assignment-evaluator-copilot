import {calculateBreakdown, calculatePoints} from "../utils/index.js";

/**
 * @typedef {Object} Requirement
 * @property {string} id - Requirement ID
 * @property {string} description - Requirement description
 * @property {number} weight - Weight in final score
 * @property {boolean} critical - Is critical requirement
 * @property {string} category - Requirement category
 */

/**
 * @typedef {Object} EvidenceResult
 * @property {string} requirement_id - Requirement ID
 * @property {string} requirement_description - Requirement description
 * @property {string} status - PASS/PARTIAL/FAIL/UNKNOWN
 * @property {number} confidence - Confidence score (0-1)
 * @property {string} evidence_quote - Code evidence
 * @property {string} reasoning - Evaluation reasoning
 */

/**
 * @typedef {Object} Breakdown
 * @property {number} overall_score - Overall score (0-100)
 * @property {number} requirements_met - Count of PASS requirements
 * @property {number} requirements_partial - Count of PARTIAL requirements
 * @property {number} requirements_missing - Count of FAIL/UNKNOWN requirements
 * @property {number} critical_failures - Count of failed critical requirements
 */

/**
 * @typedef {Object} RequirementReport
 * @property {string} requirement_id - Requirement ID
 * @property {string} description - Requirement description
 * @property {string} category - Requirement category
 * @property {string} status - PASS/PARTIAL/FAIL/UNKNOWN
 * @property {number} confidence - Confidence score (0-1)
 * @property {string} evidence_quote - Code evidence
 * @property {string} feedback - Feedback for student
 * @property {number} points_earned - Points earned
 * @property {number} points_possible - Maximum points possible
 */

/**
 * @typedef {Object} EvaluationReport
 * @property {number} overall_score - Overall score (0-100)
 * @property {Breakdown} breakdown - Score breakdown statistics
 * @property {Array<RequirementReport>} per_requirement_status - Detailed per-requirement status
 * @property {string} timestamp - ISO 8601 timestamp
 */

/**
 * Builds final evaluation report from rubric and evidence results.
 * Calculates scores, aggregates statistics, and formats output.
 *
 * @param {Object} options - Scoring options
 * @param {Array<Requirement>} options.rubric - Original rubric requirements
 * @param {Array<EvidenceResult>} options.evidenceResults - Evidence extraction results
 * @returns {EvaluationReport} Complete evaluation report
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
