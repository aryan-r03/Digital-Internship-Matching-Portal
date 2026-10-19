import {
  Opportunity,
  OpportunityFilterOptions,
  CandidateProfile,
  ApplicationRecord,
} from '../types/opportunity.js';

// Explicitly labelled sample / mock opportunities
export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-cv-01',
    title: 'Computer Vision & Deep Learning Intern',
    company: {
      name: 'NeuroMesh Robotics',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
      website: 'https://neuromesh.ai',
      isVerified: true,
      industry: 'Robotics & Autonomous Systems',
      headquarters: 'Bengaluru, Karnataka',
    },
    category: 'AI / Machine Learning',
    roleType: 'Internship',
    workMode: 'Hybrid',
    location: 'Bengaluru',
    experienceLevel: 'Students / Freshers',
    stipend: {
      amount: '₹45,000 / month',
      numericMonthly: 45000,
      currency: 'INR',
      hasPPO: true,
      ppoRange: '14 - 20 LPA',
    },
    duration: '6 Months',
    batchEligibility: ['2025', '2026', '2027'],
    degreeEligibility: ['B.Tech', 'BCA (AI/ML)', 'MCA', 'M.Tech', 'Data Science'],
    skillsRequired: ['PyTorch', 'OpenCV', 'Python', 'YOLOv8', 'TensorRT'],
    description:
      'Join our perception engineering team building real-time edge computer vision pipelines for industrial automated robotics. You will train spatial detection models and optimize inference latency on embedded Jetson modules.',
    responsibilities: [
      'Architect and fine-tune convolutional & transformer-based object detection pipelines.',
      'Profile memory and inference latency on TensorRT and ONNX runtimes.',
      'Contribute synthetic data generation techniques and augment video datasets.',
      'Collaborate with hardware robotics teams during factory floor validation.',
    ],
    requirements: [
      'Strong proficiency in Python and modern deep learning frameworks (PyTorch preferred).',
      'Solid foundational understanding of image processing, feature maps, and loss functions.',
      'Demonstrated portfolio or GitHub projects showing practical computer vision implementations.',
      'Active undergraduate or postgraduate enrollment in computer science or related discipline.',
    ],
    perks: [
      'Pre-Placement Offer (PPO) review after 4 months based on performance.',
      'Hardware allowance for GPU compute cloud credits.',
      '1-on-1 mentorship with former DRDO and Stanford robotics alumni.',
      'Free catered lunch & commuter shuttle across Bengaluru.',
    ],
    applicationDeadline: '2025-11-25',
    postedDate: '2025-10-14',
    applicantCount: 142,
    openings: 3,
    isFeatured: true,
    isUrgent: true,
    isMockData: true,
  },
  {
    id: 'opp-fs-02',
    title: 'Full Stack Engineering Intern (React + Go)',
    company: {
      name: 'RazorScale Technologies',
      logoUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=150&q=80',
      website: 'https://razorscale.io',
      isVerified: true,
      industry: 'Developer Infrastructure & FinTech',
      headquarters: 'Bengaluru / Remote',
    },
    category: 'Software Engineering',
    roleType: 'Internship',
    workMode: 'Remote',
    location: 'Remote (India)',
    experienceLevel: 'Students / Freshers',
    stipend: {
      amount: '₹40,000 / month',
      numericMonthly: 40000,
      currency: 'INR',
      hasPPO: true,
      ppoRange: '12 - 16 LPA',
    },
    duration: '6 Months',
    batchEligibility: ['2024', '2025', '2026'],
    degreeEligibility: ['B.Tech / B.E.', 'BCA', 'MCA', 'B.Sc CS'],
    skillsRequired: ['TypeScript', 'React', 'Go', 'PostgreSQL', 'Docker'],
    description:
      'We are building high-throughput payment reconciliation engines processing over 50M daily transactions. You will work alongside staff engineers delivering core features across both our modern web client and distributed microservices.',
    responsibilities: [
      'Build responsive, high-performance dashboards using React 18, Vite, and Tailwind.',
      'Develop concurrent REST and gRPC endpoints in Golang backed by PostgreSQL.',
      'Write comprehensive unit and integration test suites.',
      'Participate in architecture reviews and database schema migrations.',
    ],
    requirements: [
      'Solid command of JavaScript/TypeScript and React state management.',
      'Eagerness to write performant backend microservices in Go or Node.js.',
      'Familiarity with SQL transactions and relational data modeling.',
      'Clean Git workflow and effective written communication.',
    ],
    perks: [
      'High-conversion PPO pathway for graduating candidates.',
      '₹25,000 remote workstation setup allowance.',
      'Unlimited wellness days and annual book budget.',
    ],
    applicationDeadline: '2025-11-30',
    postedDate: '2025-10-12',
    applicantCount: 218,
    openings: 4,
    isFeatured: true,
    isMockData: true,
  },
  {
    id: 'opp-llm-03',
    title: 'Autonomous AI Agents & RAG Engineer',
    company: {
      name: 'Karya Intelligence',
      logoUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=150&q=80',
      website: 'https://karya-ai.internal',
      isVerified: true,
      industry: 'Enterprise Generative AI',
      headquarters: 'Delhi NCR / Hybrid',
    },
    category: 'AI / Machine Learning',
    roleType: 'Internship',
    workMode: 'Hybrid',
    location: 'Delhi NCR (Noida/Gurugram)',
    experienceLevel: '0-1 Years',
    stipend: {
      amount: '₹50,000 / month',
      numericMonthly: 50000,
      currency: 'INR',
      hasPPO: true,
      ppoRange: '16 - 22 LPA',
    },
    duration: '6 Months',
    batchEligibility: ['2024', '2025', '2026'],
    degreeEligibility: ['Any Graduate with demonstrable AI agent projects'],
    skillsRequired: ['Python', 'LangChain', 'LlamaIndex', 'Vector DBs', 'FastAPI'],
    description:
      'Build multi-agent decision systems and contextual RAG architectures for legal and compliance enterprise intelligence. Experience working with tool-calling LLMs, vector search, and structured output parsing.',
    responsibilities: [
      'Implement context-aware query routers and recursive chunking pipelines.',
      'Design deterministic validation guardrails around generative model outputs.',
      'Benchmark embedding retrieval accuracy using hybrid dense and sparse ranking.',
      'Deploy production-ready inference endpoints using FastAPI and vLLM.',
    ],
    requirements: [
      'Prior hands-on experience building custom RAG workflows or agentic applications.',
      'Clear understanding of tokenization, attention mechanisms, and prompt optimization.',
      'Proficiency with Qdrant, Pinecone, or pgvector.',
    ],
    perks: [
      'High PPO conversion with equity allocation on full-time onboarding.',
      'Direct interaction with enterprise CTOs and founding teams.',
      'Top-tier Apple MacBook Pro M3 provided.',
    ],
    applicationDeadline: '2025-11-18',
    postedDate: '2025-10-15',
    applicantCount: 96,
    openings: 2,
    isFeatured: true,
    isUrgent: true,
    isMockData: true,
  },
  {
    id: 'opp-uiux-04',
    title: 'Product & Motion Design Intern',
    company: {
      name: 'Paperwork Studio',
      logoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      website: 'https://paperwork.design',
      isVerified: true,
      industry: 'Design Systems & Editorial Web',
      headquarters: 'Mumbai',
    },
    category: 'UI/UX Design',
    roleType: 'Internship',
    workMode: 'Remote',
    location: 'Remote',
    experienceLevel: 'Students / Freshers',
    stipend: {
      amount: '₹30,000 / month',
      numericMonthly: 30000,
      currency: 'INR',
      hasPPO: false,
    },
    duration: '3 Months',
    batchEligibility: ['2025', '2026', '2027', '2028'],
    degreeEligibility: ['Design / CS / Any Discipline with Strong Portfolio'],
    skillsRequired: ['Figma', 'Design Systems', 'Micro-Interactions', 'Prototyping'],
    description:
      'Design high-contrast, editorial user interfaces combining modern brutalism, Japanese editorial cues, and accessible interaction states for developer tools and fintech apps.',
    responsibilities: [
      'Craft atomic design tokens, typography scales, and accessible component states.',
      'Create interactive motion prototypes demonstrating easing and tactile feedback.',
      'Conduct usability tests with early adopters and iterate based on telemetry.',
    ],
    requirements: [
      'Compelling design portfolio showcasing web applications or SaaS interfaces.',
      'Obsessive eye for negative space, typography, and contrast standards (WCAG AA).',
      'Comfort collaborating with frontend engineers using Figma inspection.',
    ],
    perks: [
      'Flexible 25-hour work week suited for university exam periods.',
      '100% remote with asynchronous communication culture.',
      'Portfolio mentorship from international Awwwards jury designers.',
    ],
    applicationDeadline: '2025-12-05',
    postedDate: '2025-10-10',
    applicantCount: 88,
    openings: 2,
    isFeatured: false,
    isMockData: true,
  },
  {
    id: 'opp-cloud-05',
    title: 'Cloud Infrastructure & SRE Intern',
    company: {
      name: 'InfraScale Systems',
      logoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=150&q=80',
      website: 'https://infrascale.systems',
      isVerified: true,
      industry: 'Cloud Engineering & DevOps',
      headquarters: 'Pune, Maharashtra',
    },
    category: 'Cloud & DevOps',
    roleType: 'Internship',
    workMode: 'Hybrid',
    location: 'Pune',
    experienceLevel: 'Students / Freshers',
    stipend: {
      amount: '₹35,000 / month',
      numericMonthly: 35000,
      currency: 'INR',
      hasPPO: true,
      ppoRange: '10 - 15 LPA',
    },
    duration: '6 Months',
    batchEligibility: ['2025', '2026'],
    degreeEligibility: ['B.Tech / B.E. (CS/IT/ECE)', 'MCA'],
    skillsRequired: ['Linux', 'Kubernetes', 'Terraform', 'AWS', 'Prometheus'],
    description:
      'Help scale our multi-region cloud platform running across thousands of containerized nodes. Learn zero-downtime canary rollouts, Prometheus alerting, and infrastructure-as-code automation.',
    responsibilities: [
      'Automate CI/CD pipelines using GitHub Actions and ArgoCD.',
      'Configure metrics exporters, dashboards, and automated anomaly alerts.',
      'Participate in simulated chaos engineering drills.',
    ],
    requirements: [
      'Solid command of Linux shell environments, networking basics, and Docker.',
      'Foundational knowledge of cloud providers (AWS, GCP, or Azure).',
      'Scripting capability in Bash or Python.',
    ],
    perks: [
      'AWS / CKA certification exam vouchers fully reimbursed.',
      'Mentorship from Linux Foundation active contributors.',
    ],
    applicationDeadline: '2025-11-28',
    postedDate: '2025-10-13',
    applicantCount: 110,
    openings: 2,
    isFeatured: false,
    isMockData: true,
  },
  {
    id: 'opp-ds-06',
    title: 'Data Science & Predictive Modeling Associate',
    company: {
      name: 'QuantMatrix Analytics',
      logoUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=150&q=80',
      website: 'https://quantmatrix.io',
      isVerified: true,
      industry: 'Algorithmic Analytics & Risk',
      headquarters: 'Mumbai',
    },
    category: 'Data Science',
    roleType: 'Full-Time Fresher',
    workMode: 'On-site',
    location: 'Mumbai (BKC)',
    experienceLevel: '0-1 Years',
    stipend: {
      amount: '₹60,000 / month (or 10 LPA CTC)',
      numericMonthly: 60000,
      currency: 'INR',
      hasPPO: true,
      ppoRange: '10 - 14 LPA',
    },
    duration: 'Full-Time Role',
    batchEligibility: ['2024', '2025'],
    degreeEligibility: ['B.Tech', 'B.Sc Statistics / Mathematics', 'BCA/MCA'],
    skillsRequired: ['Python', 'SQL', 'Scikit-learn', 'Time Series', 'PowerBI'],
    description:
      'Analyze multi-terabyte financial transaction streams to forecast consumer credit defaults and uncover macroeconomic behavioral shifts.',
    responsibilities: [
      'Perform exploratory data analysis and feature engineering on high-cardinality tables.',
      'Train, calibrate, and backtest gradient-boosted trees and survival analysis models.',
      'Build executive telemetry dashboards tracking model drift.',
    ],
    requirements: [
      'Exemplary analytical aptitude and statistical hypothesis testing foundation.',
      'Advanced SQL and Python data wrangling (pandas, polars, duckdb).',
    ],
    perks: [
      'Competitive Mumbai BKC compensation package.',
      'Comprehensive health coverage and annual performance bonus.',
    ],
    applicationDeadline: '2025-12-10',
    postedDate: '2025-10-11',
    applicantCount: 175,
    openings: 2,
    isFeatured: true,
    isMockData: true,
  },
  {
    id: 'opp-fe-07',
    title: 'Frontend Engineering Intern (Vite, TS, Tailwind)',
    company: {
      name: 'Karya Portal Labs',
      logoUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=150&q=80',
      website: 'https://karya.internal',
      isVerified: true,
      industry: 'EdTech & Career Mobility',
      headquarters: 'Remote / Bengaluru',
    },
    category: 'Software Engineering',
    roleType: 'Internship',
    workMode: 'Remote',
    location: 'Remote',
    experienceLevel: 'Students / Freshers',
    stipend: {
      amount: '₹35,000 / month',
      numericMonthly: 35000,
      currency: 'INR',
      hasPPO: true,
      ppoRange: '9 - 13 LPA',
    },
    duration: '4 Months',
    batchEligibility: ['2025', '2026', '2027'],
    degreeEligibility: ['Any Student with strong frontend capabilities'],
    skillsRequired: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Git'],
    description:
      'Craft lightning-fast, accessible web interfaces that help thousands of Indian students discover mentorship and high-quality internships. Work on responsive layouts, state caching, and keyboard navigation.',
    responsibilities: [
      'Implement modular, typed UI components adhering to WCAG 2.2 accessibility.',
      'Optimize asset delivery, font loading, and layout cumulative shifts (CLS).',
      'Integrate REST/GraphQL client layers with graceful error handling.',
    ],
    requirements: [
      'Demonstrated portfolio of responsive React or Next.js applications.',
      'Deep appreciation for semantic HTML, accessible colors, and clean component structure.',
      'Strong problem-solving attitude and willingness to learn.',
    ],
    perks: [
      'PPO opportunity on successful completion of tenure.',
      '100% remote flexibility with asynchronous standups.',
    ],
    applicationDeadline: '2025-11-22',
    postedDate: '2025-10-16',
    applicantCount: 130,
    openings: 3,
    isFeatured: false,
    isUrgent: true,
    isMockData: true,
  },
  {
    id: 'opp-pm-08',
    title: 'Associate Product Manager Intern',
    company: {
      name: 'Zomato/Swiggy Ecosystem Partner',
      logoUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=150&q=80',
      website: 'https://ecosystem.partner',
      isVerified: true,
      industry: 'Quick-Commerce & Logistics',
      headquarters: 'Gurugram, Haryana',
    },
    category: 'Product Management',
    roleType: 'Internship',
    workMode: 'On-site',
    location: 'Gurugram',
    experienceLevel: 'Students / Freshers',
    stipend: {
      amount: '₹45,000 / month',
      numericMonthly: 45000,
      currency: 'INR',
      hasPPO: true,
      ppoRange: '14 - 18 LPA',
    },
    duration: '6 Months',
    batchEligibility: ['2025', '2026'],
    degreeEligibility: ['B.Tech', 'BBA', 'BCA', 'Economics / Any Discipline'],
    skillsRequired: ['Product Analytics', 'PRD Writing', 'SQL', 'User Research', 'Wireframing'],
    description:
      'Collaborate directly with senior product leaders to optimize merchant onboarding funnels and inventory dispatch accuracy across 40+ fulfillment dark stores.',
    responsibilities: [
      'Write detailed Product Requirement Documents (PRDs) with clear user stories.',
      'Analyze funnel drop-offs using Mixpanel and PostHog metrics.',
      'Synthesize merchant interview findings into actionable sprint deliverables.',
    ],
    requirements: [
      'First-principles thinker with sharp quantitative analytical ability.',
      'Exceptional structured communication and empathy for end users.',
      'Previous leadership experience in university clubs or hackathons.',
    ],
    perks: [
      'Direct executive mentorship with VP of Product.',
      'Free meals and executive fitness center access.',
    ],
    applicationDeadline: '2025-11-26',
    postedDate: '2025-10-09',
    applicantCount: 240,
    openings: 1,
    isFeatured: true,
    isMockData: true,
  },
];

