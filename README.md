Battle Warriors - NFT Battle Game
Overview
Battle Warriors is a Web3 NFT battle game built on Ethereum (Sepolia testnet). Players can mint warrior NFTs with randomized stats, battle NPCs of varying difficulty, earn experience points, and level up their warriors.
Tech Stack

Smart Contracts: Solidity (Remix IDE)
Blockchain: Ethereum Sepolia Testnet
Frontend: Next.js + TypeScript + Tailwind CSS
Web3 Integration: Thirdweb SDK
Wallet: MetaMask

Smart Contract Architecture
The project consists of three interconnected smart contracts:
1. RandomNumber.sol
Generates pseudo-random numbers using a combination of block data and a nonce system.

getRandomNumber(uint256 max) - Returns a random number between 0 and max-1
getRandomInRange(uint256 min, uint256 max) - Returns a random number between min and max

2. BattleNFT.sol
Manages warrior NFTs including minting, attributes, and leveling system.

Inherits from OpenZeppelin's ERC721 and Ownable
Each warrior has: Attack (50-100), Defense (30-70), HP (100-200), Level, Experience, Wins, Losses
Warriors level up every 100 experience points, gaining random stat boosts
Only the BattleArena contract can update warrior stats (permission control)

Key functions:

mintWarrior() - Mints a new warrior NFT with randomized stats (costs 0.0001 ETH)
getWarrior(uint256 tokenId) - Returns full warrior data
addExperience(uint256 tokenId, uint256 exp) - Adds experience and triggers level up if threshold is met
_levelUp(uint256 tokenId) - Internal function that increases level and randomly boosts stats

3. BattleArena.sol
Handles all battle logic including PvE (Player vs Environment) combat.

Generates NPC opponents based on difficulty level (1=Easy, 2=Normal, 3=Hard)
Implements turn-based combat with damage calculation
Records all battle results on-chain

Key functions:

battleNPC(uint256 myWarriorId, uint256 difficulty) - Starts a PvE battle
_generateNPC(uint256 difficulty) - Generates NPC with stats based on difficulty
_fight(Warrior memory warrior1, Warrior memory warrior2) - Core battle logic

Contract Interactions
Player
  ↓ mint NFT
BattleNFT (manages warriors)
  ↑ update experience/stats
BattleArena (handles battles)
  ↓ generate random numbers
RandomNumber (random generation)
Battle System

Turn-based combat with random first-attacker selection
Damage = Attacker's ATK - Defender's DEF (minimum 1 damage)
Battle continues until one warrior's HP reaches 0
Win reward: 10 experience points + win record
Loss reward: 3 experience points + loss record

Level Up System

Every 100 experience points triggers a level up
Level up rewards:

Attack: +5 to +10 (random)
Defense: +3 to +7 (random)
Max HP: +10 to +20 (random)
HP fully restored



Deployed Contracts (Sepolia Testnet)

RandomNumber: 0xC82E2E5c3702159AF0b365F24Eb5623F84fc3BF9
BattleNFT: 0xBE5b0f42f0EdeCd57fffcF6770B0d2747221B9A2
BattleArena: 0x321Eb2300f75F856Fbf4D72ef993a55280C37940

Frontend Setup
bashcd battle-game
npm install
npm run dev
Open http://localhost:3000
How to Play

Connect your MetaMask wallet (Sepolia testnet)
Mint a warrior NFT (costs 0.0001 ETH)
Select your warrior and choose a difficulty level
Start the battle and earn experience to level up!

Future Plans (Level 3)

PvP (Player vs Player) battle system with challenge mechanism
NFT Marketplace
DAO governance
Battle animations
Leaderboard system