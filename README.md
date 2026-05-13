# Travel Guidebook React Block System

這個專案是一個純靜態 React 旅遊書系統。內容由 JSON 驅動，React 只負責依照 `sections[]`、`days[]`、`blocks[]` 和 `content.entities[]` render 旅遊書。

這份文件主要給下一次接手的 AI agent 使用：如果要規劃新行程、修改現有旅遊書、增加景點、增加新 block，請先讀完這份 README。

## Current Stack

- Vite + React + TypeScript
- TanStack Router，使用 hash routing，可部署到 Cloudflare R2 / S3 這種純靜態空間
- Zod runtime validation，JSON 載入後會檢查 schema shape
- Tailwind CSS v4 + CSS variables theme
- shadcn/ui 風格本地元件，Dialog 底層使用 Radix Dialog

## Local Commands

```bash
npm install
npm run dev
npm run build
```

本機網址：

```text
Catalog:
http://127.0.0.1:5173/#/

Fukuoka guide:
http://127.0.0.1:5173/#/trip/fukuoka

Component demo guide:
http://127.0.0.1:5173/#/trip/component-demo
```

靜態部署：

```bash
npm run build
```

上傳 `dist/` 到靜態 hosting。URL 使用 hash route，例如：

```text
https://example.com/index.html#/trip/fukuoka
```

不需要 server rewrite。

## Important Paths

資料：

```text
public/data/trips.json
public/data/fukuoka/trip.json
public/data/fukuoka/images/
public/data/component-demo/trip.json
```

Schema：

```text
src/schema/common.ts
src/schema/entity.ts
src/schema/blocks.ts
src/schema/trip.ts
```

Block components：

```text
src/blocks/
```

Shared primitives：

```text
src/components/primitives/
src/components/ui/
```

Page templates and routing：

```text
src/templates/CatalogPage.tsx
src/templates/TravelGuidePage.tsx
src/router.tsx
```

Style and theme tokens：

```text
src/styles.css
```

## Data Model

每本旅遊書使用 `schemaVersion: 2`。不支援舊版 `welcome/prep/overview/days/food` 固定欄位格式。

一本旅遊書的資料形狀：

```json
{
  "schemaVersion": 2,
  "template": "travelGuide",
  "theme": "guidebookWarm",
  "meta": {},
  "content": {
    "entities": []
  },
  "sections": []
}
```

`sections[]` 是資料分組，不一定等於視覺上的卡片。現在視覺 session 以「section block」或「day」為單位：

```text
coverHero = 封面，不包 session card
guideIntro = 歡迎 / 導讀 session
tripOverview = 旅程概覽 session
travelPreparation = 行前準備 session
each day = Day 1 / Day 2 / Day 3 session
sourceList = 資料來源 session
```

目前旅遊書常用 sections：

```text
cover
overview
preparation
days
sources
```

`days` section 裡面可以有 `days[]`。每一天也有自己的 `blocks[]`，順序完全由 JSON 決定。

## Catalog

總目錄資料在：

```text
public/data/trips.json
```

新增一本旅遊書時：

1. 建立 `public/data/<trip-id>/trip.json`
2. 建立 `public/data/<trip-id>/images/`
3. 在 `public/data/trips.json` 的 `trips[]` 加一筆：

```json
{
  "id": "tokyo",
  "title": "東京五天四夜城市導覽手冊",
  "subtitle": "上野・淺草・澀谷・橫濱",
  "description": "一段簡短描述。",
  "data": "data/tokyo/trip.json",
  "image": "data/tokyo/images/cover.jpg",
  "imageAlt": "東京旅遊書封面",
  "days": 5,
  "nights": 4,
  "base": "東京站周邊",
  "updated": "2026-05-13",
  "tags": ["城市", "文化", "美食"],
  "actionLabel": "打開東京行程"
}
```

Catalog card 整張可點擊，不需要額外 CTA button。

## Entities

