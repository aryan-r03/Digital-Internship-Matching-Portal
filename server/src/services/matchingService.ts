import { CandidateProfile, Internship, MatchResult } from '../types/index.js';

export class MatchingService {
  /**
   * Deterministic, explainable matching algorithm comparing a CandidateProfile with an Internship.
   */
  static calculateMatch(profile: Partial<CandidateProfile> | null | undefined, internship: Internship): MatchResult {
    // Edge case: Incomplete or missing profile
    if (!profile || !profile.skills || profile.skills.length === 0) {
      return {
        score: 0,
        verdict: 'Low Match',
        matchedSkills: [],
        missingSkills: internship.requirements || [],
        eligibilityIssues: ['Candidate profile is incomplete. Add skills and graduation year to evaluate match.'],
        highlights: [],
        breakdown: {
          skillsScore: 0,
          eligibilityScore: 0,
          preferenceScore: 0,
          workModeScore: 0,
        },
      };
    }

    const highlights: string[] = [];
    const eligibilityIssues: string[] = [];

    // --- 1. SKILLS SCORING (Max 40 Points) ---
    const candidateSkillsNormalized = (profile.skills || []).map((s) => s.toLowerCase().trim());
    const requiredSkills = internship.requirements || [];
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const req of requiredSkills) {
      const normalizedReq = req.toLowerCase().trim();
      const hasMatch = candidateSkillsNormalized.some(
        (cs) => cs === normalizedReq || cs.includes(normalizedReq) || normalizedReq.includes(cs)
      );

      if (hasMatch) {
        matchedSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    }

    let skillsScore = 0;
    if (requiredSkills.length > 0) {
      const matchRatio = matchedSkills.length / requiredSkills.length;
      skillsScore = Math.round(matchRatio * 40);
      if (matchRatio >= 0.7) {
        highlights.push(`Matches ${matchedSkills.length} of ${requiredSkills.length} required technical skills.`);
      }
    } else {
      skillsScore = 40;
    }

    // --- 2. ELIGIBILITY & DEGREE SCORING (Max 25 Points) ---
    let eligibilityScore = 0;

    // Batch year check (10 pts)
    const candidateGradYear = profile.graduation_year;
    const eligibleBatches = internship.eligible_batches || [];
    if (candidateGradYear && eligibleBatches.length > 0) {
      if (eligibleBatches.includes(candidateGradYear)) {
        eligibilityScore += 10;
        highlights.push(`Eligible graduation batch (${candidateGradYear}).`);
      } else {
        eligibilityIssues.push(
          `Graduation year ${candidateGradYear} is not in eligible batches: ${eligibleBatches.join(', ')}.`
        );
      }
    } else if (eligibleBatches.length === 0) {
      eligibilityScore += 10;
    } else {
      eligibilityIssues.push('Graduation year not specified in candidate profile.');
    }

    // Degree check (10 pts)
    const candidateDegree = (profile.degree || '').toLowerCase();
    const candidateField = (profile.field_of_study || '').toLowerCase();
    const eligibleDegrees = internship.eligible_degrees || [];

    if (eligibleDegrees.length > 0) {
      const degreeMatches = eligibleDegrees.some((d) => {
        const norm = d.toLowerCase();
        return (
          norm.includes('any') ||
          (candidateDegree && candidateDegree.includes(norm)) ||
          (candidateField && candidateField.includes(norm)) ||
          (candidateDegree && norm.includes(candidateDegree))
        );
      });

      if (degreeMatches) {
        eligibilityScore += 10;
        highlights.push('Academic degree aligns with eligibility requirements.');
      } else {
        eligibilityIssues.push(
          `Candidate degree (${profile.degree || 'Unspecified'}) may not meet criteria: ${eligibleDegrees.join(', ')}.`
        );
      }
    } else {
      eligibilityScore += 10;
    }

    // CGPA threshold check (5 pts)
    const candidateCgpa = profile.cgpa ?? 0;
    const minCgpa = internship.min_cgpa ?? 0;
    if (minCgpa > 0) {
      if (candidateCgpa >= minCgpa) {
        eligibilityScore += 5;
        highlights.push(`CGPA (${candidateCgpa.toFixed(1)}) meets requirement (min ${minCgpa.toFixed(1)}).`);
      } else {
        eligibilityIssues.push(
          `CGPA (${candidateCgpa.toFixed(1)}) is below minimum required (${minCgpa.toFixed(1)}).`
        );
      }
    } else {
      eligibilityScore += 5;
    }

    // --- 3. PREFERRED ROLES & DOMAIN (Max 20 Points) ---
    let preferenceScore = 0;
    const preferredRoles = (profile.preferred_roles || []).map((r) => r.toLowerCase());
    const categoryNorm = (internship.category || '').toLowerCase();
    const titleNorm = (internship.title || '').toLowerCase();

    if (preferredRoles.length > 0) {
      const matchesPreference = preferredRoles.some(
        (pr) =>
          categoryNorm.includes(pr) ||
          pr.includes(categoryNorm) ||
          titleNorm.includes(pr) ||
          pr.includes(titleNorm)
      );

      if (matchesPreference) {
        preferenceScore = 20;
        highlights.push(`Matches candidate's career track preferences.`);
      } else {
        preferenceScore = 10; // Partial domain credit
      }
    } else {
      preferenceScore = 15; // Neutral baseline if no preference specified
    }

    // --- 4. WORK MODE & LOCATION (Max 15 Points) ---
    let workModeScore = 0;
    const candidateWorkModes = (profile.work_modes || []).map((w) => w.toLowerCase());
    const internshipWorkMode = (internship.work_mode || '').toLowerCase();

    if (candidateWorkModes.length === 0 || candidateWorkModes.includes(internshipWorkMode)) {
      workModeScore += 10;
      highlights.push(`Work mode (${internship.work_mode}) matches preference.`);
    } else if (internshipWorkMode === 'remote') {
      workModeScore += 10;
    } else {
      workModeScore += 3;
    }

    // Location matching
    const candidateLocation = (profile.current_location || '').toLowerCase();
    const preferredLocations = (profile.preferred_locations || []).map((l) => l.toLowerCase());
    const internshipLocation = (internship.location || '').toLowerCase();

    if (
      internshipWorkMode === 'remote' ||
      candidateLocation.includes(internshipLocation) ||
      internshipLocation.includes(candidateLocation) ||
      preferredLocations.some((pl) => internshipLocation.includes(pl) || pl.includes(internshipLocation))
    ) {
      workModeScore += 5;
    } else {
      workModeScore += 1;
    }

    // Total Score (bounded between 0 and 100)
    const rawScore = skillsScore + eligibilityScore + preferenceScore + workModeScore;
    const finalScore = Math.min(100, Math.max(0, rawScore));

    let verdict: MatchResult['verdict'] = 'Low Match';
    if (finalScore >= 80) verdict = 'Excellent Match';
    else if (finalScore >= 60) verdict = 'Strong Match';
    else if (finalScore >= 40) verdict = 'Moderate Match';

    return {
      score: finalScore,
      verdict,
      matchedSkills,
      missingSkills,
      eligibilityIssues,
      highlights,
      breakdown: {
        skillsScore,
        eligibilityScore,
        preferenceScore,
        workModeScore,
      },
    };
  }
}
