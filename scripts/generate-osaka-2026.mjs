import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tripId = "osaka-2026";
const outDir = path.join(root, "public", "data", tripId);
const imageDir = path.join(outDir, "images");
const assetBase = `data/${tripId}/images`;

const sources = [
  ["南海 Rapi:t 數位票", "https://www.nankai.co.jp/en_railway/ticket/rapit"],
  ["關西機場巴士/交通", "https://www.kansai-airport.or.jp/en/access/to-airport/bus"],
  ["大阪城天守閣官方利用案內", "https://www.osakacastle.net/guide/?lang=en"],
  ["大阪天神祭｜OSAKA-INFO", "https://osaka-info.jp/experience/en/osaka/spot/611"],
  ["天神祭｜JNTO", "https://www.japan.travel/en/spot/30/"],
  ["道頓堀｜OSAKA-INFO", "https://osaka-info.jp/experience/en/osaka/spot/201"],
  ["法善寺橫丁｜OSAKA-INFO", "https://www.osaka-info.jp/en/spot/hozenji-yokocho/"],
  ["心齋橋｜OSAKA-INFO", "https://osaka-info.jp/experience/en/osaka/spot/210"],
  ["黑門市場｜OSAKA-INFO", "https://osaka-info.jp/en/spot/kuromon-market/"],
  ["千日前道具屋筋｜OSAKA-INFO", "https://osaka-info.jp/experience/en/osaka/spot/205"],
  ["中之島公園｜OSAKA-INFO", "https://www.osaka-info.jp/en/spot/nakanoshima-park/"],
  ["大阪市中央公會堂｜OSAKA-INFO", "https://osaka-info.jp/experience/en/osaka/spot/259"],
  ["天神橋筋商店街｜OSAKA-INFO", "https://osaka-info.jp/en/spot/tenjimbashisuji-shopping-street/"],
  ["四天王寺｜OSAKA-INFO", "https://osaka-info.jp/experience/en/osaka/spot/286"],
  ["天王寺公園｜OSAKA-INFO", "https://osaka-info.jp/experience/en/osaka/spot/228"],
  ["阿倍野 Harukas｜OSAKA-INFO", "https://osaka-info.jp/experience/en/osaka/spot/376"],
  ["堀江/Orange Street｜OSAKA-INFO", "https://osaka-info.jp/experience/en/osaka/spot/218"],
  ["神戶布引香草園/纜車", "https://www.kobeherb.com/en/"],
  ["神戶港塔", "https://www.kobe-port-tower.com/en/"],
  ["神戶北野異人館｜VISIT KOBE", "https://www.feel-kobe.jp/en/places/central_kobe/"],
  ["神戶元町商店街｜VISIT KOBE", "https://www.feel-kobe.jp/en/attractions/detail_1049.html"],
  ["神戶牛｜VISIT KOBE", "https://www.feel-kobe.jp/en/stories/kobebeef"],
  ["日本氣象廳氣候平年值", "https://www.data.jma.go.jp/stats/data/en/normal/normal.html"],
  ["Osaka Metro 大阪周遊 Pass 2026", "https://subway.osakametro.co.jp/guide/page/20260401_osaka_amazing_pass.php"]
];

const imageSpecs = [
  ["hero-osaka-cover", "File:Dotonbori, Osaka, at night, November 2016.jpg", "夜晚的道頓堀與霓虹招牌"],
  ["dotonbori", "File:Dotonbori Osaka Japan01-r.jpg", "道頓堀白天街景"],
  ["hozenji-yokocho", "File:Hozenji Yokocho at night.jpg", "法善寺橫丁夜間石板巷"],
  ["shinsaibashi", "File:Shinsaibashi-suji Shopping Street 20190201.jpg", "心齋橋筋商店街"],
  ["osaka-castle", "File:Osaka Castle 02bs3200.jpg", "大阪城天守閣"],
  ["nakanoshima-park", "File:Nakanoshima Park in 201411 002.JPG", "中之島公園"],
  ["central-public-hall", "File:Osaka City Central Public Hall-20071015.JPG", "大阪市中央公會堂"],
  ["umeda-sky", "File:Umeda Sky Building, Osaka, November 2016 -01.jpg", "梅田藍天大廈"],
  ["tenjinbashisuji", "File:Tenjinbashisuji shopping street - panoramio.jpg", "天神橋筋商店街"],
  ["kobe-herb-garden", "File:Kobe Nunobiki Herb Garden03n3200.jpg", "神戶布引香草園"],
  ["kitano-kobe", "File:Kitano Street Kobe01s5s4110.jpg", "神戶北野街區"],
  ["meriken-park", "File:Kobe Meriken Park01bs3200.jpg", "神戶美利堅公園"],
  ["kobe-port-tower", "File:Kobe Port Tower and Maritime Museum, November 2016.jpg", "神戶港塔與海洋博物館"],
  ["shitennoji", "File:Shitenno-ji Temple @ Osaka (13382746953).jpg", "四天王寺"],
  ["abeno-harukas", "File:Illuminated Tennōji Park and Abeno Harukas, November 2015, Osaka.jpg", "天王寺公園與阿倍野 Harukas"],
  ["kuromon-market", "File:Kuromon-ichiba in 201408.JPG", "黑門市場"],
  ["doguyasuji", "File:Sennichimae-doguya-suji in 201408.JPG", "千日前道具屋筋"],
  ["takoyaki", "File:Takoyaki by yomi955.jpg", "章魚燒"],
  ["okonomiyaki", "File:Okonomiyaki by Elijah in Osaka.jpg", "大阪燒"],
  ["sushi", "File:Otoro and Chu-Toro sushi - 19 February 2019.jpg", "壽司"],
  ["izakaya", "File:Izakaya in Sendagaya, Shibuya, Tokyo, Japan, 2024 May.jpg", "居酒屋店內"],
  ["kobe-beef", null, "神戶牛鐵板料理"]
];

const places = {
  namba: ["難波站", "Namba Station, Osaka", 34.6663, 135.5002],
  dotonbori: ["道頓堀", "Dotonbori, Chuo Ward, Osaka", 34.6687, 135.5011],
  hozenji: ["法善寺橫丁", "Hozenji Yokocho, Osaka", 34.6675, 135.5027],
  shinsaibashi: ["心齋橋筋商店街", "Shinsaibashi-suji Shopping Street, Osaka", 34.6738, 135.5010],
  osakaCastle: ["大阪城天守閣", "1-1 Osakajo, Chuo Ward, Osaka", 34.6873, 135.5262],
  nakanoshima: ["中之島公園", "1 Nakanoshima, Kita Ward, Osaka", 34.6923, 135.5067],
  publicHall: ["大阪市中央公會堂", "1-1-27 Nakanoshima, Kita Ward, Osaka", 34.6936, 135.5048],
  umedaSky: ["梅田藍天大廈", "1-1-88 Oyodonaka, Kita Ward, Osaka", 34.7052, 135.4907],
  tenma: ["天神橋筋商店街/天滿", "Tenjinbashisuji Shopping Street, Osaka", 34.7042, 135.5110],
  shinKobe: ["新神戶站", "Shin-Kobe Station", 34.7069, 135.1950],
  herb: ["神戶布引香草園/纜車", "Kobe Nunobiki Herb Gardens", 34.7145, 135.1902],
  kitano: ["北野異人館街", "Kitano Ijinkan-gai, Kobe", 34.7009, 135.1897],
  motomachi: ["元町商店街", "Kobe Motomachi Shopping Street", 34.6887, 135.1876],
  meriken: ["美利堅公園", "Meriken Park, Kobe", 34.6825, 135.1898],
  portTower: ["神戶港塔", "Kobe Port Tower", 34.6826, 135.1867],
  shitennoji: ["四天王寺", "1-11-18 Shitennoji, Tennoji Ward, Osaka", 34.6546, 135.5165],
  tennoji: ["天王寺公園", "Tennoji Park, Osaka", 34.6505, 135.5113],
  harukas: ["阿倍野 Harukas", "1-1-43 Abenosuji, Abeno Ward, Osaka", 34.6461, 135.5134],
  horie: ["堀江/Orange Street", "Tachibana-dori Orange Street, Osaka", 34.6717, 135.4920],
  kuromon: ["黑門市場", "2-4-1 Nippombashi, Chuo Ward, Osaka", 34.6654, 135.5061],
  doguyasuji: ["千日前道具屋筋", "Nambasennichimae, Chuo Ward, Osaka", 34.6643, 135.5024],
  kix: ["關西國際機場", "Kansai International Airport", 34.4347, 135.2440]
};

