// Gabungan State
let appData = JSON.parse(localStorage.getItem("GWDconfig")) || {
    searchGroups: [],
    linkGroups: [],
    calcHistory: []
};

window.onload = () => renderAll();

function renderAll() {
    renderSearch();
    renderTranslator();
    renderInterlinks();
    renderCalcHistory();
    saveData();
}

function saveData() {
    localStorage.setItem("GWDconfig", JSON.stringify(appData));
}

// --- NAVIGASI ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');
    const btn = document.querySelector(`.nav-btn[onclick*="${tabId}"]`);
    if(btn) btn.classList.add('active');
}

// --- SEARCH LOGIC (Based on your stable code) ---
function renderSearch() {
    const wrapper = document.getElementById("groupWrapper");
    wrapper.innerHTML = "";
    appData.searchGroups.forEach(group => {
        const details = document.createElement("details");
        if (group.isOpened) details.open = true;
        details.ontoggle = () => { group.isOpened = details.open; saveData(); };
        details.innerHTML = `
            <summary><span><span style="color:#6a9955">//</span> ${group.summary}</span>
                <button onclick="deleteItem(${group.id}, 'search')" style="background:transparent; color:#f44747">×</button>
            </summary>
            <div class="url-container">
                ${group.urls.map(u => `<div class="url-row"><input type="text" value="${u.url}" onchange="updateUrl(${group.id}, ${u.id}, this.value)" style="flex:1"></div>`).join('')}
                <div class="url-row"><input type="text" placeholder="+ New URL..." onkeydown="handleAddUrl(event, ${group.id}, 'search')" style="flex:1"></div>
                <button class="btn-search-all" onclick="searchGroup(${group.id})">EXECUTE_SEARCH</button>
            </div>`;
        wrapper.appendChild(details);
    });
}

function handleAddUrl(e, groupId, type) {
    if(e.key === "Enter" && e.target.value !== "") {
        const group = (type === 'search' ? appData.searchGroups : appData.linkGroups).find(g => g.id === groupId);
        group.urls.push({ id: Date.now(), url: e.target.value, label: e.target.value.split('//')[1]?.split('/')[0] || 'Link' });
        e.target.value = "";
        renderAll();
    }
}

document.getElementById("newGroupName").onkeydown = (e) => {
    if(e.key === "Enter" && e.target.value !== "") {
        appData.searchGroups.push({ id: Date.now(), summary: e.target.value, urls: [], isOpened: true });
        e.target.value = "";
        renderAll();
    }
};

function searchGroup(id) {
    const query = document.getElementById("globalInp").value;
    const group = appData.searchGroups.find(g => g.id === id);
    group.urls.forEach(u => window.open(u.url + encodeURIComponent(query), "_blank"));
}

// --- TRANSLATOR LOGIC ---
function renderTranslator() {
    const wrapper = document.getElementById("transWrapper");
    // Tampilan statis karena hanya menggunakan 1 engine (Google Translate)
    wrapper.innerHTML = `
        <div class="search-container" style="justify-content: center; opacity: 0.8;">
            <span class="material-symbols-outlined">info</span>
            <span style="margin-left:10px">Powered by Google Translate Engine</span>
        </div>`;
}

document.getElementById("transInp").onkeydown = (e) => {
    if(e.key === "Enter" && e.target.value !== "") {
        const text = encodeURIComponent(e.target.value);
        const from = document.getElementById("langFrom").value;
        const to = document.getElementById("langTo").value;
        const googleUrl = `https://translate.google.com/?sl=${from}&tl=${to}&text=${text}&op=translate`;
        window.open(googleUrl, "_blank");
    }
};

