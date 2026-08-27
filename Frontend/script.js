/* ==========================================================================
   My Diary — client
   Backend is the existing Spring Boot API: /auth/**, /api/diary/**
   ========================================================================== */

const SERVER_URL = "https://profound-creativity-production-ee37.up.railway.app";

const MOODS = [
    { key: "happy", label: "😊 Happy" },
    { key: "calm", label: "🌿 Calm" },
    { key: "grateful", label: "🙏 Grateful" },
    { key: "excited", label: "✨ Excited" },
    { key: "tired", label: "😴 Tired" },
    { key: "low", label: "😔 Low" }
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let allEntries = [];
let editingId = null;
let selectedMood = "";
const expanded = new Set();

/* ---------------------------------------------------------------- helpers */

function getToken() {
    return localStorage.getItem("token");
}

function toast(message) {
    const el = document.getElementById("toast");
    if (!el) {
        alert(message);
        return;
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => el.classList.remove("show"), 2600);
}

function todayISO() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
}

// Split the ISO string by hand — new Date("2026-08-26") parses as UTC and can
// shift the displayed day by one depending on the reader's timezone.
function parseISODate(value) {
    if (!value) return null;
    const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
    if (!year || !month || !day) return null;
    return { year, month, day };
}

function moodLabel(key) {
    const mood = MOODS.find((m) => m.key === key);
    return mood ? mood.label : "";
}

/**
 * Read a response body once, tolerating anything the API sends back: JSON,
 * plain text, or nothing at all.
 *
 * Calling response.json() directly is the trap — on a non-JSON body it throws a
 * SyntaxError, and that parser message ("The string did not match the expected
 * pattern" in Safari) ends up in front of the user instead of the real error.
 *
 * Returns { data, message } where message is the server's explanation if it
 * gave one, whether it arrived as {"message": "..."} or as raw text.
 */
async function readResponse(response) {
    const raw = await response.text();

    let data = null;
    if (raw) {
        try {
            data = JSON.parse(raw);
        } catch {
            // Not JSON — treat the body as a plain-text message below.
        }
    }

    // A non-JSON body is only worth showing if it reads like a sentence. Proxies
    // and gateways return HTML error pages, which must not reach the user.
    const text = raw.trim();
    const isDisplayableText = text.length > 0 && text.length <= 200 && !text.startsWith("<");

    const message = data
        ? data.message || data.error || ""
        : isDisplayableText ? text : "";

    return { data, message };
}

/** Turn a failed response into an Error carrying the most useful message available. */
async function toError(response, fallback) {
    const { message } = await readResponse(response);
    return new Error(message || fallback);
}

/* ------------------------------------------------------------------- auth */

/** Show/hide the password next to this toggle button. */
function togglePassword(button) {
    const input = button.parentElement.querySelector("input");
    if (!input) return;

    const reveal = input.type === "password";
    input.type = reveal ? "text" : "password";

    button.setAttribute("aria-pressed", String(reveal));
    button.setAttribute("aria-label", reveal ? "Hide password" : "Show password");

    // Return the caret to where the user left it rather than to the button.
    const caret = input.value.length;
    input.focus();
    input.setSelectionRange(caret, caret);
}

function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        toast("Enter your email and password.");
        return;
    }

    fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
        .then(async (response) => {
            if (!response.ok) {
                throw await toError(response, "Could not sign you in. Please try again.");
            }
            const { data } = await readResponse(response);
            if (!data || !data.token) throw new Error("Could not sign you in. Please try again.");
            return data;
        })
        .then((data) => {
            localStorage.setItem("token", data.token);
            window.location.href = "diary.html";
        })
        .catch((error) => toast(error.message));
}

