// /app/markets/[id]/page.tsx (Server Component)
import { marketsMock } from '@/lib/mocks/markets';
import MarketPageClient from './client';

// This function must be in a server component
export async function generateStaticParams() {
  return marketsMock.map(market => ({
    id: market.id,
  }));
}

export default function MarketPage({ params }: { params: { id: string } }) {
  // You can fetch initial data here if needed
  const market = marketsMock.find(m => m.id === params.id);
  
  // Pass the market data and ID to the client component
  return <MarketPageClient initialMarket={market} id={params.id} />;
}