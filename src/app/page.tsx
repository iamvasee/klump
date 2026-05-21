import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import RealitySection from '@/components/landing/RealitySection';
import PersonaPainSection from '@/components/landing/PersonaPainSection';
import SolutionSection from '@/components/landing/SolutionSection';
import WorkflowSection from '@/components/landing/WorkflowSection';
import TrustSection from '@/components/landing/TrustSection';
import VisionSection from '@/components/landing/VisionSection';
import WaitlistSection from '@/components/landing/WaitlistSection';
import LandingFooter from '@/components/landing/LandingFooter';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Klump — Memory Infrastructure for Modern Organizations',
  description:
    'Klump helps organizations preserve filings, approvals, resolutions, records, and institutional history — across people, teams, and generations.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased">
      <LandingNavbar />
      <HeroSection />
      <RealitySection />
      <PersonaPainSection />
      <SolutionSection />
      <WorkflowSection />
      <TrustSection />
      <VisionSection />
      <WaitlistSection />
      <LandingFooter />
    </div>
  );
}