景點、餐廳、車站、飯店、自然區域、商業設施都應該放在：

```json
{
  "content": {
    "entities": []
  }
}
```

不要把完整景點介紹直接塞進 day block。Day block 應該引用 `entityId`。

Entity example：

```json
{
  "id": "hakata-station",
  "type": "station",
  "title": "博多站",
  "subtitle": "九州旅行的交通玄關",
  "image": {
    "src": "data/fukuoka/images/hakata-station.jpg",
    "alt": "博多站"
  },
  "address": {
    "label": "地址",
    "text": "福岡県福岡市博多区博多駅中央街1-1",
    "query": "Hakata Station, Fukuoka"
  },
  "tags": ["交通樞紐", "住宿基地"],
  "summary": [
    "短摘要，會出現在列表卡片中。"
  ],
  "detail": {
    "kicker": "Day 1 · 深度景點介紹",
    "videos": [],
    "gallery": [],
    "paragraphs": [
      "Modal 裡的長文內容。"
    ],
    "side": {
      "title": "為什麼要看這裡",
      "body": "側欄說明。",
      "pointsTitle": "現場觀察重點",
      "points": ["重點一", "重點二"]
    }
  }
}
```

Recommended entity `type` values：

```text
station
place
restaurant
hotel
lodging
nature
commercial
```

`recommendedStops` 會用 entity type 顯示不同顏色 label。顏色 token 在 `src/styles.css`。

## Address

Entity 可以有 `address`。卡片和 modal 都會顯示可點擊地址。手機上會嘗試打開預設地圖 App。

```json
{
  "address": {
    "label": "地址",
    "text": "福岡県太宰府市宰府4丁目7-1",
    "query": "Dazaifu Tenmangu"
  }
}
```

欄位：

```text
label: 顯示用標籤，例如 地址 / 搜尋
text: 使用者看到的地址文字
query: 地圖搜尋 query，可比 text 更適合搜尋
lat/lng: 可選，若有座標會優先用座標
```

Implementation:

```text
src/components/primitives/AddressLink.tsx
```

## Modal URL State

景點詳細介紹 modal 由 TanStack Router search params 控制。

URL example：

```text
/#/trip/fukuoka?scope=day3&entity=mojiko
```

參數：

```text
scope: 目前在哪個範圍，通常是 day id，例如 day1 / day2 / day3
entity: 目前打開的 entity id
```

行為：

- 點擊 `recommendedStops` 卡片會更新 URL 並打開 modal。
- 重新整理頁面會依照 `scope/entity` 自動打開 modal。
- 關閉 modal 會清掉 `scope/entity`。
- 桌面版 modal 會顯示上一個 / 下一個按鈕。
- 上一個 / 下一個只在同一個 `scope` 的 `recommendedStops` 裡切換。

Implementation:

```text
src/router.tsx
src/templates/TravelGuidePage.tsx
src/components/primitives/EntityDialog.tsx
src/blocks/DayBlocks.tsx
```

## YouTube Video

YouTube 使用共用 primitive：

```text
src/components/primitives/YouTubeEmbed.tsx
```

外層 block 可以用 `videoFeature`：

```json
{
  "type": "videoFeature",
  "data": {
    "kicker": "Video Guide",
    "title": "福岡城市印象影片",
    "note": "一段說明。",
    "video": {
      "provider": "youtube",
      "url": "https://www.youtube.com/watch?v=_VZv_Z9Aey4",
      "title": "福岡介紹影片",
      "caption": "YouTube 影片嵌入示範。"
    }
  }
}
```

導讀 block `guideIntro` 也可以直接放影片，適合目的地導覽影片：

```json
{
  "type": "guideIntro",
  "data": {
    "kicker": "Welcome",
    "title": "歡迎來到福岡",
    "body": "導讀文字。",
    "video": {
      "provider": "youtube",
      "url": "https://www.youtube.com/watch?v=_VZv_Z9Aey4",
      "title": "福岡介紹影片"
    },
    "maps": []
  }
}
```