function asset(slug) {
  const spec = imageSpecs.find(([id]) => id === slug);
  return `${assetBase}/${spec?.[3] ?? `${slug}.jpg`}`;
}

function image(slug, alt) {
  return { src: asset(slug), alt };
}

function address(key) {
  const [label, text, lat, lng] = places[key];
  return { label: "位置", text, query: label, lat, lng };
}

function mapQuery(keys) {
  return `https://www.google.com/maps?q=${encodeURIComponent(keys.map((key) => places[key][0]).join(" "))}&output=embed`;
}

function side(title, body, points) {
  return { title, body, pointsTitle: "現場觀察重點", points };
}

function detail(kicker, paragraphs, points, gallery = []) {
  return {
    kicker,
    gallery,
    paragraphs,
    side: side("為什麼要看這裡", paragraphs[0], points)
  };
}

function entity({ id, type = "place", title, subtitle, img, tags = [], summary, detailData, addr, data = {} }) {
  return {
    id,
    type,
    title,
    subtitle,
    image: img,
    tags,
    summary: [summary],
    detail: detailData,
    address: addr,
    data
  };
}

function recommended(items, segments = []) {
  return {
    type: "recommendedStops",
    data: {
      interaction: "dialog",
      segments,
      items: items.map((item) => (typeof item === "string" ? { entityId: item } : item))
    }
  };
}

function dailyRoute(stops, stopTypes, segments) {
  return { type: "dailyRoute", data: { stops, stopTypes, segments } };
}

function dayMedia(img, keys, label) {
  return { type: "dayMedia", data: { image: img, mapEmbed: mapQuery(keys), mapLabel: label } };
}

function schedule(rows) {
  return { type: "dailySchedule", data: { table: { headers: ["時段", "安排", "重點與提醒"], rows } } };
}

function detailsNote(summary, body) {
  return { type: "detailsNote", data: { summary, body } };
}

function callout(label, text) {
  return { type: "callout", data: { label, text } };
}

async function fetchCommonsInfo() {
  const titleMap = new Map();
  for (const [slug, title] of imageSpecs) {
    if (!title) continue;
    titleMap.set(title, slug);
  }
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("titles", imageSpecs.map(([, title]) => title).filter(Boolean).join("|"));
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|mime|extmetadata");
  url.searchParams.set("iiurlwidth", "1600");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  const response = await fetch(url, { headers: { "User-Agent": "travel-guidebook-generator/1.0" } });
  if (!response.ok) throw new Error(`Commons API failed: ${response.status}`);
  const data = await response.json();
  const pages = Object.values(data.query?.pages ?? {});
  const info = new Map();
  for (const page of pages) {
    const slug = titleMap.get(page.title);
    const imageinfo = page.imageinfo?.[0];
    if (!slug || !imageinfo) continue;
    const mime = imageinfo.mime ?? "image/jpeg";
    const ext = mime.includes("png") ? "png" : "jpg";
    info.set(slug, {
      title: page.title,
      source: imageinfo.descriptionurl,
      download: imageinfo.thumburl ?? imageinfo.url,
      ext,
      credit: imageinfo.extmetadata?.Artist?.value?.replace(/<[^>]+>/g, "").trim()
    });
  }
  return info;
}

async function downloadImages() {
  await mkdir(imageDir, { recursive: true });
  const info = await fetchCommonsInfo();

  for (const spec of imageSpecs) {
    const [slug] = spec;
    const item = info.get(slug);
    if (!item) {
      console.warn(`Missing Commons image for ${slug}`);
      spec[3] = `${slug}.svg`;
      await writeFile(path.join(imageDir, spec[3]), placeholderSvg(slug, spec[2]), "utf8");
      continue;
    }
    spec[3] = `${slug}.${item.ext}`;
    spec[4] = item;
    const filePath = path.join(imageDir, spec[3]);
    if (await exists(filePath)) {
      console.log(`Skipped existing ${spec[3]}`);
      continue;
    }
    const response = await fetchWithRetry(item.download, { headers: { "User-Agent": "travel-guidebook-generator/1.0" } });
    await writeFile(filePath, Buffer.from(await response.arrayBuffer()));
    console.log(`Downloaded ${spec[3]}`);
    await sleep(2500);
  }
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, attempts = 4) {
  let lastResponse;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, options);
    if (response.ok) {
      return response;
    }
    lastResponse = response;
    if (response.status !== 429 && response.status < 500) {
      break;
    }
    const retryAfter = Number(response.headers.get("retry-after"));
    await sleep(Number.isFinite(retryAfter) ? retryAfter * 1000 : 5000 * attempt);
  }
  throw new Error(`Failed downloading asset: ${lastResponse?.status ?? "unknown"}`);
}

function placeholderSvg(slug, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <rect width="1200" height="800" fill="#efe8da"/>
  <path d="M80 620 C240 500 320 590 460 470 S760 330 1120 250" fill="none" stroke="#9d5d43" stroke-width="22" opacity=".55"/>
  <circle cx="300" cy="280" r="120" fill="#2f5f68" opacity=".18"/>
  <text x="80" y="120" font-family="system-ui, sans-serif" font-size="58" font-weight="800" fill="#2c2925">${label}</text>
  <text x="84" y="190" font-family="system-ui, sans-serif" font-size="26" fill="#756b60">${slug}</text>
</svg>`;
}

async function writeMaps() {
  const overview = makeMapSvg("大阪 5 天動線總覽", [
    ["KIX", 110, 660],
    ["難波/心齋橋", 490, 435],
    ["大阪城", 620, 340],
    ["梅田/中之島", 520, 260],
    ["神戶", 230, 250],
    ["天王寺", 560, 520]
  ]);
  const clusters = makeMapSvg("每日區域集群", [
    ["Day 1 Minami", 485, 450],
    ["Day 2 Castle/Kita", 560, 300],
    ["Day 3 Kobe", 230, 260],
    ["Day 4 Tennoji/Horie", 540, 540],
    ["Day 5 Namba", 500, 470]
  ]);
  await writeFile(path.join(imageDir, "osaka-overview-map.svg"), overview, "utf8");
  await writeFile(path.join(imageDir, "osaka-day-clusters.svg"), clusters, "utf8");
}

function makeMapSvg(title, pins) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
  <rect width="1200" height="760" rx="36" fill="#f6efe4"/>
  <path d="M132 650 C238 540 328 500 420 430 C520 354 610 252 750 190 C870 136 982 118 1080 92" fill="none" stroke="#2f6f7a" stroke-width="18" opacity=".25"/>
  <path d="M160 188 C330 220 440 280 560 352 S816 490 1040 512" fill="none" stroke="#b45f45" stroke-width="12" opacity=".26"/>
  <text x="72" y="92" font-family="system-ui, sans-serif" font-size="42" font-weight="800" fill="#292621">${title}</text>
  ${pins
    .map(
      ([label, x, y], index) => `<g>
    <circle cx="${x}" cy="${y}" r="18" fill="#b45f45"/>
    <circle cx="${x}" cy="${y}" r="7" fill="#fff7ed"/>
    <text x="${Number(x) + 26}" y="${Number(y) + 9}" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#292621">${index + 1}. ${label}</text>
  </g>`
    )
    .join("\n")}
</svg>`;
}

function imageCredit(slug) {
  const spec = imageSpecs.find(([id]) => id === slug);
  const info = spec?.[4];
  return info ? { commonsTitle: info.title, source: info.source, credit: info.credit } : undefined;
}

