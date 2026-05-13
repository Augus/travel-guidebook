import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "public", "data");
const outputPath = path.join(dataDir, "catalog.generated.json");

function findBlock(trip, type) {
  for (const section of trip.sections ?? []) {
    const block = section.blocks?.find((item) => item.type === type);

    if (block) {
      return block;
    }
  }

  return undefined;
}

function getSubtitle(coverHero) {
  const title = coverHero?.data?.title;

  if (Array.isArray(title)) {
    return title.join(" ");
  }

  return typeof title === "string" ? title : undefined;
}

function getBase(trip, coverHero) {
  if (trip.meta?.recommendedBase) {
    return trip.meta.recommendedBase;
  }

  const meta = Array.isArray(coverHero?.data?.meta) ? coverHero.data.meta : [];
  const base = meta.find((item) => item.includes("住宿") || item.toLowerCase().includes("base"));

  return base?.replace(/^[^:：]*[:：]\s*/, "");
}

function cleanDateRange(value) {
  return value
    .replace(/^[^:：]*[:：]\s*/, "")
    .replace(/\s*[–—-]\s*/, " 到 ")
    .trim();
}

function getDateRange(trip, coverHero) {
  if (trip.meta?.dateRange) {
    return cleanDateRange(trip.meta.dateRange);
  }

  const meta = Array.isArray(coverHero?.data?.meta) ? coverHero.data.meta : [];
  const dateMeta = meta.find((item) => item.includes("日期") || /\d{4}\/\d{1,2}\/\d{1,2}.*[–—-].*\d{1,2}\/\d{1,2}/.test(item));

  if (dateMeta) {
    return cleanDateRange(dateMeta);
  }

  const eyebrow = coverHero?.data?.eyebrow;

  if (typeof eyebrow !== "string") {
    return undefined;
  }

  const dateRange = eyebrow.match(/\d{4}\/\d{1,2}\/\d{1,2}\s*[–—-]\s*(?:\d{4}\/)?\d{1,2}\/\d{1,2}/);

  return dateRange ? cleanDateRange(dateRange[0]) : undefined;
}

async function buildTripEntry(folderName) {
  const tripPath = path.join(dataDir, folderName, "trip.json");
  const raw = await readFile(tripPath, "utf8");
  const trip = JSON.parse(raw);
  const coverHero = findBlock(trip, "coverHero");
  const days = (trip.sections ?? []).flatMap((section) => section.days ?? []);
  const tripStat = await stat(tripPath);

  if (!trip.meta?.id || !trip.meta?.title) {
    throw new Error(`${path.relative(root, tripPath)} is missing meta.id or meta.title`);
  }

  return {
    id: trip.meta.id,
    title: trip.meta.title,
    subtitle: getSubtitle(coverHero),
    description: coverHero?.data?.lead,
    data: `data/${folderName}/trip.json`,
    image: coverHero?.data?.image,
    imageAlt: coverHero?.data?.image ? `${trip.meta.title} cover` : undefined,
    days: days.length || undefined,
    nights: days.length > 1 ? days.length - 1 : undefined,
    base: getBase(trip, coverHero),
    dateRange: getDateRange(trip, coverHero),
    updated: tripStat.mtime.toISOString().slice(0, 10),
    tags: (trip.sections ?? []).map((section) => section.navLabel).filter(Boolean).slice(0, 5),
    actionLabel: `Open ${trip.meta.title}`
  };
}

async function main() {
  const entries = await readdir(dataDir, { withFileTypes: true });
  const tripFolders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
  const trips = [];

  for (const folderName of tripFolders) {
    try {
      trips.push(await buildTripEntry(folderName));
    } catch (error) {
      if (error?.code !== "ENOENT") {
        throw error;
      }
    }
  }

  const catalog = {
    schemaVersion: 1,
    meta: {
      title: "旅遊書目錄",
      language: "zh-Hant"
    },
    hero: {
      eyebrow: "TRIP LIBRARY",
      title: ["旅遊書目錄"],
      lead: "選擇一份行程開始閱讀。",
      image: trips[0]?.image,
      meta: [`目前 ${trips.length} 份行程`, "自動整理資料"]
    },
    catalog: {
      kicker: "Trips",
      title: "行程清單",
      note: ""
    },
    trips,
    footer: ""
  };

  await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  console.log(`Generated ${path.relative(root, outputPath)} from ${trips.length} trip file(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
