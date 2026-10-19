import { DatabaseSync } from 'node:sqlite';

export const INITIAL_INTERNSHIPS = [
  {
    title: 'Computer Vision & Deep Learning Intern',
    slug: 'cv-deep-learning-intern-sarvam-ai',
    company_name: 'Sarvam Vision Labs',
    company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    company_website: 'https://sarvam.ai.internal',
    is_verified: 1,
    category: 'AI / Machine Learning',
    role_type: 'Internship',
    work_mode: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    stipend_min: 45000,
    stipend_max: 60000,
    stipend_period: 'month',
    ppo_offered: 1,
    ppo_ctc_min: 18.0,
    ppo_ctc_max: 24.0,
    duration_months: 6,
    experience_level: 'Students & Freshers',
    description: 'Work with the frontier AI perception team developing low-latency OCR and vision-language models for multilingual documents across Indian regional languages.',
    responsibilities: JSON.stringify([
      'Benchmark and fine-tune lightweight Vision-Language Models (VLMs) on proprietary multilingual image datasets.',
      'Deploy ONNX/TensorRT inference runtimes with sub-50ms latency constraints.',
      'Construct automated data augmentation pipelines using OpenCV and synthetic rendering engines.',
      'Participate in weekly research reading groups and write production-grade model validation tests.'
    ]),
    requirements: JSON.stringify([
      'Python',
      'PyTorch',
      'OpenCV',
      'Computer Vision',
      'TensorRT',
      'Linux'
    ]),
    preferred_qualifications: JSON.stringify([
      'Prior contributions to Hugging Face or open-source vision libraries.',
      'Experience with multilingual document understanding or handwriting OCR.'
    ]),
    perks: JSON.stringify([
      'Dedicated Nvidia A100 GPU cluster access',
      'Fast-track PPO evaluation at month 4',
      'Weekly research mentorship sessions with ex-Google Brain scientists'
    ]),
    eligible_batches: JSON.stringify([2024, 2025, 2026]),
    eligible_degrees: JSON.stringify(['B.Tech', 'B.E.', 'M.Tech', 'Dual Degree']),
    min_cgpa: 7.5,
    is_mock_data: 1,
    is_active: 1,
    deadline: '2026-11-30',
  },
  {
    title: 'Full Stack Systems Intern',
    slug: 'fullstack-systems-intern-zerodha',
    company_name: 'Naked Engine Technologies',
    company_logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80',
    company_website: 'https://nakedengine.internal',
    is_verified: 1,
    category: 'Engineering',
    role_type: 'Internship',
    work_mode: 'Remote',
    location: 'Remote (India)',
    stipend_min: 50000,
    stipend_max: 50000,
    stipend_period: 'month',
    ppo_offered: 1,
    ppo_ctc_min: 16.0,
    ppo_ctc_max: 22.0,
    duration_months: 6,
    experience_level: 'Students & Freshers',
    description: 'Build robust, fault-tolerant financial execution telemetry and internal developer interfaces handling millions of WebSocket events per second.',
    responsibilities: JSON.stringify([
      'Architect real-time order-book visualization components in React 19 and WebSockets.',
      'Implement high-throughput backend services in Go and TypeScript with SQLite/Postgres persistence.',
      'Write end-to-end integration tests using Vitest and Playwright.',
      'Optimize bundle size and render lifecycles for zero-lag market charting.'
    ]),
    requirements: JSON.stringify([
      'TypeScript',
      'React',
      'Go',
      'PostgreSQL',
      'WebSockets',
      'Node.js'
    ]),
    preferred_qualifications: JSON.stringify([
      'Personal projects demonstrating low-latency networking or concurrency.',
      'Experience with Redis pub/sub streams.'
    ]),
    perks: JSON.stringify([
      '100% remote workspace allowance (₹40,000 one-time)',
      'Direct PPO offer on successful deliverable review',
      'Ergonomic hardware provided'
    ]),
    eligible_batches: JSON.stringify([2025, 2026]),
    eligible_degrees: JSON.stringify(['B.Tech', 'B.E.', 'BCA', 'MCA', 'B.Sc Computer Science']),
    min_cgpa: 7.0,
    is_mock_data: 1,
    is_active: 1,
    deadline: '2026-12-15',
  },
  {
    title: 'Autonomous LLM Agents Researcher',
    slug: 'llm-agents-researcher-kaamsutra-labs',
    company_name: 'KaamSutra Intelligence',
    company_logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=128&auto=format&fit=crop&q=80',
    company_website: 'https://kaamsutra-ai.internal',
    is_verified: 1,
    category: 'AI / Machine Learning',
    role_type: 'Internship',
    work_mode: 'Hybrid',
    location: 'Gurugram, Haryana',
    stipend_min: 55000,
    stipend_max: 75000,
    stipend_period: 'month',
    ppo_offered: 1,
    ppo_ctc_min: 22.0,
    ppo_ctc_max: 30.0,
    duration_months: 6,
    experience_level: 'Students & Freshers',
    description: 'Design deterministic reasoning loops, multi-agent orchestrators, and tool-use verification harnesses for enterprise code intelligence workflows.',
    responsibilities: JSON.stringify([
      'Build evaluation harnesses for tool-calling accuracy across Claude, Gemini, and Llama 3 models.',
      'Implement memory summarization and semantic caching layers using vector indices and SQLite.',
      'Design security guardrails against prompt injection and unauthorized shell executions.'
    ]),
    requirements: JSON.stringify([
      'Python',
      'LangChain / LlamaIndex',
      'Vector Databases',
      'FastAPI',
      'Prompt Engineering',
      'Docker'
    ]),
    preferred_qualifications: JSON.stringify([
      'Published paper or open-source agent framework.',
      'Deep understanding of transformer attention mechanics.'
    ]),
    perks: JSON.stringify([
      'Generous compute credits for personal AI research',
      'Catered artisanal lunch and barista bar',
      'Direct interaction with founding team'
    ]),
    eligible_batches: JSON.stringify([2024, 2025, 2026, 2027]),
    eligible_degrees: JSON.stringify(['Any STEM Degree', 'B.Tech', 'M.Tech', 'MS']),
    min_cgpa: 8.0,
    is_mock_data: 1,
    is_active: 1,
    deadline: '2026-11-20',
  },
  {
    title: 'Product Design & Design Systems Intern',
    slug: 'product-design-intern-credo',
    company_name: 'Kanso Studio',
    company_logo: 'https://images.unsplash.com/photo-1542744094-3a317272212f?w=128&auto=format&fit=crop&q=80',
    company_website: 'https://kanso.studio.internal',
    is_verified: 1,
    category: 'Design & UI/UX',
    role_type: 'Internship',
    work_mode: 'Remote',
    location: 'Mumbai / Remote',
    stipend_min: 35000,
    stipend_max: 45000,
    stipend_period: 'month',
    ppo_offered: 1,
    ppo_ctc_min: 12.0,
    ppo_ctc_max: 16.0,
    duration_months: 4,
    experience_level: 'Students & Freshers',
    description: 'Create brutalist-editorial design tokens, interactive micro-animations, and high-contrast accessibility patterns for next-generation developer platforms.',
    responsibilities: JSON.stringify([
      'Construct scalable Figma component libraries adhering to WCAG 2.2 AA standards.',
      'Collaborate with frontend engineers to translate Figma tokens into Tailwind CSS classes.',
      'Conduct usability walkthroughs with 20+ engineering candidates and distill feedback.'
    ]),
    requirements: JSON.stringify([
      'Figma',
      'Design Systems',
      'Typography',
      'HTML/CSS Basics',
      'Wireframing',
      'Prototyping'
    ]),
    preferred_qualifications: JSON.stringify([
      'Stellar portfolio showcasing typography and dark-mode web experiences.',
      'Familiarity with Framer Motion or web animation principles.'
    ]),
    perks: JSON.stringify([
      'Annual Figma Enterprise & typography licenses',
      'Portfolio review and mentorship by principal design leaders'
    ]),
    eligible_batches: JSON.stringify([2024, 2025, 2026, 2027]),
    eligible_degrees: JSON.stringify(['B.Des', 'B.Tech', 'B.Arch', 'Any Degree with Strong Portfolio']),
    min_cgpa: 6.0,
    is_mock_data: 1,
    is_active: 1,
    deadline: '2026-12-01',
  },
  {
    title: 'Site Reliability & Cloud Infrastructure Intern',
    slug: 'cloud-sre-intern-infra-lattice',
    company_name: 'Lattice Cloud Technologies',
    company_logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=128&auto=format&fit=crop&q=80',
    company_website: 'https://latticeinfra.internal',
    is_verified: 1,
    category: 'DevOps & Cloud',
    role_type: 'Internship',
    work_mode: 'Onsite',
    location: 'Hyderabad, Telangana',
    stipend_min: 40000,
    stipend_max: 50000,
    stipend_period: 'month',
    ppo_offered: 1,
    ppo_ctc_min: 15.0,
    ppo_ctc_max: 20.0,
    duration_months: 6,
    experience_level: 'Students & Freshers',
    description: 'Manage automated Kubernetes clusters, Prometheus/Grafana observability pipelines, and zero-downtime CI/CD workflows across multi-region AWS infrastructure.',
    responsibilities: JSON.stringify([
      'Write Terraform modules for provisioning isolated VPCs and EKS clusters.',
      'Maintain automated canary deployments with ArgoCD.',
      'Configure Grafana alerts and incident simulation tests.'
    ]),
    requirements: JSON.stringify([
      'Linux',
      'Docker',
      'Kubernetes',
      'Terraform',
      'AWS / GCP',
      'Bash Scripting'
    ]),
    preferred_qualifications: JSON.stringify([
      'CKA (Certified Kubernetes Administrator) or AWS Cloud Practitioner.',
      'Experience managing personal homelab or VPS servers.'
    ]),
    perks: JSON.stringify([
      'Cloud certification fee reimbursements (up to ₹25,000)',
      'Relocation assistance to Hyderabad campus'
    ]),
    eligible_batches: JSON.stringify([2025, 2026]),
    eligible_degrees: JSON.stringify(['B.Tech', 'B.E.', 'MCA']),
    min_cgpa: 7.0,
    is_mock_data: 1,
    is_active: 1,
    deadline: '2026-11-25',
  },
  {
    title: 'Data Science & Market Intelligence Intern',
    slug: 'data-science-intern-quant-vector',
    company_name: 'QuantVector Analytics',
    company_logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=128&auto=format&fit=crop&q=80',
    company_website: 'https://quantvector.internal',
    is_verified: 1,
    category: 'Data & Analytics',
    role_type: 'Internship',
    work_mode: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    stipend_min: 42000,
    stipend_max: 52000,
    stipend_period: 'month',
    ppo_offered: 0,
    duration_months: 3,
    experience_level: 'Students & Freshers',
    description: 'Analyze multi-market volatility signals, clean tabular datasets, and build feature stores for predictive algorithmic models.',
    responsibilities: JSON.stringify([
      'Perform exploratory data analysis on tick-level trading datasets using Polars and Pandas.',
      'Build feature engineering pipelines and backtest mean-reversion trading strategies.',
      'Write automated data quality validation routines with Great Expectations.'
    ]),
    requirements: JSON.stringify([
      'Python',
      'SQL',
      'Pandas / Polars',
      'Statistics',
      'Data Visualization',
      'Git'
    ]),
    preferred_qualifications: JSON.stringify([
      'Strong mathematical foundations in linear algebra and probability.',
      'Kaggle competition participation.'
    ]),
    perks: JSON.stringify([
      'Monthly book allowance for quantitative finance and ML',
      'Flexible hybrid schedule (2 days onsite)'
    ]),
    eligible_batches: JSON.stringify([2024, 2025, 2026]),
    eligible_degrees: JSON.stringify(['B.Tech', 'B.Stat', 'B.Math', 'M.Sc Statistics', 'Economics']),
    min_cgpa: 7.5,
    is_mock_data: 1,
    is_active: 1,
    deadline: '2026-12-10',
  },
  {
    title: 'Frontend React Engineer (Fresher / New Grad)',
    slug: 'frontend-fresher-react-kaamsutra-labs',
    company_name: 'KaamSutra Portal Labs',
    company_logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=128&auto=format&fit=crop&q=80',
    company_website: 'https://kaamsutra.internal',
    is_verified: 1,
    category: 'Engineering',
    role_type: 'Fresher / Full-time',
    work_mode: 'Remote',
    location: 'Remote (India)',
    stipend_min: 75000,
    stipend_max: 95000,
    stipend_period: 'month',
    ppo_offered: 1,
    ppo_ctc_min: 14.0,
    ppo_ctc_max: 18.0,
    duration_months: 12,
    experience_level: '0-1 Years (Freshers)',
    description: 'Full-time entry level opportunity for passionate frontend craftspeople to create cinematic, lightning-fast UI experiences with React, Tailwind, and TypeScript.',
    responsibilities: JSON.stringify([
      'Develop modular component systems adhering strictly to design token architecture.',
      'Ensure 100% WCAG 2.2 AA accessibility across keyboard navigations and screen readers.',
      'Profile and optimize Core Web Vitals to sustain sub-1.0s Largest Contentful Paint.'
    ]),
    requirements: JSON.stringify([
      'React',
      'TypeScript',
      'Tailwind CSS',
      'HTML5 Semantics',
      'REST APIs',
      'Performance Optimization'
    ]),
    preferred_qualifications: JSON.stringify([
      'Open-source projects showcasing custom animations and clean component APIs.'
    ]),
    perks: JSON.stringify([
      'Health insurance cover for self & parents (₹10 Lakh)',
      'Learning & conference stipend (₹50,000/year)'
    ]),
    eligible_batches: JSON.stringify([2023, 2024, 2025]),
    eligible_degrees: JSON.stringify(['Any Graduate', 'B.Tech', 'BCA', 'B.Sc']),
    min_cgpa: 6.5,
    is_mock_data: 1,
    is_active: 1,
    deadline: '2026-11-15',
  },
  {
    title: 'Associate Product Manager Intern',
    slug: 'apm-intern-stryke-technologies',
    company_name: 'Stryke Fintech',
    company_logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&auto=format&fit=crop&q=80',
    company_website: 'https://stryke.internal',
    is_verified: 1,
    category: 'Product Management',
    role_type: 'Internship',
    work_mode: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    stipend_min: 40000,
    stipend_max: 50000,
    stipend_period: 'month',
    ppo_offered: 1,
    ppo_ctc_min: 16.0,
    ppo_ctc_max: 20.0,
    duration_months: 6,
    experience_level: 'Students & Freshers',
    description: 'Own user research cohorts, define product requirement documents (PRDs), and track funnel metrics for an upcoming student credit product.',
    responsibilities: JSON.stringify([
      'Interview 50+ college students each month to unearth pain points in student financing.',
      'Draft clear PRDs with wireframes, user stories, and acceptance criteria.',
      'Collaborate with analytics to track onboarding funnel drop-offs using Mixpanel.'
    ]),
    requirements: JSON.stringify([
      'Product Thinking',
      'User Research',
      'Wireframing',
      'SQL Basics',
      'Data Analysis',
      'Written Communication'
    ]),
    preferred_qualifications: JSON.stringify([
      'Previous entrepreneurial stint or campus club leadership experience.'
    ]),
    perks: JSON.stringify([
      'Direct executive mentorship with VP of Product',
      'Comprehensive PPO pathway based on product milestone delivery'
    ]),
    eligible_batches: JSON.stringify([2025, 2026]),
    eligible_degrees: JSON.stringify(['Any Degree', 'B.Tech', 'BBA', 'B.Com']),
    min_cgpa: 7.0,
    is_mock_data: 1,
    is_active: 1,
    deadline: '2026-11-28',
  }
];

