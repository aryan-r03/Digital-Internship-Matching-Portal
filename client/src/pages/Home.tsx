import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  ChevronRight,
  Target,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { Opportunity } from '../types/opportunity.js';
import { opportunityService } from '../api/opportunityService.js';
import { OpportunityCard } from '../components/opportunities/OpportunityCard.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { ScreentonePanel } from '../components/ui/ScreentonePanel.js';

export const Home: React.FC = () => {
  const [featuredOpportunities, setFeaturedOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const feat = await opportunityService.getFeaturedOpportunities();
        setFeaturedOpportunities(feat);
      } catch (err) {
        console.error('Failed to load featured opportunities:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const careerTracks = [
    {
      title: 'AI & Machine Learning',
      hindi: 'कृत्रिम बुद्धिमत्ता',
      roles: 'Computer Vision, LLMs, Vector RAG, Deep Learning',
      avgStipend: '₹48,000 / mo',
      count: '14 Roles',
      category: 'AI / Machine Learning',
    },
    {
      title: 'Full Stack & Software Engineering',
      hindi: 'सॉफ्टवेयर निर्माण',
      roles: 'React, Node.js, Golang, PostgreSQL, Distributed Systems',
      avgStipend: '₹40,000 / mo',
      count: '28 Roles',
      category: 'Software Engineering',
    },
    {
      title: 'Data Science & Quantitative Analytics',
      hindi: 'आंकड़ा विज्ञान',
      roles: 'Predictive Modeling, Time Series, Python, Feature Eng',
      avgStipend: '₹45,000 / mo',
      count: '11 Roles',
      category: 'Data Science',
    },
    {
      title: 'UI/UX & Product Design',
      hindi: 'उत्पाद डिज़ाइन',
      roles: 'Design Systems, Micro-Interactions, User Research',
      avgStipend: '₹32,000 / mo',
      count: '9 Roles',
      category: 'UI/UX Design',
    },
    {
      title: 'Cloud Infrastructure & DevOps',
      hindi: 'क्लाउड संरचना',
      roles: 'Kubernetes, Terraform, CI/CD Pipelines, Linux SRE',
      avgStipend: '₹38,000 / mo',
      count: '8 Roles',
      category: 'Cloud & DevOps',
    },
    {
      title: 'Product Management & Growth',
      hindi: 'उत्पाद प्रबंधन',
      roles: 'PRDs, User Journeys, Funnel Analytics, Strategy',
      avgStipend: '₹45,000 / mo',
      count: '7 Roles',
      category: 'Product Management',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center border-b-2 border-manga-borderStrong overflow-hidden bg-black">
        {/* Subtle Screentone & Speedlines Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-screentone bg-screentone-sm opacity-20" />
          <div className="absolute inset-0 bg-speed-lines opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-manga-bg via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Hindi Bilingual Greeting Badge */}
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-black border border-manga-accent text-manga-accent font-hindi font-bold text-xs tracking-wider shadow-panel-accent">
                नमस्ते // Welcome
              </span>
              <span className="text-xs font-mono text-manga-muted uppercase tracking-widest flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-manga-accent" />
                <span>Next-Gen Career Launchpad</span>
              </span>
            </div>

            {/* Value Proposition Title */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight text-white uppercase leading-none drop-shadow-md">
                Where High-Impact <span className="text-manga-accent">Internships</span> Begin.
              </h1>
              <p className="text-xl sm:text-2xl font-hindi font-bold text-manga-text/90 tracking-wide pt-1">
                सफ़र सपनों से सफलता तक // Bridging Ambition & Engineering
              </p>
            </div>

            {/* Value Proposition Subtext */}
            <p className="text-sm sm:text-base font-mono text-manga-text/80 leading-relaxed border-l-2 border-manga-accent pl-4">
              Curated technical internships, verified pre-placement offer (PPO) pathways, and transparent stipends for students, freshers, and early-career developers. No ambiguous job descriptions, zero unpaid tech grinds.
            </p>

            {/* Mandatory Demo Data Notice Banner */}
            <div className="p-3 bg-neutral-900 border border-amber-500/40 text-[11px] font-mono text-amber-200/90 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Demo data — not live opportunities.</strong> All opportunities shown are mock listings structured for career discovery evaluation.
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/opportunities">
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<Compass className="w-5 h-5" />}
                >
                  Explore Opportunities
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" size="lg">
                  Setup Candidate Profile →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE STATISTICS TICKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 bg-manga-surface border-2 border-manga-borderStrong shadow-panel-lg divide-y md:divide-y-0 md:divide-x divide-manga-border">
          <div className="p-5 sm:p-6 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black font-heading text-white">
              8+
            </div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-manga-muted">
              Curated Domains // विषय
            </div>
          </div>
          <div className="p-5 sm:p-6 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black font-heading text-manga-accent">
              ₹42,000
            </div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-manga-muted">
              Average Monthly Stipend // मानदेय
            </div>
          </div>
          <div className="p-5 sm:p-6 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black font-heading text-white">
              85%
            </div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-manga-muted">
              PPO Conversion Track // रोज़गार
            </div>
          </div>
          <div className="p-5 sm:p-6 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black font-heading text-manga-gold">
              500+
            </div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-manga-muted">
              Student Aspirants // अभ्यर्थी
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED OPPORTUNITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b-2 border-manga-border pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-manga-accent uppercase tracking-widest">
              <Zap className="w-4 h-4 fill-manga-accent" />
              <span>High-Impact Openings // चुनिंदा अवसर</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase tracking-wider text-white mt-1">
              Featured Opportunities
            </h2>
          </div>
          <Link
            to="/opportunities"
            className="text-xs font-mono uppercase text-manga-muted hover:text-white flex items-center gap-1 group"
          >
            <span>View All Openings</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </section>

      {/* 4. CAREER TAXONOMY & TRACKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b-2 border-manga-border pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-manga-muted uppercase tracking-widest">
            <Layers className="w-4 h-4 text-manga-accent" />
            <span>Domain Exploration // कार्यक्षेत्र</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase tracking-wider text-white mt-1">
            Browse by Engineering Discipline
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {careerTracks.map((track) => (
            <Link
              key={track.title}
              to={`/opportunities?category=${encodeURIComponent(track.category)}`}
              className="p-6 bg-manga-surface border border-manga-border hover:border-manga-accent transition-all duration-300 shadow-panel hover:shadow-panel-accent group relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-screentone bg-screentone-sm opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-hindi text-manga-accent font-bold">
                    {track.hindi}
                  </span>
                  <span className="text-manga-dim">
                    Avg: <strong className="text-white">{track.avgStipend}</strong>
                  </span>
                </div>
                <h3 className="text-lg font-bold font-heading uppercase text-white group-hover:text-manga-accent transition-colors">
                  {track.title}
                </h3>
                <p className="text-xs text-manga-muted font-mono leading-relaxed">
                  {track.roles}
                </p>
              </div>

              <div className="relative z-10 pt-4 mt-3 border-t border-manga-border/60 flex items-center justify-between font-mono text-xs text-manga-dim group-hover:text-white">
                <span>{track.count} Available</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. EDITORIAL MANIFESTO / PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScreentonePanel hasAccentBorder withSpeedLines className="p-8 sm:p-12 space-y-6 text-center">
          <span className="font-hindi text-manga-accent font-bold text-sm tracking-widest block">
            तैयारी और मार्गदर्शन // CANDIDATE ADVOCACY DIRECTIVE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-heading uppercase tracking-wider text-white max-w-xl mx-auto">
            Zero Unpaid Work. Real Engineering Impact.
          </h2>
          <p className="text-xs sm:text-sm font-mono text-manga-muted max-w-2xl mx-auto leading-relaxed">
            Every listing indexed on KaamSutra provides clear stipend transparency, well-defined batch eligibility, explainable match scoring, and structured mentor accountability. Candidates are treated as junior colleagues contributing to production codebases, not coffee runners.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link to="/opportunities">
              <Button variant="primary" size="md">
                Find Your Internship
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" size="md">
                Candidate Dossier
              </Button>
            </Link>
          </div>
        </ScreentonePanel>
      </section>
    </div>
  );
};