function buildEntities() {
  return [
    entity({
      id: "namba",
      type: "station",
      title: "難波 / 南海難波站",
      subtitle: "KIX 進出大阪最順的玄關，也是本次 Minami 行程的交通核心。",
      img: image("dotonbori", "難波周邊的道頓堀街景"),
      tags: ["交通樞紐", "南海電鐵", "Minami", "建議停留：交通節點"],
      summary: "難波不是單一景點，而是這趟大阪旅行的落地作業系統：從 KIX 進城、第一天寄放行李、道頓堀與心齋橋散步、最後一天採買，都會反覆用到它。",
      detailData: detail(
        "Day 1 · 交通與城市入口",
        [
          "難波是這趟行程的落地核心。從關西機場搭南海電鐵到難波，能快速進入大阪南區，接上飯店、道頓堀、心齋橋、法善寺橫丁與千日前。",
          "它的價值不是建築本身，而是讓旅客理解大阪的城市尺度。難波、心齋橋、日本橋和道頓堀彼此很近，第一天不必跨城移動，就能完成吃飯、散步、買藥妝、熟悉地鐵和找晚餐這些基本任務。",
          "7 月底抵達大阪時，入境、搭車和高溫會消耗體力。先讓難波成為行李與晚餐基地，比把第一天排進大型祭典或遠距景點更穩。"
        ],
        ["南海/地鐵/近鐵/阪神站體分散，要先確認出口", "飯店若在本町或梅田，仍可把難波當第一天吃逛區", "回程日採買後去 KIX 的動線簡單"],
        [image("dotonbori", "難波周邊街景")]
      ),
      addr: address("namba"),
      data: { imageCredit: imageCredit("dotonbori") }
    }),
    entity({
      id: "dotonbori",
      type: "place",
      title: "道頓堀",
      subtitle: "大阪 Minami 的招牌場景；這次看霓虹與飲食密度，不把它當排隊任務。",
      img: image("hero-osaka-cover", "夜晚的道頓堀"),
      tags: ["霓虹", "巨大招牌", "大阪食文化", "建議停留：60–90 分鐘"],
      summary: "道頓堀是大阪最容易被辨認的景觀。它集合河道、招牌、劇場娛樂史與觀光飲食，但這次的策略是散步、拍照、吃代表性食物，不在熱門店前耗掉第一晚。",
      detailData: detail(
        "Day 1 · 大阪第一印象",
        [
          "道頓堀之所以重要，不只是因為 Glico 看板，而是它把大阪的『看板文化、演藝歷史、飲食密度和水邊城市』壓縮在很短的步行距離裡。",
          "官方資料指出，道頓堀作為 Minami 的象徵商業區，與巨大立體招牌、劇場娛樂和吃到倒的城市形象密切相連。對第一次認真玩大阪的人來說，這裡很適合當第一晚的視覺開場。",
          "但它也高度觀光化。這趟不把道頓堀當餐廳排隊戰場，而是當作城市劇場：看人流、看招牌、看河岸、看店家如何把食物變成表演。"
        ],
        ["戎橋一帶拍照人潮", "餐廳招牌如何成為城市景觀", "河岸步道比主街更適合放慢速度"],
        [image("hero-osaka-cover", "道頓堀夜景"), image("dotonbori", "道頓堀白天街景")]
      ),
      addr: address("dotonbori"),
      data: { imageCredit: imageCredit("hero-osaka-cover") }
    }),
    entity({
      id: "hozenji",
      type: "place",
      title: "法善寺橫丁",
      subtitle: "在難波核心旁邊保留石板巷尺度，適合第一天從喧鬧轉入老大阪氛圍。",
      img: image("hozenji-yokocho", "法善寺橫丁"),
      tags: ["石板巷", "法善寺", "老大阪", "建議停留：30–45 分鐘"],
      summary: "法善寺橫丁把難波的高密度觀光區切出一條較安靜的巷弄。這裡適合看大阪如何在最商業的地方保留小尺度、石板、料理店和參拜氛圍。",
      detailData: detail(
        "Day 1 · 巷弄與老大阪",
        [
          "法善寺橫丁位在 Minami 核心，卻和道頓堀主街的噪音很不同。官方資料描述這裡有東西向石板巷、長年料理店與酒吧，也和法善寺的參拜歷史相連。",
          "對旅遊書來說，法善寺橫丁是很好的節奏調整點。先看道頓堀的大招牌，再轉進橫丁，會立刻感覺大阪不是只有巨大和吵鬧，也有小尺度與人情味。",
          "第一晚不建議排太硬，這裡可以作為晚餐前後的短散步。若覺得道頓堀太滿，法善寺一帶通常更容易找到稍微安靜的晚餐選項。"
        ],
        ["石板路與招牌尺度", "水掛不動尊與參拜者", "晚間燈光比白天更有情緒"],
        [image("hozenji-yokocho", "法善寺橫丁夜景")]
      ),
      addr: address("hozenji"),
      data: { imageCredit: imageCredit("hozenji-yokocho") }
    }),
    entity({
      id: "shinsaibashi",
      type: "commercial",
      title: "心齋橋筋商店街",
      subtitle: "從江戶商業街到今日大型拱廊，是大阪購物與人潮觀察的主軸。",
      img: image("shinsaibashi", "心齋橋筋商店街"),
      tags: ["購物", "雨天友善", "拱廊商店街", "建議停留：60–120 分鐘"],
      summary: "心齋橋筋南北約 580 公尺，商店密度高且有遮雨拱廊。這次把它當作第一天與最後一天都可使用的彈性購物軸。",
      detailData: detail(
        "Day 1 / Day 5 · 購物主軸",
        [
          "心齋橋筋是大阪 Minami 的主要商業步行軸。官方資料指出，它長約 580 公尺，從江戶時代以來就是連接劇場、碼頭與商業活動的重要道路。",
          "這裡不需要一次逛完。第一天適合短走、看人潮和補生活用品；最後一天再回來做伴手禮、藥妝和服飾採買。",
          "7 月底大阪很熱，有遮雨的商店街比長時間戶外街區安全。若午後雷雨或體力下降，心齋橋比硬跑景點更有彈性。"
        ],
        ["拱廊如何控制夏天/雨天體驗", "老店與全國連鎖店混合", "和道頓堀、難波的步行銜接"],
        [image("shinsaibashi", "心齋橋筋商店街")]
      ),
      addr: address("shinsaibashi"),
      data: { imageCredit: imageCredit("shinsaibashi") }
    }),
    entity({
      id: "osaka-castle",
      type: "place",
      title: "大阪城天守閣與大阪城公園",
      subtitle: "大阪代表景點，但夏天要早到，重點是看城郭記憶與現代博物館轉譯。",
      img: image("osaka-castle", "大阪城"),
      tags: ["城郭", "博物館", "豐臣秀吉", "建議停留：90–150 分鐘"],
      summary: "大阪城是 Day 2 的上午核心。官方現行資訊顯示天守閣 9:00–18:00、17:30 最後入館；7 月底要早去，避免中午在園區曝曬。",
      detailData: detail(
        "Day 2 · 城市權力與觀光展示",
        [
          "大阪城很容易被當成拍照背景，但它真正值得看的是大阪如何把城郭、豐臣記憶、戰爭與現代觀光展示放在同一個空間裡。",
          "現在的天守閣是博物館式參觀體驗，和原始城堡生活並不相同。這不是缺點，而是城市如何把歷史轉譯給大量旅客的案例。",
          "7 月底參觀要務實：早上 9:00 左右到，先看公園與天守閣，接近中午就轉往中之島/北濱或室內空間。"
        ],
        ["天守閣外觀與博物館內部的差異", "護城河、石垣和現代高樓的對照", "排隊、電梯和室內人潮"],
        [image("osaka-castle", "大阪城天守閣")]
      ),
      addr: address("osakaCastle"),
      data: { imageCredit: imageCredit("osaka-castle") }
    }),
    entity({
      id: "nakanoshima",
      type: "nature",
      title: "中之島公園與北濱",
      subtitle: "大阪水都氣質的代表；下午用河岸、咖啡與近代建築降速。",
      img: image("nakanoshima-park", "中之島公園"),
      tags: ["水邊散步", "近代建築", "咖啡", "建議停留：90–150 分鐘"],
      summary: "中之島位在堂島川與土佐堀川之間，是大阪第一座都市公園所在。這裡適合接在大阪城後，用比較安靜的水邊尺度平衡上午的觀光密度。",
      detailData: detail(
        "Day 2 · 水都大阪",
        [
          "中之島讓大阪從『吃與招牌』轉成『水、商業、近代建築』。官方資料指出，中之島公園 1891 年開園，是大阪市最早的都市公園之一。",
          "這裡的重點不是跑景點數，而是看城市空間。河岸、公園、中央公會堂、圖書館、咖啡店和金融街，把大阪的商業與文化層次連在一起。",
          "夏天午後安排中之島合理，因為可以在戶外短走和室內咖啡間切換。若太熱，就縮短河岸，把重點放在中央公會堂外觀與北濱咖啡。"
        ],
        ["堂島川/土佐堀川的水邊尺度", "中央公會堂與近代建築", "北濱咖啡店如何利用河景"],
        [image("nakanoshima-park", "中之島公園"), image("central-public-hall", "大阪市中央公會堂")]
      ),
      addr: address("nakanoshima"),
      data: { imageCredit: imageCredit("nakanoshima-park") }
    }),
    entity({
      id: "central-public-hall",
      type: "place",
      title: "大阪市中央公會堂",
      subtitle: "中之島的紅磚地標，適合用來讀大阪近代都市文化。",
      img: image("central-public-hall", "大阪市中央公會堂"),
      tags: ["重要文化財", "近代建築", "中之島", "建議停留：外觀 15–30 分鐘"],
      summary: "大阪市中央公會堂 1918 年完工，是中之島代表建築。這趟以外觀與周邊街景為主，不安排長時間室內導覽。",
      detailData: detail(
        "Day 2 · 近代建築節點",
        [
          "中央公會堂是中之島最容易辨認的紅磚建築。官方資料指出它完成於 1918 年，現為國家重要文化財，至今仍作為演講與活動場館使用。",
          "它讓旅客看到大阪不是只有城與商店街，也有近代市民文化、公共集會與建築保存的傳統。",
          "行程上不需要進行完整導覽，外觀、河岸、周邊建築和拍照點就足夠支撐下午段落。"
        ],
        ["紅磚與屋頂線條", "公共建築如何成為城市地標", "和中之島公園/北濱動線的關係"],
        [image("central-public-hall", "大阪市中央公會堂")]
      ),
      addr: address("publicHall"),
      data: { imageCredit: imageCredit("central-public-hall") }
    }),
    entity({
      id: "umeda-sky",
      type: "place",
      title: "梅田藍天大廈 空中庭園",
      subtitle: "用傍晚高度收束 Day 2，看大阪北區與城市延展。",
      img: image("umeda-sky", "梅田藍天大廈"),
      tags: ["夜景", "建築", "梅田", "建議停留：60–90 分鐘"],
      summary: "梅田藍天大廈適合放傍晚，若天氣好看夕景；若下雨或雲厚，就改梅田商場與地下街，不硬上展望台。",
      detailData: detail(
        "Day 2 · 傍晚城市視角",
        [
          "空中庭園的價值在於把大阪從街道尺度拉到都市尺度。上午看城、下午看水邊，傍晚從高處看梅田，Day 2 的城市閱讀會完整很多。",
          "官方資訊顯示空中庭園也和大阪周遊卡/大阪 e-Pass 有指定時段優惠或免費入場規則，但這版行程不為了票券硬衝景點。",
          "若天氣不好，不要勉強。梅田本身有 Grand Front Osaka、LUCUA、阪急百貨與地下街，完全能作為雨天收束。"
        ],
        ["夕景時間的人潮", "屋頂是否因天候開放", "梅田站區動線複雜，提早抓路線"],
        [image("umeda-sky", "梅田藍天大廈")]
      ),
      addr: address("umedaSky"),
      data: { imageCredit: imageCredit("umeda-sky") }
    }),
    entity({
      id: "tenma",
      type: "commercial",
      title: "天滿 / 天神橋筋商店街",
      subtitle: "日本最長級商店街與居酒屋密度，適合 Day 2 晚上吃喝。",
      img: image("tenjinbashisuji", "天神橋筋商店街"),
      tags: ["商店街", "居酒屋", "晚餐區", "建議停留：60–120 分鐘"],
      summary: "天神橋筋商店街長約 2.6 公里，店家密度高，周邊天滿夜晚很適合找居酒屋。這次不排串炸，晚餐就用居酒屋、燒鳥、小料理替代。",
      detailData: detail(
        "Day 2 · 晚餐街區",
        [
          "天神橋筋商店街官方資料稱全長約 2.6 公里，從大阪天滿宮周邊發展出來，沿線有大量日常店鋪與餐飲。",
          "這裡比道頓堀更像大阪人的生活街區。晚上轉入天滿找居酒屋，比在觀光主街排名店更符合這趟『大阪市區深度』的方向。",
          "因為你不想吃串炸，天滿可改用燒鳥、海鮮居酒屋、小料理、立吞或壽司。原則是訂一間穩的，現場再加散步。"
        ],
        ["商店街日常感", "晚餐不要排太晚，隔天要去神戶", "小店菜單可能日文為主"],
        [image("tenjinbashisuji", "天神橋筋商店街")]
      ),
      addr: address("tenma"),
      data: { imageCredit: imageCredit("tenjinbashisuji") }
    }),
    entity({
      id: "kobe-herb",
      type: "nature",
      title: "神戶布引香草園 / 纜車",
      subtitle: "神戶一日遊的山景入口，早上上山避暑，比午後曝曬合理。",
      img: image("kobe-herb-garden", "神戶布引香草園"),
      tags: ["纜車", "山景", "花園", "建議停留：90–150 分鐘"],
      summary: "布引香草園以纜車連接新神戶和山上花園，官方介紹有約 200 種、75,000 株香草與花卉。夏天早上先上山，再回市區散步。",
      detailData: detail(
        "Day 3 · 神戶山側",
        [
          "神戶的特色是山與海距離很近。布引香草園/纜車讓一日遊一開始就看到這種地形：從新神戶附近上山，短時間內俯瞰神戶市區與港灣。",
          "官方資料介紹園內有多個主題花園，纜車約 10 分鐘可到山上。7 月底雖然仍熱，但比在市區午後上坡更合理。",
          "這裡不必走完整園區。抓纜車景觀、山頂展望、花園短走和咖啡休息即可，午後留給北野與港邊。"
        ],
        ["纜車營運與天候", "山上也要防曬補水", "不走完整步道，避免消耗神戶午後體力"],
        [image("kobe-herb-garden", "神戶布引香草園")]
      ),
      addr: address("herb"),
      data: { imageCredit: imageCredit("kobe-herb-garden") }
    }),
    entity({
      id: "kitano",
      type: "place",
      title: "神戶北野異人館街",
      subtitle: "港口開放後形成的洋館街區，讓神戶和大阪氣質拉開差異。",
      img: image("kitano-kobe", "神戶北野街區"),
      tags: ["洋館", "港口城市", "坡道街區", "建議停留：60–120 分鐘"],
      summary: "北野異人館街展示神戶作為開港城市的歷史層次。官方 VISIT KOBE 將 Kitano / Shin-Kobe 視為可步行看異國街區與山側景觀的區域。",
      detailData: detail(
        "Day 3 · 港口城市的山側記憶",
        [
          "北野讓神戶和大阪明顯分開。大阪的主軸是商業、食物和水都；神戶則因開港、外國人居留和山海地形形成另一種街區氣質。",
          "VISIT KOBE 介紹 Kitano / Shin-Kobe 是可從三宮或新神戶步行抵達的異國街區，保留多座外國人住宅與洋館。",
          "夏天北野坡道會累，所以行程只抓核心街區，不硬進每一棟館。若體力普通，選 1 座代表館加街區散步即可。"
        ],
        ["坡度與體力", "洋館外觀和街道尺度", "從山側往港邊轉場的城市感"],
        [image("kitano-kobe", "神戶北野街區")]
      ),
      addr: address("kitano"),
      data: { imageCredit: imageCredit("kitano-kobe") }
    }),
    entity({
      id: "motomachi",
      type: "commercial",
      title: "三宮 / 元町",
      subtitle: "神戶市中心與商店街軸線，午餐、咖啡、晚餐都可在這裡調整。",
      img: image("kitano-kobe", "神戶街區"),
      tags: ["市中心", "商店街", "咖啡", "建議停留：60–120 分鐘"],
      summary: "三宮是神戶交通與商業核心，元町商店街則有 1.2 公里拱廊與老店。這段是神戶一日遊的彈性緩衝，讓上山和港邊之間有午餐與休息。",
      detailData: detail(
        "Day 3 · 神戶城市緩衝",
        [
          "三宮/元町是神戶一日遊的中場。從香草園和北野下來後，不必立刻衝港邊，可以在市中心吃午餐、喝咖啡或看商店街。",
          "VISIT KOBE 介紹元町商店街有約 300 間店鋪與 1.2 公里拱廊，是神戶港町生活與商業的代表軸線。",
          "這段行程保留彈性：若上山耗時，就縮短元町；若天氣太熱，就把北野縮短，把休息放在三宮/元町。"
        ],
        ["三宮站體與回大阪交通", "元町商店街老店與新店混合", "不要把神戶塞成打卡清單"],
        [image("kitano-kobe", "神戶街區")]
      ),
      addr: address("motomachi"),
      data: { imageCredit: imageCredit("kitano-kobe") }
    }),
    entity({
      id: "meriken",
      type: "place",
      title: "美利堅公園",
      subtitle: "神戶港邊的開闊收尾，適合傍晚從市中心走到海風裡。",
      img: image("meriken-park", "神戶美利堅公園"),
      tags: ["港邊", "夜景", "開港城市", "建議停留：45–90 分鐘"],
      summary: "美利堅公園讓神戶一日遊從山側、洋館街、商業街，收束到港邊。傍晚看港塔、海洋博物館與港口天際線最合適。",
      detailData: detail(
        "Day 3 · 神戶海側",
        [
          "神戶港邊是 Day 3 的收尾。從布引香草園看山，到北野看開港洋館，再到美利堅公園看海，這條線能讓神戶特色完整出現。",
          "美利堅公園不需要排很長時間。它的價值在開闊感：海風、港塔、海洋博物館、BE KOBE 標誌與港邊步道共同形成神戶的視覺記憶。",
          "夏天傍晚比中午舒服，適合把港邊放在 16:30 之後。若要吃神戶牛或正式晚餐，港邊停留時間就控制在 45–60 分鐘。"
        ],
        ["港塔與海洋博物館構圖", "傍晚光線", "回三宮或元町搭車的距離"],
        [image("meriken-park", "美利堅公園")]
      ),
      addr: address("meriken"),
      data: { imageCredit: imageCredit("meriken-park") }
    }),
    entity({
      id: "kobe-port-tower",
      type: "place",
      title: "神戶港塔",
      subtitle: "神戶港邊地標；改裝後可登塔，但這版以天氣與體力決定是否上去。",
      img: image("kobe-port-tower", "神戶港塔"),
      tags: ["港口地標", "觀景", "夜景", "建議停留：30–75 分鐘"],
      summary: "神戶港塔官方資料顯示觀景樓層與屋頂開放至 23:00、最後入場 22:30。這讓神戶晚間安排很彈性，但不必強制上塔。",
      detailData: detail(
        "Day 3 · 港邊地標",
        [
          "神戶港塔是港邊最明確的垂直地標。若天氣好、體力也夠，上塔能補上神戶海側夜景；若天候普通，外觀與港邊散步已足夠。",
          "官方資訊顯示神戶港塔觀景區有指定日期時間票，屋頂與觀景樓層開到深夜，適合接晚餐前後。",
          "這趟不把它當硬性打卡點，是因為 Day 3 已有香草園、北野、元町、港邊；登塔與否要服務節奏。"
        ],
        ["是否先買指定時間票", "屋頂需經樓梯，留意體力", "晚餐預約時間會決定上塔可行性"],
        [image("kobe-port-tower", "神戶港塔")]
      ),
      addr: address("portTower"),
      data: { imageCredit: imageCredit("kobe-port-tower") }
    }),
    entity({
      id: "shitennoji",
      type: "place",
      title: "四天王寺",
      subtitle: "大阪南側的古寺核心，和京都寺院氣質不同，更像城市裡的佛教地層。",
      img: image("shitennoji", "四天王寺"),
      tags: ["古寺", "聖德太子", "天王寺", "建議停留：45–75 分鐘"],
      summary: "四天王寺官方資料稱其為日本第一座官寺，由聖德太子創建，現有建築重現飛鳥時代伽藍配置。Day 4 早上看，避免午後高溫。",
      detailData: detail(
        "Day 4 · 大阪南側歷史",
        [
          "四天王寺是大阪南側很重要的歷史節點。官方資料指出它約 1,400 年前由聖德太子創建，是日本最早的官寺之一。",
          "它和京都寺院不一樣。四天王寺更像是在現代大阪城市裡保留下來的一層佛教與古代國家記憶，周邊接的是天王寺、阿倍野與商業設施。",
          "夏天建議早上去，停留 45–75 分鐘即可。不需要把它看成京都式寺院巡禮，而是作為大阪南區歷史的入口。"
        ],
        ["伽藍配置", "月例市集若遇 21/22 日才適合加碼", "天王寺/阿倍野的現代城市對照"],
        [image("shitennoji", "四天王寺")]
      ),
      addr: address("shitennoji"),
      data: { imageCredit: imageCredit("shitennoji") }
    }),
    entity({
      id: "tennoji-harukas",
      type: "commercial",
      title: "天王寺公園 / 阿倍野 Harukas",
      subtitle: "大阪南區的現代地標，作為 Day 4 中午避暑與展望選項。",
      img: image("abeno-harukas", "天王寺公園與阿倍野 Harukas"),
      tags: ["展望台", "商場", "公園", "建議停留：90–150 分鐘"],
      summary: "阿倍野 Harukas 高約 300 公尺，官方資料顯示 Harukas 300 觀景台 9:00–22:00。Day 4 可視天氣選擇上展望台或只用商場避暑。",
      detailData: detail(
        "Day 4 · 南區現代城市",
        [
          "天王寺/阿倍野是大阪南區的現代核心。四天王寺看完後轉到這裡，會很清楚地看到古寺、都市公園、百貨、展望台和車站商業如何疊在一起。",
          "官方資料介紹阿倍野 Harukas 為約 300 公尺高的複合大樓，包含百貨、辦公、飯店、美術館與觀景台。它適合夏天中午當避暑節點。",
          "若天氣清楚，上 Harukas 300 能看大阪平面；若雲厚或體力普通，改百貨美食街、商場與天王寺公園就好。"
        ],
        ["展望台票價與天氣", "午餐不要排太遠", "天王寺站/大阪阿部野橋站方向要分清"],
        [image("abeno-harukas", "阿倍野 Harukas 與天王寺公園")]
      ),
      addr: address("harukas"),
      data: { imageCredit: imageCredit("abeno-harukas") }
    }),
    entity({
      id: "horie",
      type: "commercial",
      title: "堀江 / Orange Street",
      subtitle: "從家具街轉型成咖啡、選物、生活風格街區，適合不想只逛百貨的人。",
      img: image("shinsaibashi", "堀江附近商業街區參考圖"),
      tags: ["選物店", "咖啡", "生活雜貨", "建議停留：75–120 分鐘"],
      summary: "堀江與 Orange Street 原本有家具街背景，現在是大阪年輕感、設計店、咖啡與生活雜貨集中區。Day 4 下午放這裡，比回道頓堀主街更有深度。",
      detailData: detail(
        "Day 4 · 生活風格街區",
        [
          "堀江的價值在於它不是大阪最有名的觀光名所，卻很適合看城市消費如何變得生活風格化。官方資料指出 Orange Street 原為家具街，後來轉型成咖啡、精品、雜貨與設計店聚集的街區。",
          "把它放在 Day 4 下午，是為了避開『每天都在難波主街』的單調感。從天王寺/阿倍野轉到堀江，會看到大阪南區更年輕、較鬆的面貌。",
          "這裡不追求特定店家。策略是走街區、進幾間選物或咖啡，若覺得太熱，就縮短後回心齋橋或飯店休息。"
        ],
        ["家具街痕跡與新店轉型", "咖啡店密度", "和 America-mura/心齋橋的差異"],
        [image("shinsaibashi", "大阪商業街區參考")]
      ),
      addr: address("horie"),
      data: { imageCredit: imageCredit("shinsaibashi") }
    }),
    entity({
      id: "kuromon",
      type: "commercial",
      title: "黑門市場",
      subtitle: "大阪廚房的觀光化市場；最後一天短逛，不把正餐押在這裡。",
      img: image("kuromon-market", "黑門市場"),
      tags: ["市場", "海鮮", "街食", "建議停留：45–75 分鐘"],
      summary: "黑門市場官方資料指出約有 150 店、長約 580 公尺，從江戶末期延續至今。這次作為最後一天短逛和補吃，不排成重餐。",
      detailData: detail(
        "Day 5 · 最後採買與市場觀察",
        [
          "黑門市場是大阪市場觀光的代表。官方資料提到它約 580 公尺、約 150 店，長期供應大阪地方飲食需求，也服務餐飲職人。",
          "現在黑門高度觀光化，價格和體驗可能不如期待。這不是不能去，而是要設定正確：最後一天短逛、看市場如何面向旅客、補吃小份食物即可。",
          "不要把黑門當唯一午餐。若人太多或價格不合理，就轉難波、百貨美食街或心齋橋。"
        ],
        ["市場觀光化程度", "店家是否清楚標價", "避免最後一天吃太撐影響搭機"],
        [image("kuromon-market", "黑門市場")]
      ),
      addr: address("kuromon"),
      data: { imageCredit: imageCredit("kuromon-market") }
    }),
    entity({
      id: "doguyasuji",
      type: "commercial",
      title: "千日前道具屋筋",
      subtitle: "料理器具、招牌、食品模型與大阪飲食後台，適合最後一天買小物。",
      img: image("doguyasuji", "千日前道具屋筋"),
      tags: ["廚具", "食品模型", "伴手禮", "建議停留：30–60 分鐘"],
      summary: "道具屋筋官方資料指出它有超過 130 年歷史，專門販售料理器具、暖簾、招牌等，是支撐大阪食文化的後台街區。",
      detailData: detail(
        "Day 5 · 大阪飲食的後台",
        [
          "千日前道具屋筋比一般藥妝更有大阪特色。官方資料說它有超過 130 年歷史，販售廚具、暖簾、招牌、餐具與食品模型，支撐大阪作為食之城市的職人系統。",
          "這裡很適合最後一天買小物：筷子、刀具、器皿、食品模型、廚房雜貨都比一般伴手禮更有記憶點。",
          "行程上接在黑門/難波旁邊很順，不需要特地跨城。若行李已滿，就只看食品模型和店鋪陳列。"
        ],
        ["料理工具如何支撐餐飲城市", "食品模型店", "刀具購買需留意托運規則"],
        [image("doguyasuji", "千日前道具屋筋")]
      ),
      addr: address("doguyasuji"),
      data: { imageCredit: imageCredit("doguyasuji") }
    }),
    ...foodEntities()
  ];
}

