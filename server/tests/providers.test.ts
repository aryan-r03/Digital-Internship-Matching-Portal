import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { providerRegistry } from '../src/services/providers/providerRegistry.js';
import { RemoteOkProvider } from '../src/services/providers/remoteOkProvider.js';
import { AdzunaProvider } from '../src/services/providers/adzunaProvider.js';

describe('KaamSetu Phase 3A — External Internship Providers & Verification Test Suite', () => {
  describe('1. Provider Registry & Health Statuses', () => {
    it('registers verified providers and returns structured status summaries', () => {
      const statuses = providerRegistry.getProviderStatuses();
      expect(Array.isArray(statuses)).toBe(true);
      expect(statuses.length).toBeGreaterThanOrEqual(2);

      const remoteOkStatus = statuses.find((s) => s.name === 'RemoteOK');
      expect(remoteOkStatus).toBeDefined();
      expect(remoteOkStatus?.requires_credentials).toBe(false);
      expect(remoteOkStatus?.attribution_notice).toContain('RemoteOK.com');
      expect(remoteOkStatus?.documentation_url).toBe('https://remoteok.com/api');

      const adzunaStatus = statuses.find((s) => s.name === 'Adzuna');
      expect(adzunaStatus).toBeDefined();
      expect(adzunaStatus?.requires_credentials).toBe(true);
      expect(adzunaStatus?.status).toBe('unconfigured');
    });

    it('exposes GET /api/v1/internships/sources/status with provider health metadata', async () => {
      const res = await request(app).get('/api/v1/internships/sources/status');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);

      const remoteOk = res.body.data.find((p: any) => p.name === 'RemoteOK');
      expect(remoteOk).toBeDefined();
      expect(remoteOk.documentation_url).toBe('https://remoteok.com/api');
    });
  });

  describe('2. Unconfigured Provider Guardrails (Adzuna)', () => {
    it('returns empty list gracefully without throwing when credentials are not configured', async () => {
      const adzuna = new AdzunaProvider();
      const listings = await adzuna.fetchListings();
      expect(Array.isArray(listings)).toBe(true);
      expect(listings.length).toBe(0);
      expect(adzuna.getStatus().status).toBe('unconfigured');
    });
  });

  describe('3. RemoteOK Provider Normalization & Deduplication', () => {
    it('normalizes mock feed items into valid NormalizedOpportunity format', async () => {
      const provider = new RemoteOkProvider();

      // Mock fetch response for offline test determinism
      const mockJobs = [
        {
          id: 'test-101',
          position: 'Computer Vision & Deep Learning Intern',
          company: 'Tensor Robotics',
          tags: ['python', 'pytorch', 'machine learning', 'intern'],
          description: '<p>Train edge neural networks on camera streams.</p>',
          location: 'Remote',
          url: 'https://remoteok.com/remote-jobs/test-101',
          apply_url: 'https://tensor-robotics.ai/careers/101',
          salary_min: 45000,
          salary_max: 60000,
        },
        {
          id: 'test-102',
          position: 'Full Stack Engineer (React + Go)',
          company: 'CloudScale Inc',
          tags: ['react', 'golang', 'frontend', 'engineer'],
          description: '<p>Build microservices and dashboards.</p>',
          location: 'Worldwide',
          url: 'https://remoteok.com/remote-jobs/test-102',
          apply_url: 'https://cloudscale.io/jobs/102',
          salary_min: 80000,
          salary_max: 110000,
        },
      ];

      vi.spyOn(global, 'fetch').mockImplementationOnce(async () => {
        return {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => [{ legal: 'Attribution required' }, ...mockJobs],
        } as any;
      });

      const listings = await provider.fetchListings();
      expect(listings.length).toBe(2);

      const first = listings[0];
      expect(first.id).toBe('remoteok-test-101');
      expect(first.title).toBe('Computer Vision & Deep Learning Intern');
      expect(first.company_name).toBe('Tensor Robotics');
      expect(first.category).toBe('AI / Machine Learning');
      expect(first.role_type).toBe('Internship');
      expect(first.is_mock_data).toBe(0); // Verified external live listing!
      expect(first.source_name).toBe('RemoteOK');
      expect(first.source_url).toBe('https://remoteok.com/remote-jobs/test-101');
      expect(first.apply_url).toBe('https://tensor-robotics.ai/careers/101');

      const second = listings[1];
      expect(second.category).toBe('Software Engineering');
      expect(second.is_mock_data).toBe(0);

      vi.restoreAllMocks();
    });

    it('recovers gracefully from network failure using cached listings', async () => {
      const provider = new RemoteOkProvider();

      // Seed cache
      (provider as any).cache = [
        {
          id: 'remoteok-cached-1',
          title: 'Cached Junior Developer',
          company_name: 'Resilient Systems',
          category: 'Software Engineering',
          work_mode: 'Remote',
          stipend_max: 50000,
          requirements: ['Node.js'],
          description: 'Cached description',
          is_mock_data: 0,
          source_name: 'RemoteOK',
          source_url: 'https://remoteok.com/cached',
          apply_url: 'https://remoteok.com/cached',
        },
      ];
      (provider as any).lastFetchedAt = 0; // Force cache expiration check

      // Mock network failure
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network offline or ECONNREFUSED'));

      const results = await provider.fetchListings();
      expect(results.length).toBe(1);
      expect(results[0].title).toBe('Cached Junior Developer');

      vi.restoreAllMocks();
    });
  });

  describe('4. Internships Route Provider Integration', () => {
    it('supports source=demo query and returns exclusively mock data with is_mock_data = 1', async () => {
      const res = await request(app).get('/api/v1/internships?source=demo');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data.every((item: any) => item.is_mock_data === true || item.is_mock_data === 1)).toBe(true);
    });

    it('resolves external listing detail and explains match deterministically', async () => {
      // Register a mock external listing in the registry for lookup
      const mockExternalListing = {
        id: 'remoteok-999999',
        title: 'Autonomous Systems Vision Intern',
        slug: 'remoteok-999999',
        company_name: 'AeroPerception Labs',
        company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128',
        company_website: 'https://aeroperception.ai',
        is_verified: 1,
        category: 'AI / Machine Learning',
        role_type: 'Internship',
        work_mode: 'Remote' as const,
        location: 'Remote',
        stipend_min: 40000,
        stipend_max: 55000,
        stipend_period: 'month',
        ppo_offered: 1,
        duration_months: 6,
        experience_level: 'Students & Freshers',
        description: 'Perception engineering role.',
        responsibilities: ['Write PyTorch pipelines'],
        requirements: ['Python', 'PyTorch', 'OpenCV'],
        perks: ['PPO review'],
        eligible_batches: [2025, 2026],
        eligible_degrees: ['B.Tech', 'BCA'],
        is_mock_data: 0,
        is_active: 1,
        deadline: '2026-12-31',
        source_name: 'RemoteOK' as const,
        source_url: 'https://remoteok.com/remote-jobs/999999',
        apply_url: 'https://aeroperception.ai/careers/apply',
        last_verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      vi.spyOn(providerRegistry, 'getListingById').mockResolvedValue(mockExternalListing as any);

      // 1. Fetch details
      const detailRes = await request(app).get('/api/v1/internships/remoteok-999999');
      expect(detailRes.status).toBe(200);
      expect(detailRes.body.data.title).toBe('Autonomous Systems Vision Intern');
      expect(detailRes.body.data.is_mock_data).toBe(0);
      expect(detailRes.body.data.source_name).toBe('RemoteOK');

      // 2. Fetch match explanation
      const matchRes = await request(app).get('/api/v1/internships/remoteok-999999/match');
      expect(matchRes.status).toBe(200);
      expect(matchRes.body.success).toBe(true);
      expect(matchRes.body.data.verdict).toBeDefined();

      vi.restoreAllMocks();
    });
  });
});
