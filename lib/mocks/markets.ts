export const marketsMock = [
  {
    id: '1',
    title: 'Will Bitcoin exceed $100,000 before the end of 2025?',
    description: 'This market will resolve to YES if the price of Bitcoin (BTC) exceeds $100,000 USD on any major exchange before December 31, 2025, 23:59:59 UTC.',
    category: 'crypto',
    yesPrice: 0.72,
    volume: 15420,
    participants: 832,
    trades: 1243,
    featured: true,
    closingDate: new Date('2025-12-31T23:59:59Z').toISOString(),
    resolutionCriteria: 'Resolution will be based on price data from at least three major cryptocurrency exchanges, including Binance, Coinbase, and Kraken.',
  },
  {
    id: '2',
    title: 'Will the Democratic candidate win the 2024 US Presidential Election?',
    description: 'This market will resolve to YES if the Democratic Party candidate wins the 2024 US Presidential Election, and to NO otherwise.',
    category: 'politics',
    yesPrice: 0.48,
    volume: 35982,
    participants: 1422,
    trades: 3251,
    featured: true,
    closingDate: new Date('2024-11-05T23:59:59Z').toISOString(),
    resolutionCriteria: 'Resolution will be based on official election results as certified by all 50 states and acknowledged by major media outlets.',
  },
  {
    id: '3',
    title: 'Will Apple release a new AR/VR headset in 2024?',
    description: 'This market will resolve to YES if Apple officially releases (makes available for purchase) a new AR/VR headset product during the calendar year 2024.',
    category: 'technology',
    yesPrice: 0.85,
    volume: 8254,
    participants: 456,
    trades: 921,
    featured: false,
    closingDate: new Date('2024-12-31T23:59:59Z').toISOString(),
    resolutionCriteria: 'Resolution will be based on official Apple announcements and product releases. The headset must be commercially available for purchase in at least one country.',
  },
  {
    id: '4',
    title: 'Will the Tampa Bay Buccaneers win the Super Bowl LIX?',
    description: 'This market will resolve to YES if the Tampa Bay Buccaneers win Super Bowl LIX, scheduled for February 2025.',
    category: 'sports',
    yesPrice: 0.12,
    volume: 6721,
    participants: 289,
    trades: 542,
    featured: false,
    closingDate: new Date('2025-02-09T23:59:59Z').toISOString(),
    resolutionCriteria: 'Resolution will be based on the official NFL game result for Super Bowl LIX.',
  },
  {
    id: '5',
    title: 'Will Taylor Swift release a new album in 2024?',
    description: 'This market will resolve to YES if Taylor Swift releases a new studio album (not a re-recording, EP, or single) during the calendar year 2024.',
    category: 'entertainment',
    yesPrice: 0.65,
    volume: 4123,
    participants: 378,
    trades: 723,
    featured: false,
    closingDate: new Date('2024-12-31T23:59:59Z').toISOString(),
    resolutionCriteria: 'Resolution will be based on official releases by Taylor Swift or her record label. The release must be a full studio album of new material, not a re-recording of previous work.',
  },
  {
    id: '6',
    title: 'Will Ethereum transition to full sharding before the end of 2024?',
    description: 'This market will resolve to YES if Ethereum implements and activates a full sharding solution on mainnet before December 31, 2024, 23:59:59 UTC.',
    category: 'crypto',
    yesPrice: 0.28,
    volume: 12789,
    participants: 543,
    trades: 987,
    featured: true,
    closingDate: new Date('2024-12-31T23:59:59Z').toISOString(),
    resolutionCriteria: 'Resolution will be based on official Ethereum Foundation announcements and blockchain data confirming the activation of sharding on the Ethereum mainnet.',
  },
  {
    id: '7',
    title: 'Will NASA\'s Artemis II mission successfully orbit the Moon in 2024?',
    description: 'This market will resolve to YES if NASA\'s Artemis II crewed mission successfully orbits the Moon and returns safely to Earth in 2024.',
    category: 'science',
    yesPrice: 0.54,
    volume: 7823,
    participants: 412,
    trades: 865,
    featured: true,
    closingDate: new Date('2024-12-31T23:59:59Z').toISOString(),
    resolutionCriteria: 'Resolution will be based on official NASA statements and confirmation that the Artemis II mission successfully orbited the Moon and returned safely to Earth.',
  },
  {
    id: '8',
    title: 'Will The Elder Scrolls VI be released before 2026?',
    description: 'This market will resolve to YES if Bethesda Softworks officially releases The Elder Scrolls VI for any platform before January 1, 2026.',
    category: 'entertainment',
    yesPrice: 0.15,
    volume: 3891,
    participants: 267,
    trades: 512,
    featured: false,
    closingDate: new Date('2025-12-31T23:59:59Z').toISOString(),
    resolutionCriteria: 'Resolution will be based on official announcements from Bethesda Softworks or its parent company. The game must be commercially available for purchase.',
  },
  {
    id: '9',
    title: 'Will the Federal Reserve cut interest rates before July 2024?',
    description: 'This market will resolve to YES if the US Federal Reserve announces a cut to the federal funds rate before July 1, 2024.',
    category: 'economics',
    yesPrice: 0.63,
    volume: 14567,
    participants: 587,
    trades: 1321,
    featured: true,
    closingDate: new Date('2024-07-01T23:59:59Z').toISOString(),
    resolutionCriteria: 'Resolution will be based on official Federal Reserve announcements and implemented policy changes regarding the federal funds rate.',
  },
  {
    id: '10',
    title: 'Will Artificial General Intelligence (AGI) be achieved before 2030?',
    description: 'This market will resolve to YES if an AI system demonstrating general intelligence across multiple domains is publicly recognized by at least 3 major academic institutions before January 1, 2030.',
    category: 'technology',
    yesPrice: 0.22,
    volume: 21345,
    participants: 712,
    trades: 1876,
    featured: true,
    closingDate: new Date('2029-12-31T23:59:59Z').toISOString(),
    resolutionCriteria: 'Resolution will be based on public statements from at least 3 of the following institutions: MIT, Stanford, Berkeley, Oxford, Cambridge, Microsoft Research, or Google DeepMind, acknowledging that an AI system meets the criteria for AGI.',
  },
  {
    id: '11',
    title: 'Will SpaceX successfully land humans on Mars before 2028?',
    description: 'This market will resolve to YES if SpaceX successfully lands at least one human on the surface of Mars who returns safely to Earth before January 1, 2028.',
    category: 'science',
    yesPrice: 0.17,
    volume: 18921,
    participants: 673,
    trades: 1543,
    featured: false,
    closingDate: new Date('2027-12-31T23:59:59Z').toISOString(),
    resolutionCriteria: 'Resolution will be based on official SpaceX announcements, independent verification by space agencies (NASA, ESA, etc.), and video evidence of the Mars landing and return.',
  },
  {
    id: '12',
    title: 'Will global average temperature increase by more than 1.5°C above pre-industrial levels by 2030?',
    description: 'This market will resolve to YES if the global average temperature for any calendar year before 2030 exceeds 1.5°C above pre-industrial levels (1850-1900) according to major climate data sources.',
    category: 'science',
    yesPrice: 0.74,
    volume: 9876,
    participants: 421,
    trades: 876,
    featured: false,
    closingDate: new Date('2029-12-31T23:59:59Z').toISOString(),
    resolutionCriteria: 'Resolution will be based on data from at least two of the following sources: NASA GISS, HadCRUT, NOAA, or Berkeley Earth, showing that the global average temperature exceeded the threshold.',
  }
];