function foodEntities() {
  const data = [
    {
      id: "takoyaki",
      title: "章魚燒",
      img: image("takoyaki", "章魚燒"),
      summary: "章魚燒是大阪最容易入口的粉物小吃。這趟不追求名店排隊，建議在道頓堀、難波或心齋橋看到順路店就吃小份。",
      points: ["剛出爐非常燙，先等一下", "不要為單一名店排太久", "適合當第一天或最後一天小吃"]
    },
    {
      id: "okonomiyaki",
      title: "大阪燒",
      img: image("okonomiyaki", "大阪燒"),
      summary: "大阪燒比章魚燒更適合作為晚餐主食。若第一天想吃大阪代表味道，選一間可坐下的店會比站著吃多樣小吃更舒服。",
      points: ["可當完整晚餐", "熱門店可預約或避尖峰", "與啤酒/高球很搭"]
    },
    {
      id: "sushi",
      title: "壽司 / 海鮮",
      img: image("sushi", "壽司"),
      summary: "大阪不是只吃粉物。難波、梅田、黑門周邊都有壽司與海鮮選項，可作為不吃串炸後的重要替代晚餐。",
      points: ["選交通方便店", "最後一天避免吃太久", "黑門不一定比店面划算"]
    },
    {
      id: "izakaya",
      title: "居酒屋 / 燒鳥 / 小料理",
      img: image("izakaya", "居酒屋"),
      summary: "居酒屋是這趟晚餐主力。天滿、梅田、難波、福島都可選；不吃串炸後，用燒鳥、海鮮、小料理和當季菜補足大阪夜晚。",
      points: ["週末建議訂位", "小店可能吸菸或只有日文菜單", "不要把每晚都放道頓堀"]
    },
    {
      id: "kobe-beef",
      title: "神戶牛（可選）",
      img: image("kobe-beef", "神戶牛"),
      summary: "神戶牛不是這趟必吃，但如果 Day 3 想升級晚餐，可選三宮/元町可預約餐廳。官方 VISIT KOBE 說明神戶牛需符合嚴格等級與血統標準。",
      points: ["可選不強制", "若要吃建議預約", "確認是否為正式神戶牛而非一般和牛"]
    }
  ];

  return data.map((item) =>
    entity({
      id: item.id,
      type: "food",
      title: item.title,
      subtitle: "本行程餐飲策略",
      img: item.img,
      tags: ["美食", "不排串炸", "彈性替換"],
      summary: item.summary,
      detailData: detail(
        "美食策略",
        [
          item.summary,
          "這趟餐飲不做名店綁架。大阪和神戶的好處是同類選擇很多，若第一家滿位或排隊太久，立刻換同區域同類型店，行程品質會比硬排更穩。",
          "餐廳安排原則是：抵達日簡單、Day 2 居酒屋、Day 3 神戶彈性、Day 4 南區晚餐、Day 5 不吃太撐。"
        ],
        item.points,
        [item.img]
      ),
      addr: { label: "搜尋", text: `${item.title} 大阪/神戶`, query: item.title },
      data: { imageCredit: imageCredit(item.id) }
    })
  );
}

