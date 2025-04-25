import { HeroSection } from '@/components/sections/hero-section';
import { FeaturedMarkets } from '@/components/sections/featured-markets';
import { HowItWorks } from '@/components/sections/how-it-works';
import { AIResolution } from '@/components/sections/ai-resolution';
import { TrendingMarkets } from '@/components/sections/trending-markets';
import { StatsSection } from '@/components/sections/stats-section';

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <HeroSection />
      <TrendingMarkets />
      <FeaturedMarkets />
      <HowItWorks />
      <AIResolution />
      <StatsSection />
    </div>
  );
}