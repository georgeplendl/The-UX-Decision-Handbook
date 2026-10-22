# The UX Decision Handbook

**Make interface decisions you can defend in any design review.**

A field guide by [George Plendl](https://georgeplendl.me) to 62 everyday interface calls, such as tabs or sidebar, skeleton or spinner, and undo or confirm. Every card gives you a one-line rule, the thresholds behind it, a live demo of each option, a sentence you can say in review, and sources you can cite.

It's a single HTML file. Open it in a browser and start reading. There's no build step and nothing to install.

## What's on each card

| Section | What it gives you |
|---|---|
| **The rule** | The decision in one line, e.g. *"Match the loader to the wait: nothing for a blink, structure for seconds, real progress for longer."* |
| **Try it** | A working mini-interface for every option, so you can feel the difference instead of imagining it |
| **When to pick each** | The signals that point to one option over the other |
| **Thresholds** | The numbers and cut-offs: item counts, wait times, form lengths |
| **Say it in review** | A ready-made rationale with a Copy button, for critiques, pull requests, and design docs |
| **Exceptions** | The situations where the usual answer flips |
| **Sources** | 4–5 credible references per card to dig deeper |

On the index, each card shows a minimal preview of its first option. Hover over it to see the alternative.

## The 62 decisions

**Navigation** (12): Tabs or Sidebar · Bottom Bar or Menu · Pagination or Infinite Scroll · Accordion or Tabs · Same Tab or New Tab · Breadcrumbs or Back · Browse or Search · Suggestions or Results · Instant or Apply · Group or Search · URL or Local State · Restore or Reset

**State & feedback** (13): Skeleton or Spinner · Toast or Inline · Inline or Summary · Guide or Sample · Relative or Absolute Time · Count or Dot · Progress or Indeterminate · Optimistic or Wait · Retry or Explain · Interrupt or Inbox · Exact or Rounded · Live or On Request · Partial or Nothing

**Flow & continuity** (13): Modal, Panel, or Page · Undo or Confirm · Delete or Archive · Autosave or Save · Warn or Keep · One Page or Steps · Show or Disclose · Inline Edit or Edit Mode · Tour or Just-in-Time · Gate or Guest · Wizard or Checklist · Bulk or One by One · Drag or Controls

**Hierarchy & focus** (12): Primary or Secondary · Button or Link · Table or Cards · Icon or Label · Visible or Overflow · Truncate or Wrap · Color or Label · Hover or Always · Comfortable or Compact · Sticky or In-Flow · Chart or Number · Narrow or Full Width

**Input & affordance** (12): Radio or Dropdown · Toggle or Checkbox · Label or Placeholder · Required or Optional · Live or On Submit · Disable or Hide · Free Text or Picker · Ask or Default · Strict or Forgiving · One Field or Split · Mask or Show · Slider or Number Field

Within each category, the decisions teams run into most often come first. That order is editorial judgment, not usage data.

## Sources

The cards cite 271 unique sources (304 citations in all). The main publishers are:

- Nielsen Norman Group (120 citations)
- Baymard Institute
- GOV.UK Design System
- Smashing Magazine
- Material Design 3
- W3C (WCAG 2.2 and WAI-ARIA)
- IBM Carbon
- Atlassian Design
- AWS Cloudscape
- Apple Human Interface Guidelines
- Luke Wroblewski
- MDN

Every link was checked when it was added in October 2026.

Some thresholds are practitioner rules of thumb rather than research findings. Examples include a tour of "about three steps" and switching from relative to absolute time "after about a week." Treat those as starting points, not laws.

## Using it

- Open `Decision Cards Field Guide.html` in any modern browser. The only external request is for the IBM Plex fonts from Google Fonts.
- Filter by category with the tabs, or scroll through all five sections.
- Open a card to try its demo. Use the ← and → keys to move between cards and Esc to close.
- Every card has its own link, so you can share one directly, e.g. `…/Decision Cards Field Guide.html#skeleton-spinner`.

The demos use a fictional wholesale brand, Northwind, so the examples feel like a real product.

## Design

The page follows [`DESIGN.md`](DESIGN.md), a visual spec inspired by IBM's Carbon Design System:

- IBM Plex Sans, with light weights for display sizes
- Square corners, and one blue accent
- Hairlines instead of shadows
- A light theme only

The guide also tries to follow its own advice:

- Everything works with a keyboard and has a visible focus ring.
- Demos announce changes to screen readers.
- Animations respect the reduced-motion setting.
- The layout holds up down to a 360px-wide phone screen.

## Project structure

```
├── Decision Cards Field Guide.html   The whole guide: markup, styles, card data, demos, previews
├── DESIGN.md                         The visual design spec the page follows
├── README.md
└── LICENSE
```

To edit content, look for these in the page's `<script>`:

| Name | What it holds |
|---|---|
| `CATS` | The five categories and their one-line descriptions |
| `CARDS` | Each card's question, rule, options, thresholds, review line, and exception |
| `D` | The live demo for each card, keyed by card ID |
| `SRC` | The sources for each card |
| `PV` | The index preview glyphs |
| `ORDER` | The order of cards within each category |

## License

[MIT](LICENSE) © 2026 George Plendl.

The visual style is inspired by IBM's Carbon Design System; this project is not affiliated with IBM. Linked articles belong to their publishers.
