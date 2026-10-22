// Checks every source link in index.html (plus the page's own outbound links).
// Writes link-report.md, adds it to the GitHub Actions job summary, and exits 1
// if anything is broken. Sites that block automated checks are listed for a
// manual look but don't count as broken.
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

// Evaluate only the URL prefixes and the SRC object from the page script.
const from = html.indexOf("const NNG=");
const open = html.indexOf("{", html.indexOf("const SRC=", from));
if (from < 0 || open < 0) throw new Error("Couldn't find the sources (const NNG= / const SRC=) in index.html.");
const SRC = vm.runInNewContext(html.slice(from, closingBrace(html, open) + 1) + ";SRC");

// One entry per URL, remembering every card that cites it.
const links = new Map();
const add = (url, card, label) => {
  const link = links.get(url) || { url, label, cards: [] };
  if (card) link.cards.push(card);
  links.set(url, link);
};
for (const [card, sources] of Object.entries(SRC)) {
  for (const [publisher, title, url] of sources) add(url, card, `${publisher}: ${title}`);
}
for (const [, url] of html.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
  if (!/fonts\.(googleapis|gstatic)\.com/.test(url)) add(url, null, "Page link");
}

const AGENT = "UX-Decision-Handbook-link-check/1.0 (+https://github.com/georgeplendl/The-UX-Decision-Handbook)";
const BLOCKED = new Set([401, 403, 429, 451, 999]);

// Hosts are checked in parallel; links on the same host go one at a time with a
// short pause, so a site with many citations (NN/g) isn't hammered.
const byHost = Map.groupBy([...links.values()], link => new URL(link.url).host);
const queue = [...byHost.values()];
const results = [];
await Promise.all(Array.from({ length: 8 }, async () => {
  for (let group; (group = queue.shift()); ) {
    for (const link of group) {
      results.push({ ...link, ...(await check(link.url)) });
      await sleep(400);
    }
  }
}));

const broken = results.filter(r => r.state === "broken");
const blocked = results.filter(r => r.state === "blocked");
const today = new Date().toISOString().slice(0, 10);
const table = rows => [
  "| Cited on | Source | Problem |",
  "|---|---|---|",
  ...rows.map(r => `| ${r.cards.length ? r.cards.map(c => `\`${c}\``).join(", ") : "page"} | [${escape(r.label)}](${r.url}) | ${r.problem} |`),
].join("\n");

const report = [
  `## Source link check, ${today}`,
  "",
  `Checked ${results.length} links in \`index.html\`.`,
  "",
  broken.length ? `### ${broken.length} broken\n\n${table(broken)}` : "No broken links.",
  blocked.length ? `\n### ${blocked.length} couldn't be checked\n\nThese sites block automated requests. Open them by hand if you want to be sure.\n\n${table(blocked)}` : "",
].join("\n");

writeFileSync(new URL("../link-report.md", import.meta.url), report + "\n");
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + "\n");
console.log(report);
process.exit(broken.length ? 1 : 0);

async function check(url) {
  let last;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        headers: { "user-agent": AGENT, accept: "text/html,*/*;q=0.8" },
        signal: AbortSignal.timeout(20000),
      });
      res.body?.cancel();
      const was = new URL(url), now = new URL(res.url);
      if (res.ok && res.redirected && now.pathname === "/" && was.pathname !== "/") {
        return { state: "broken", problem: `Redirects to the home page (${now.host})` };
      }
      if (res.ok) return { state: "ok" };
      if (BLOCKED.has(res.status)) return { state: "blocked", problem: `HTTP ${res.status}` };
      last = { state: "broken", problem: `HTTP ${res.status}` };
      if (res.status < 500) return last;            // 404, 410, etc. won't fix themselves on a retry
    } catch (err) {
      last = { state: "broken", problem: err.name === "TimeoutError" ? "Timed out" : `Unreachable (${err.cause?.code || err.message})` };
    }
    await sleep(3000);
  }
  return last;
}

function closingBrace(text, i) {
  let depth = 0, quote = null;
  for (; i < text.length; i++) {
    const c = text[i];
    if (quote) { if (c === "\\") i++; else if (c === quote) quote = null; continue; }
    if (c === '"' || c === "'" || c === "`") quote = c;
    else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return i;
  }
  throw new Error("Unbalanced braces in the SRC block.");
}

function escape(text) {
  return text.replace(/[|[\]]/g, "\\$&");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
