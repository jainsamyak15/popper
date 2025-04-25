export function generateMarketActivity(marketId: string) {
  const activityCount = Math.floor(Math.random() * 8) + 3; // 3-10 activities
  const activities = [];
  
  const now = new Date();
  
  for (let i = 0; i < activityCount; i++) {
    const isYes = Math.random() > 0.5;
    const amount = Math.floor(Math.random() * 100) + 5; // 5-105 XLM
    const timestamp = new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 7); // Random time in the last week
    const priceChange = (Math.random() * 0.06) * (Math.random() > 0.5 ? 1 : -1); // -6% to +6%
    
    activities.push({
      id: `activity-${marketId}-${i}`,
      address: `GABCD${Math.floor(Math.random() * 1000000)}XYZ`,
      prediction: isYes ? 'yes' : 'no',
      amount,
      timestamp: timestamp.toISOString(),
      priceChange
    });
  }
  
  // Sort by timestamp, most recent first
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}