export function truncateAddress(address: string | null): string {
  if (!address) return '';
  
  if (address.length <= 10) return address;
  
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}