// Initial default candidate profile
export const INITIAL_CANDIDATE_PROFILE: CandidateProfile = {
  id: 'cand-001',
  fullName: 'Aryan Ranjan',
  email: 'aryan.ranjan@example.com',
  phone: '+91 98765 43210',
  headline: 'AI/ML Developer & Full Stack Builder • BCA (AI & ML) at LPU',
  university: 'Lovely Professional University (LPU)',
  degree: 'Bachelor of Computer Applications (AI & ML)',
  graduationYear: '2026',
  currentCity: 'Jalandhar / Delhi NCR',
  bio: 'Passionate about intelligent systems, edge computer vision, and building full-stack products with crisp editorial aesthetics. Experienced with React, PyTorch, and distributed microservices.',
  skills: [
    'Python',
    'PyTorch',
    'Computer Vision',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'PostgreSQL',
    'Machine Learning',
    'FastAPI',
    'Git',
  ],
  portfolioUrl: 'https://aryanranjan03.vercel.app',
  githubUrl: 'https://github.com/aryanr03',
  linkedinUrl: 'https://linkedin.com/in/aryan-ranjan',
  workModePreference: 'Hybrid',
  preferredRoles: [
    'Computer Vision Intern',
    'AI/ML Engineer',
    'Full Stack Developer',
    'Frontend Engineer',
  ],
  expectedStipendMin: 35000,
  resumeFileName: 'Aryan_Ranjan_Resume_2025.pdf',
  profileCompletionPercentage: 92,
};

