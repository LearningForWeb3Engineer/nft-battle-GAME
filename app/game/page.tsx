"use client";

import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendTransaction } from "thirdweb";
import { battleNFTContract, battleArenaContract } from "../../contracts";
import CustomConnectButton from "../../components/CustomConnectButton";
import BattleResultModal from "../../components/BattleResultModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { readContract } from "thirdweb";
import Link from "next/link";

export default function GamePage() {
  const account = useActiveAccount();
  const [minting, setMinting] = useState(false);
  const [selectedWarrior, setSelectedWarrior] = useState("");
  const [difficulty, setDifficulty] = useState("1");
  const [battling, setBattling] = useState(false);
  const [myWarriors, setMyWarriors] = useState<any[]>([]);
  const [loadingWarriors, setLoadingWarriors] = useState(false);
  const [battleResult, setBattleResult] = useState<{
    won: boolean;
    experienceGained: number;
    warriorId: number;
    oldLevel: number;
    newLevel: number;
    leveledUp: boolean;
  } | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  // Mint 戰士
  const handleMint = async () => {
    if (!account) {
      alert("請先連接錢包！");
      return;
    }

    try {
      setMinting(true);

      const transaction = prepareContractCall({
        contract: battleNFTContract,
        method: "function mintWarrior() payable",
        params: [],
        value: BigInt("100000000000000"), // 0.0001 ETH
      });

      await sendTransaction({
        transaction,
        account,
      });

      alert("鑄造成功！🎉");
      await loadMyWarriors(); // 重新載入戰士列表
    } catch (error) {
      console.error(error);
      alert("鑄造失敗！");
    } finally {
      setMinting(false);
    }
  };
  // 戰鬥
  const handleBattle = async () => {
    if (!account) {
      alert("請先連接錢包！");
      return;
    }

    if (!selectedWarrior) {
      alert("請選擇戰士！");
      return;
    }

    try {
      setBattling(true);

      // 獲取戰鬥前的戰士數據
      const oldWarriorData: any = await readContract({
        contract: battleNFTContract,
        method: "function getWarrior(uint256) view returns (uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)",
        params: [BigInt(selectedWarrior)],
      });
      const oldLevel = Number(oldWarriorData[4]);
      const oldExperience = Number(oldWarriorData[5]);

      const transaction = prepareContractCall({
        contract: battleArenaContract,
        method: "function battleNPC(uint256 myWarriorId, uint256 difficulty)",
        params: [BigInt(selectedWarrior), BigInt(difficulty)],
      });

      const result = await sendTransaction({
        transaction,
        account,
      });

      // 獲取戰鬥後的戰士數據
      const newWarriorData: any = await readContract({
        contract: battleNFTContract,
        method: "function getWarrior(uint256) view returns (uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)",
        params: [BigInt(selectedWarrior)],
      });
      const newLevel = Number(newWarriorData[4]);
      const newExperience = Number(newWarriorData[5]);
      const wins = Number(newWarriorData[6]);
      const oldWins = Number(oldWarriorData[6]);

      // 判斷勝負（如果勝場增加了就是贏）
      const won = wins > oldWins;

      // 計算獲得的經驗值
      let experienceGained = newExperience - oldExperience;
      if (newLevel > oldLevel) {
        // 如果升級了，需要加上上一級的剩餘經驗
        experienceGained = (100 - oldExperience) + newExperience;
      }

      // 顯示戰鬥結果
      setBattleResult({
        won,
        experienceGained,
        warriorId: Number(selectedWarrior),
        oldLevel,
        newLevel,
        leveledUp: newLevel > oldLevel,
      });
      setShowResultModal(true);

      // 重新載入戰士列表
      await loadMyWarriors();
    } catch (error) {
      console.error(error);
      alert("戰鬥失敗！");
    } finally {
      setBattling(false);
    }
  };
// 載入我的戰士
const loadMyWarriors = async () => {
  if (!account) return;
  
  setLoadingWarriors(true);
  const warriorsList = [];

  try {
    for (let i = 1; i <= 50; i++) {
      try {
        const owner = await readContract({
          contract: battleNFTContract,
          method: "function ownerOf(uint256 tokenId) view returns (address)",
          params: [BigInt(i)],
        });

        if (owner.toLowerCase() === account.address.toLowerCase()) {
          const warrior: any = await readContract({
            contract: battleNFTContract,
            method: "function getWarrior(uint256) view returns (uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)",
            params: [BigInt(i)],
          });

          warriorsList.push({
            tokenId: i,
            attack: Number(warrior[0]),
            defense: Number(warrior[1]),
            maxHp: Number(warrior[2]),
            hp: Number(warrior[3]),
            level: Number(warrior[4]),
            experience: Number(warrior[5]),
          });
        }
      } catch (e) {
        continue;
      }
    }

    setMyWarriors(warriorsList);
  } catch (error) {
    console.error(error);
  } finally {
    setLoadingWarriors(false);
  }
};
useEffect(() => {
  if (account) {
    loadMyWarriors();
  }
}, [account]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* 戰鬥結果 Modal */}
      <BattleResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        result={battleResult}
      />

      {/* 導航欄 */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-white">⚔️ Battle Warriors</h1>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-300 hover:text-white transition">
            首頁
          </Link>
          <Link href="/warriors" className="text-gray-300 hover:text-white transition">
            我的戰士
          </Link>
          <Link href="/history" className="text-gray-300 hover:text-white transition">
            戰鬥統計
          </Link>
          <Link href="/leaderboard" className="text-gray-300 hover:text-white transition">
            排行榜
          </Link>
          <CustomConnectButton />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-white mb-8">遊戲大廳</h2>

        {!account ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-300 mb-6">
              請先連接錢包開始遊戲
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mint 戰士卡片 */}
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-4">🎴 鑄造戰士</h3>
              <p className="text-gray-400 mb-6">
                花費 0.0001 ETH 鑄造一個隨機屬性的戰士 NFT
              </p>
              <button
                onClick={handleMint}
                disabled={minting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                {minting && <LoadingSpinner size="sm" />}
                {minting ? "鑄造中..." : "鑄造戰士"}
              </button>
            </div>

            {/* 戰鬥卡片 */}
<div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
  <h3 className="text-2xl font-bold text-white mb-4">⚔️ 戰鬥競技</h3>
  <p className="text-gray-400 mb-4">
    挑戰 NPC，贏得經驗值！
  </p>
  
  <div className="space-y-4">
    <div>
      <label className="block text-gray-300 mb-2">戰士 ID</label>
      <input
        type="number"
        placeholder="輸入你的戰士 ID"
        value={selectedWarrior}
        onChange={(e) => setSelectedWarrior(e.target.value)}
        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
      />
    </div>
    
    <div>
      <label className="block text-gray-300 mb-2">難度</label>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
      >
        <option value="1">簡單</option>
        <option value="2">普通</option>
        <option value="3">困難</option>
      </select>
    </div>
    
    <button
      onClick={handleBattle}
      disabled={battling || !selectedWarrior}
      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
    >
      {battling && <LoadingSpinner size="sm" />}
      {battling ? "戰鬥中..." : "開始戰鬥！"}
    </button>
  </div>
</div>

            {/* 我的戰士列表 */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">我的戰士</h3>
                <button
                  onClick={loadMyWarriors}
                  disabled={loadingWarriors}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  {loadingWarriors && <LoadingSpinner size="sm" />}
                  {loadingWarriors ? "載入中..." : "重新整理"}
                </button>
              </div>

              {loadingWarriors ? (
                <div className="flex justify-center items-center py-20">
                  <LoadingSpinner size="lg" />
                </div>
              ) : myWarriors.length === 0 ? (
                <p className="text-gray-400">還沒有戰士，先去鑄造一個吧！</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {myWarriors.map((warrior) => (
                    <div
                      key={warrior.tokenId}
                      onClick={() => setSelectedWarrior(warrior.tokenId.toString())}
                      className={`bg-gray-800 p-4 rounded-lg border cursor-pointer transition transform hover:scale-105 ${
                        selectedWarrior === warrior.tokenId.toString()
                          ? "border-blue-500 bg-blue-900 shadow-lg shadow-blue-500/50 scale-105"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <h4 className="text-lg font-bold text-white mb-2">
                        戰士 #{warrior.tokenId}
                      </h4>
                      <p className="text-sm text-yellow-400 mb-2">Lv.{warrior.level}</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-red-400">⚔️ 攻擊: {warrior.attack}</p>
                        <p className="text-blue-400">🛡️ 防禦: {warrior.defense}</p>
                        <p className="text-green-400">
                          ❤️ HP: {warrior.hp}/{warrior.maxHp}
                        </p>
                        <p className="text-purple-400">📈 經驗: {warrior.experience}/100</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}