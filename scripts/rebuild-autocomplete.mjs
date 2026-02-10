/**
 * content/parking/ JSON 파일 기반으로 parking-autocomplete.json 재생성
 * Usage: node scripts/rebuild-autocomplete.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const parkingDir = path.join(rootDir, 'content', 'parking');
const outputPath = path.join(rootDir, 'public', 'data', 'parking-autocomplete.json');

const SIDO_SHORT = {
  '서울특별시': '서울', '부산광역시': '부산', '대구광역시': '대구',
  '인천광역시': '인천', '광주광역시': '광주', '대전광역시': '대전',
  '울산광역시': '울산', '세종특별자치시': '세종',
  '경기도': '경기', '강원특별자치도': '강원', '강원도': '강원',
  '충청북도': '충북', '충청남도': '충남',
  '전북특별자치도': '전북', '전라북도': '전북', '전라남도': '전남',
  '경상북도': '경북', '경상남도': '경남', '제주특별자치도': '제주',
};

// 집계용 맵
const sidoCounts = {};       // sido -> count
const sigunguCounts = {};    // "sido|sigungu" -> count
const dongCounts = {};       // "sido|sigungu|dong" -> count

const sidos = fs.readdirSync(parkingDir).filter(f =>
  fs.statSync(path.join(parkingDir, f)).isDirectory()
);

for (const sido of sidos) {
  const sidoDir = path.join(parkingDir, sido);
  const files = fs.readdirSync(sidoDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const sigungu = file.replace('.json', '');
    const filePath = path.join(sidoDir, file);

    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      const items = data.items || [];
      const count = items.length;

      // 시도 집계
      sidoCounts[sido] = (sidoCounts[sido] || 0) + count;

      // 시군구 집계
      const sgKey = `${sido}|${sigungu}`;
      sigunguCounts[sgKey] = (sigunguCounts[sgKey] || 0) + count;

      // 동 집계
      for (const item of items) {
        if (item.dong) {
          const dKey = `${sido}|${sigungu}|${item.dong}`;
          dongCounts[dKey] = (dongCounts[dKey] || 0) + 1;
        }
      }
    } catch (e) {
      console.error(`Error reading ${filePath}:`, e.message);
    }
  }
}

// 결과 배열 생성
const result = [];

// 시도
for (const [sido, count] of Object.entries(sidoCounts)) {
  result.push({
    label: sido,
    short: SIDO_SHORT[sido] || '',
    type: 'sido',
    count,
  });
}

// 시군구
for (const [key, count] of Object.entries(sigunguCounts)) {
  const [sido, sigungu] = key.split('|');
  result.push({
    label: sigungu,
    full: `${sido} ${sigungu}`,
    type: 'sigungu',
    sido,
    count,
  });
}

// 동
for (const [key, count] of Object.entries(dongCounts)) {
  const [sido, sigungu, dong] = key.split('|');
  result.push({
    label: dong,
    full: `${sido} ${sigungu} ${dong}`,
    type: 'dong',
    sido,
    sigungu,
    desc: `${sigungu}`,
    count,
  });
}

// 정렬: type 우선 (sido > sigungu > dong), count 내림차순
const typeOrder = { sido: 0, sigungu: 1, dong: 2 };
result.sort((a, b) => {
  const ta = typeOrder[a.type] ?? 3;
  const tb = typeOrder[b.type] ?? 3;
  if (ta !== tb) return ta - tb;
  return b.count - a.count;
});

fs.writeFileSync(outputPath, JSON.stringify(result), 'utf-8');
console.log(`Done! ${result.length} entries written to ${outputPath}`);
console.log(`  sido: ${Object.keys(sidoCounts).length}`);
console.log(`  sigungu: ${Object.keys(sigunguCounts).length}`);
console.log(`  dong: ${Object.keys(dongCounts).length}`);