// --- INTERLINK LOGIC ---
function renderInterlinks() {
    const wrapper = document.getElementById("linkGroupWrapper");
    if (!wrapper) return;
    wrapper.innerHTML = "";

    appData.linkGroups.forEach(group => {
        const details = document.createElement("details");
        details.className = "link-group-card";
        if (group.isOpened) details.open = true;
        details.ontoggle = () => { group.isOpened = details.open; saveData(); };
        
        details.innerHTML = `
            <summary>
                <span><span style="color:#6a9955">//</span> ${group.summary}</span>
                <button onclick="deleteItem(${group.id}, 'link')" style="background:transparent; color:#f44747; border:none; cursor:pointer">
                    <span class="material-symbols-outlined" style="font-size:16px">delete</span>
                </button>
            </summary>
            <div class="url-container">
                <div class="link-list-wrapper">
                    ${group.urls.map(u => `
                        <div class="link-tag-container">
                            <a href="${u.url}" target="_blank" class="quick-link-item">${u.label}</a>
                            <button class="btn-delete-link" onclick="deleteSingleLink(${group.id}, ${u.id})">×</button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="add-link-form">
                    <input type="text" id="lab-${group.id}" placeholder="Label" style="width: 80px;">
                    <input type="text" id="url-${group.id}" placeholder="URL (https://...)" style="flex: 1;">
                    <button class="icon-btn" onclick="addLinkToGroup(${group.id})">
                        <span class="material-symbols-outlined" style="font-size: 18px;">add</span>
                    </button>
                </div>
            </div>`;
        wrapper.appendChild(details);
    });
}

document.getElementById("newLinkGroupName").onkeydown = (e) => {
    if(e.key === "Enter" && e.target.value !== "") {
        appData.linkGroups.push({ id: Date.now(), summary: e.target.value, urls: [], isOpened: true });
        e.target.value = "";
        renderAll();
    }
};

function addLinkToGroup(groupId) {
    const labelInp = document.getElementById(`lab-${groupId}`);
    const urlInp = document.getElementById(`url-${groupId}`);
    
    if(labelInp.value && urlInp.value) {
        const group = appData.linkGroups.find(g => g.id === groupId);
        group.urls.push({ 
            id: Date.now(), 
            label: labelInp.value, 
            url: urlInp.value 
        });
        labelInp.value = ""; 
        urlInp.value = "";
        renderAll();
    }
}

function deleteSingleLink(groupId, linkId) {
    const group = appData.linkGroups.find(g => g.id === groupId);
    group.urls = group.urls.filter(u => u.id !== linkId);
    renderAll();
}

// --- CALCULATOR LOGIC ---
const cInp = document.getElementById("calcInp");
function calcAction(v) { cInp.value += v; cInp.focus(); }
function clearCalc() { cInp.value = ""; document.getElementById("calcResult").innerText = "0"; }
function runCalc() {
    try {
        const res = eval(cInp.value);
        document.getElementById("calcResult").innerText = res;
        appData.calcHistory.unshift({ exp: cInp.value, res: res });
        if(appData.calcHistory.length > 10) appData.calcHistory.pop();
        renderCalcHistory();
        cInp.value = res;
    } catch(e) { document.getElementById("calcResult").innerText = "Error"; }
}
function renderCalcHistory() {
    document.getElementById("calcHistoryList").innerHTML = appData.calcHistory.map(h => `
        <div class="history-item" onclick="document.getElementById('calcInp').value='${h.res}'">
            <small>${h.exp}</small><div>${h.res}</div>
        </div>`).join('');
}
function clearCalcHistory() { appData.calcHistory = []; renderCalcHistory(); saveData(); }

// --- SYSTEM ---
function deleteItem(id, type) {
    if(confirm("Hapus?")) {
        if(type === 'search') appData.searchGroups = appData.searchGroups.filter(g => g.id !== id);
        else appData.linkGroups = appData.linkGroups.filter(g => g.id !== id);
        renderAll();
    }
}
function swapLanguages() {
    const f = document.getElementById("langFrom"), t = document.getElementById("langTo");
    const tmp = f.value; f.value = t.value; t.value = tmp;
}
function exportData() {
    const blob = new Blob([JSON.stringify(appData, null, 2)], {type: "application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "devhub_config.json";
    a.click();
}
function importData(e) {
    const reader = new FileReader();
    reader.onload = (event) => { appData = JSON.parse(event.target.result); renderAll(); };
    reader.readAsText(e.target.files[0]);
}