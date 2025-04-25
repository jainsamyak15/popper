export function generatePortfolioData(timeRange: string) {
  const dataPoints = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : timeRange === 'year' ? 12 : 24;
  const data = [];
  const endDate = new Date();
  let balance = 500 + Math.random() * 500; // Start with 500-1000 XLM
  let accuracy = 50 + Math.random() * 30; // Start with 50-80% accuracy
  
  // Calculate time interval based on range
  const interval = timeRange === 'week' 
    ? 24 * 60 * 60 * 1000 // 1 day
    : timeRange === 'month'
      ? 24 * 60 * 60 * 1000 // 1 day
      : timeRange === 'year'
        ? 30 * 24 * 60 * 60 * 1000 // ~1 month
        : 60 * 24 * 60 * 60 * 1000; // ~2 months
  
  for (let i = 0; i < dataPoints; i++) {
    const date = new Date(endDate.getTime() - (dataPoints - 1 - i) * interval);
    
    // Generate smooth random walk for balance and accuracy
    const balanceChange = (Math.random() - 0.4) * (balance * 0.05); // Slightly biased toward growth
    balance = Math.max(100, balance + balanceChange);
    
    const accuracyChange = (Math.random() - 0.5) * 5;
    accuracy = Math.min(100, Math.max(30, accuracy + accuracyChange));
    
    data.push({
      date: date.toISOString(),
      balance: Math.round(balance * 100) / 100,
      accuracy: Math.round(accuracy)
    });
  }
  
  return data;
}

export function generateCategoryData() {
  return [
    { name: 'Politics', value: 25 + Math.floor(Math.random() * 15) },
    { name: 'Crypto', value: 20 + Math.floor(Math.random() * 15) },
    { name: 'Sports', value: 15 + Math.floor(Math.random() * 10) },
    { name: 'Entertainment', value: 10 + Math.floor(Math.random() * 10) },
    { name: 'Science', value: 5 + Math.floor(Math.random() * 15) }
  ];
}