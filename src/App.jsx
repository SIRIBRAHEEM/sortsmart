import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, ITEMS, searchItems } from "./data/items.js";
import { Badge, Button, Card, Input, Label, Progress, Select } from "./components/ui.jsx";
import { cn } from "./lib/utils.js";

// SortSmart: a waste sorting helper for Nigerian households.
// Four parts: look an item up, test yourself with a quiz, log what you
// throw away, and read plain guidance on where things should go.
// Design: bold eco-poster. Lime and forest green on off-white, chunky
// display type, sticker cards with hard shadows, bin-colour chips.

const CATEGORY_META = {
  Recyclable: { ink: "#14532d", bg: "#dcfce7", edge: "#15803d", dot: "#22c55e", icon: "recycle" },
  Organic: { ink: "#92400e", bg: "#fef3c7", edge: "#d97706", dot: "#f59e0b", icon: "leaf" },
  Hazardous: { ink: "#991b1b", bg: "#fee2e2", edge: "#dc2626", dot: "#ef4444", icon: "alert" },
  General: { ink: "#334155", bg: "#e2e8f0", edge: "#64748b", dot: "#94a3b8", icon: "trash" },
};

const LOG_KEY = "sortsmart-log-v1";

function loadLog() {
  try {
    const saved = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function dayLabel(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" });
}

// ---------- Icons (inline SVG, Lucide style) ----------

const ICON_PATHS = {
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  recycle: (
    <>
      <path d="M7 19H4.8a1.8 1.8 0 0 1-1.6-2.7l1.6-2.8A1.8 1.8 0 0 1 6.4 12h3.1" />
      <path d="m14.5 5.5-1.9-3.3A1.8 1.8 0 0 0 9.5 1.6L8 4.2" />
      <path d="M17.5 8.5l1.7 2.9a1.8 1.8 0 0 1-1.6 2.7H14" />
      <path d="M9.5 5.5 12 1.8a1.8 1.8 0 0 1 3.1 0l1.5 2.6" />
      <path d="M14.5 18.5 12 22.2a1.8 1.8 0 0 1-3.1 0L7.4 19.6" />
      <path d="M6.5 15.5 4.8 12.6A1.8 1.8 0 0 1 6.4 9.9H10" />
    </>
  ),
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </>
  ),
  alert: (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </>
  ),
  trophy: (
    <>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </>
  ),
  book: (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
  ),
  notebook: (
    <>
      <path d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4z" />
      <path d="M4 2v20" />
      <path d="M8 7h9" />
      <path d="M8 12h9" />
      <path d="M8 17h6" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  x: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  plus: (
    <>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </>
  ),
  again: (
    <>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  sprout: (
    <>
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4.1.7-4.9 2z" />
    </>
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m4.9 4.9 14.2 14.2" />
    </>
  ),
  package: (
    <>
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
      <path d="M12 22V12" />
      <path d="m3.3 7 8.7 5 8.7-5" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <path d="m5.6 5.6 2.2 2.2" />
      <path d="m16.2 16.2 2.2 2.2" />
      <path d="m18.4 5.6-2.2 2.2" />
      <path d="m7.8 16.2-2.2 2.2" />
    </>
  ),
};

function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

function CategoryBadge({ category, className = "" }) {
  const meta = CATEGORY_META[category];
  return (
    <Badge
      className={className}
      style={{ background: meta.bg, borderColor: meta.edge, color: meta.ink }}
    >
      <Icon name={meta.icon} className="h-3.5 w-3.5" />
      {category}
    </Badge>
  );
}

// ---------- App shell ----------

const TABS = [
  { id: "lookup", label: "Look it up", icon: "search" },
  { id: "quiz", label: "Sorting quiz", icon: "trophy" },
  { id: "log", label: "My waste log", icon: "notebook" },
  { id: "guide", label: "Guide", icon: "book" },
];

export default function App() {
  const [tab, setTab] = useState("lookup");

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-14 sm:px-6">
      <header className="pt-8 pb-2">
        <div className="mb-4 inline-flex -rotate-1 items-center gap-2 rounded-full border-2 border-forest-900 bg-lime-pop px-3.5 py-1 text-[12px] font-extrabold tracking-widest text-forest-950 uppercase shadow-sticker-sm">
          <Icon name="sparkles" className="h-3.5 w-3.5" />
          Arbiter Hacks V1 · Rethinking Waste
        </div>
        <h1 className="font-display text-[44px] leading-[0.95] tracking-tight text-forest-950 uppercase sm:text-[64px]">
          Sort
          <span className="ml-2 inline-block -rotate-2 rounded-2xl border-[3px] border-forest-900 bg-lime-pop px-3 pb-1 text-forest-950 shadow-sticker">
            Smart
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-lg font-medium text-ink/75">
          Know where your waste goes. Built for Nigerian households.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {[
            ["54 items in the guide", "package"],
            ["4 bins, colour coded", "recycle"],
            ["Works offline, no account", "check"],
          ].map(([text, icon]) => (
            <span
              key={text}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-forest-900 bg-white px-3 py-1 text-[13px] font-bold text-forest-900"
            >
              <Icon name={icon} className="h-3.5 w-3.5" />
              {text}
            </span>
          ))}
        </div>
      </header>

      <nav className="sticky top-3 z-20 mt-6 mb-6 flex flex-wrap gap-2 rounded-3xl border-2 border-forest-900 bg-paper/90 p-2 shadow-sticker backdrop-blur">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 px-3 py-2.5 text-[14px] font-extrabold whitespace-nowrap transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-pop/60 sm:text-[15px]",
              tab === t.id
                ? "border-forest-900 bg-forest-900 text-white shadow-sticker-sm"
                : "border-transparent text-forest-900 hover:border-forest-900 hover:bg-lime-soft",
            )}
          >
            <Icon name={t.icon} className="h-4.5 w-4.5" />
            {t.label}
          </button>
        ))}
      </nav>

      <main>
        {tab === "lookup" && <Lookup />}
        {tab === "quiz" && <Quiz />}
        {tab === "log" && <WasteLog />}
        {tab === "guide" && <Guide />}
      </main>

      <footer className="mt-10 rounded-3xl border-2 border-forest-900 bg-forest-900 px-6 py-5 text-center shadow-sticker-lime">
        <p className="font-display text-lg tracking-wide text-lime-pop uppercase">
          Sort it right, every time
        </p>
        <p className="mx-auto mt-2 max-w-lg text-sm text-white/80">
          SortSmart helps you sort waste correctly: recyclable, organic, hazardous,
          or general waste. Categories follow what buy-back centres, waste collectors
          and compost heaps in Nigeria actually accept.
        </p>
      </footer>
    </div>
  );
}