function register() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        toast("Enter your email and password.");
        return;
    }

    fetch(`${SERVER_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
        .then(async (response) => {
            if (!response.ok) {
                throw await toError(response, "Could not create your account. Please try again.");
            }
        })
        .then(() => {
            toast("Account created — please sign in.");
            setTimeout(() => (window.location.href = "login.html"), 1200);
        })
        .catch((error) => toast(error.message));
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

/* --------------------------------------------------------------- composer */

function renderMoodChips() {
    const wrap = document.getElementById("moods");
    wrap.innerHTML = "";

    MOODS.forEach((mood) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "mood-chip";
        chip.textContent = mood.label;
        chip.setAttribute("aria-pressed", String(selectedMood === mood.key));

        chip.addEventListener("click", () => {
            // clicking the active chip clears it
            selectedMood = selectedMood === mood.key ? "" : mood.key;
            renderMoodChips();
        });

        wrap.appendChild(chip);
    });
}

function resetComposer() {
    editingId = null;
    selectedMood = "";
    document.getElementById("entry-title").value = "";
    document.getElementById("entry-content").value = "";
    document.getElementById("entry-date").value = todayISO();
    document.getElementById("composer-title").textContent = "New entry";
    document.getElementById("save-btn").textContent = "Save entry";
    document.getElementById("cancel-btn").hidden = true;
    renderMoodChips();
}

function editEntry(id) {
    const entry = allEntries.find((e) => e.id === id);
    if (!entry) return;

    editingId = id;
    selectedMood = entry.mood || "";
    document.getElementById("entry-title").value = entry.title || "";
    document.getElementById("entry-content").value = entry.content || "";
    document.getElementById("entry-date").value = entry.entryDate || todayISO();
    document.getElementById("composer-title").textContent = "Edit entry";
    document.getElementById("save-btn").textContent = "Update entry";
    document.getElementById("cancel-btn").hidden = false;
    renderMoodChips();

    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("entry-title").focus();
}

function saveEntry() {
    const title = document.getElementById("entry-title").value.trim();
    const content = document.getElementById("entry-content").value.trim();
    const entryDate = document.getElementById("entry-date").value || todayISO();

    if (!title && !content) {
        toast("Write something first.");
        return;
    }

    const existing = editingId ? allEntries.find((e) => e.id === editingId) : null;

    const payload = {
        title: title || "Untitled entry",
        content: content,
        mood: selectedMood,
        entryDate: entryDate,
        completed: existing ? existing.completed : false
    };

    const editing = editingId !== null;

    fetch(editing ? `${SERVER_URL}/api/diary/${editingId}` : `${SERVER_URL}/api/diary`, {
        method: editing ? "PUT" : "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(payload)
    })
        .then(async (response) => {
            if (!response.ok) throw await toError(response, "Could not save the entry.");
        })
        .then(() => {
            toast(editing ? "Entry updated." : "Entry saved.");
            resetComposer();
            loadEntries();
        })
        .catch((error) => toast(error.message));
}

/* ------------------------------------------------------------------ entry */

function toggleStar(id) {
    const entry = allEntries.find((e) => e.id === id);
    if (!entry) return;

    fetch(`${SERVER_URL}/api/diary/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ ...entry, completed: !entry.completed })
    })
        .then(async (response) => {
            if (!response.ok) throw await toError(response, "Could not update the entry.");
        })
        .then(() => loadEntries())
        .catch((error) => toast(error.message));
}

