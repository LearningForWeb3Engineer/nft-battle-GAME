"use client";

import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { readContract } from "thirdweb";
import { battleNFTContract } from "../../contracts";
import CustomConnectButton from "../../components/CustomConnectButton";
import LoadingSpinner from "../../components/LoadingSpinner";
import Link from "next/link";

interface WarriorData {
  tokenId: number;
  attack: number;
  defense: number;
  maxHp: number;
  hp: number;
  level: number;
  experience: number;
  wins: number;
  losses: number;
}

export default function HistoryPage() {
  const account = useActiveAccount();
  const [warriors, setWarriors] = useState<WarriorData[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMyWarriors = async () => {
    if (!account) return;

    setLoading(true);
    const warriorsList: WarriorData[] = [];

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
              wins: Number(warrior[6]),
              losses: Number(warrior[7]),
            });
          }
        } catch (e) {
          continue;
        }
      }

      setWarriors(warriorsList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      loadMyWarriors();
    }
  }, [account]);

  const totalBattles = warriors.reduce((sum, w) => sum + w.wins + w.losses, 0);
  const totalWins = warriors.reduce((sum, w) => sum + w.wins, 0);
  const totalLosses = warriors.reduce((sum, w) => sum + w.losses, 0);
  const overallWinRate = totalBattles > 0 ? Math.round((totalWins / totalBattles) * 100) : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <nav className="flex justify-between items-center p-6 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-white">⚔️ Battle Warriors</h1>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-300 hover:text-white transition">
            首頁
          </Link>
          <Link href="/game" className="text-gray-300 hover:text-white transition">
            遊戲大廳
          </Link>
          <Link href="/warriors" className="text-gray-300 hover:text-white transition">
            我的戰士
          </Link>
          <Link href="/leaderboard" className="text-gray-300 hover:text-white transition">
            排行榜
          </Link>
          <CustomConnectButton />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">📜 戰鬥統計</h2>
            <p className="text-gray-400">查看你所有戰士的戰鬥記錄</p>
          </div>
          <button
            onClick={loadMyWarriors}
            disabled={loading}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            {loading && <LoadingSpinner size="sm" />}
            {loading ? "載入中..." : "重新整理"}
          </button>
        </div>

        {!account ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-300">請先連接錢包</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : warriors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-300 mb-6">你還沒有戰士</p>
            <Link href="/game">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition">
                去鑄造戰士
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* 總體統計 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg">
                <div className="text-3xl mb-2">⚔️</div>
                <div className="text-2xl font-bold text-white">{totalBattles}</div>
                <div className="text-blue-200">總戰鬥數</div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-2xl font-bold text-white">{totalWins}</div>
                <div className="text-green-200">總勝場</div>
              </div>
              <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-lg">
                <div className="text-3xl mb-2">❌</div>
                <div className="text-2xl font-bold text-white">{totalLosses}</div>
                <div className="text-red-200">總敗場</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-white">{overallWinRate}%</div>
                <div className="text-purple-200">總勝率</div>
              </div>
            </div>

            {/* 戰士詳細統計 */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="bg-gray-700 px-6 py-4">
                <h3 className="text-xl font-bold text-white">戰士戰績詳情</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-750 border-t border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-300 font-bold">戰士 ID</th>
                      <th className="px-6 py-4 text-center text-gray-300 font-bold">等級</th>
                      <th className="px-6 py-4 text-center text-gray-300 font-bold">攻擊</th>
                      <th className="px-6 py-4 text-center text-gray-300 font-bold">防禦</th>
                      <th className="px-6 py-4 text-center text-gray-300 font-bold">生命值</th>
                      <th className="px-6 py-4 text-center text-gray-300 font-bold">總戰鬥</th>
                      <th className="px-6 py-4 text-center text-gray-300 font-bold">勝場</th>
                      <th className="px-6 py-4 text-center text-gray-300 font-bold">敗場</th>
                      <th className="px-6 py-4 text-center text-gray-300 font-bold">勝率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warriors.map((warrior) => {
                      const battles = warrior.wins + warrior.losses;
                      const winRate = battles > 0 ? Math.round((warrior.wins / battles) * 100) : 0;

                      return (
                        <tr
                          key={warrior.tokenId}
                          className="border-t border-gray-700 hover:bg-gray-750 transition"
                        >
                          <td className="px-6 py-4">
                            <span className="text-white font-bold">#{warrior.tokenId}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-yellow-400 font-bold">Lv.{warrior.level}</span>
                          </td>
                          <td className="px-6 py-4 text-center text-red-400 font-bold">
                            {warrior.attack}
                          </td>
                          <td className="px-6 py-4 text-center text-blue-400 font-bold">
                            {warrior.defense}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`font-bold ${
                              warrior.hp / warrior.maxHp > 0.5 ? "text-green-400" :
                              warrior.hp / warrior.maxHp > 0.25 ? "text-yellow-400" : "text-red-400"
                            }`}>
                              {warrior.hp}/{warrior.maxHp}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-gray-300 font-bold">
                            {battles}
                          </td>
                          <td className="px-6 py-4 text-center text-green-400 font-bold">
                            {warrior.wins}
                          </td>
                          <td className="px-6 py-4 text-center text-red-400 font-bold">
                            {warrior.losses}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`font-bold ${
                              winRate >= 70 ? "text-green-400" :
                              winRate >= 50 ? "text-yellow-400" :
                              winRate > 0 ? "text-red-400" : "text-gray-500"
                            }`}>
                              {battles > 0 ? `${winRate}%` : "-"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                💡 提示：合約未存儲詳細戰鬥歷史記錄，此頁面顯示當前累積統計數據
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
