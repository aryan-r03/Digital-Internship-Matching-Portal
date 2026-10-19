import { describe, it, expect } from 'vitest';
import {
  MOCK_OPPORTUNITIES,
  opportunityService,
  INITIAL_CANDIDATE_PROFILE,
} from './api/opportunityService.js';

describe('Kaamsetu Career & Internship Portal — Frontend Domain & Service Suite', () => {
  describe('Data Integrity & Mock Labeling', () => {
    it('ensures every single opportunity has explicit isMockData: true flag', () => {
      expect(MOCK_OPPORTUNITIES.length).toBeGreaterThan(0);
      for (const opp of MOCK_OPPORTUNITIES) {
        expect(opp.isMockData).toBe(true);
        expect(opp.id).toBeDefined();
        expect(opp.title).toBeDefined();
        expect(opp.company.name).toBeDefined();
        expect(opp.stipend.amount).toBeDefined();
        expect(opp.stipend.numericMonthly).toBeGreaterThan(0);
        expect(opp.applicationDeadline).toBeDefined();
      }
    });

    it('ensures required engineering categories are present', () => {
      const categories = MOCK_OPPORTUNITIES.map((o) => o.category);
      expect(categories).toContain('AI / Machine Learning');
      expect(categories).toContain('Software Engineering');
      expect(categories).toContain('UI/UX Design');
      expect(categories).toContain('Data Science');
    });
  });

  describe('Filtering & Discovery Engine', () => {
    it('filters opportunities by category', async () => {
      const res = await opportunityService.getOpportunities({
        category: 'AI / Machine Learning',
      });
      expect(res.items.length).toBeGreaterThan(0);
      for (const item of res.items) {
        expect(item.category).toBe('AI / Machine Learning');
      }
    });

    it('filters opportunities by keyword search', async () => {
      const res = await opportunityService.getOpportunities({
        search: 'PyTorch',
      });
      expect(res.items.length).toBeGreaterThan(0);
      expect(
        res.items.some((item) =>
          item.skillsRequired.includes('PyTorch')
        )
      ).toBe(true);
    });

    it('filters opportunities with PPO only', async () => {
      const res = await opportunityService.getOpportunities({
        hasPPOOnly: true,
      });
      expect(res.items.length).toBeGreaterThan(0);
      for (const item of res.items) {
        expect(item.stipend.hasPPO).toBe(true);
      }
    });

    it('filters opportunities by minimum stipend', async () => {
      const res = await opportunityService.getOpportunities({
        minStipend: 45000,
      });
      expect(res.items.length).toBeGreaterThan(0);
      for (const item of res.items) {
        expect(item.stipend.numericMonthly).toBeGreaterThanOrEqual(45000);
      }
    });
  });

  describe('Candidate Profile & Onboarding', () => {
    it('verifies candidate profile default structure', () => {
      expect(INITIAL_CANDIDATE_PROFILE.fullName).toBe('Aryan Ranjan');
      expect(INITIAL_CANDIDATE_PROFILE.university).toContain('LPU');
      expect(INITIAL_CANDIDATE_PROFILE.skills.length).toBeGreaterThanOrEqual(5);
      expect(INITIAL_CANDIDATE_PROFILE.portfolioUrl).toBe(
        'https://aryanranjan03.vercel.app'
      );
      expect(INITIAL_CANDIDATE_PROFILE.profileCompletionPercentage).toBeGreaterThanOrEqual(80);
    });
  });
});
