export function generateUserPositions(type: string) {
  const positionCount = Math.floor(Math.random() * 5) + 3; // 3-7 positions
  const positions = [];
  const now = new Date();
  
  for (let i = 0; i < positionCount; i++) {
    const isYes = Math.random() > 0.5;
    const amount = Math.floor(Math.random() * 100) + 10; // 10-110 XLM
    const profit = type === 'resolved' 
      ? (Math.random() > 0.6 ? 1 : -1) * (amount * (Math.random() * 1.5 + 0.2)) // Win or lose, 20-170% of amount
      : amount * (Math.random() * 1.2 + 0.5); // Potential profit for open positions
    
    const closingDate = new Date(now.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 30); // Random time in the next month
    const resolvedDate = new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 14); // Random time in the last 2 weeks
    
    const categories = ['politics', 'crypto', 'sports', 'entertainment', 'science'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const marketTitles = [
      'Will Bitcoin exceed $100,000 before the end of 2025?',
      'Will the Democratic candidate win the 2024 US Presidential Election?',
      'Will Apple release a new AR/VR headset in 2024?',
      'Will the Tampa Bay Buccaneers win the Super Bowl LIX?',
      'Will Taylor Swift release a new album in 2024?',
      'Will Ethereum transition to full sharding before the end of 2024?',
      'Will NASA\'s Artemis II mission successfully orbit the Moon in 2024?',
      'Will The Elder Scrolls VI be released before 2026?',
      'Will the Federal Reserve cut interest rates before July 2024?',
      'Will Artificial General Intelligence (AGI) be achieved before 2030?'
    ];
    
    positions.push({
      id: `position-${i}`,
      marketId: (i % 10) + 1,
      marketTitle: marketTitles[i % marketTitles.length],
      prediction: isYes ? 'yes' : 'no',
      amount,
      profit,
      category,
      closingDate: closingDate.toISOString(),
      resolvedDate: resolvedDate.toISOString()
    });
  }
  
  return positions;
}