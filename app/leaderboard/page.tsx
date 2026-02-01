"use client";

import { useState, useEffect } from "react";
import { readContract } from "thirdweb";
import { battleNFTContract } from "../../contracts";
import CustomConnectButton from "../../components/CustomConnectButton";
import LoadingSpinner from "../../components/LoadingSpinner";
import Link from "next/link";

interface WarriorData {
  tokenId: number;
  owner: string;
  attack: number;
  defense: number;
  level: number;
  wins: number;
  losses: number;
  winRate: number;
  totalBattles: number;
}

export default function LeaderboardPage() {
  const [warriors, setWarriors] = useState<WarriorData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAllWarriors = async () => {
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

          const warrior: any = await readContract({
            contract: battleNFTContract,
            method: "function getWarrior(uint256) view returns (uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)",
            params: [BigInt(i)],
          });

          const wins = Number(warrior[6]);
          const losses = Number(warrior[7]);
          const totalBattles = wins + losses;

          warriorsList.push({
            tokenId: i,
            owner,
            attack: Number(warrior[0]),
            defense: Number(warrior[1]),
            level: Number(warrior[4]),
            wins,
            losses,
            winRate: totalBattles > 0 ? (wins / totalBattles) * 100 : 0,
            totalBattles,
          });
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
    loadAllWarriors();
  }, []);

  // 按等級排序,相同等級按勝場排序
  const sortedWarriors = [...warriors].sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    return b.wins - a.wins;
  });

  const getMedalEmoji = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <nav className="flex justify-between items-center p-6 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-white">⚔️ Battle Warriors</h1>
        <CustomConnectButton />
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">🏆 戰士排行榜</h2>
            <p className="text-gray-400">按等級排序，相同等級按勝場排序</p>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition">
              首頁
            </Link>
            <Link href="/game" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition">
              遊戲大廳
            </Link>
            <Link href="/warriors" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition">
              我的戰士
            </Link>
            <Link href="/history" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition">
              戰鬥統計
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : warriors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-300">還沒有戰士數據</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300 font-bold">排名</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-bold">戰士 ID</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-bold">持有者</th>
                  <th className="px-6 py-4 text-center text-gray-300 font-bold">等級</th>
                  <th className="px-6 py-4 text-center text-gray-300 font-bold">攻擊</th>
                  <th className="px-6 py-4 text-center text-gray-300 font-bold">防禦</th>
                  <th className="px-6 py-4 text-center text-gray-300 font-bold">戰績</th>
                  <th className="px-6 py-4 text-center text-gray-300 font-bold">勝率</th>
                </tr>
              </thead>
              <tbody>
                {sortedWarriors.slice(0, 20).map((warrior, index) => (
                  <tr
                    key={warrior.tokenId}
                    className={`border-t border-gray-700 hover:bg-gray-750 transition ${
                      index < 3 ? "bg-gray-750" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-2xl font-bold">
                        {getMedalEmoji(index)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-bold">
                      #{warrior.tokenId}
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-sm">
                      {warrior.owner.slice(0, 6)}...{warrior.owner.slice(-4)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-yellow-400 font-bold">
                        Lv.{warrior.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-red-400 font-bold">
                      {warrior.attack}
                    </td>
                    <td className="px-6 py-4 text-center text-blue-400 font-bold">
                      {warrior.defense}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-400">{warrior.wins}勝</span>
                      {" "}
                      <span className="text-red-400">{warrior.losses}敗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold ${
                        warrior.winRate >= 70 ? "text-green-400" :
                        warrior.winRate >= 50 ? "text-yellow-400" :
                        warrior.winRate > 0 ? "text-red-400" : "text-gray-500"
                      }`}>
                        {warrior.totalBattles > 0 ? `${Math.round(warrior.winRate)}%` : "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && warriors.length > 0 && (
          <p className="text-center text-gray-400 mt-6">
            顯示前 20 名戰士 • 總共 {warriors.length} 個戰士
          </p>
        )}
      </div>
    </main>
  );
}
