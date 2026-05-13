# 旅遊書資料驅動架構

每份行程現在都是一個自包含資料包：

```text
data/
  trips.json
  fukuoka/
    trip.json
    images/
```

- `data/trips.json`：總目錄，維護每本旅遊書的 `id`、標題、封面、標籤與資料路徑。
- `data/fukuoka/trip.json`：福岡旅遊書資料，維護 hero、每日行程、景點、modal、美食與來源。
- `data/fukuoka/images/`：福岡旅遊書使用的所有圖片。

外層不再使用共用 `images/` 資料夾。之後新增其他目的地時，請建立自己的行程資料夾，例如 `data/tokyo/images/`。

## 本機預覽

外部 JSON 需要透過本機伺服器載入：

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

總目錄：

```text
http://127.0.0.1:8000/
```

指定行程：

```text
http://127.0.0.1:8000/?trip=fukuoka
```

## 新增另一個城市

1. 建立資料夾，例如 `data/tokyo/`。
2. 在裡面放 `trip.json` 與 `images/`。
3. 在 `trip.json` 的 `meta.id` 設定唯一 ID，例如 `tokyo`。
4. 所有本機圖片路徑使用完整相對路徑，例如 `data/tokyo/images/tokyo-cover.jpg`。
5. 到 `data/trips.json` 的 `trips` 陣列新增一筆：

```json
{
  "id": "tokyo",
  "title": "東京五天四夜城市導覽手冊",
  "subtitle": "東京・上野・淺草・澀谷・橫濱",
  "description": "一段簡短行程描述。",
  "data": "data/tokyo/trip.json",
  "image": "data/tokyo/images/tokyo-cover.jpg",
  "days": 5,
  "nights": 4,
  "base": "東京站周邊",
  "tags": ["城市", "文化", "美食"],
  "actionLabel": "打開東京行程"
}
```

之後就能用 `http://127.0.0.1:8000/?trip=tokyo` 讀取新的旅遊書。