function buildTrip() {
  const entities = buildEntities();
  return {
    schemaVersion: 2,
    template: "travelGuide",
    theme: "guidebookWarm",
    meta: {
      id: tripId,
      title: "大阪五天四夜旅行手冊｜大阪市區深度・神戶一日遊",
      language: "zh-Hant",
      printLabel: "列印 / 存成 PDF",
      dateRange: "2026/7/25（六）– 7/29（三）",
      departure: "臺灣桃園機場",
      recommendedBase: "本町 / 淀屋橋 / 北濱；次選難波 / 心齋橋",
      pace: "每日 2–3 個重點，避開中午長時間曝曬",
      mustEat: ["大阪燒", "章魚燒", "居酒屋", "壽司"]
    },
    content: { entities },
    sections: [
      {
        id: "cover",
        type: "cover",
        blocks: [
          {
            type: "coverHero",
            data: {
              eyebrow: "OSAKA 2026 · 5 DAYS",
              title: ["大阪五天四夜", "市區深度與神戶一日遊"],
              lead: "避開串炸與天神祭煙火人潮，用難波、心齋橋、中之島、梅田、天王寺、堀江與神戶港邊，做一趟夏天也走得動的大阪旅行。",
              image: asset("hero-osaka-cover"),
              meta: ["日期：2026/7/25–7/29", "出發：桃園 TPE → 關西 KIX", "住宿建議：本町 / 淀屋橋 / 北濱", "節奏：平衡、避暑、晚上吃喝"]
            }
          }
        ]
      },
      {
        id: "overview",
        type: "overview",
        navLabel: "旅程概覽",
        blocks: [
          {
            type: "guideIntro",
            data: {
              kicker: "Travel Brief",
              title: "這不是大阪打卡清單，而是一份可執行的夏季旅遊書。",
              body: "你已經去過東京與京都，這趟大阪不把自己偽裝成古都，也不做東京替代品。重點是大阪自己的城市密度：Minami 的食物與招牌、Kita 的水邊與近代建築、南區的古寺與高樓、神戶的山海港口氣質。",
              mapLabel: "大阪與神戶行程地圖",
              articleGuide: {
                buttonLabel: "閱讀設計邏輯",
                articleTitle: "大阪 2026 行程設計邏輯",
                content:
                  "# 大阪 2026 行程設計邏輯\n\n這趟旅行的核心不是收集最多景點，而是在 2026 年 7 月底的高溫條件下，讓每天都有明確主題且能實際走完。大阪夏季炎熱潮濕，日本氣象廳平年值顯示大阪 7 月日最高均溫約 31.8°C、日最低約 24.6°C，因此行程把戶外重點放在早晨與傍晚，中午轉入商場、咖啡、展望台或車站周邊。\n\n## 為什麼不擠天神祭煙火\n\n2026/7/25 正好是天神祭本宮。官方資料顯示船渡御與煙火集中在傍晚到晚上，這是非常有大阪感的事件，但你明確表示不想擠煙火，因此第一天避開天滿橋、中之島、大川沿岸，把祭典當作城市背景，不把旅程品質交給人潮。\n\n## 為什麼不排串炸\n\n串炸通常會把行程導向新世界與通天閣周邊；既然你不想吃串炸，Day 4 改成四天王寺、天王寺、阿倍野 Harukas、堀江與南船場。這樣仍能看到大阪南側的歷史與現代城市，但晚餐不被新世界串炸線綁住。\n\n## 為什麼選神戶而不是奈良或姬路\n\n神戶從大阪出發交通順，且和大阪氣質差異明顯：山、港、洋館、元町商店街、港塔與海風，都能在一天內串起來。奈良偏經典寺社，姬路車程較長；這趟既然要大阪市區深度，神戶是最平衡的周邊選擇。"
              },
              maps: [
                { src: `${assetBase}/osaka-overview-map.svg`, alt: "大阪神戶總覽地圖" },
                { src: `${assetBase}/osaka-day-clusters.svg`, alt: "每日行程區域集群圖" }
              ]
            }
          },
          {
            type: "tripOverview",
            data: {
              kicker: "Overview",
              title: "五天主題與動線",
              note: "住宿以本町 / 淀屋橋 / 北濱最平衡；若想吃逛最方便，可住難波 / 心齋橋。",
              tableTitle: "旅程設定",
              table: {
                headers: ["項目", "內容", "規劃理由"],
                rows: [
                  ["日期", "2026/7/25（六）– 7/29（三）", "避開 8 月中下旬盂蘭盆高峰，但 7/25 會遇天神祭人潮"],
                  ["航班", "桃園 TPE 早去、KIX 晚回", "可做成 4.5 天可用時間"],
                  ["住宿", "本町 / 淀屋橋 / 北濱", "到梅田、難波、中之島、神戶都順，夜間比道頓堀安靜"],
                  ["飲食", "大阪燒、章魚燒、壽司、居酒屋", "不排串炸，改用更彈性的晚餐策略"],
                  ["節奏", "每天 2–3 個重點", "夏天避免中午戶外行軍"]
                ]
              },
              cards: [
                {
                  number: "01",
                  title: "Minami 落地",
                  paragraphs: ["第一天只熟悉難波、道頓堀、心齋橋與法善寺。避開天神祭煙火核心人潮。"],
                  route: ["KIX", "難波", "道頓堀", "心齋橋"],
                  stopTypes: ["station", "station", "place", "commercial"],
                  segments: [
                    { mode: "南海電鐵", duration: "約 35–50 分", note: "依 Rapi:t 或空港急行而定" },
                    { mode: "步行", duration: "5–15 分" },
                    { mode: "步行", duration: "10–20 分" }
                  ]
                },
                {
                  number: "02",
                  title: "水都與近代大阪",
                  paragraphs: ["大阪城、中之島、梅田，從城郭記憶走到近代建築與夜景。"],
                  route: ["大阪城", "中之島", "梅田藍天", "天滿"],
                  stopTypes: ["place", "nature", "place", "commercial"]
                },
                {
                  number: "03",
                  title: "神戶山海一日",
                  paragraphs: ["布引香草園、北野、元町、美利堅公園與港塔，完整看神戶山海港口氣質。"],
                  route: ["大阪", "新神戶", "北野", "元町", "神戶港"],
                  stopTypes: ["station", "station", "place", "commercial", "place"]
                }
              ]
            }
          }
        ]
      },
      {
        id: "preparation",
        type: "preparation",
        navLabel: "行前準備",
        blocks: [
          {
            type: "travelPreparation",
            data: {
              kicker: "Before You Go",
              title: "訂票、訂位與夏天風險控管",
              note: "大阪 7 月底可玩，但需要把防暑當作行程設計的一部分。",
              cards: [
                {
                  number: "A",
                  title: "交通",
                  paragraphs: ["KIX 進出難波可用南海 Rapi:t 或空港急行。若買 Rapi:t 數位票，官方規則要求購票後指定搭乘日期、班次與座位。", "大阪到神戶用 JR、阪急或阪神都可，依住宿點選最少轉乘路線。"]
                },
                {
                  number: "B",
                  title: "票券",
                  paragraphs: ["這版不是景點衝刺型，不預設大阪周遊卡一定划算。大阪城、梅田藍天、神戶港塔、布引纜車可視天氣單點購票。", "若你後續想一天內集中多個付費景點，再重算 Osaka Amazing Pass。"]
                },
                {
                  number: "C",
                  title: "餐廳",
                  paragraphs: ["週六、週日與神戶晚餐建議訂位。這趟不排串炸，主力改居酒屋、燒鳥、壽司、大阪燒與神戶可選晚餐。", "原則是不為單一名店排太久；滿位就換同區域同類型店。"]
                }
              ],
              checklistTitle: "出發前一週重查",
              checklist: {
                headers: ["項目", "要重查的事", "原因"],
                rows: [
                  ["航班", "TPE/KIX 起降時間與行李規則", "影響 Day 1 和 Day 5 可用時間"],
                  ["天氣", "大阪/神戶高溫、午後雷雨、颱風", "7 月底必須保留室內備案"],
                  ["天神祭", "7/25 交通管制與人潮範圍", "第一天要避開煙火核心"],
                  ["纜車", "布引香草園纜車營運", "受天候影響"],
                  ["餐廳", "Day 2、Day 3、Day 4 晚餐訂位", "避免高溫後還要排隊"]
                ]
              }
            }
          }
        ]
      },
      {
        id: "days",
        type: "days",
        navLabel: "每日行程",
        days: buildDays()
      },
      {
        id: "food",
        type: "food",
        navLabel: "美食策略",
        blocks: [
          {
            type: "tripOverview",
            data: {
              kicker: "Food",
              title: "不吃串炸後，大阪晚餐怎麼排",
              note: "這趟保留大阪粉物，但把晚餐重心移到可坐下、可預約、可替換的店型。",
              cards: [
                { number: "1", title: "抵達日", paragraphs: ["大阪燒或壽司最穩。章魚燒當小吃，不要靠站食撐完整晚餐。"], route: ["難波", "法善寺", "道頓堀"], stopTypes: ["station", "place", "place"] },
                { number: "2", title: "大阪市區夜晚", paragraphs: ["天滿/梅田居酒屋、燒鳥、小料理。週末訂位，別在道頓堀主街排太久。"], route: ["梅田", "天滿"], stopTypes: ["commercial", "commercial"] },
                { number: "3", title: "神戶晚餐", paragraphs: ["神戶牛可選不強制。若預算想留給大阪，神戶洋食、壽司、居酒屋也很合理。"], route: ["元町", "三宮", "神戶港"], stopTypes: ["commercial", "station", "place"] }
              ]
            }
          },
          recommended(["takoyaki", "okonomiyaki", "sushi", "izakaya", "kobe-beef"])
        ]
      },
      {
        id: "sources",
        type: "sources",
        navLabel: "資料來源",
        blocks: [
          {
            type: "sourceList",
            data: {
              kicker: "Sources",
              title: "查證來源與圖片來源",
              note: "景點、交通、天氣與票券資訊以官方來源為主；圖片以 Wikimedia Commons 圖片下載到本地 assets，圖片來源寫入各 entity 的 data.imageCredit。",
              links: sources.map(([text, url]) => ({ text, url }))
            }
          },
          { type: "guideFooter", data: { text: "Generated for travel-guidebook/osaka-2026. 出發前請重查營業時間、票價、交通與餐廳店休日。" } }
        ]
      }
    ]
  };
}

