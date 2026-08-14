// Gabungan State
let appData = JSON.parse(localStorage.getItem("GWDconfig")) || {
    searchGroups: [],
    linkGroups: [],
    calcHistory: [],
    branchGroups: [],      // Tempat menyimpan link/engine khusus Mode Branching
    selectedBranchEngineUrl: "", // Engine tunggal yang sedang terpilih
    currentSearchMode: "multi"   // Mode aktif: "multi" atau "branch
};

window.onload = () => renderAll();

function renderAll() {
    renderSearch();
    renderBranchSearch();
    renderTranslator();
    renderInterlinks();
    renderCalcHistory();
    saveData();
}

function saveData() {
    localStorage.setItem("GWDconfig", JSON.stringify(appData));
}

function switchSearchMode(mode) {
    appData.currentSearchMode = mode;
    const isMulti = mode === 'multi';
    
    document.getElementById('multiSearchContainer').style.display = isMulti ? 'flex' : 'none';
    document.getElementById('multiSearchContent').style.display = isMulti ? 'block' : 'none';
    document.getElementById('btnModeMulti').classList.toggle('active', isMulti);

    document.getElementById('branchSearchContainer').style.display = isMulti ? 'none' : 'block';
    document.getElementById('branchSearchContent').style.display = isMulti ? 'none' : 'block';
    document.getElementById('btnModeBranch').classList.toggle('active', !isMulti);

    saveData();
}

