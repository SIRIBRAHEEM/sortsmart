import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, ITEMS, searchItems } from "./data/items.js";
import "./App.css";

// SortSmart: a waste sorting helper for Nigerian households.
// Four parts: look an item up, test yourself with a quiz, log what you
// throw away, and read plain guidance on where things should go.

const CATEGORY_COLORS = {
  Recyclable: "#1f7a3a",
  Organic: "#8a5a00",
  Hazardous: "#b3261e",
  General: "#555555",
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

export default function App() {
  const [tab, setTab] = useState("lookup");

  return (
    <div className="page">
      <header className="header">
        <h1>SortSmart</h1>
        <p>Know where your waste goes. Built for Nigerian households.</p>
      </header>

      <nav className="tabs">
        <button className={tab === "lookup" ? "active" : ""} onClick={() => setTab("lookup")}>
          Look it up
        </button>
        <button className={tab === "quiz" ? "active" : ""} onClick={() => setTab("quiz")}>
          Sorting quiz
        </button>
        <button className={tab === "log" ? "active" : ""} onClick={() => setTab("log")}>
          My waste log
        </button>
        <button className={tab === "guide" ? "active" : ""} onClick={() => setTab("guide")}>
          Guide
        </button>
      </nav>

      <main>
        {tab === "lookup" && <Lookup />}
        {tab === "quiz" && <Quiz />}
        {tab === "log" && <WasteLog />}
        {tab === "guide" && <Guide />}
      </main>

      <footer className="footer">
        <p>
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
      <h2>Look it up</h2>
      <p>Type an item, like "plastic bottle" or "yam peels", and see where it goes.</p>

      <input
        className="search"
        type="text"
        placeholder="Search an item, e.g. battery, sachet, yam peels..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected(null);
        }}
      />

      <div className="chips">
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            className={filter === c ? "chip active" : "chip"}
            onClick={() => {
              setFilter(c);
              setSelected(null);
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {selected && (
        <div className="detail" style={{ borderLeftColor: CATEGORY_COLORS[selected.category] }}>
          <h3>{selected.name}</h3>
          <span className="badge" style={{ background: CATEGORY_COLORS[selected.category] }}>
            {selected.category}
          </span>
          <p>
            <strong>What to do:</strong> {selected.how}
          </p>
          <p>
            <strong>Why:</strong> {selected.why}
          </p>
        </div>
      )}

      <p className="count">
        {results.length} item{results.length === 1 ? "" : "s"} found
      </p>

      <ul className="item-list">
        {results.map((item) => (
          <li key={item.name}>
            <button className="item-row" onClick={() => setSelected(item)}>
              <span>{item.name}</span>
              <span className="badge small" style={{ background: CATEGORY_COLORS[item.category] }}>
                {item.category}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {results.length === 0 && (
        <p>
          Nothing matches that search yet. Try a shorter word, like "bottle" or "peels".
        </p>
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

  if (questions.length === 0) return <p>Loading the quiz...</p>;

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
        <h2>Your score</h2>
        <p className="big-score">{score} out of 8</p>
        <p>{message}</p>
        <button className="primary" onClick={startQuiz}>
          Play again
        </button>
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
      <h2>Sorting quiz</h2>
      <p>
        Question {index + 1} of {questions.length} — Score: {score}
      </p>
      <p className="quiz-question">Where does this go: {current.item.name}?</p>

      <div className="quiz-options">
        {current.options.map((option) => {
          let className = "quiz-option";
          if (picked) {
            if (option === current.item.category) className += " correct";
            else if (option === picked) className += " wrong";
          }
          return (
            <button key={option} className={className} onClick={() => answer(option)}>
              {option}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="quiz-feedback">
          {picked === current.item.category ? (
            <p>Correct. {current.item.why}</p>
          ) : (
            <p>
              Not quite. {current.item.name} is {current.item.category.toLowerCase()}.{" "}
              {current.item.how}
            </p>
          )}
          <button className="primary" onClick={next}>
            {index + 1 >= questions.length ? "See my score" : "Next question"}
          </button>
        </div>
      )}
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
      <h2>My waste log</h2>
      <p>
        Log what you throw away. The totals show how much of your waste is recyclable,
        organic, hazardous, or general. Entries are saved on this device.
      </p>

      <form className="log-form" onSubmit={addEntry}>
        <label>
          Item
          <select value={itemName} onChange={(e) => setItemName(e.target.value)}>
            {ITEMS.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name} ({item.category})
              </option>
            ))}
          </select>
        </label>
        <label>
          How many
          <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
        </label>
        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <button className="primary" type="submit">
          Add to log
        </button>
      </form>

      <h3>Totals by category</h3>
      {totalLogged === 0 ? (
        <p>No entries yet. Add your first item above.</p>
      ) : (
        <ul className="totals">
          {totals.map((t) => (
            <li key={t.category}>
              <span className="dot" style={{ background: CATEGORY_COLORS[t.category] }} />
              {t.category}: <strong>{t.count}</strong> item{t.count === 1 ? "" : "s"}
              {` (${Math.round((t.count / totalLogged) * 100)}%)`}
            </li>
          ))}
        </ul>
      )}

      <h3>This week</h3>
      <div className="chart">
        {days.map((d, i) => (
          <div key={d} className="bar-wrap">
            <div
              className="bar"
              style={{ height: `${Math.max(4, (perDay[i] / maxDay) * 100)}px` }}
              title={`${perDay[i]} items on ${d}`}
            />
            <span className="bar-label">{dayLabel(d)}</span>
            <span className="bar-value">{perDay[i]}</span>
          </div>
        ))}
      </div>

      <h3>Entries</h3>
      {entries.length === 0 ? (
        <p>Nothing logged yet.</p>
      ) : (
        <ul className="log-list">
          {entries.map((entry) => (
            <li key={entry.id}>
              <span>
                {entry.qty} x {entry.name} — {entry.category} — {entry.date}
              </span>
              <button className="danger" onClick={() => removeEntry(entry.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ---------- Guide ----------

function Guide() {
  return (
    <section>
      <h2>Guide: sorting waste at home</h2>

      <h3>What goes where</h3>
      <ul>
        <li>
          <strong>Recyclable:</strong> clean plastic bottles and containers, sachet
          nylon, cans, glass bottles and jars, dry paper and cardboard, scrap metal.
          Rinse food containers first and keep paper dry.
        </li>
        <li>
          <strong>Organic:</strong> food peels, leftover food, vegetable scraps,
          eggshells, leaves and grass. These rot down into compost for the garden.
        </li>
        <li>
          <strong>Hazardous:</strong> batteries, old phones and chargers, expired
          medicine, used engine oil, paint, pesticide containers, broken fluorescent
          bulbs. Never put these in the normal bin.
        </li>
        <li>
          <strong>General waste:</strong> everything else, like tissue paper, diapers,
          broken ceramics, foam, and styrofoam packs.
        </li>
      </ul>

      <h3>Where do recyclables go in Nigeria?</h3>
      <p>
        Many cities have buy-back centres and waste collectors who pay for plastic
        bottles, cans, and sachet nylon by weight. In Lagos, PSP operators collect
        household waste, and recycling companies buy sorted plastics and paper. Ask
        your local waste collector which materials they buy, and keep those separate
        at home.
      </p>

      <h3>What never to burn or dump</h3>
      <ul>
        <li>Never burn plastic, foam, or batteries. The smoke is poisonous.</li>
        <li>
          Never dump waste in gutters, rivers, or empty plots. It blocks drains and
          causes flooding.
        </li>
        <li>Never pour engine oil or chemicals on the ground or into a drain.</li>
        <li>Never reuse pesticide containers for food or water.</li>
      </ul>

      <h3>Start composting at home</h3>
      <p>
        Pick a corner of the compound. Layer food peels and garden waste with dry
        leaves, keep it slightly damp, and turn it every few days. In a few weeks
        you get dark, rich soil for planting. Do not compost meat, oil, or cooked
        food with oil in a small home heap, it attracts rats.
      </p>

      <h3>Three bins is enough</h3>
      <p>
        You do not need fancy bins. Three bags or buckets work: one for recyclables,
        one for organic waste, and one for everything else. Keep a small sealed box
        for hazardous items like batteries until you can take them to a collection
        point.
      </p>
    </section>
  );
}
