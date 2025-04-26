#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, Map, Symbol, Vec,
};

#[contracttype]
pub enum DataKey {
    Market(u32),
    MarketCount,
    Resolution(u32),
    Position(Address, u32),
    TotalVolume,
    UserPositions(Address),
}

#[contracttype]
pub struct Market {
    pub id: u32,
    pub title: String,
    pub description: String,
    pub category: String,
    pub creator: Address,
    pub yes_pool: i128,
    pub no_pool: i128,
    pub end_time: u64,
    pub resolved: bool,
    pub outcome: bool,
    pub volume: i128,
    pub participants: u32,
}

#[contracttype]
pub struct Position {
    pub amount: i128,
    pub prediction: bool,
    pub claimed: bool,
    pub entry_price: i128,
}

#[contract]
pub struct PredictionMarket;

#[contractimpl]
impl PredictionMarket {
    pub fn initialize(env: Env) {
        env.storage().instance().set(&DataKey::MarketCount, &0u32);
        env.storage().instance().set(&DataKey::TotalVolume, &0i128);
    }

    pub fn create_market(
        env: &Env,
        title: Symbol,
        description: Symbol,
        category: Symbol,
        end_time: u64,
    ) -> u32 {
        let creator = env.invoker();
        let count: u32 = env.storage().instance().get(&DataKey::MarketCount).unwrap();
        let new_count = count + 1;

        let market = Market {
            id: new_count,
            title: title.to_string(),
            description: description.to_string(),
            category: category.to_string(),
            creator: creator.clone(),
            yes_pool: 0,
            no_pool: 0,
            end_time,
            resolved: false,
            outcome: false,
            volume: 0,
            participants: 0,
        };

        env.storage().instance().set(&DataKey::Market(new_count), &market);
        env.storage().instance().set(&DataKey::MarketCount, &new_count);

        new_count
    }

    pub fn place_prediction(
        env: &Env,
        market_id: u32,
        prediction: bool,
        amount: i128,
    ) {
        let user = env.invoker();
        let mut market: Market = env.storage().instance().get(&DataKey::Market(market_id)).unwrap();
        
        assert!(!market.resolved, "Market already resolved");
        assert!(env.ledger().timestamp() < market.end_time, "Market closed");
        assert!(amount > 0, "Amount must be positive");
        
        // Transfer tokens from user to contract
        let token = env.token();
        token.transfer(&user, &env.current_contract_address(), &amount);
        
        // Calculate entry price based on current pools
        let total_pool = market.yes_pool + market.no_pool;
        let entry_price = if total_pool == 0 {
            5000 // 50% if no liquidity
        } else if prediction {
            (market.yes_pool * 10000) / total_pool
        } else {
            (market.no_pool * 10000) / total_pool
        };
        
        // Update market pools and stats
        if prediction {
            market.yes_pool += amount;
        } else {
            market.no_pool += amount;
        }
        
        market.volume += amount;
        market.participants += 1;
        
        // Update total volume
        let total_volume: i128 = env.storage().instance().get(&DataKey::TotalVolume).unwrap();
        env.storage().instance().set(&DataKey::TotalVolume, &(total_volume + amount));
        
        // Store position
        let position = Position {
            amount,
            prediction,
            claimed: false,
            entry_price,
        };
        
        // Update user positions
        let mut user_positions: Vec<u32> = env.storage()
            .instance()
            .get(&DataKey::UserPositions(user.clone()))
            .unwrap_or(Vec::new(env));
        user_positions.push_back(market_id);
        
        env.storage().instance().set(&DataKey::Position((user.clone(), market_id)), &position);
        env.storage().instance().set(&DataKey::UserPositions(user), &user_positions);
        env.storage().instance().set(&DataKey::Market(market_id), &market);
    }

    pub fn resolve_market(env: &Env, market_id: u32, outcome: bool) {
        let market: Market = env.storage().instance().get(&DataKey::Market(market_id)).unwrap();
        
        // Only oracle (contract owner) can resolve
        assert!(env.invoker() == env.current_contract_address(), "Unauthorized");
        assert!(!market.resolved, "Market already resolved");
        assert!(env.ledger().timestamp() >= market.end_time, "Market not ended");
        
        let mut market = market;
        market.resolved = true;
        market.outcome = outcome;
        
        env.storage().instance().set(&DataKey::Market(market_id), &market);
    }

    pub fn claim_winnings(env: &Env, market_id: u32) {
        let user = env.invoker();
        let market: Market = env.storage().instance().get(&DataKey::Market(market_id)).unwrap();
        let position: Position = env.storage()
            .instance()
            .get(&DataKey::Position((user.clone(), market_id)))
            .unwrap();
            
        assert!(market.resolved, "Market not resolved");
        assert!(!position.claimed, "Already claimed");
        
        let winnings = if position.prediction == market.outcome {
            let total_pool = market.yes_pool + market.no_pool;
            let winning_pool = if market.outcome {
                market.yes_pool
            } else {
                market.no_pool
            };
            
            (position.amount * total_pool) / winning_pool
        } else {
            0
        };
        
        if winnings > 0 {
            let token = env.token();
            token.transfer(&env.current_contract_address(), &user, &winnings);
        }
        
        let mut position = position;
        position.claimed = true;
        env.storage().instance().set(&DataKey::Position((user, market_id)), &position);
    }

    pub fn get_market(env: &Env, market_id: u32) -> Market {
        env.storage().instance().get(&DataKey::Market(market_id)).unwrap()
    }

    pub fn get_user_positions(env: &Env, user: Address) -> Vec<u32> {
        env.storage()
            .instance()
            .get(&DataKey::UserPositions(user))
            .unwrap_or(Vec::new(env))
    }

    pub fn get_total_volume(env: &Env) -> i128 {
        env.storage().instance().get(&DataKey::TotalVolume).unwrap()
    }
}