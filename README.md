# 🎯 Popper - On-Chain Prediction Markets

Popper is an innovative prediction market platform built on the Stellar blockchain that enables users to earn from their insights on politics, sports, pop culture, crypto, and more. By leveraging AI-powered market creation and resolution, Popper provides a seamless, transparent, and efficient experience for users to trade their predictions.

## 🌟 Key Features

- **On-Chain Prediction Markets**: Create and participate in markets for various real-world events
- **AI-Powered Resolution**: Automated market resolution using CrewAI and GPT-4o-mini
- **Instant Settlement**: Quick and transparent settlement of predictions
- **Global Accessibility**: Available to anyone with internet access
- **User-Friendly Interface**: Built with Next.js, Tailwind CSS, and Framer Motion

## 🔧 System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Client Layer  │     │  Service Layer  │     │ Blockchain Layer│
│  (Next.js App)  │────▶│  (API Routes)   │────▶│    (Stellar)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                        │
        │                       │                        │
        ▼                       ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    UI/UX        │     │   AI Services   │     │  Smart Contract │
│ - React         │     │ - CrewAI       │     │ - Markets       │
│ - TailwindCSS   │     │ - GPT-4o-mini  │     │ - Predictions   │
│ - Framer Motion │     │ - Data Sources │     │ - Resolution    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 🔄 User Flow

1. **Market Discovery**
   - Browse trending markets
   - Filter by category
   - Search specific topics

2. **Wallet Connection**
   - Connect Freighter wallet
   - View XLM balance
   - Access user portfolio

3. **Making Predictions**
   - Select market
   - Choose YES/NO position
   - Set prediction amount
   - Confirm transaction

4. **Portfolio Management**
   - View active positions
   - Track performance
   - Monitor potential returns

5. **Market Resolution**
   - AI-powered verification
   - Multi-source validation
   - Automated settlement
   - Claim winnings

## 🛠️ Technical Stack

- **Frontend**: Next.js, TailwindCSS, Framer Motion
- **Blockchain**: Stellar, Soroban Smart Contracts
- **AI/ML**: CrewAI, GPT-4o-mini
- **Data Sources**: 
  - Serper API
  - Yahoo Finance
  - Twitter API
  - Google Trends

## 🤖 AI Resolution System

```
┌────────────────┐
│  Market Event  │
└───────┬────────┘
        │
        ▼
┌────────────────┐    ┌────────────────┐
│   CrewAI      │───▶│  Data Sources  │
│  Researchers   │    │ - Serper API   │
└───────┬────────┘    │ - Yahoo Finance│
        │             └────────────────┘
        ▼
┌────────────────┐
│  Consensus     │
│   Builder      │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│   Resolution   │
│   Outcome      │
└────────────────┘
```

## 🔮 Future Roadmap

### Phase 1: AI Market Creation
- Automated market generation from trending topics
- Dynamic parameter adjustment
- Risk assessment system

### Phase 2: Enhanced UX
- Mobile-first interface
- Social login integration
- Session key implementation
- Multicall support

### Phase 3: Advanced Features
- Liquidity pools
- Market maker integration
- Advanced analytics
- Social features

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/popper.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## 📄 Smart Contract

The prediction market smart contract is built on Soroban and includes:

- Market creation and management
- Prediction placement
- Resolution mechanism
- Reward distribution