function buildDays() {
  return [
    {
      id: "day1",
      number: "Day 1",
      navLabel: "D1 抵達大阪",
      title: "抵達大阪：難波、法善寺、道頓堀、心齋橋",
      tagline: "不擠天神祭煙火，先讓身體落地、讓胃進入大阪。",
      blocks: [
        dailyRoute(["KIX", "難波", "法善寺橫丁", "道頓堀", "心齋橋"], ["station", "station", "place", "place", "commercial"], [
          { mode: "南海電鐵", duration: "約 35–50 分", note: "依 Rapi:t / 空港急行與住宿位置調整" },
          { mode: "步行", duration: "5–10 分" },
          { mode: "步行", duration: "5–10 分" },
          { mode: "步行", duration: "10–15 分" }
        ]),
        dayMedia(image("hero-osaka-cover", "道頓堀夜景"), ["kix", "namba", "hozenji", "dotonbori", "shinsaibashi"], "Day 1 抵達大阪與 Minami 暖身"),
        callout("天神祭處理方式", "2026/7/25 是天神祭本宮，但本行程不去天滿橋、中之島、大川沿岸擠煙火。若飯店附近聽到祭典聲音，把它當作城市背景即可。"),
        schedule([
          ["上午", "TPE → KIX，入境後搭南海進大阪", "先處理交通、行李與飯店寄放，不排遠點"],
          ["下午", "難波、法善寺橫丁、道頓堀短散步", "熱就進商場/咖啡，不硬走完整街區"],
          ["晚上", "大阪燒、壽司、居酒屋；心齋橋/道頓堀短逛", "避開天神祭煙火核心人潮"]
        ]),
        recommended(["namba", "hozenji", "dotonbori", "shinsaibashi", "okonomiyaki", "takoyaki"]),
        detailsNote("第一天確認版", "已依你的偏好改成不擠煙火、不排串炸。這天的成功標準是順利落地、吃到大阪味道、熟悉住宿周邊。")
      ]
    },
    {
      id: "day2",
      number: "Day 2",
      navLabel: "D2 城與水都",
      title: "大阪城、中之島、梅田夜景、天滿居酒屋",
      tagline: "從城郭記憶到水都近代建築，再用梅田高度收束。",
      blocks: [
        dailyRoute(["大阪城", "中之島", "中央公會堂", "梅田藍天", "天滿"], ["place", "nature", "place", "place", "commercial"], [
          { mode: "地鐵/JR", duration: "約 20–30 分" },
          { mode: "地鐵/步行", duration: "約 20 分" },
          { mode: "步行", duration: "5–10 分" },
          { mode: "地鐵/步行", duration: "約 20–30 分" }
        ]),
        dayMedia(image("osaka-castle", "大阪城"), ["osakaCastle", "nakanoshima", "publicHall", "umedaSky", "tenma"], "Day 2 大阪城、中之島、梅田、天滿"),
        schedule([
          ["早上", "大阪城公園與天守閣", "9:00 左右到，避開中午高溫"],
          ["下午", "中之島公園、中央公會堂、北濱咖啡", "河岸短走 + 室內休息"],
          ["傍晚", "梅田藍天大廈空中庭園", "天氣差就改梅田商場"],
          ["晚上", "天滿或梅田居酒屋", "不排串炸，週末建議訂位"]
        ]),
        recommended(["osaka-castle", "nakanoshima", "central-public-hall", "umeda-sky", "tenma", "izakaya"]),
        detailsNote("防暑策略", "大阪城戶外段放早上；下午與晚上都在可快速進室內的區域，避免 7 月底在戶外硬撐。")
      ]
    },
    {
      id: "day3",
      number: "Day 3",
      navLabel: "D3 神戶一日遊",
      title: "神戶：布引香草園、北野、元町、美利堅公園",
      tagline: "一天內看神戶的山、洋館、商店街與港。",
      blocks: [
        dailyRoute(["大阪", "新神戶", "布引香草園", "北野", "元町", "神戶港"], ["station", "station", "nature", "place", "commercial", "place"], [
          { mode: "JR/阪急/阪神", duration: "約 30–45 分", note: "依住宿點選路線" },
          { mode: "地鐵/步行", duration: "約 10–20 分" },
          { mode: "纜車", duration: "約 10 分上山" },
          { mode: "步行/短程交通", duration: "約 15–25 分" },
          { mode: "步行/地鐵", duration: "約 15–25 分" }
        ]),
        dayMedia(image("kobe-herb-garden", "神戶布引香草園"), ["shinKobe", "herb", "kitano", "motomachi", "meriken", "portTower"], "Day 3 神戶山海一日遊"),
        schedule([
          ["早上", "大阪出發，布引香草園/纜車", "先上山避開午後熱"],
          ["中午", "三宮或北野午餐", "保留體力，不排太重餐"],
          ["下午", "北野異人館街、元町商店街", "坡道視體力縮放"],
          ["傍晚", "美利堅公園、神戶港塔外觀或登塔", "天氣好可上塔"],
          ["晚上", "神戶晚餐後回大阪", "神戶牛可選，不強制"]
        ]),
        recommended(["kobe-herb", "kitano", "motomachi", "meriken", "kobe-port-tower", "kobe-beef"]),
        detailsNote("神戶一日遊判斷", "若當天很熱，香草園與北野都縮短，把休息放在三宮/元町；不要為了全部走完而犧牲晚餐和回程品質。")
      ]
    },
    {
      id: "day4",
      number: "Day 4",
      navLabel: "D4 南區深度",
      title: "四天王寺、天王寺、阿倍野 Harukas、堀江南船場",
      tagline: "拿掉串炸線，改看大阪南側的古寺、高樓與生活風格街區。",
      blocks: [
        dailyRoute(["四天王寺", "天王寺公園", "阿倍野 Harukas", "堀江/Orange Street", "難波/心齋橋"], ["place", "nature", "commercial", "commercial", "commercial"], [
          { mode: "步行/地鐵", duration: "約 10–20 分" },
          { mode: "步行", duration: "約 10 分" },
          { mode: "地鐵", duration: "約 20 分" },
          { mode: "步行/地鐵", duration: "約 10–20 分" }
        ]),
        dayMedia(image("shitennoji", "四天王寺"), ["shitennoji", "tennoji", "harukas", "horie", "shinsaibashi"], "Day 4 天王寺、阿倍野、堀江、心齋橋"),
        schedule([
          ["早上", "四天王寺、天王寺公園", "早點走戶外，寺院不排太久"],
          ["中午", "阿倍野/天王寺午餐", "進商場避暑"],
          ["下午", "Harukas 300 或百貨休息，再去堀江/Orange Street", "展望台視天氣決定"],
          ["晚上", "難波/心齋橋壽司、大阪燒、燒鳥或居酒屋", "不排新世界串炸"]
        ]),
        recommended(["shitennoji", "tennoji-harukas", "horie", "sushi", "izakaya", "okonomiyaki"]),
        detailsNote("串炸替代方案", "原本新世界/通天閣常和串炸綁在一起；既然你不想吃串炸，Day 4 轉成天王寺歷史 + 阿倍野現代 + 堀江生活風格，更符合你的偏好。")
      ]
    },
    {
      id: "day5",
      number: "Day 5",
      navLabel: "D5 採買回台",
      title: "黑門市場、千日前道具屋筋、難波心齋橋，晚班機回台",
      tagline: "最後一天不跑遠，把行李、採買、午餐與前往 KIX 都留在可控範圍。",
      blocks: [
        dailyRoute(["飯店", "黑門市場", "道具屋筋", "難波/心齋橋", "KIX"], ["hotel", "commercial", "commercial", "station", "station"], [
          { mode: "地鐵/步行", duration: "依住宿點約 10–25 分" },
          { mode: "步行", duration: "10–15 分" },
          { mode: "步行", duration: "5–15 分" },
          { mode: "南海/轉乘", duration: "約 45–70 分", note: "預留機場時間" }
        ]),
        dayMedia(image("kuromon-market", "黑門市場"), ["kuromon", "doguyasuji", "namba", "shinsaibashi", "kix"], "Day 5 難波採買與 KIX 回程"),
        schedule([
          ["早上", "退房寄行李，黑門市場短逛", "不要把正餐完全押在市場"],
          ["中午", "道具屋筋、難波午餐", "買廚房小物、食品模型、伴手禮"],
          ["下午", "心齋橋/難波最後採買，回飯店拿行李", "不要排遠點"],
          ["晚上", "前往 KIX，晚班機回 TPE", "夏季雷雨與行李處理要留緩衝"]
        ]),
        recommended(["kuromon", "doguyasuji", "shinsaibashi", "takoyaki", "sushi"]),
        detailsNote("最後一天原則", "最後一天行程不跨城、不上山、不排遠距景點。所有安排都圍繞難波/心齋橋，讓回機場風險最低。")
      ]
    }
  ];
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await downloadImages();
  await writeMaps();
  const trip = buildTrip();
  await writeFile(path.join(outDir, "trip.json"), `${JSON.stringify(trip, null, 2)}\n`, "utf8");
  console.log(`Generated public/data/${tripId}/trip.json with ${trip.content.entities.length} entities.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
