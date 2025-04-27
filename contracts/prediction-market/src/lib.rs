#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, token::Client as TokenClient, Address, Env, Symbol, Vec,
};

#[contracttype]
pub enum DataKey {
    Market(u32),
    MarketCount,
    Position(Address, u32),
    TotalVolume,
    UserPositions(Address),
}

#[contracttype]
#[derive(Clone)]
pub struct Market {
    pub id: u32,
    pub title: Symbol,
    pub description: Symbol,
    pub category: Symbol,
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
#[derive(Clone)]
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
        env: Env,
        creator: Address,
        title: Symbol,
        description: Symbol,
        category: Symbol,
        end_time: u64,
    ) -> u32 {
        // Use the provided creator address instead of extracting from environment
        creator.require_auth();

        let count: u32 = env.storage().instance().get(&DataKey::MarketCount).unwrap_or(0);
        let new_count = count + 1;

        let market = Market {
            id: new_count,
            title,
            description,
            category,
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
        env: Env,
        user: Address,
        market_id: u32,
        prediction: bool,
        amount: i128,
        token_address: Address,
    ) {
        user.require_auth();

        let market_key = DataKey::Market(market_id);
        let mut market: Market = env.storage().instance().get(&market_key).expect("Market not found");

        assert!(!market.resolved, "Market already resolved");
        assert!(env.ledger().timestamp() < market.end_time, "Market closed");
        assert!(amount > 0, "Amount must be positive");

        let token_client = TokenClient::new(&env, &token_address);
        token_client.transfer(&user, &env.current_contract_address(), &amount);

        let (current_yes, current_no) = (market.yes_pool, market.no_pool);
        let total_pool_before = current_yes + current_no;
        let entry_price = if prediction {
            if current_yes == 0 { 5000 } else { (current_yes * 10000).checked_div(total_pool_before).unwrap_or(5000) }
        } else {
            if current_no == 0 { 5000 } else { (current_no * 10000).checked_div(total_pool_before).unwrap_or(5000) }
        };

        if prediction {
            market.yes_pool += amount;
        } else {
            market.no_pool += amount;
        }
        market.volume += amount;

        let position_key = DataKey::Position(user.clone(), market_id);
        if !env.storage().instance().has(&position_key) {
             market.participants += 1;
        }
        let position = Position { amount, prediction, claimed: false, entry_price };
        env.storage().instance().set(&position_key, &position);

        let user_positions_key = DataKey::UserPositions(user.clone());
        let mut user_positions: Vec<u32> = env.storage().instance().get(&user_positions_key).unwrap_or_else(|| Vec::new(&env));
        if !user_positions.contains(market_id) {
             user_positions.push_back(market_id);
             env.storage().instance().set(&user_positions_key, &user_positions);
        }

        let total_volume: i128 = env.storage().instance().get(&DataKey::TotalVolume).unwrap_or(0);
        env.storage().instance().set(&DataKey::TotalVolume, &(total_volume + amount));

        env.storage().instance().set(&market_key, &market);
    }

    pub fn resolve_market(env: Env, resolver: Address, market_id: u32, outcome: bool) {
        resolver.require_auth();

        let market_key = DataKey::Market(market_id);
        let mut market: Market = env.storage().instance().get(&market_key).expect("Market not found");

        assert!(!market.resolved, "Market already resolved");
        assert!(env.ledger().timestamp() >= market.end_time, "Market not ended yet");

        market.resolved = true;
        market.outcome = outcome;

        env.storage().instance().set(&market_key, &market);
    }

    pub fn claim_winnings(env: Env, user: Address, market_id: u32, token_address: Address) {
        user.require_auth();

        let market: Market = env.storage().instance().get(&DataKey::Market(market_id)).expect("Market not found");
        let position_key = DataKey::Position(user.clone(), market_id);
        let mut position: Position = env.storage().instance().get(&position_key).expect("Position not found");

        assert!(market.resolved, "Market not resolved yet");
        assert!(!position.claimed, "Winnings already claimed");

        let winnings = if position.prediction == market.outcome {
            let total_pool = market.yes_pool + market.no_pool;
            let winning_pool = if market.outcome { market.yes_pool } else { market.no_pool };
            if winning_pool == 0 { 0 } else { 
                (position.amount.checked_mul(total_pool).unwrap_or(0))
                    .checked_div(winning_pool)
                    .unwrap_or(0)
            }
        } else {
            0
        };

        if winnings > 0 {
            let token_client = TokenClient::new(&env, &token_address);
            token_client.transfer(&env.current_contract_address(), &user, &winnings);
        }

        position.claimed = true;
        env.storage().instance().set(&position_key, &position);
    }

    // Read-only functions
    pub fn get_market(env: Env, market_id: u32) -> Market {
        env.storage().instance().get(&DataKey::Market(market_id)).expect("Market not found")
    }

    pub fn get_position(env: Env, user: Address, market_id: u32) -> Option<Position> {
        let position_key = DataKey::Position(user, market_id);
        env.storage().instance().get(&position_key)
    }

    pub fn get_user_positions(env: Env, user: Address) -> Vec<u32> {
        env.storage().instance().get(&DataKey::UserPositions(user)).unwrap_or_else(|| Vec::new(&env))
    }

    pub fn get_total_volume(env: Env) -> i128 {
        env.storage().instance().get(&DataKey::TotalVolume).unwrap_or(0)
    }
}