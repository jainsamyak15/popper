export function generateMarketChartData(currentYesPrice: number, timeRange: string) {
  const dataPoints = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const data = [];
  const endDate = new Date();
  let startPrice = Math.random() * 0.4 + 0.3; // Random starting price between 0.3 and 0.7
  
  // Calculate time interval based on range
  const interval = timeRange === '24h' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = new Date(endDate.getTime() - i * interval);
    
    // Generate smooth random walk
    const randomChange = (Math.random() - 0.5) * 0.1;
    startPrice = Math.max(0.01, Math.min(0.99, startPrice + randomChange));
    
    // As we get closer to the end, move price closer to the current price
    const weight = i / dataPoints;
    const interpolatedPrice = weight * startPrice + (1 - weight) * currentYesPrice;
    const yesPrice = Math.round(interpolatedPrice * 100) / 100;
    
    data.push({
      date: date.toISOString(),
      yes: yesPrice,
      no: Math.round((1 - yesPrice) * 100) / 100
    });
  }
  
  return data;
}