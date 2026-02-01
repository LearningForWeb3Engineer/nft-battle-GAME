"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "zh" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  zh: {
    // 導航
    "nav.home": "首頁",
    "nav.game": "遊戲大廳",
    "nav.warriors": "我的戰士",
    "nav.history": "戰鬥統計",
    "nav.leaderboard": "排行榜",

    // 首頁
    "home.title": "NFT 戰鬥遊戲",
    "home.subtitle": "鑄造你的戰士，升級屬性，挑戰強敵！",
    "home.feature1.title": "鑄造戰士",
    "home.feature1.desc": "隨機生成獨特屬性的戰士 NFT",
    "home.feature2.title": "戰鬥競技",
    "home.feature2.desc": "挑戰 NPC，贏得經驗值升級",
    "home.feature3.title": "成長系統",
    "home.feature3.desc": "累積經驗，提升戰士能力",
    "home.startGame": "開始遊戲",
    "home.viewLeaderboard": "查看排行榜",

    // 遊戲大廳
    "game.title": "遊戲大廳",
    "game.connectWallet": "請先連接錢包開始遊戲",
    "game.mint.title": "鑄造戰士",
    "game.mint.desc": "花費 0.0001 ETH 鑄造一個隨機屬性的戰士 NFT",
    "game.mint.button": "鑄造戰士",
    "game.mint.minting": "鑄造中...",
    "game.battle.title": "戰鬥競技",
    "game.battle.desc": "挑戰 NPC，贏得經驗值！",
    "game.battle.warriorId": "戰士 ID",
    "game.battle.difficulty": "難度",
    "game.battle.easy": "簡單",
    "game.battle.normal": "普通",
    "game.battle.hard": "困難",
    "game.battle.button": "開始戰鬥！",
    "game.battle.battling": "戰鬥中...",
    "game.warriors.title": "我的戰士",
    "game.warriors.refresh": "重新整理",
    "game.warriors.loading": "載入中...",
    "game.warriors.empty": "還沒有戰士，先去鑄造一個吧！",

    // 我的戰士
    "warriors.title": "我的戰士",
    "warriors.stats.total": "總戰士數",
    "warriors.stats.maxLevel": "最高等級",
    "warriors.stats.totalWins": "總勝場",
    "warriors.stats.winRate": "總勝率",
    "warriors.connectWallet": "請先連接錢包",
    "warriors.empty": "你還沒有戰士",
    "warriors.goMint": "去鑄造戰士",
    "warriors.goToBattle": "前往戰鬥",
    "warriors.attack": "攻擊力",
    "warriors.defense": "防禦力",
    "warriors.hp": "生命值",
    "warriors.exp": "經驗值",
    "warriors.record": "戰績",
    "warriors.wins": "勝",
    "warriors.losses": "敗",

    // 戰鬥統計
    "history.title": "戰鬥統計",
    "history.subtitle": "查看你所有戰士的戰鬥記錄",
    "history.totalBattles": "總戰鬥數",
    "history.totalWins": "總勝場",
    "history.totalLosses": "總敗場",
    "history.overallWinRate": "總勝率",
    "history.details": "戰士戰績詳情",
    "history.hint": "提示：合約未存儲詳細戰鬥歷史記錄，此頁面顯示當前累積統計數據",

    // 排行榜
    "leaderboard.title": "戰士排行榜",
    "leaderboard.subtitle": "按等級排序，相同等級按勝場排序",
    "leaderboard.rank": "排名",
    "leaderboard.warriorId": "戰士 ID",
    "leaderboard.owner": "持有者",
    "leaderboard.level": "等級",
    "leaderboard.attack": "攻擊",
    "leaderboard.defense": "防禦",
    "leaderboard.record": "戰績",
    "leaderboard.winRate": "勝率",
    "leaderboard.showing": "顯示前 20 名戰士 • 總共",
    "leaderboard.warriors": "個戰士",
    "leaderboard.empty": "還沒有戰士數據",

    // 戰鬥結果
    "battle.result.victory": "勝利！",
    "battle.result.defeat": "失敗！",
    "battle.result.warrior": "戰士",
    "battle.result.battleResult": "的戰鬥結果",
    "battle.result.expGained": "獲得經驗值：",
    "battle.result.levelUp": "等級提升：",
    "battle.result.confirm": "確定",

    // 通用
    "common.level": "等級",
    "common.warrior": "戰士",
    "common.loading": "載入中...",
    "common.refresh": "重新整理",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.game": "Game Hall",
    "nav.warriors": "My Warriors",
    "nav.history": "Battle Stats",
    "nav.leaderboard": "Leaderboard",

    // Home
    "home.title": "NFT Battle Game",
    "home.subtitle": "Mint your warriors, upgrade stats, challenge enemies!",
    "home.feature1.title": "Mint Warriors",
    "home.feature1.desc": "Generate unique warrior NFTs with random attributes",
    "home.feature2.title": "Battle Arena",
    "home.feature2.desc": "Challenge NPCs and gain experience to level up",
    "home.feature3.title": "Growth System",
    "home.feature3.desc": "Accumulate experience and enhance warrior abilities",
    "home.startGame": "Start Game",
    "home.viewLeaderboard": "View Leaderboard",

    // Game Hall
    "game.title": "Game Hall",
    "game.connectWallet": "Please connect your wallet to start",
    "game.mint.title": "Mint Warrior",
    "game.mint.desc": "Mint a warrior NFT with random attributes for 0.0001 ETH",
    "game.mint.button": "Mint Warrior",
    "game.mint.minting": "Minting...",
    "game.battle.title": "Battle Arena",
    "game.battle.desc": "Challenge NPCs and earn experience!",
    "game.battle.warriorId": "Warrior ID",
    "game.battle.difficulty": "Difficulty",
    "game.battle.easy": "Easy",
    "game.battle.normal": "Normal",
    "game.battle.hard": "Hard",
    "game.battle.button": "Start Battle!",
    "game.battle.battling": "Battling...",
    "game.warriors.title": "My Warriors",
    "game.warriors.refresh": "Refresh",
    "game.warriors.loading": "Loading...",
    "game.warriors.empty": "No warriors yet, go mint one!",

    // My Warriors
    "warriors.title": "My Warriors",
    "warriors.stats.total": "Total Warriors",
    "warriors.stats.maxLevel": "Max Level",
    "warriors.stats.totalWins": "Total Wins",
    "warriors.stats.winRate": "Win Rate",
    "warriors.connectWallet": "Please connect your wallet",
    "warriors.empty": "You don't have any warriors yet",
    "warriors.goMint": "Go Mint Warrior",
    "warriors.goToBattle": "Go to Battle",
    "warriors.attack": "Attack",
    "warriors.defense": "Defense",
    "warriors.hp": "HP",
    "warriors.exp": "Experience",
    "warriors.record": "Record",
    "warriors.wins": "W",
    "warriors.losses": "L",

    // Battle History
    "history.title": "Battle Statistics",
    "history.subtitle": "View battle records of all your warriors",
    "history.totalBattles": "Total Battles",
    "history.totalWins": "Total Wins",
    "history.totalLosses": "Total Losses",
    "history.overallWinRate": "Overall Win Rate",
    "history.details": "Warrior Battle Details",
    "history.hint": "Note: The contract doesn't store detailed battle history. This page shows current cumulative statistics.",

    // Leaderboard
    "leaderboard.title": "Warrior Leaderboard",
    "leaderboard.subtitle": "Sorted by level, then by wins",
    "leaderboard.rank": "Rank",
    "leaderboard.warriorId": "Warrior ID",
    "leaderboard.owner": "Owner",
    "leaderboard.level": "Level",
    "leaderboard.attack": "Attack",
    "leaderboard.defense": "Defense",
    "leaderboard.record": "Record",
    "leaderboard.winRate": "Win Rate",
    "leaderboard.showing": "Showing top 20 warriors • Total",
    "leaderboard.warriors": "warriors",
    "leaderboard.empty": "No warrior data yet",

    // Battle Result
    "battle.result.victory": "Victory!",
    "battle.result.defeat": "Defeat!",
    "battle.result.warrior": "Warrior",
    "battle.result.battleResult": "Battle Result",
    "battle.result.expGained": "Experience Gained:",
    "battle.result.levelUp": "Level Up:",
    "battle.result.confirm": "Confirm",

    // Common
    "common.level": "Level",
    "common.warrior": "Warrior",
    "common.loading": "Loading...",
    "common.refresh": "Refresh",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("zh");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.zh] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