// ---------- Lookup ----------

function Lookup() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const results = useMemo(() => searchItems(query, filter), [query, filter]);

  return (
    <section>
      <h2 className="font-display text-[28px] tracking-tight text-forest-950 uppercase sm:text-[34px]">
        Look it up
      </h2>
      <p className="mt-1.5 text-ink/70">
        Type an item, like "plastic bottle" or "yam peels", and see where it goes.
      </p>

      <div className="relative mt-5">
        <Icon
          name="search"
          className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-forest-900/50"
        />
        <Input
          className="rounded-2xl py-3.5 pr-4 pl-12 text-[17px] font-medium shadow-sticker-sm"
          type="text"
          placeholder="Search an item, e.g. battery, sachet, yam peels..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map((c) => {
          const meta = CATEGORY_META[c];
          const active = filter === c;
          return (
            <button
              key={c}
              onClick={() => {
                setFilter(c);
                setSelected(null);
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-[14px] font-extrabold transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-pop/60",
                active
                  ? "border-forest-900 bg-forest-900 text-white shadow-sticker-sm"
                  : "border-forest-900/25 bg-white text-ink/70 hover:border-forest-900 hover:text-forest-900",
              )}
            >
              {meta && (
                <span
                  className="h-3 w-3 rounded-full border border-black/20"
                  style={{ background: meta.dot }}
                />
              )}
              {c}
            </button>
          );
        })}
      </div>

      {selected && (
        <Card
          className="mt-6 -rotate-[0.4deg] p-6"
          style={{ borderColor: CATEGORY_META[selected.category].edge }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="font-display text-2xl tracking-tight text-forest-950">
              {selected.name}
            </h3>
            <CategoryBadge category={selected.category} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-forest-900/15 bg-paper p-4">
              <p className="mb-1 text-[12px] font-extrabold tracking-widest text-forest-900 uppercase">
                What to do
              </p>
              <p className="text-[15px] leading-relaxed">{selected.how}</p>
            </div>
            <div className="rounded-2xl border-2 border-forest-900/15 bg-paper p-4">
              <p className="mb-1 text-[12px] font-extrabold tracking-widest text-forest-900 uppercase">
                Why
              </p>
              <p className="text-[15px] leading-relaxed">{selected.why}</p>
            </div>
          </div>
        </Card>
      )}

      <p className="mt-7 mb-3 text-sm font-bold tracking-wide text-ink/55 uppercase">
        {results.length} item{results.length === 1 ? "" : "s"} found
      </p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {results.map((item, i) => {
          const meta = CATEGORY_META[item.category];
          return (
            <li key={item.name}>
              <button
                onClick={() => setSelected(item)}
                className={cn(
                  "group flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-forest-900 bg-white px-4 py-3.5 text-left shadow-sticker-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sticker focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-pop/60",
                  i % 2 === 0 ? "hover:-rotate-[0.5deg]" : "hover:rotate-[0.5deg]",
                  selected?.name === item.name && "bg-lime-soft",
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2"
                    style={{ background: meta.bg, borderColor: meta.edge, color: meta.ink }}
                  >
                    <Icon name={meta.icon} className="h-4.5 w-4.5" />
                  </span>
                  <span className="text-[15px] font-bold text-ink">{item.name}</span>
                </span>
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-[11.5px] font-extrabold tracking-wide uppercase"
                  style={{ background: meta.bg, color: meta.ink }}
                >
                  {item.category}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {results.length === 0 && (
        <Card className="mt-4 p-6 text-center" sticker={false}>
          <p className="font-bold text-ink/70">
            Nothing matches that search yet. Try a shorter word, like "bottle" or "peels".
          </p>
        </Card>
      )}
    </section>
  );
}

// ---------- Quiz ----------

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function startQuiz() {
    const pickedItems = shuffle(ITEMS).slice(0, 8);
    setQuestions(pickedItems.map((item) => ({ item, options: shuffle(CATEGORIES) })));
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  // Start a quiz the first time the tab opens.
  useEffect(() => {
    if (questions.length === 0) startQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (questions.length === 0) return <p className="font-bold text-ink/60">Loading the quiz...</p>;

  if (done) {
    const message =
      score === 8
        ? "Perfect score. You know your bins."
        : score >= 6
          ? "Good work. A few items still trip you up, try again."
          : score >= 4
            ? "Not bad. Read the guide and try again, you will do better."
            : "Keep learning. Read the guide, then try the quiz again.";
    return (
      <section>
        <Card className="p-8 text-center">
          <span className="mx-auto flex h-16 w-16 -rotate-3 items-center justify-center rounded-2xl border-2 border-forest-900 bg-lime-pop text-forest-950 shadow-sticker-sm">
            <Icon name="trophy" className="h-8 w-8" />
          </span>
          <h2 className="mt-5 font-display text-[28px] tracking-tight text-forest-950 uppercase">
            Your score
          </h2>
          <p className="font-display mt-2 text-[64px] leading-none text-forest-900">
            {score}
            <span className="text-[28px] text-ink/40"> / 8</span>
          </p>
          <div className="mx-auto mt-4 max-w-xs">
            <Progress value={(score / 8) * 100} />
          </div>
          <p className="mx-auto mt-4 max-w-md font-medium text-ink/75">{message}</p>
          <Button variant="lime" className="mt-6" onClick={startQuiz}>
            <Icon name="again" className="h-4.5 w-4.5" />
            Play again
          </Button>
        </Card>
      </section>
    );
  }

  const current = questions[index];

  function answer(choice) {
    if (picked) return;
    setPicked(choice);
    if (choice === current.item.category) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex(index + 1);
      setPicked(null);
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-[28px] tracking-tight text-forest-950 uppercase sm:text-[34px]">
          Sorting quiz
        </h2>
        <span className="rounded-full border-2 border-forest-900 bg-white px-3.5 py-1 text-[13px] font-extrabold text-forest-900">
          Question {index + 1} of {questions.length} · Score: {score}
        </span>
      </div>
      <Progress className="mt-4" value={((index + (picked ? 1 : 0)) / questions.length) * 100} />

      <Card className="mt-6 p-6 sm:p-8">
        <p className="text-[12px] font-extrabold tracking-widest text-forest-900/60 uppercase">
          Where does this go?
        </p>
        <p className="font-display mt-2 text-[26px] leading-tight tracking-tight text-forest-950 sm:text-[32px]">
          {current.item.name}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {current.options.map((option) => {
            const meta = CATEGORY_META[option];
            let stateClass = "border-forest-900 bg-white hover:bg-lime-soft hover:-translate-y-0.5 hover:shadow-sticker-sm";
            if (picked) {
              if (option === current.item.category) {
                stateClass = "border-forest-900 bg-lime-pop text-forest-950 shadow-sticker-sm";
              } else if (option === picked) {
                stateClass = "border-red-700 bg-red-100 text-red-900";
              } else {
                stateClass = "border-forest-900/20 bg-white text-ink/45";
              }
            }
            return (
              <button
                key={option}
                onClick={() => answer(option)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-2 px-5 py-4 text-left text-[16px] font-extrabold transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-pop/60",
                  stateClass,
                )}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2"
                  style={{ background: meta.bg, borderColor: meta.edge, color: meta.ink }}
                >
                  <Icon name={meta.icon} className="h-4.5 w-4.5" />
                </span>
                <span className="flex-1">{option}</span>
                {picked && option === current.item.category && (
                  <Icon name="check" className="h-5 w-5 shrink-0" />
                )}
                {picked && option === picked && option !== current.item.category && (
                  <Icon name="x" className="h-5 w-5 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {picked && (
          <div
            className={cn(
              "mt-6 rounded-2xl border-2 p-5",
              picked === current.item.category
                ? "border-forest-900 bg-lime-soft"
                : "border-red-700 bg-red-50",
            )}
          >
            {picked === current.item.category ? (
              <p className="font-medium">
                <strong className="font-extrabold text-forest-900">Correct.</strong>{" "}
                {current.item.why}
              </p>
            ) : (
              <p className="font-medium">
                <strong className="font-extrabold text-red-800">Not quite.</strong>{" "}
                {current.item.name} is {current.item.category.toLowerCase()}. {current.item.how}
              </p>
            )}
            <Button className="mt-4" onClick={next}>
              {index + 1 >= questions.length ? "See my score" : "Next question"}
              <Icon name="arrow" className="h-4.5 w-4.5" />
            </Button>
          </div>
        )}
      </Card>
    </section>
  );
}

// ---------- Waste log ----------

function WasteLog() {
  const [entries, setEntries] = useState(loadLog);
  const [itemName, setItemName] = useState(ITEMS[0].name);
  const [qty, setQty] = useState(1);
  const [date, setDate] = useState(todayISO());

  useEffect(() => {
    localStorage.setItem(LOG_KEY, JSON.stringify(entries));
  }, [entries]);

  function addEntry(e) {
    e.preventDefault();
    const item = ITEMS.find((i) => i.name === itemName);
    if (!item) return;
    const entry = {
      id: Date.now(),
      name: item.name,
      category: item.category,
      qty: Math.max(1, Number(qty) || 1),
      date,
    };
    setEntries((prev) => [entry, ...prev]);
    setQty(1);
  }

  function removeEntry(id) {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  const totals = CATEGORIES.map((c) => ({
    category: c,
    count: entries.filter((e) => e.category === c).reduce((sum, e) => sum + e.qty, 0),
  }));
  const totalLogged = totals.reduce((sum, t) => sum + t.count, 0);

  // Last 7 days, oldest first, for the chart.
  const days = useMemo(() => {
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      out.push(d.toISOString().slice(0, 10));
    }
    return out;
  }, []);
  const perDay = days.map((d) =>
    entries.filter((e) => e.date === d).reduce((sum, e) => sum + e.qty, 0),
  );
  const maxDay = Math.max(1, ...perDay);

  return (
    <section>
      <h2 className="font-display text-[28px] tracking-tight text-forest-950 uppercase sm:text-[34px]">
        My waste log
      </h2>
      <p className="mt-1.5 max-w-2xl text-ink/70">
        Log what you throw away. The totals show how much of your waste is recyclable,
        organic, hazardous, or general. Entries are saved on this device.
      </p>

      <Card className="mt-6 p-6">
        <form className="flex flex-wrap items-end gap-4" onSubmit={addEntry}>
          <div className="min-w-[220px] flex-1">
            <Label htmlFor="log-item">Item</Label>
            <Select id="log-item" value={itemName} onChange={(e) => setItemName(e.target.value)}>
              {ITEMS.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} ({item.category})
                </option>
              ))}
            </Select>
          </div>
          <div className="w-28">
            <Label htmlFor="log-qty">How many</Label>
            <Input
              id="log-qty"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>
          <div className="w-44">
            <Label htmlFor="log-date">Date</Label>
            <Input id="log-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <Button variant="lime" type="submit">
            <Icon name="plus" className="h-4.5 w-4.5" />
            Add to log
          </Button>
        </form>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6" sticker={false}>
          <h3 className="font-display text-lg tracking-tight text-forest-950 uppercase">
            Totals by category
          </h3>
          {totalLogged === 0 ? (
            <p className="mt-3 font-medium text-ink/60">No entries yet. Add your first item above.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {totals.map((t) => {
                const meta = CATEGORY_META[t.category];
                const pct = Math.round((t.count / totalLogged) * 100);
                return (
                  <li key={t.category}>
                    <div className="mb-1.5 flex items-center justify-between text-[14px] font-bold">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-black/20"
                          style={{ background: meta.dot }}
                        />
                        {t.category}
                      </span>
                      <span className="text-ink/60">
                        {t.count} item{t.count === 1 ? "" : "s"} ({pct}%)
                      </span>
                    </div>
                    <div className="h-3.5 w-full overflow-hidden rounded-full border-2 border-forest-900 bg-cream">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: meta.dot }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="p-6" sticker={false}>
          <h3 className="font-display text-lg tracking-tight text-forest-950 uppercase">
            This week
          </h3>
          <div className="mt-4 flex h-40 items-end gap-2.5 border-b-[3px] border-forest-900 px-1">
            {days.map((d, i) => (
              <div key={d} className="flex h-full flex-1 flex-col items-center justify-end">
                <span className="mb-1 text-[13px] font-extrabold text-forest-900">{perDay[i]}</span>
                <div
                  className="w-full max-w-10 rounded-t-lg border-2 border-b-0 border-forest-900 bg-lime-pop transition-all duration-500"
                  style={{ height: `${Math.max(4, (perDay[i] / maxDay) * 100)}px` }}
                  title={`${perDay[i]} items on ${d}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2.5 px-1">
            {days.map((d) => (
              <span key={d} className="flex-1 text-center text-[11.5px] font-bold text-ink/55">
                {dayLabel(d)}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <h3 className="font-display mt-8 mb-3 text-lg tracking-tight text-forest-950 uppercase">
        Entries
      </h3>
      {entries.length === 0 ? (
        <p className="font-medium text-ink/60">Nothing logged yet.</p>
      ) : (
        <ul className="space-y-2.5">
          {entries.map((entry) => {
            const meta = CATEGORY_META[entry.category];
            return (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-3 rounded-2xl border-2 border-forest-900 bg-white px-4 py-3 shadow-sticker-sm"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2"
                    style={{ background: meta.bg, borderColor: meta.edge, color: meta.ink }}
                  >
                    <Icon name={meta.icon} className="h-4.5 w-4.5" />
                  </span>
                  <span className="truncate text-[15px] font-bold">
                    {entry.qty} x {entry.name}
                    <span className="ml-2 font-medium text-ink/50">
                      {entry.category} · {entry.date}
                    </span>
                  </span>
                </span>
                <Button variant="danger" onClick={() => removeEntry(entry.id)}>
                  Remove
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// ---------- Guide ----------

function GuideCard({ icon, title, accent = false, children }) {
  return (
    <Card className="p-6" sticker={false}>
      <div className="mb-3 flex items-center gap-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 -rotate-3 items-center justify-center rounded-2xl border-2 border-forest-900 shadow-sticker-sm",
            accent ? "bg-lime-pop text-forest-950" : "bg-forest-900 text-lime-pop",
          )}
        >
          <Icon name={icon} className="h-5.5 w-5.5" />
        </span>
        <h3 className="font-display text-lg leading-tight tracking-tight text-forest-950 uppercase">
          {title}
        </h3>
      </div>
      <div className="space-y-3 text-[15px] leading-relaxed text-ink/85">{children}</div>
    </Card>
  );
}

function Guide() {
  return (
    <section>
      <h2 className="font-display text-[28px] tracking-tight text-forest-950 uppercase sm:text-[34px]">
        Guide: sorting waste at home
      </h2>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <GuideCard icon="package" title="What goes where" accent>
          <ul className="space-y-3">
            {[
              [
                "Recyclable",
                "clean plastic bottles and containers, sachet nylon, cans, glass bottles and jars, dry paper and cardboard, scrap metal. Rinse food containers first and keep paper dry.",
              ],
              [
                "Organic",
                "food peels, leftover food, vegetable scraps, eggshells, leaves and grass. These rot down into compost for the garden.",
              ],
              [
                "Hazardous",
                "batteries, old phones and chargers, expired medicine, used engine oil, paint, pesticide containers, broken fluorescent bulbs. Never put these in the normal bin.",
              ],
              [
                "General waste",
                "everything else, like tissue paper, diapers, broken ceramics, foam, and styrofoam packs.",
              ],
            ].map(([name, text]) => {
              const key = name === "General waste" ? "General" : name;
              const meta = CATEGORY_META[key];
              return (
                <li key={name} className="flex gap-3">
                  <span
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2"
                    style={{ background: meta.bg, borderColor: meta.edge, color: meta.ink }}
                  >
                    <Icon name={meta.icon} className="h-4 w-4" />
                  </span>
                  <span>
                    <strong className="font-extrabold text-forest-950">{name}:</strong> {text}
                  </span>
                </li>
              );
            })}
          </ul>
        </GuideCard>

        <GuideCard icon="recycle" title="Where do recyclables go in Nigeria?">
          <p>
            Many cities have buy-back centres and waste collectors who pay for plastic
            bottles, cans, and sachet nylon by weight. In Lagos, PSP operators collect
            household waste, and recycling companies buy sorted plastics and paper. Ask
            your local waste collector which materials they buy, and keep those separate
            at home.
          </p>
        </GuideCard>

        <GuideCard icon="ban" title="What never to burn or dump">
          <ul className="list-disc space-y-2 pl-5">
            <li>Never burn plastic, foam, or batteries. The smoke is poisonous.</li>
            <li>
              Never dump waste in gutters, rivers, or empty plots. It blocks drains and
              causes flooding.
            </li>
            <li>Never pour engine oil or chemicals on the ground or into a drain.</li>
            <li>Never reuse pesticide containers for food or water.</li>
          </ul>
        </GuideCard>

        <GuideCard icon="sprout" title="Start composting at home" accent>
          <p>
            Pick a corner of the compound. Layer food peels and garden waste with dry
            leaves, keep it slightly damp, and turn it every few days. In a few weeks
            you get dark, rich soil for planting. Do not compost meat, oil, or cooked
            food with oil in a small home heap, it attracts rats.
          </p>
        </GuideCard>
      </div>

      <Card className="mt-5 -rotate-[0.3deg] bg-lime-soft p-6">
        <h3 className="font-display text-lg tracking-tight text-forest-950 uppercase">
          Three bins is enough
        </h3>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink/85">
          You do not need fancy bins. Three bags or buckets work: one for recyclables,
          one for organic waste, and one for everything else. Keep a small sealed box
          for hazardous items like batteries until you can take them to a collection
          point.
        </p>
      </Card>
    </section>
  );
}
