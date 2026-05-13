# 旅遊書 React Block 架構

這是一個純靜態 React 旅遊書網站。資料由 JSON 驅動，頁面由固定旅遊書 section 與語意 block 組成，build 後的 `dist/` 可以直接部署到 Cloudflare R2、S3、GitHub Pages 等靜態空間。

## 技術架構

- Vite + React + TypeScript
- TanStack Router hash routing
- Zod runtime schema validation
- Tailwind CSS + theme CSS variables
- shadcn/ui 風格本地元件，包含 Radix Dialog

## 本機開發

```bash
npm install
npm run dev
```

目錄頁：

```text
http://127.0.0.1:5173/
```

指定旅遊書：

```text
http://127.0.0.1:5173/#/trip/fukuoka
```

元件展示旅遊書：

```text
http://127.0.0.1:5173/#/trip/component-demo
```

## 靜態部署

```bash
npm run build
```

把 `dist/` 內容上傳到靜態空間即可。第一版使用 hash routing，例如：

```text
https://example.com/index.html#/trip/fukuoka
```

因此 object storage 不需要 rewrite fallback。

## 資料結構

每本旅遊書使用 `schemaVersion: 2`，不支援舊格式。

```text
public/
  data/
    trips.json
    fukuoka/
      trip.json
      images/
```

`trip.json` 的最高層固定為：

```text
meta
theme
content.entities[]
sections[]
```

`sections[]` 固定使用旅遊書章節：

```text
cover
overview
preparation
days
sources
```

餐廳、飯店、車站與景點都作為 `content.entities[]`，在每日 `recommendedStops` 清單中穿插呈現；不再使用獨立 `foodPlan` block。

每個 section 內部都由 `blocks[]` 驅動。`days` section 另外包含 `days[]`，每一天也由自己的 `blocks[]` 決定內容順序。

## Block 原則

JSON 使用旅遊語意命名，而不是 UI 元件命名。

例如：

```json
{
  "type": "dailySchedule",
  "data": {
    "title": "時間配置",
    "table": {
      "headers": ["時段", "安排"],
      "rows": []
    }
  }
}
```

目前已實作的 block：

- `coverHero`
- `guideIntro`
- `tripOverview`
- `travelPreparation`
- `videoFeature`
- `dailyRoute`
- `dayMedia`
- `callout`
- `dailySchedule`
- `recommendedStops`
- `detailsNote`
- `sourceList`
- `guideFooter`

## Entities

可重複使用的景點、餐廳、車站、自然區域等內容放在：

```json
{
  "content": {
    "entities": []
  }
}
```

block 透過 `entityId` 引用 entity。第一版 Zod 只做資料 shape validation，尚未做 cross-reference validation。

Entity detail 可使用 `videos[]` 在 modal 中嵌入 YouTube：

```json
{
  "detail": {
    "videos": [
      {
        "provider": "youtube",
        "url": "https://www.youtube.com/watch?v=...",
        "title": "影片標題"
      }
    ]
  }
}
```

Entity 也可加入 `address`，卡片與 modal 會顯示可點擊地址，手機上會依平台嘗試開啟地圖 App：

```json
{
  "address": {
    "label": "地址",
    "text": "福岡県福岡市博多区博多駅中央街1-1",
    "query": "Hakata Station, Fukuoka"
  }
}
```
