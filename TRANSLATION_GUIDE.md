# 語言翻譯實現指南

## 已完成
✅ 首頁 (app/page.tsx) - 完全支持中英文切換
✅ 語言切換組件 (components/LanguageSwitcher.tsx)
✅ 翻譯系統 (contexts/LanguageContext.tsx)

## 如何在其他頁面添加翻譯

### 1. 導入必要的 hooks
```typescript
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function YourPage() {
  const { t } = useLanguage();
  // ... 其他代碼
}
```

### 2. 添加語言切換按鈕到導航欄
在導航欄的 `CustomConnectButton` 之前添加:
```typescript
<LanguageSwitcher />
<CustomConnectButton />
```

### 3. 替換文字為翻譯函數
將硬編碼的中文文字替換為 `t("key")`:

**之前:**
```typescript
<h2>遊戲大廳</h2>
<p>請先連接錢包開始遊戲</p>
```

**之後:**
```typescript
<h2>{t("game.title")}</h2>
<p>{t("game.connectWallet")}</p>
```

## 翻譯鍵值對照表

### 導航
- `nav.home` - 首頁 / Home
- `nav.game` - 遊戲大廳 / Game Hall
- `nav.warriors` - 我的戰士 / My Warriors
- `nav.history` - 戰鬥統計 / Battle Stats
- `nav.leaderboard` - 排行榜 / Leaderboard

### 遊戲大廳 (game/)
- `game.title` - 遊戲大廳
- `game.connectWallet` - 請先連接錢包開始遊戲
- `game.mint.title` - 鑄造戰士
- `game.mint.button` - 鑄造戰士 / 鑄造中...
- `game.battle.title` - 戰鬥競技
- `game.battle.button` - 開始戰鬥 / 戰鬥中...

### 其他頁面
查看 `contexts/LanguageContext.tsx` 中的完整翻譯列表

## 快速模板

```typescript
"use client";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";
// ... 其他 imports

export default function Page() {
  const { t } = useLanguage();

  return (
    <main>
      <nav>
        <h1>⚔️ Battle Warriors</h1>
        <div>
          <Link href="/">{t("nav.home")}</Link>
          <Link href="/game">{t("nav.game")}</Link>
          <LanguageSwitcher />
          <CustomConnectButton />
        </div>
      </nav>

      {/* 使用 t() 函數翻譯所有文字 */}
      <h2>{t("page.title")}</h2>
    </main>
  );
}
```