function renderBranchSearch() {
    const wrapper = document.getElementById("branchGroupWrapper");
    if (!wrapper) return;
    wrapper.innerHTML = "";

    // Tampilkan status engine terpilih
    const engineBadge = document.getElementById("selectedBranchEngine");
    if(engineBadge) {
        engineBadge.innerText = appData.selectedBranchEngineUrl 
            ? `Engine Terpilih: ${appData.selectedBranchEngineUrl}` 
            : "Belum ada engine terpilih (Klik opsi di bawah untuk memilih 1 engine)";
    }

    appData.branchGroups = appData.branchGroups || [];
    
    appData.branchGroups.forEach(group => {
        const details = document.createElement("details");
        if (group.isOpened) details.open = true;
        details.ontoggle = () => { group.isOpened = details.open; saveData(); };

        // Pilihan Engine tunggal (Radio/Clickable selection)
        const isSelected = appData.selectedBranchEngineUrl === group.engineUrl;
        
        details.innerHTML = `
            <summary class="${isSelected ? 'selected-branch-group' : ''}">
                <span><span style="color:#6a9955">//</span> ${group.summary}</span>
                <div>
                    <button onclick="selectBranchEngine('${group.engineUrl}')" style="background: ${isSelected ? '#007acc' : '#3c3c3c'}; color: white; padding: 2px 8px; font-size: 11px;">
                        ${isSelected ? 'ACTIVE ENGINE' : 'SELECT ENGINE'}
                    </button>
                    <button onclick="deleteItem(${group.id}, 'branch')" style="background:transparent; color:#f44747; border:none;">×</button>
                </div>
            </summary>
            <div class="url-container">
                <div style="margin-bottom: 8px;">
                    <label style="font-size: 11px; color:#888;">Base Search URL Engine:</label>
                    <input type="text" value="${group.engineUrl || ''}" placeholder="e.g. https://www.google.com/search?q=" onchange="updateBranchEngineUrl(${group.id}, this.value)" style="width:100%; box-sizing:border-box;">
                </div>

                <div class="branches-list">
                    <label style="font-size: 11px; color:#888;">List Branch (Dropdown Modifiers):</label>
                    ${(group.branches || []).map((b, idx) => `
                        <div class="url-row">
                            <input type="text" value="${b}" onchange="updateBranchItem(${group.id}, ${idx}, this.value)" style="flex:1">
                            <button onclick="deleteBranchItem(${group.id}, ${idx})" style="background:#f44747">×</button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="url-row">
                    <input type="text" placeholder="+ Add New Branch Keyword..." onkeydown="handleAddBranchKeyword(event, ${group.id})" style="flex:1">
                </div>

                <button class="btn-search-all" onclick="executeBranchSearch(${group.id})">EXECUTE_BRANCH_SEARCH</button>
            </div>`;
        wrapper.appendChild(details);
    });
}

document.getElementById("newBranchGroupName")?.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && e.target.value !== "") {
        appData.branchGroups = appData.branchGroups || [];
        appData.branchGroups.push({ 
            id: Date.now(), 
            summary: e.target.value, 
            engineUrl: "https://www.google.com/search?q=", 
            branches: [], 
            isOpened: true 
        });
        e.target.value = "";
        renderAll();
    }
});

function selectBranchEngine(url) {
    if(!url) { alert("Isi Search Engine Base URL terlebih dahulu!"); return; }
    appData.selectedBranchEngineUrl = url;
    renderBranchSearch();
    saveData();
}

function updateBranchEngineUrl(groupId, value) {
    const group = appData.branchGroups.find(g => g.id === groupId);
    if(group) group.engineUrl = value;
    saveData();
}

function handleAddBranchKeyword(e, groupId) {
    if(e.key === "Enter" && e.target.value !== "") {
        const group = appData.branchGroups.find(g => g.id === groupId);
        if(!group.branches) group.branches = [];
        group.branches.push(e.target.value);
        e.target.value = "";
        renderAll();
    }
}

function updateBranchItem(groupId, index, value) {
    const group = appData.branchGroups.find(g => g.id === groupId);
    if(group) group.branches[index] = value;
    saveData();
}

function deleteBranchItem(groupId, index) {
    const group = appData.branchGroups.find(g => g.id === groupId);
    if(group) {
        group.branches.splice(index, 1);
        renderAll();
    }
}

// MEKANISME EKSEKUSI PENCARIAN BRANCHING
function executeBranchSearch(groupId) {
    const mainQuery = document.getElementById("branchMainInp").value.trim();
    if(!mainQuery) {
        alert("Harap isi Main Search (Batang) terlebih dahulu!");
        return;
    }
    
    if(!appData.selectedBranchEngineUrl) {
        alert("Harap pilih 1 Search Engine terlebih dahulu!");
        return;
    }

    const group = appData.branchGroups.find(g => g.id === groupId);
    if(!group || !group.branches || group.branches.length === 0) {
        alert("Belum ada branch keywords dalam grup ini!");
        return;
    }

    // Buka tab sebanyak cabang dropdown
    group.branches.forEach(branch => {
        const finalQuery = `${mainQuery} ${branch}`;
        const searchUrl = appData.selectedBranchEngineUrl + encodeURIComponent(finalQuery);
        window.open(searchUrl, "_blank");
    });
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

const transArea = document.getElementById("transInp");

transArea.addEventListener("input", function() {
    // Logika Auto-Resize: Menyesuaikan tinggi kotak mengikuti jumlah baris
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

transArea.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        // Jika Shift + Enter (atau Enter di HP yang biasanya mengirim event normal)
        // Kita ijinkan baris baru jika Shift ditekan
        if (e.shiftKey) {
            // Biarkan browser membuat baris baru secara alami
        } else {
            // Jika Enter saja (Desktop), kirim ke Google Translate
            e.preventDefault();
            executeTranslate();
        }
    }
});

function executeTranslate() {
    const inp = document.getElementById("transInp");
    const val = inp.value.trim();
    if(val !== "") {
        const text = encodeURIComponent(val);
        const from = document.getElementById("langFrom").value;
        const to = document.getElementById("langTo").value;
        const googleUrl = `https://translate.google.com/?sl=${from}&tl=${to}&text=${text}&op=translate`;
        window.open(googleUrl, "_blank");
    }
}

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
document.addEventListener('DOMContentLoaded', () => {
    const calcInput = document.getElementById("calcInp");
    if(calcInput) {
        calcInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                runCalc();
            }
        });
    }
});

const cInp = document.getElementById("calcInp");
function calcAction(v) { cInp.value += v;}
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

function backspaceCalc() {
    const cInp = document.getElementById("calcInp");
    // Menghapus 1 karakter terakhir
    cInp.value = cInp.value.slice(0, -1);
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

const originalDeleteItem = deleteItem;
deleteItem = function(id, type) {
    if(type === 'branch') {
        if(confirm("Hapus Group Branch ini?")) {
            appData.branchGroups = appData.branchGroups.filter(g => g.id !== id);
            renderAll();
        }
    } else {
        originalDeleteItem(id, type);
    }
};

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