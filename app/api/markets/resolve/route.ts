import { NextResponse } from 'next/server';
import { ResolutionService } from '@/src/services/ai/resolution-service';
import { StellarService } from '@/src/services/stellar';

export async function POST(req: Request) {
  try {
    const { marketId, marketData } = await req.json();

    // Get AI resolution
    const resolution = await ResolutionService.resolveMarket(marketId, marketData);

    // Submit resolution to blockchain
    await StellarService.resolveMarket(Number(marketId), resolution.outcome);

    return NextResponse.json({
      success: true,
      data: resolution,
    });
  } catch (error) {
    console.error('Error resolving market:', error);
    return NextResponse.json(
      { error: 'Failed to resolve market' },
      { status: 500 }
    );
  }
}