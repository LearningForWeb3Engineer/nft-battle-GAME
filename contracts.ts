import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "./client";

// BattleNFT 合約
export const battleNFTContract = getContract({
  client,
  chain: sepolia,
  address: "0xBE5b0f42f0EdeCd57fffcF6770B0d2747221B9A2",
});

// BattleArena 合約
export const battleArenaContract = getContract({
  client,
  chain: sepolia,
  address: "0x321Eb2300f75F856Fbf4D72ef993a55280C37940",
});