"use client";

import CustomConnectButton from "../components/CustomConnectButton";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";
import Link from "next/link";

export default function Home() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* 導航欄 */}
      <nav className="flex justify-between items-center p-6 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-white">⚔️ Battle Warriors</h1>
        <div className="flex items-center gap-4">
          <Link href="/game" className="text-gray-300 hover:text-white transition">
            {t("nav.game")}
          </Link>
          <Link href="/warriors" className="text-gray-300 hover:text-white transition">
            {t("nav.warriors")}
          </Link>
          <Link href="/history" className="text-gray-300 hover:text-white transition">
            {t("nav.history")}
          </Link>
          <Link href="/leaderboard" className="text-gray-300 hover:text-white transition">
            {t("nav.leaderboard")}
          </Link>
          <LanguageSwitcher />
          <CustomConnectButton />
        </div>
      </nav>

      {/* 主要內容 */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">⚔️</div>
          <h2 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t("home.title")}
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            {t("home.subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* 功能卡片 1 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-lg border border-gray-700 hover:border-blue-500 transition transform hover:scale-105 hover:shadow-2xl">
              <div className="text-4xl mb-4">🎴</div>
              <h3 className="text-2xl font-bold text-white mb-4">{t("home.feature1.title")}</h3>
              <p className="text-gray-400">
                {t("home.feature1.desc")}
              </p>
            </div>

            {/* 功能卡片 2 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-lg border border-gray-700 hover:border-red-500 transition transform hover:scale-105 hover:shadow-2xl">
              <div className="text-4xl mb-4">⚔️</div>
              <h3 className="text-2xl font-bold text-white mb-4">{t("home.feature2.title")}</h3>
              <p className="text-gray-400">
                {t("home.feature2.desc")}
              </p>
            </div>

            {/* 功能卡片 3 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-lg border border-gray-700 hover:border-purple-500 transition transform hover:scale-105 hover:shadow-2xl">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-2xl font-bold text-white mb-4">{t("home.feature3.title")}</h3>
              <p className="text-gray-400">
                {t("home.feature3.desc")}
              </p>
            </div>
          </div>

          {/* 快捷按鈕 */}
          <div className="flex gap-4 justify-center mt-16">
            <Link href="/game">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-12 rounded-lg transition transform hover:scale-105">
                {t("home.startGame")} →
              </button>
            </Link>
            <Link href="/leaderboard">
              <button className="bg-gray-700 hover:bg-gray-600 text-white text-xl font-bold py-4 px-12 rounded-lg transition transform hover:scale-105">
                {t("home.viewLeaderboard")} 🏆
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}