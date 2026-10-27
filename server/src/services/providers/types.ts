export interface NormalizedOpportunity {
  id: string; // e.g. "remoteok-1137542" or "adzuna-9827341"
  title: string;
  slug: string;
  company_name: string;
  company_logo: string;
  company_website: string | null;
  is_verified: number; // 1 for verified real company
  category: string;
  role_type: string;
  work_mode: 'Remote' | 'Hybrid' | 'Onsite';
  location: string;
  stipend_min: number;
  stipend_max: number;
  stipend_period: string;
  ppo_offered: number;
  ppo_ctc_min?: number;
  ppo_ctc_max?: number;
  duration_months: number;
  experience_level: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
  eligible_batches: number[];
  eligible_degrees: string[];
  is_mock_data: number; // 0 for verified live listings, 1 for local demo records
  is_active: number;
  deadline: string;
  source_name: 'RemoteOK' | 'Adzuna' | 'Internal';
  source_url: string;
  apply_url: string;
  last_verified_at: string;
  created_at: string;
}

export interface ProviderStatus {
  name: string;
  status: 'active' | 'unconfigured' | 'error' | 'rate_limited';
  last_synced_at: string | null;
  items_count: number;
  error_message: string | null;
  requires_credentials: boolean;
  documentation_url: string;
  attribution_notice: string;
}

export interface ProviderQueryOptions {
  search?: string;
  category?: string;
  workMode?: string;
  minStipend?: number;
  limit?: number;
}

export interface ListingProvider {
  readonly name: string;
  fetchListings(options?: ProviderQueryOptions): Promise<NormalizedOpportunity[]>;
  getStatus(): ProviderStatus;
}
