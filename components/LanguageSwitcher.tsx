"use client";

import { useLanguage } from "../contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
      <button
        onClick={() => setLanguage("zh")}
        className={`px-3 py-1 rounded transition ${
          language === "zh"
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:text-white"
        }`}
      >
        中文
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded transition ${
          language === "en"
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