function deleteEntry(id) {
    if (!confirm("Delete this entry? This cannot be undone.")) return;

    fetch(`${SERVER_URL}/api/diary/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
    })
        .then(async (response) => {
            if (!response.ok) throw await toError(response, "Could not delete the entry.");
            if (editingId === id) resetComposer();
            toast("Entry deleted.");
            loadEntries();
        })
        .catch((error) => toast(error.message));
}

/* --------------------------------------------------------------- rendering */

function buildEntryCard(entry) {
    const card = document.createElement("article");
    card.className = "entry" + (entry.completed ? " is-starred" : "");

    // date badge
    const dateBox = document.createElement("div");
    dateBox.className = "entry-date";
    const parsed = parseISODate(entry.entryDate);

    if (parsed) {
        const day = document.createElement("span");
        day.className = "day";
        day.textContent = String(parsed.day);

        const month = document.createElement("span");
        month.className = "month";
        month.textContent = MONTHS[parsed.month - 1];

        const year = document.createElement("span");
        year.className = "year";
        year.textContent = String(parsed.year);

        dateBox.append(day, month, year);
    } else {
        const month = document.createElement("span");
        month.className = "month";
        month.textContent = "—";
        dateBox.appendChild(month);
    }

    // main column
    const main = document.createElement("div");

    const head = document.createElement("div");
    head.className = "entry-head";

    const title = document.createElement("h3");
    title.className = "entry-title";
    title.textContent = entry.title || "Untitled entry";
    head.appendChild(title);
    main.appendChild(head);

    if (entry.mood) {
        const mood = document.createElement("span");
        mood.className = "entry-mood";
        mood.textContent = moodLabel(entry.mood);
        main.appendChild(mood);
    }

    if (entry.content) {
        const body = document.createElement("p");
        const isOpen = expanded.has(entry.id);
        const isLong = entry.content.length > 260 || entry.content.split("\n").length > 4;

        body.className = "entry-body" + (isLong && !isOpen ? " clamped" : "");
        body.textContent = entry.content;
        main.appendChild(body);

        if (isLong) {
            const more = document.createElement("button");
            more.className = "entry-more";
            more.textContent = isOpen ? "Show less" : "Read more";
            more.onclick = () => {
                if (isOpen) expanded.delete(entry.id);
                else expanded.add(entry.id);
                renderEntries();
            };
            main.appendChild(more);
        }
    }

    // actions
    const actions = document.createElement("div");
    actions.className = "entry-actions";

    const star = document.createElement("button");
    star.className = "icon-btn" + (entry.completed ? " starred" : "");
    star.textContent = entry.completed ? "★ Favourite" : "☆ Favourite";
    star.onclick = () => toggleStar(entry.id);

    const edit = document.createElement("button");
    edit.className = "icon-btn";
    edit.textContent = "✎ Edit";
    edit.onclick = () => editEntry(entry.id);

    const remove = document.createElement("button");
    remove.className = "icon-btn danger";
    remove.textContent = "🗑 Delete";
    remove.onclick = () => deleteEntry(entry.id);

    actions.append(star, edit, remove);
    main.appendChild(actions);

    card.append(dateBox, main);
    return card;
}

function showState(html) {
    document.getElementById("entries").innerHTML = html;
}

function renderEntries() {
    const list = document.getElementById("entries");
    const searchEl = document.getElementById("search");
    const query = searchEl ? searchEl.value.trim().toLowerCase() : "";

    const visible = allEntries
        .filter((entry) => {
            if (!query) return true;
            return (
                (entry.title || "").toLowerCase().includes(query) ||
                (entry.content || "").toLowerCase().includes(query)
            );
        })
        .sort((a, b) => {
            // newest entry date first; entries without a date sink to the bottom
            const dateA = a.entryDate || "";
            const dateB = b.entryDate || "";
            if (dateA !== dateB) return dateB.localeCompare(dateA);
            return (b.id || 0) - (a.id || 0);
        });

    const count = document.getElementById("entry-count");
    count.textContent = allEntries.length
        ? `· ${visible.length} of ${allEntries.length}`
        : "";

    if (!allEntries.length) {
        showState(
            '<div class="state"><span class="state-mark">🕯️</span>' +
            "<strong>Your diary is empty</strong>Write your first entry on the left.</div>"
        );
        return;
    }

    if (!visible.length) {
        showState(
            '<div class="state"><span class="state-mark">🔍</span>' +
            "<strong>Nothing found</strong>No entries match that search.</div>"
        );
        return;
    }

    list.innerHTML = "";
    visible.forEach((entry) => list.appendChild(buildEntryCard(entry)));
}

function loadEntries() {
    const token = getToken();

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    fetch(`${SERVER_URL}/api/diary`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(async (response) => {
            if (!response.ok) throw await toError(response, "Failed to load entries.");
            const { data } = await readResponse(response);
            return data;
        })
        .then((entries) => {
            allEntries = Array.isArray(entries) ? entries : [];
            renderEntries();
        })
        .catch((error) => {
            console.error(error);
            showState(
                '<div class="state error"><span class="state-mark">⚠️</span>' +
                "<strong>Could not load your diary</strong>Check your connection and refresh.</div>"
            );
        });
}

/* ----------------------------------------------------------------- startup */

document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("entries")) return;

    const today = new Date();
    document.getElementById("today").textContent = today.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    resetComposer();
    loadEntries();
});