Modal 內影片放在 `entity.detail.videos[]`：

```json
{
  "detail": {
    "videos": [
      {
        "provider": "youtube",
        "url": "https://www.youtube.com/watch?v=LIEI0dM2oNw",
        "title": "牛腸鍋介紹影片"
      }
    ]
  }
}
```

## Blocks / Components

JSON 使用旅遊語意命名，不使用 `cardGrid`、`twoColumnLayout` 這種 UI 命名。React component 可以重用 UI primitives，但資料層應該描述「內容用途」。

### `coverHero`

Path:

```text
src/blocks/CoverHeroBlock.tsx
```

用途：旅遊書封面。通常只放在 `sections[].id === "cover"`。

Data:

```json
{
  "type": "coverHero",
  "data": {
    "eyebrow": "FUKUOKA 5 DAYS GUIDE",
    "title": ["福岡五天四夜", "城市導覽手冊"],
    "lead": "封面導語。",
    "image": "data/fukuoka/images/cover.jpg",
    "meta": ["基地：博多站周邊"]
  }
}
```

### `guideIntro`

Path:

```text
src/blocks/GuideIntroBlock.tsx
```

用途：目的地歡迎、定位、閱讀方式、地圖或影片導覽。現在它會成為一張獨立 visual session。

支援：

```text
kicker / title / body
video
maps
```

### `tripOverview`

Path:

```text
src/blocks/TripOverviewBlock.tsx
```

用途：旅程總覽、交通節奏、每日概要、摘要卡。可放表格和卡片。

適合內容：

```text
每日節奏表
交通方向表
旅行策略 cards
```

### `travelPreparation`

Path:

```text
src/blocks/TravelPreparationBlock.tsx
```

用途：行前準備、訂位提醒、攜帶物、天氣策略、交通卡等。

支援：

```text
cards
checklist table
```

### `videoFeature`

Path:

```text
src/blocks/VideoFeatureBlock.tsx
```

用途：獨立影片 section。若影片是目的地導讀，優先放進 `guideIntro.data.video`；若影片是某個專題、交通教學或餐廳介紹，才使用 `videoFeature`。

### `dailyRoute`

Path:

```text
src/blocks/DayBlocks.tsx
```

用途：一天的路線麵包屑 / stop trail。

Data:

```json
{
  "type": "dailyRoute",
  "data": {
    "stops": ["博多", "小倉城", "門司港"]
  }
}
```

### `dayMedia`

Path:

```text
src/blocks/DayBlocks.tsx
```

用途：一天的主圖 + Google Maps embed。

Data:

```json
{
  "type": "dayMedia",
  "data": {
    "image": {
      "src": "data/fukuoka/images/mojiko-retro.webp",
      "alt": "門司港"
    },
    "mapEmbed": "https://www.google.com/maps?q=...&output=embed",
    "mapLabel": "Day 3 地圖"
  }
}
```

### `callout`

Path:

```text
src/blocks/DayBlocks.tsx
```

用途：提醒、今日重點、雨天判斷、不要踩雷的說明。

### `dailySchedule`

Path:

```text
src/blocks/DayBlocks.tsx
```

用途：每日時間配置 table。現在不顯示額外標題，也不包外框；table 本身就是視覺單位。

Data:

```json
{
  "type": "dailySchedule",
  "data": {
    "table": {
      "headers": ["時段", "安排"],
      "rows": [
        ["上午", "前往景點。"]
      ]
    }
  }
}
```

### `recommendedStops`

Path:

```text
src/blocks/DayBlocks.tsx
```

用途：一天內的景點、商店、車站、餐廳、飯店混排清單。這是最核心的 day content block。

Important:

- `items[].entityId` 應該引用 `content.entities[]`
- `interaction: "dialog"` 時，點卡片會更新 URL 並開 modal
- `interaction: "none"` 時，只顯示靜態卡片
- 可以用 `title`、`description`、`image` 覆蓋 entity 預設顯示
- 餐廳不要用獨立 food section，請直接放進 `recommendedStops`