// Initial applied opportunities
export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-001',
    opportunityId: 'opp-cv-01',
    opportunityTitle: 'Computer Vision & Deep Learning Intern',
    companyName: 'NeuroMesh Robotics',
    companyLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    stipendAmount: '₹45,000 / month',
    appliedDate: '2025-10-16',
    status: 'In Review',
    coverNote: 'Excited to leverage my experience in OpenCV and PyTorch for spatial robotics detection.',
  },
  {
    id: 'app-002',
    opportunityId: 'opp-llm-03',
    opportunityTitle: 'Autonomous AI Agents & RAG Engineer',
    companyName: 'KaamSutra Intelligence',
    companyLogoUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=150&q=80',
    location: 'Delhi NCR',
    workMode: 'Hybrid',
    stipendAmount: '₹50,000 / month',
    appliedDate: '2025-10-15',
    status: 'Shortlisted',
    coverNote: 'Built multi-agent RAG pipelines with custom evaluation guardrails.',
  },
];

const API_BASE = ((import.meta as any).env?.VITE_API_BASE as string) || 'http://localhost:5001/api/v1';

// Helper storage keys for KaamSutra local persistence fallback
const STORAGE_SAVED_IDS = 'kaamsutra_saved_opp_ids';
const STORAGE_APPLICATIONS = 'kaamsutra_applied_records';
const STORAGE_PROFILE = 'kaamsutra_candidate_profile';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('kaamsutra_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function mapBackendInternship(b: any): Opportunity {
  return {
    id: String(b.id),
    title: b.title,
    company: {
      name: b.company_name,
      logoUrl: b.company_logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
      website: b.company_website || 'https://kaamsutra.internal',
      isVerified: Boolean(b.is_verified),
      industry: b.category,
      headquarters: b.location,
    },
    category: b.category,
    roleType: b.role_type,
    workMode: b.work_mode,
    location: b.location,
    experienceLevel: b.experience_level,
    stipend: {
      amount: `₹${Number(b.stipend_min).toLocaleString()} - ₹${Number(b.stipend_max).toLocaleString()} / ${b.stipend_period || 'month'}`,
      numericMonthly: b.stipend_max,
      currency: 'INR',
      hasPPO: Boolean(b.ppo_offered),
      ppoRange: b.ppo_ctc_min ? `${b.ppo_ctc_min} - ${b.ppo_ctc_max || b.ppo_ctc_min + 4} LPA` : undefined,
    },
    duration: `${b.duration_months} Months`,
    batchEligibility: (b.eligible_batches || []).map(String),
    degreeEligibility: b.eligible_degrees || [],
    skillsRequired: b.requirements || [],
    description: b.description,
    responsibilities: b.responsibilities || [],
    requirements: b.requirements || [],
    perks: b.perks || [],
    applicationDeadline: b.deadline,
    postedDate: b.created_at ? b.created_at.split('T')[0] : '2026-10-15',
    applicantCount: b.applicant_count || 14,
    openings: b.openings || 2,
    isFeatured: true,
    isMockData: true,
  };
}

