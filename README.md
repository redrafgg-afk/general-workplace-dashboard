# General Workplace Dashboard (GWD) 🎓💼

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/status-active-success.svg)]()
[![SEO Optimized](https://img.shields.io/badge/SEO-Optimized-brightgreen.svg)]()

**General Workplace Dashboard (GWD)** is a fast, offline-first, all-in-one web productivity suite designed for researchers, software developers, students, and professionals. Styled with a developer-friendly **VS Code dark aesthetic**, GWD merges search management, link categorization, translation, and scientific calculation into a single, high-performance browser tab.

---

## 🔍 Key Features & Capabilities

### 1. Dual-Mode Smart Search Engine
Switch seamlessly between two powerful search strategies designed for complex research workflows:
- **Mode 1: Multi-Engine Broadcast Search**: Execute a single query across multiple predefined search engines or databases simultaneously with one click.
- **Mode 2: Single-Engine Branching Search (NEW)**: Target a single search engine (e.g., Google, IEEE, ArXiv) while injecting multiple keyword branches into your main search topic. Automatically opens targeted search tabs for deep-dive queries.

### 2. Categorized Quick Interlinks
- Save and organize research portals, internal docs, e-learning links, or GitHub repositories.
- Custom labels and tags with single-click navigation and clean UI categorization.

### 3. Integrated Scientific Calculator
- Built-in math engine capable of handling trigonometry, logarithms, power roots, and algebraic operations.
- Full interactive visual keyboard with real-time expression evaluation and dynamic calculation history log.

### 4. Fast Google Translate Engine
- Auto-resizing multi-line text input for quick translation of code comments, academic journal abstracts, or foreign documentation.
- One-click language swap and direct execution.

### 5. 100% Privacy & Local Storage Persistence
- Zero tracking and no external servers required. All configurations, search groups, and history are stored directly in your browser's `localStorage`.
- Full **JSON Import/Export** support for seamless manual backup, syncing across devices, or sharing team configurations.

---

## 📖 How to Use

### Using Search Mode 1 (Multi-Engine Search)
1. Select **Mode 1: Multi-Engine** in the search tab header.
2. Type your search term into the main query field (`~/search/`).
3. Expand any Search Group and click **`EXECUTE_SEARCH`** to open all configured search engines at once in separate tabs.

### Using Search Mode 2 (Single-Engine Branching Search)
1. Select **Mode 2: Single-Engine Branching** in the search tab header.
2. Enter your core topic in the **Main Search (Batang Utama)** input field (e.g., `"Machine Learning in Healthcare"`).
3. In your Branch Group, define your target base search URL (e.g., `https://www.google.com/search?q=`) and click **`SELECT ENGINE`**.
4. Add your branch keywords/modifiers (e.g., `"2025 review"`, `"case study"`, `"open source dataset"`).
5. Click **`EXECUTE_BRANCH_SEARCH`**. GWD will generate and open separate tabs combining your Main Topic with each Branch Keyword!

---

## ⚠️ Important Browser Configuration (Pop-up Permission)

Because GWD opens multiple research tabs simultaneously, your browser may block multi-tab execution by default.
To allow uninterrupted searching:
1. Click the **Lock / Site Settings icon** on the left of your browser address bar.
2. Go to **Site Settings** > **Permissions**.
3. Set **Pop-ups and redirects** to **Allow**.

---

## 📥 Quick Start & Pre-Configuration

Get started instantly with recommended academic & developer presets:

1. Download the pre-made **`config.json`** file from the `Save File` folder in this repository.
2. Open the Dashboard (online or local).
3. Click the **File Open (Import JSON)** icon on the left sidebar sidebar.
4. Select `config.json` to instantly load your search groups, quick links, and settings!

---

## 🚀 How to Run

### Option A: Online via GitHub Pages
Access the hosted version anytime: `https://redrafgg-afk.github.io/general-workplace-dashboard/`

### Option B: Local Desktop or Mobile
- **Desktop**: Clone or download this repository and double-click `index.html`. No Node.js or web server required!
- **Mobile**: Open `index.html` via mobile browsers or offline web servers (such as **Acode** or **HTTP Server** apps) for persistent local storage.

---

## 🛠️ Feature Matrix Summary

| Feature | Description | Primary Use Case |
| :--- | :--- | :--- |
| **Multi-Engine Search** | 1 Query → Multiple Search Engines | Broad literature review across Google, Bing, DuckDuckGo |
| **Branching Search** | 1 Engine + 1 Main Topic → Multiple Sub-Topics | Niche technical research, multi-angle topic analysis |
| **Quick Interlinks** | Tagged & categorized bookmarking | Organizing workspace links, APIs, internal docs |
| **Sci-Calculator** | Advanced math engine with log history | Quick calculations during research or coding |
| **Quick Translator** | Direct Google Translate query runner | Reading foreign abstracts & technical papers |
| **Data Backup** | JSON Export / Import | Moving configs between home/office/mobile devices |

---

## 🤝 Contributing & Customization
Contributions are welcome! Feel free to open an issue or submit a pull request for new layout widgets, accessibility updates, or new default search engine presets.

---
*General Workplace Dashboard — Streamlining research, study, and developer workflows in a single tab.*