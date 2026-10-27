import { RemoteOkProvider } from './remoteOkProvider.js';
import { AdzunaProvider } from './adzunaProvider.js';
export class ProviderRegistry {
    static instance;
    providers = new Map();
    constructor() {
        // Register verified providers
        this.registerProvider(new RemoteOkProvider());
        this.registerProvider(new AdzunaProvider());
    }
    static getInstance() {
        if (!ProviderRegistry.instance) {
            ProviderRegistry.instance = new ProviderRegistry();
        }
        return ProviderRegistry.instance;
    }
    registerProvider(provider) {
        this.providers.set(provider.name, provider);
    }
    getProviderStatuses() {
        return Array.from(this.providers.values()).map((p) => p.getStatus());
    }
    async getAggregatedListings(options = {}) {
        const activeProviders = Array.from(this.providers.values()).filter((p) => {
            const status = p.getStatus().status;
            return status === 'active' || status === 'error'; // Allow error if it has cached fallback
        });
        const results = await Promise.allSettled(activeProviders.map((p) => p.fetchListings(options)));
        const allListings = [];
        const seenUrls = new Set();
        const seenSignatures = new Set();
        for (const res of results) {
            if (res.status === 'fulfilled' && Array.isArray(res.value)) {
                for (const item of res.value) {
                    const sig = `${item.company_name.toLowerCase().trim()}::${item.title.toLowerCase().trim()}`;
                    if (seenUrls.has(item.source_url) || seenSignatures.has(sig)) {
                        continue; // Deduplicate
                    }
                    seenUrls.add(item.source_url);
                    seenSignatures.add(sig);
                    allListings.push(item);
                }
            }
        }
        return allListings;
    }
    async getListingById(id) {
        const all = await this.getAggregatedListings();
        const found = all.find((item) => item.id === id || item.slug === id);
        return found || null;
    }
}
export const providerRegistry = ProviderRegistry.getInstance();
