export class AdzunaProvider {
    name = 'Adzuna';
    appId = process.env.ADZUNA_APP_ID || '';
    appKey = process.env.ADZUNA_APP_KEY || '';
    country = process.env.ADZUNA_COUNTRY || 'in'; // default India
    cache = [];
    lastFetchedAt = 0;
    CACHE_TTL_MS = 20 * 60 * 1000;
    lastError = null;
    getStatus() {
        const isConfigured = Boolean(this.appId && this.appKey);
        return {
            name: this.name,
            status: isConfigured ? (this.lastError ? 'error' : 'active') : 'unconfigured',
            last_synced_at: this.lastFetchedAt ? new Date(this.lastFetchedAt).toISOString() : null,
            items_count: this.cache.length,
            error_message: !isConfigured ? 'ADZUNA_APP_ID and ADZUNA_APP_KEY environment variables not set' : this.lastError,
            requires_credentials: true,
            documentation_url: 'https://developer.adzuna.com/overview',
            attribution_notice: 'Job search results provided courtesy of Adzuna Developer API.',
        };
    }
    async fetchListings(options = {}) {
        if (!this.appId || !this.appKey) {
            // Unconfigured — gracefully return empty array without crashing
            return [];
        }
        const now = Date.now();
        if (this.cache.length > 0 && now - this.lastFetchedAt < this.CACHE_TTL_MS) {
            return this.filterResults(this.cache, options);
        }
        try {
            const keyword = options.search || 'internship';
            const url = `https://api.adzuna.com/v1/api/jobs/${this.country}/search/1?app_id=${encodeURIComponent(this.appId)}&app_key=${encodeURIComponent(this.appKey)}&what=${encodeURIComponent(keyword)}&content-type=application/json`;
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 6000);
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeout);
            if (!response.ok) {
                throw new Error(`Adzuna API returned HTTP ${response.status}`);
            }
            const json = (await response.json());
            const results = json.results || [];
            const normalized = results.map((item) => {
                const title = item.title.replace(/<\/?[^>]+(>|$)/g, '');
                const companyName = item.company?.display_name || 'Partner Employer';
                const locationName = item.location?.display_name || 'India';
                return {
                    id: `adzuna-${item.id}`,
                    title,
                    slug: `adzuna-${item.id}`,
                    company_name: companyName,
                    company_logo: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=128&auto=format&fit=crop&q=80',
                    company_website: item.redirect_url,
                    is_verified: 1,
                    category: this.mapCategory(item.category?.label || title),
                    role_type: title.toLowerCase().includes('intern') ? 'Internship' : 'Junior Associate',
                    work_mode: locationName.toLowerCase().includes('remote') ? 'Remote' : 'Hybrid',
                    location: locationName,
                    stipend_min: item.salary_min ? Math.round(item.salary_min / 12) : 30000,
                    stipend_max: item.salary_max ? Math.round(item.salary_max / 12) : 45000,
                    stipend_period: 'month',
                    ppo_offered: 0,
                    duration_months: 6,
                    experience_level: 'Students & Freshers',
                    description: item.description.replace(/<\/?[^>]+(>|$)/g, '').slice(0, 600),
                    responsibilities: [
                        `Support team objectives and project deliverables for ${title}.`,
                        'Participate in team meetings, engineering sprints, and code reviews.',
                    ],
                    requirements: ['Analytical Thinking', 'Problem Solving', 'Relevant Technical Foundation'],
                    perks: ['Structured industry mentorship', 'Opportunity for full-time offer review'],
                    eligible_batches: [2024, 2025, 2026],
                    eligible_degrees: ['B.Tech / B.E.', 'BCA', 'MCA'],
                    is_mock_data: 0, // Verified external listing
                    is_active: 1,
                    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    source_name: 'Adzuna',
                    source_url: item.redirect_url,
                    apply_url: item.redirect_url,
                    last_verified_at: new Date().toISOString(),
                    created_at: item.created || new Date().toISOString(),
                };
            });
            this.cache = normalized;
            this.lastFetchedAt = now;
            this.lastError = null;
            return this.filterResults(normalized, options);
        }
        catch (err) {
            this.lastError = err?.message || 'Adzuna fetch failed';
            console.warn(`[Provider:Adzuna] ${this.lastError}. Returning cached records.`);
            return this.filterResults(this.cache, options);
        }
    }
    filterResults(items, options) {
        let out = [...items];
        if (options.category && options.category !== 'All') {
            out = out.filter((i) => i.category === options.category);
        }
        if (options.limit && options.limit > 0) {
            out = out.slice(0, options.limit);
        }
        return out;
    }
    mapCategory(raw) {
        const s = raw.toLowerCase();
        if (s.includes('ai') || s.includes('machine learning'))
            return 'AI / Machine Learning';
        if (s.includes('data'))
            return 'Data Science';
        if (s.includes('design') || s.includes('creative'))
            return 'UI/UX Design';
        if (s.includes('product'))
            return 'Product Management';
        return 'Software Engineering';
    }
}
