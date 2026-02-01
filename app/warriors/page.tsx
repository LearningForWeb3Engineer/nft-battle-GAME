"use client";

import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { readContract } from "thirdweb";
import { battleNFTContract } from "../../contracts";
import CustomConnectButton from "../../components/CustomConnectButton";
import LoadingSpinner from "../../components/LoadingSpinner";
import Link from "next/link";

export default function WarriorsPage() {
  const account = useActiveAccount();
  const [warriors, setWarriors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

const loadWarriors = async () => {
    if (!account) return;
    
    setLoading(true);
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
      loadWarriors();
    }
  }, [account]);

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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-white">我的戰士</h2>
          <button
            onClick={loadWarriors}
            disabled={loading}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            {loading && <LoadingSpinner size="sm" />}
            {loading ? "載入中..." : "重新整理"}
          </button>
        </div>

        {/* 統計卡片 */}
        {warriors.length > 0 && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg">
              <div className="text-3xl mb-2">🎴</div>
              <div className="text-2xl font-bold text-white">{warriors.length}</div>
              <div className="text-blue-200">總戰士數</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-6 rounded-lg">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-white">
                {Math.max(...warriors.map(w => w.level))}
              </div>
              <div className="text-yellow-200">最高等級</div>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-white">
                {warriors.reduce((sum, w) => sum + w.wins, 0)}
              </div>
              <div className="text-green-200">總勝場</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-white">
                {warriors.reduce((sum, w) => sum + w.wins, 0) + warriors.reduce((sum, w) => sum + w.losses, 0) > 0
                  ? Math.round((warriors.reduce((sum, w) => sum + w.wins, 0) / (warriors.reduce((sum, w) => sum + w.wins, 0) + warriors.reduce((sum, w) => sum + w.losses, 0))) * 100)
                  : 0}%
              </div>
              <div className="text-purple-200">總勝率</div>
            </div>
          </div>
        )}

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
            <a
              href="/game"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition inline-block"
            >
              去鑄造戰士
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {warriors.map((warrior) => (
              <div
                key={warrior.tokenId}
                className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">
                    戰士 #{warrior.tokenId}
                  </h3>
                  <span className="text-yellow-400 font-bold">
                    Lv.{warrior.level}
                  </span>
                </div>

                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>⚔️ 攻擊力：</span>
                    <span className="font-bold text-red-400">{warrior.attack}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🛡️ 防禦力：</span>
                    <span className="font-bold text-blue-400">{warrior.defense}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>❤️ 生命值：</span>
                    <span className="font-bold text-green-400">
                      {warrior.hp}/{warrior.maxHp}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>📈 經驗值：</span>
                    <span className="font-bold">{warrior.experience}/100</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-700">
                    <span>🏆 戰績：</span>
                    <span className="font-bold">
                      <span className="text-green-400">{warrior.wins}勝</span>
                      {" "}
                      <span className="text-red-400">{warrior.losses}敗</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>📊 勝率：</span>
                    <span className="font-bold text-yellow-400">
                      {warrior.wins + warrior.losses > 0
                        ? Math.round((warrior.wins / (warrior.wins + warrior.losses)) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>

                {/* 經驗值進度條 */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>經驗值</span>
                    <span>{warrior.experience}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${warrior.experience}%` }}
                    ></div>
                  </div>
                </div>

                {/* HP 進度條 */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>生命值</span>
                    <span>{warrior.hp}/{warrior.maxHp}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        warrior.hp / warrior.maxHp > 0.5
                          ? "bg-green-500"
                          : warrior.hp / warrior.maxHp > 0.25
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${(warrior.hp / warrior.maxHp) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <Link href="/game">
                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
                    前往戰鬥
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}