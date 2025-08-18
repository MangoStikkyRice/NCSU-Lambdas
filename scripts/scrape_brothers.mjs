import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';

const ALUMNI_URL = 'http://lphiencsu.weebly.com/alumni.html';

const CLASS_NAMES = [
  'Charter Conquest',
  'Alpha Ascension',
  'Beta Battalion',
  'Gamma Guardians',
  'Delta Dimension',
  'Epsilon Eclipse',
  'Zeta Zaibatsu',
  'Eta Evolution',
  'Theta Trinity',
  'Iota Immortals',
  'Kappa Kazoku',
  'Mu Monarchs',
  'Nu Nen',
  'Xi Xin',
];

function parseMemberText(text, classField) {
  // Example: #1. David "Patroclus" Chang
  const idMatch = text.match(/^#?(\d+)/);
  const id = idMatch ? parseInt(idMatch[1], 10) : null;

  // Extract line name inside quotes
  const lineMatch = text.match(/"(.*?)"/);
  const line_name = lineMatch ? lineMatch[1].trim() : '';

  // Remove leading id and dot, and the quoted part to get the name
  const namePart = text.replace(/^#?\d+\.?\s*/, '').trim();
  const name = namePart
    .replace(/".*?"/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g,'')
    .replace(/\s+/g,' ')
    .trim();

  if (!id || !name) return null;

  return {
    id,
    name,
    line_name,
    status: 'Alumni',
    class_field: classField || null,
    major: null,
    hobbies: [],
    image: null,
    casual_image1: null,
    casual_image2: null,
    casual_image3: null,
    bigId: null,
    littleIds: [],
  };
}

async function main() {
  const { data: html } = await axios.get(ALUMNI_URL, { timeout: 20000 });
  const $ = cheerio.load(html);

  const members = [];

  $('table').each((_, tbl) => {
    const tableText = $(tbl).text();
    const classField = CLASS_NAMES.find((c) => tableText.includes(c)) || null;

    $(tbl)
      .find('a')
      .each((__, a) => {
        const t = $(a).text().trim();
        const href = $(a).attr('href');
        const m = parseMemberText(t, classField);
        if (m) {
          if (!m.page) {
            m.page = href && href.startsWith('http') ? href : href ? `http://lphiencsu.weebly.com${href}` : null;
          }
          members.push(m);
        }
      });
  });

  // De-duplicate by id and sort
  const byId = new Map();
  for (const m of members) {
    if (!byId.has(m.id)) byId.set(m.id, m);
  }
  const list = Array.from(byId.values()).sort((a, b) => a.id - b.id);

  // Build name->id map for linking big/littles by name
  const normalize = (s) => (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu,'')
    .replace(/".*?"/g,'')
    .replace(/[^a-z0-9\s]/g,' ')
    .replace(/\s+/g,' ')
    .trim();

  const nameToId = new Map(list.map(m => [normalize(m.name), m.id]));

  // Visit each member page to extract extra fields
  for (const m of list) {
    if (!m.page) continue;
    try {
      const { data: pageHtml } = await axios.get(m.page, { timeout: 20000 });
      const $p = cheerio.load(pageHtml);

      const $t = $p('table').first();
      const tableTextRaw = $t.text().replace(/\s+/g,' ').trim();
      const bodyText = tableTextRaw.replace(/\*+/g, '');

      // Major
      const majorMatch = bodyText.match(/Major\s*:??\s*([^\n]+?)(?:Hobbies|Big\s*Brother|Little\s*Brother|$)/i);
      if (majorMatch) {
        const major = majorMatch[1]
          .replace(/[\u200B-\u200D\uFEFF]/g,'')
          .replace(/^\s*:\s*/, '')
          .replace(/\s+\*\*.*$/,'')
          .trim();
        if (major) m.major = major;
      }

      // Hobbies
      const hobbiesMatch = bodyText.match(/Hobbies\s*:??\s*([^\n]+?)(?:Big\s*Brother|Little\s*Brother|Major|$)/i);
      if (hobbiesMatch) {
        let hobbiesRaw = hobbiesMatch[1]
          .replace(/\*+/g,'')
          .replace(/[\u200B-\u200D\uFEFF]/g,'')
          .replace(/Powered by.*$/i,'')
          .trim();
        const hobbies = hobbiesRaw
          .split(/,|\u2022|\||\band\b/i)
          .map(s=>s.replace(/^[\s:]+/, '').trim())
          .filter(Boolean)
          .filter(s => !/(weebly|analytics|http|script|function|document|window|cdn|google-analytics|snowday|\[|\]|\(|\))/i.test(s))
          .filter(s => s.length <= 40);
        if (hobbies.length) m.hobbies = hobbies;
      }

      // Big brother: try to get the text after label; if anchor exists, use its text
      let bigName = null;
      // Prefer anchor near the label
      $t.find('a').each((_, a) => {
        const href = $p(a).attr('href') || '';
        const txt = $p(a).text().trim();
        if (/member-page/i.test(href) && /Big\s*Brother:/i.test($p(a).parent().text())) {
          bigName = txt;
        }
      });
      if (!bigName) {
        const bigMatch = bodyText.match(/Big\s*Brother:\s*([^*\n]+?)(?:Little Brother|Major|Hobbies|$)/i);
        if (bigMatch) bigName = bigMatch[1].trim();
      }
      if (bigName) {
        const norm = normalize(bigName);
        m.bigId = nameToId.get(norm) || null;
      }

      // Little brothers: collect anchors near label; fallback to text
      const littleIds = new Set();
      $t.find('a').each((_, a) => {
        const href = $p(a).attr('href') || '';
        const txt = $p(a).text().trim();
        if (/member-page/i.test(href)) {
          const parentTxt = $p(a).parent().text();
          if (/Little\s*Brother/i.test(parentTxt)) {
            const id = nameToId.get(normalize(txt));
            if (id && id !== m.id) littleIds.add(id);
          }
        }
      });
      if (!littleIds.size) {
        const littleMatch = bodyText.match(/Little\s*Brother[s]?:\s*([^*\n]+?)(?:Major|Hobbies|Big Brother|$)/i);
        if (littleMatch) {
          const names = littleMatch[1].split(/,|\band\b|\u2022|\|/i).map(s=>s.replace(/\[|\]|\(|\)/g,'').trim()).filter(Boolean);
          for (const nm of names) {
            const id = nameToId.get(normalize(nm));
            if (id && id !== m.id) littleIds.add(id);
          }
        }
      }
      m.littleIds = Array.from(littleIds);
    } catch (e) {
      // Keep defaults if page fails
    }
  }

  // Remove helper fields before writing
  for (const m of list) {
    delete m.page;
  }
  fs.writeFileSync('src/data/brothers.json', JSON.stringify(list, null, 2));
  console.log(`Wrote ${list.length} records to src/data/brothers.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


