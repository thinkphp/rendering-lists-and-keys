import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const initialTasks = [
  { id: "task-jsx", title: "Repetă elementele de bază JSX", done: true, tag: "STUDIU" },
  { id: "task-list", title: "Construiește o listă cu map()", done: false, tag: "PRACTICĂ" },
  { id: "task-keys", title: "Adaugă un key stabil fiecărui element", done: false, tag: "REACT" },
];

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-row ${task.done ? "completed" : ""}`}>
      <button
        className="check"
        type="button"
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? `Marchează „${task.title}” ca nefinalizată` : `Finalizează „${task.title}”`}
        aria-pressed={task.done}
      >{task.done ? "✓" : ""}</button>
      <span className="task-title">{task.title}</span>
      <span className="task-tag">{task.tag}</span>
      <button className="delete" type="button" onClick={() => onDelete(task.id)} aria-label={`Șterge „${task.title}”`}>×</button>
    </li>
  );
}

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");

  const visibleTasks = tasks.filter((task) => {
    if (filter === "active") return !task.done;
    if (filter === "done") return task.done;
    return true;
  });
  const remaining = tasks.filter((task) => !task.done).length;

  function addTask(event) {
    event.preventDefault();
    const title = newTask.trim();
    if (!title) return;

    setTasks((current) => [
      ...current,
      { id: crypto.randomUUID(), title, done: false, tag: "NOU" },
    ]);
    setNewTask("");
  }

  function toggleTask(id) {
    setTasks((current) => current.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task,
    ));
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="#top"><span className="brand-mark">✓</span> pași mici</a>
        <span className="top-note">ORGANIZEAZĂ-ȚI IDEILE</span>
        <span className="date-chip">LISTĂ · 01</span>
      </header>

      <section className="intro" id="top">
        <p className="eyebrow"><span /> DEMO REACT · LISTS & KEYS</p>
        <h1>Un lucru<br /><em>pe rând.</em></h1>
        <p className="intro-copy">Împarte ce ai de făcut în pași clari. Bifează-i pe măsură ce înaintezi.</p>
      </section>

      <section className="list-card" aria-labelledby="list-title">
        <div className="list-header">
          <div><p className="section-label">PLANUL TĂU</p><h2 id="list-title">Sarcini de azi</h2></div>
          <span className="remaining"><strong>{remaining}</strong> rămase</span>
        </div>

        <form className="add-form" onSubmit={addTask}>
          <label className="sr-only" htmlFor="task-input">Sarcină nouă</label>
          <input
            id="task-input"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            placeholder="Adaugă o sarcină nouă..."
            autoComplete="off"
          />
          <button type="submit">Adaugă <span aria-hidden="true">+</span></button>
        </form>

        <div className="list-toolbar">
          <div className="filters" aria-label="Filtrează sarcinile">
            {[ ["all", "Toate"], ["active", "De făcut"], ["done", "Finalizate"] ].map(([value, label]) => (
              <button
                type="button"
                className={filter === value ? "active" : ""}
                key={value}
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
              >{label}</button>
            ))}
          </div>
          <span className="count-label">{visibleTasks.length} {visibleTasks.length === 1 ? "SARCINĂ" : "SARCINI"}</span>
        </div>

        {visibleTasks.length > 0 ? (
          <ul className="task-list">
            {visibleTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">✳</span>
            <p>{tasks.length === 0 ? "Lista ta e liberă. Adaugă primul pas." : "Nu sunt sarcini în această categorie."}</p>
          </div>
        )}

        <div className="key-explanation">
          <span className="key-symbol">key</span>
          <p>Fiecare element are un <code>key</code> unic, bazat pe ID-ul lui, ca React să-l poată identifica atunci când lista se schimbă.</p>
        </div>
      </section>

      <footer className="footer"><span><b>✳</b> Progresul începe cu un pas.</span><span>Cheile nu se văd în pagină; ajută React să urmărească elementele.</span></footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