export function seedOpportunities(db: DatabaseSync): void {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM internships').get() as { count: number };
  if (countRow && countRow.count > 0) {
    return; // Already seeded
  }

  const insertStmt = db.prepare(`
    INSERT INTO internships (
      title, slug, company_name, company_logo, company_website, is_verified,
      category, role_type, work_mode, location, stipend_min, stipend_max,
      stipend_period, ppo_offered, ppo_ctc_min, ppo_ctc_max, duration_months,
      experience_level, description, responsibilities, requirements,
      preferred_qualifications, perks, eligible_batches, eligible_degrees,
      min_cgpa, is_mock_data, is_active, deadline
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  for (const item of INITIAL_INTERNSHIPS) {
    insertStmt.run(
      item.title,
      item.slug,
      item.company_name,
      item.company_logo,
      item.company_website,
      item.is_verified,
      item.category,
      item.role_type,
      item.work_mode,
      item.location,
      item.stipend_min,
      item.stipend_max,
      item.stipend_period,
      item.ppo_offered,
      item.ppo_ctc_min || null,
      item.ppo_ctc_max || null,
      item.duration_months,
      item.experience_level,
      item.description,
      item.responsibilities,
      item.requirements,
      item.preferred_qualifications || null,
      item.perks || null,
      item.eligible_batches,
      item.eligible_degrees,
      item.min_cgpa,
      item.is_mock_data,
      item.is_active,
      item.deadline
    );
  }

  console.log(`[Database] Successfully seeded ${INITIAL_INTERNSHIPS.length} demo internships with explicit is_mock_data=1.`);
}