Example:

```json
{
  "type": "recommendedStops",
  "data": {
    "interaction": "dialog",
    "items": [
      {
        "entityId": "kushida",
        "title": "櫛田神社：博多的地方信仰核心",
        "description": "這一天的文化重點。",
        "meta": ["停留：30–45 分鐘"]
      },
      {
        "entityId": "牛腸鍋",
        "title": "牛腸鍋：Day 3 晚餐",
        "meta": ["餐廳 / 晚餐"]
      }
    ]
  }
}
```

### `detailsNote`

Path:

```text
src/blocks/DayBlocks.tsx
```

用途：可收合補充說明，例如雨天備案、為什麼這樣排、親子提醒。

### `sourceList`

Path:

```text
src/blocks/SourceListBlock.tsx
```

用途：資料來源與圖片來源。預設收起，使用者可展開。

### `guideFooter`

Path:

```text
src/blocks/GuideFooterBlock.tsx
```

用途：旅遊書底部備註。可選。

## Shared Components

這些不是 JSON block，但 block 會使用它們：

```text
src/components/primitives/SectionHeader.tsx
```

通用 section header。固定單欄：kicker、title、description。不要改回左右分欄，長中文標題會很難看。

```text
src/components/primitives/RouteTrail.tsx
```

路線 chip trail。

```text
src/components/primitives/EntityDialog.tsx
```

Entity modal。支援 URL state、自動打開、桌面上一個 / 下一個。

```text
src/components/primitives/AddressLink.tsx
```

可點地址，手機開地圖。

```text
src/components/primitives/YouTubeEmbed.tsx
```

YouTube iframe，使用 `youtube-nocookie.com`。

```text
src/components/ui/
```

shadcn/ui 風格本地基礎元件：Button、Card、Badge、Dialog、Table。

## How To Add A New Day

在 `public/data/<trip-id>/trip.json` 找到 `sections[].id === "days"`，新增一個 day：

```json
{
  "id": "day6",
  "number": "Day 6",
  "navLabel": "Day 6",
  "title": "最後採買與返程",
  "tagline": "今日主題：低壓收尾。",
  "blocks": [
    {
      "type": "dailyRoute",
      "data": {
        "stops": ["飯店", "商店街", "機場"]
      }
    },
    {
      "type": "dailySchedule",
      "data": {
        "table": {
          "headers": ["時段", "安排"],
          "rows": [["上午", "退房寄放行李。"]]
        }
      }
    },
    {
      "type": "recommendedStops",
      "data": {
        "interaction": "dialog",
        "items": []
      }
    }
  ]
}
```

如果 day 裡需要新增景點，請先在 `content.entities[]` 新增 entity，再在 `recommendedStops.items[]` 引用它。

## How To Add A New Block Type

1. 在 `src/schema/blocks.ts` 新增 Zod schema。
2. 在 `src/blocks/` 新增 React component。
3. 在 `src/blocks/registry.tsx` 註冊。
4. 在 `public/data/component-demo/trip.json` 加一個 demo。
5. 更新 README 的 Blocks / Components 區段。
6. 跑：

```bash
npm run build
```

## Agent Editing Rules

- 優先修改 JSON，不要硬寫內容到 React component。
- 新景點、餐廳、飯店、車站先建 entity，再由 block 引用。
- 圖片路徑使用 build 後可用的 public path，例如 `data/fukuoka/images/foo.jpg`。
- 不要新增舊格式資料欄位，例如 `welcome`、`prep`、`food`。
- 餐廳與食物安排應放進每日 `recommendedStops`，不要新增獨立 `foodPlan`。
- 長文深度介紹放在 `entity.detail.paragraphs`。
- 外層行程敘事放在 blocks。
- 每次改完資料或 schema 都跑 `npm run build`。