export const opportunityService = {
  // Query opportunities with filtering and sorting
  getOpportunities: async (filters: OpportunityFilterOptions = {}): Promise<{
    items: Opportunity[];
    total: number;
    isLiveBackend?: boolean;
  }> => {
    // Attempt live backend fetch
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.workMode && filters.workMode !== 'All') params.append('workMode', filters.workMode);
      if (filters.roleType && filters.roleType !== 'All') params.append('roleType', filters.roleType);
      if (filters.minStipend) params.append('minStipend', String(filters.minStipend));
      if (filters.hasPPOOnly) params.append('ppoOnly', '1');

      if (filters.sortBy === 'stipend_high') params.append('sort', 'stipend');
      else if (filters.sortBy === 'deadline_soon') params.append('sort', 'deadline');
      else params.append('sort', 'newest');

      const response = await fetch(`${API_BASE}/internships?${params.toString()}`, {
        headers: { ...getAuthHeader() },
        signal: AbortSignal.timeout(2000), // Quick timeout for offline fallback
      });

      if (response.ok) {
        const json = await response.json();
        if (json.data && Array.isArray(json.data)) {
          return {
            items: json.data.map(mapBackendInternship),
            total: json.pagination?.total || json.data.length,
            isLiveBackend: true,
          };
        }
      }
    } catch {
      // Backend offline or unreachable — seamlessly use local mock data
    }

    // Local fallback
    let result = [...MOCK_OPPORTUNITIES];

    // Search query filter (title, company, skills, description)
    if (filters.search && filters.search.trim() !== '') {
      const term = filters.search.toLowerCase().trim();
      result = result.filter(
        (opp) =>
          opp.title.toLowerCase().includes(term) ||
          opp.company.name.toLowerCase().includes(term) ||
          opp.category.toLowerCase().includes(term) ||
          opp.skillsRequired.some((s) => s.toLowerCase().includes(term)) ||
          opp.location.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'All') {
      result = result.filter((opp) => opp.category === filters.category);
    }

    // Role type filter
    if (filters.roleType && filters.roleType !== 'All') {
      result = result.filter((opp) => opp.roleType === filters.roleType);
    }

    // Work mode filter
    if (filters.workMode && filters.workMode !== 'All') {
      result = result.filter((opp) => opp.workMode === filters.workMode);
    }

    // Experience level filter
    if (filters.experienceLevel && filters.experienceLevel !== 'All') {
      result = result.filter((opp) => opp.experienceLevel === filters.experienceLevel);
    }

    // Location filter
    if (filters.location && filters.location !== 'All') {
      result = result.filter((opp) =>
        opp.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Min stipend filter
    if (filters.minStipend && filters.minStipend > 0) {
      result = result.filter(
        (opp) => opp.stipend.numericMonthly >= filters.minStipend!
      );
    }

    // PPO only filter
    if (filters.hasPPOOnly) {
      result = result.filter((opp) => opp.stipend.hasPPO);
    }

    // Sorting
    if (filters.sortBy === 'stipend_high') {
      result.sort((a, b) => b.stipend.numericMonthly - a.stipend.numericMonthly);
    } else if (filters.sortBy === 'deadline_soon') {
      result.sort(
        (a, b) =>
          new Date(a.applicationDeadline).getTime() -
          new Date(b.applicationDeadline).getTime()
      );
    } else if (filters.sortBy === 'newest') {
      result.sort(
        (a, b) =>
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      );
    } else {
      // Default: featured first, then newest
      result.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
      });
    }

    return {
      items: result,
      total: result.length,
      isLiveBackend: false,
    };
  },

  // Single opportunity by ID
  getOpportunityById: async (id: string): Promise<Opportunity | null> => {
    try {
      const res = await fetch(`${API_BASE}/internships/${id}`, {
        headers: { ...getAuthHeader() },
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return mapBackendInternship(json.data);
      }
    } catch {
      // Fallback
    }

    const found = MOCK_OPPORTUNITIES.find((opp) => opp.id === id);
    return found || null;
  },

  // Explainable match score between candidate profile and opportunity
  getExplainableMatch: async (opportunityId: string): Promise<any | null> => {
    try {
      const res = await fetch(`${API_BASE}/internships/${opportunityId}/match`, {
        headers: { ...getAuthHeader() },
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  // Featured opportunities for landing page
  getFeaturedOpportunities: async (): Promise<Opportunity[]> => {
    try {
      const res = await fetch(`${API_BASE}/internships?limit=4`, {
        headers: { ...getAuthHeader() },
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          return json.data.map(mapBackendInternship);
        }
      }
    } catch {
      // Fallback
    }
    return MOCK_OPPORTUNITIES.filter((opp) => opp.isFeatured).slice(0, 4);
  },

  // Saved bookmark IDs
  getSavedIds: (): string[] => {
    try {
      const stored = localStorage.getItem(STORAGE_SAVED_IDS);
      return stored ? JSON.parse(stored) : ['opp-cv-01', 'opp-fs-02'];
    } catch {
      return ['opp-cv-01', 'opp-fs-02'];
    }
  },

  toggleSave: (opportunityId: string): boolean => {
    const saved = opportunityService.getSavedIds();
    let updated: string[];
    let isNowSaved: boolean;

    if (saved.includes(opportunityId)) {
      updated = saved.filter((id) => id !== opportunityId);
      isNowSaved = false;
      // Background sync to backend if logged in
      fetch(`${API_BASE}/saved/${opportunityId}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() },
      }).catch(() => {});
    } else {
      updated = [...saved, opportunityId];
      isNowSaved = true;
      // Background sync to backend if logged in
      fetch(`${API_BASE}/saved/${opportunityId}`, {
        method: 'POST',
        headers: { ...getAuthHeader() },
      }).catch(() => {});
    }

    localStorage.setItem(STORAGE_SAVED_IDS, JSON.stringify(updated));
    return isNowSaved;
  },

  getSavedOpportunities: async (): Promise<Opportunity[]> => {
    // Try live backend saved list
    try {
      const res = await fetch(`${API_BASE}/saved`, {
        headers: { ...getAuthHeader() },
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          return json.data.map((s: any) => mapBackendInternship(s.internship));
        }
      }
    } catch {
      // Fallback
    }

    const savedIds = opportunityService.getSavedIds();
    return MOCK_OPPORTUNITIES.filter((opp) => savedIds.includes(opp.id));
  },

  // Candidate applications (Synchronous for immediate UI rendering)
  getApplications: (): ApplicationRecord[] => {
    try {
      const stored = localStorage.getItem(STORAGE_APPLICATIONS);
      return stored ? JSON.parse(stored) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  },

  syncApplicationsFromBackend: async (): Promise<ApplicationRecord[]> => {
    try {
      const res = await fetch(`${API_BASE}/applications`, {
        headers: { ...getAuthHeader() },
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          const mapped: ApplicationRecord[] = json.data.map((app: any) => ({
            id: String(app.id),
            opportunityId: String(app.internship_id),
            opportunityTitle: app.internship?.title || 'Engineering Role',
            companyName: app.internship?.company_name || 'KaamSutra Partner',
            companyLogoUrl: app.internship?.company_logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
            location: app.internship?.location || 'Remote',
            workMode: (app.internship?.work_mode as any) || 'Remote',
            stipendAmount: app.internship ? `₹${Number(app.internship.stipend_min).toLocaleString()} - ₹${Number(app.internship.stipend_max).toLocaleString()}` : 'Competitive',
            appliedDate: app.applied_at ? app.applied_at.split('T')[0] : '2026-10-15',
            status: (app.status.charAt(0).toUpperCase() + app.status.slice(1)) as any,
            coverNote: app.cover_note || '',
          }));
          localStorage.setItem(STORAGE_APPLICATIONS, JSON.stringify(mapped));
          return mapped;
        }
      }
    } catch {
      // Ignore
    }
    return opportunityService.getApplications();
  },

  submitApplication: async (
    opportunityId: string,
    coverNote: string = ''
  ): Promise<ApplicationRecord> => {
    // Try backend submission
    try {
      const res = await fetch(`${API_BASE}/applications/${opportunityId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ coverNote }),
      });

      if (res.ok) {
        const json = await res.json();
        const app = json.data;
        const newApp: ApplicationRecord = {
          id: String(app.id),
          opportunityId: String(app.internship_id),
          opportunityTitle: app.internship?.title || 'Engineering Role',
          companyName: app.internship?.company_name || 'KaamSutra Partner',
          companyLogoUrl: app.internship?.company_logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
          location: app.internship?.location || 'Remote',
          workMode: (app.internship?.work_mode as any) || 'Remote',
          stipendAmount: 'Competitive',
          appliedDate: new Date().toISOString().split('T')[0],
          status: 'Applied',
          coverNote,
        };

        const current = opportunityService.getApplications();
        const updated = [newApp, ...current.filter((a) => a.opportunityId !== opportunityId)];
        localStorage.setItem(STORAGE_APPLICATIONS, JSON.stringify(updated));
        return newApp;
      }
    } catch {
      // Local fallback
    }

    const opp = await opportunityService.getOpportunityById(opportunityId);
    if (!opp) throw new Error('Opportunity not found.');

    const newApp: ApplicationRecord = {
      id: `app-${Date.now()}`,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      companyName: opp.company.name,
      companyLogoUrl: opp.company.logoUrl,
      location: opp.location,
      workMode: opp.workMode,
      stipendAmount: opp.stipend.amount,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      coverNote,
    };

    const current = opportunityService.getApplications();
    const updated = [newApp, ...current.filter((a) => a.opportunityId !== opportunityId)];
    localStorage.setItem(STORAGE_APPLICATIONS, JSON.stringify(updated));
    return newApp;
  },

  // Candidate Profile
  getProfile: (): CandidateProfile => {
    try {
      const stored = localStorage.getItem(STORAGE_PROFILE);
      return stored ? JSON.parse(stored) : INITIAL_CANDIDATE_PROFILE;
    } catch {
      return INITIAL_CANDIDATE_PROFILE;
    }
  },

  updateProfile: (updated: Partial<CandidateProfile>): CandidateProfile => {
    const current = opportunityService.getProfile();
    const merged: CandidateProfile = { ...current, ...updated };
    localStorage.setItem(STORAGE_PROFILE, JSON.stringify(merged));

    // Async sync with backend
    try {
      fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          full_name: merged.fullName,
          headline: merged.headline,
          bio: merged.bio,
          phone: merged.phone,
          current_location: merged.currentCity,
          graduation_year: parseInt(merged.graduationYear, 10) || 2025,
          degree: merged.degree,
          field_of_study: 'Computer Science & Engineering',
          cgpa: 8.5,
          skills: merged.skills,
          portfolio_url: merged.portfolioUrl,
          github_url: merged.githubUrl,
        }),
      }).catch(() => {});
    } catch {
      // Ignore
    }

    return merged;
  },
};

