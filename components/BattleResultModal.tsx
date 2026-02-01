"use client";

interface BattleResultProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    won: boolean;
    experienceGained: number;
    warriorId: number;
    oldLevel: number;
    newLevel: number;
    leveledUp: boolean;
  } | null;
}

export default function BattleResultModal({ isOpen, onClose, result }: BattleResultProps) {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 border-2 border-gray-700 animate-scaleIn">
        {/* 結果標題 */}
        <div className="text-center mb-6">
          <div className={`text-6xl mb-4 animate-bounce ${result.won ? 'animate-victory' : 'animate-defeat'}`}>
            {result.won ? '🎉' : '💔'}
          </div>
          <h2 className={`text-4xl font-bold mb-2 ${result.won ? 'text-green-400' : 'text-red-400'}`}>
            {result.won ? '勝利！' : '失敗！'}
          </h2>
          <p className="text-gray-400">
            戰士 #{result.warriorId} 的戰鬥結果
          </p>
        </div>

        {/* 戰鬥結果詳情 */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">獲得經驗值：</span>
            <span className="text-purple-400 font-bold text-xl">
              +{result.experienceGained} EXP
            </span>
          </div>

          {result.leveledUp && (
            <div className="flex justify-between items-center pt-3 border-t border-gray-700">
              <span className="text-gray-300">等級提升：</span>
              <span className="text-yellow-400 font-bold text-xl">
                Lv.{result.oldLevel} → Lv.{result.newLevel} ⬆️
              </span>
            </div>
          )}
        </div>

        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105"
        >
          確定
        </button>
      </div>
    </div>
  );
}
