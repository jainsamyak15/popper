export function generateTransactionHistory() {
  const transactionCount = Math.floor(Math.random() * 10) + 5; // 5-14 transactions
  const transactions = [];
  const now = new Date();
  
  for (let i = 0; i < transactionCount; i++) {
    const date = new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 30); // Random time in the last month
    const amount = Math.floor(Math.random() * 100) + 5; // 5-105 XLM
    
    const types = ['buy', 'sell', 'win', 'loss'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const marketTitles = [
      'Bitcoin exceeding $100,000',
      'Democratic candidate winning 2024 election',
      'Apple AR/VR headset release',
      'Tampa Bay Buccaneers Super Bowl',
      'Taylor Swift album release',
      'Ethereum sharding implementation',
      'NASA Artemis II mission',
      'Elder Scrolls VI release',
      'Federal Reserve interest rate cut',
      'AGI achievement by 2030'
    ];
    
    let description;
    if (type === 'buy') {
      description = `Prediction on ${marketTitles[Math.floor(Math.random() * marketTitles.length)]}`;
    } else if (type === 'sell') {
      description = `Sold prediction on ${marketTitles[Math.floor(Math.random() * marketTitles.length)]}`;
    } else if (type === 'win') {
      description = `Won prediction on ${marketTitles[Math.floor(Math.random() * marketTitles.length)]}`;
    } else {
      description = `Lost prediction on ${marketTitles[Math.floor(Math.random() * marketTitles.length)]}`;
    }
    
    transactions.push({
      id: `tx-${i}`,
      date: date.toISOString(),
      amount,
      type,
      description,
      marketId: Math.floor(Math.random() * 10) + 1
    });
  }
  
  // Sort by date, most recent first
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}