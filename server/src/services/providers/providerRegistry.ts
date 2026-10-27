import { ListingProvider, NormalizedOpportunity, ProviderQueryOptions, ProviderStatus } from './types.js';
import { RemoteOkProvider } from './remoteOkProvider.js';
import { AdzunaProvider } from './adzunaProvider.js';

export class ProviderRegistry {
  private static instance: ProviderRegistry;
  private providers: Map<string, ListingProvider> = new Map();

  private constructor() {
    // Register verified providers
    this.registerProvider(new RemoteOkProvider());
    this.registerProvider(new AdzunaProvider());
  }

  public static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  public registerProvider(provider: ListingProvider): void {
    this.providers.set(provider.name, provider);
  }

  public getProviderStatuses(): ProviderStatus[] {
    return Array.from(this.providers.values()).map((p) => p.getStatus());
  }

  public async getAggregatedListings(options: ProviderQueryOptions = {}): Promise<NormalizedOpportunity[]> {
    const activeProviders = Array.from(this.providers.values()).filter((p) => {
      const status = p.getStatus().status;
      return status === 'active' || status === 'error'; // Allow error if it has cached fallback
    });

    const results = await Promise.allSettled(
      activeProviders.map((p) => p.fetchListings(options))
    );

    const allListings: NormalizedOpportunity[] = [];
    const seenUrls = new Set<string>();
    const seenSignatures = new Set<string>();

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

  public async getListingById(id: string): Promise<NormalizedOpportunity | null> {
    const all = await this.getAggregatedListings();
    const found = all.find((item) => item.id === id || item.slug === id);
    return found || null;
  }
}

export const providerRegistry = ProviderRegistry.getInstance();
