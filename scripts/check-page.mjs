// Runs before every deploy. Fails if the page script throws, or if any card is
// missing its demo, sources, or index preview.
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const start = html.indexOf("<script>"), end = html.lastIndexOf("</script>");
if (start < 0 || end < start) fail("No <script> block found in index.html.");

// A stand-in DOM: every property is another stub and every call returns one,
// so the page's setup code can run without a browser.
const stub = () => new Proxy(function () {}, {
  get: (_, key) =>
    key === Symbol.toPrimitive ? () => "" :
    key === "style" ? { setProperty() {} } :
    key === "dataset" ? {} :
    key === "querySelectorAll" ? () => [] :
    stub(),
  set: () => true,
  apply: () => stub(),
});
const context = vm.createContext({
  document: stub(),
  location: { hash: "", pathname: "/", search: "" },
  history: { replaceState() {} },
  matchMedia: () => ({ matches: true }),
  setTimeout, clearTimeout, setInterval, clearInterval, console,
});

let page;
try {
  page = vm.runInContext(html.slice(start + 8, end) + "\n;({ CARDS, CATS, D, SRC, PV })", context);
} catch (err) {
  fail(`The page script threw: ${err.message}`);
}

const { CARDS, CATS, D, SRC, PV } = page;
const problems = [];
const seen = new Set();
for (const card of CARDS) {
  const id = card.id, n = card.opts.length;
  if (seen.has(id)) problems.push(`${id}: duplicate card id`);
  seen.add(id);
  if (!CATS[card.cat]) problems.push(`${id}: unknown category "${card.cat}"`);
  if (!D[id]) problems.push(`${id}: no demo`);
  else if (D[id].cap.length !== n) problems.push(`${id}: ${D[id].cap.length} demo captions for ${n} options`);
  if (!SRC[id] || SRC[id].length < 3) problems.push(`${id}: fewer than 3 sources`);
  if (!PV[id]) problems.push(`${id}: no index preview`);
  else if (PV[id].length !== n) problems.push(`${id}: ${PV[id].length} preview frames for ${n} options`);
}

if (problems.length) fail(`${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
console.log(`OK: ${CARDS.length} cards, each with a demo, sources, and a preview.`);

function fail(message) {
  console.error(message);
  process.exit(1);
}
