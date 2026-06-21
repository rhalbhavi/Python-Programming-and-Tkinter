const REPO_OWNER = 'rhalbhavi';
const REPO_NAME = 'Python-Programming-and-Tkinter';

// Primary framework configuration pairing UI layouts to curriculum folders
const topicsData = {
    "Core Foundations": {
        mdFile: "Core Foundations.md",
        subtopics: [
            { name: "Keywords and Identifiers", path: "Keywords and Identifiers", preferredOrder: ["Python Keywords.png", "Python Identifiers.md"] },
            { name: "Strings", path: "Strings", preferredOrder: ["Initializing Strings", "String Methods", "Examples"] }
        ]
    },
    "Data Structures": {
        mdFile: "Data Structures.md",
        subtopics: [
            { name: "Lists", path: "Lists", preferredOrder: ["Initializing Lists", "Empty List", "Nested Tuple", "List Methods", "Examples"] },
            { name: "Tuples", path: "Tuples", preferredOrder: ["Initializing Tuples", "Nested Tuple", "Tuple Methods", "Examples"] },
            { name: "Sets", path: "Sets", preferredOrder: ["Initializing Sets", "Set Methods", "Set Operations"] },
            { name: "Dictionaries", path: "Dictionaries", preferredOrder: ["Initializing Dictionaries", "Dictionary Methods", "Examples"] }
        ]
    },
    "Control Flow": {
        mdFile: "Control Flow.md",
        subtopics: [
            { name: "If-Else-Elif Statements", path: "If-Else-Elif Statements", preferredOrder: ["if-else", "Nested if-else", "if-else-elif"] }, 
            { name: "For Loop", path: "For Loop", preferredOrder: ["General Syntax", "for Loop with break and continue statements", "Nested for Loop", "Examples", "for i in Range, List, String"] },
            { name: "While Loop", path: "While Loop", preferredOrder: ["General Syntax", "while Loop with break Statement", "Examples"] },
            { name: "Functions", path: "Functions", preferredOrder: ["Local and Global Variables.py", "Namespaces.py", "def Functions", "lambda Functions", "Recursive Functions", "Built-in Functions"] }
        ]
    },
    "Error Handling": {
        mdFile: "Error Handling.md",
        subtopics: [
            { name: "Try-Except-Finally Statements", path: "Try-Except-Finally Statements", preferredOrder: ["Built-in Exceptions.png", "try-except-finally", "try-except-finally with else", "Multiple except Statements in Single except Block", "Error Handling"] }
        ]
    },
    "GUI": {
        mdFile: "Tkinter.md",
        subtopics: [
            { name: "Tkinter", path: "Tkinter", preferredOrder: ["Create a Basic Tkinter Application", "Widgets", "Methods", "Geometry Manager Properties", "Event Handling", "Cursors", "Examples"] }
        ]
    }
};

const subtopicTitle = document.getElementById('current-subtopic-title');
const programsContainer = document.getElementById('programs-container');
const sidebarTreeWrapper = document.getElementById('sidebar-tree-wrapper');

let globalRepositoryTreeFlatArray = [];

document.addEventListener('DOMContentLoaded', async () => {
    buildDropdownMenus();
    setupInlineContentLinks();
    setupParentTopicLinks();
    await initializeRepositoryTreeMap();
    checkUrlHashRoute();
});

async function initializeRepositoryTreeMap() {
    try {
        const response = await fetch('tree_manifest.json');
        if (!response.ok) throw new Error("Could not find tree_manifest.json");
        globalRepositoryTreeFlatArray = await response.json();
    } catch (err) {
        console.error("Blueprint layout generation loading exception:", err);
    }
}

function buildDropdownMenus() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        const topicKey = menu.getAttribute('data-topic');
        const subtopics = topicsData[topicKey].subtopics || [];

        subtopics.forEach(sub => {
            const li = document.createElement('li');
            li.className = 'dropdown-item';
            li.textContent = sub.name;
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                window.location.hash = `${encodeURIComponent(topicKey)}:${encodeURIComponent(sub.path)}`;
            });
            menu.appendChild(li);
        });
    });
}

function setupInlineContentLinks() {
    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const parentTopic = link.getAttribute('data-parent');
            let targetPath = link.getAttribute('data-path');
            if (targetPath === "If-Else-Elif") targetPath = "If-Else-Elif Statements";
            if (targetPath === "Error Handling") targetPath = "Try-Except-Finally Statements";
            window.location.hash = `${encodeURIComponent(parentTopic)}:${encodeURIComponent(targetPath)}`;
        });
    });
}

function setupParentTopicLinks() {
    document.querySelectorAll('.nav-topic-title').forEach(titleSpan => {
        titleSpan.addEventListener('click', () => {
            const topicKey = titleSpan.getAttribute('data-topic');
            window.location.hash = `${encodeURIComponent(topicKey)}:all`;
        });
    });
}

function updateBrowserTabTitle(viewName) {
    document.title = `${viewName} | 🐍 Ultimate Python Repository`;
}

async function checkUrlHashRoute() {
    const currentHash = window.location.hash.replace('#', '');
    if (!currentHash) {
        document.title = "Ultimate Python Repository";
        return; 
    }

    if (currentHash.startsWith('section_')) {
        const element = document.getElementById(currentHash);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            setTimeout(() => {
                const retryElement = document.getElementById(currentHash);
                if (retryElement) retryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
        return;
    }

    const segments = currentHash.split(':');
    if (segments.length !== 2) return;

    const topicKey = decodeURIComponent(segments[0]);
    const routeTarget = decodeURIComponent(segments[1]);

    if (!topicsData[topicKey]) return;

    if (routeTarget === 'all') {
        await triggerParentTopicLoad(topicKey);
    } else {
        const sub = topicsData[topicKey].subtopics.find(s => s.path === routeTarget);
        if (sub) await triggerContentLoad(topicKey, sub);
    }
}

window.addEventListener('hashchange', checkUrlHashRoute);

async function triggerParentTopicLoad(topicKey) {
    updateBrowserTabTitle(topicKey);
    document.getElementById('main-split-layout').classList.remove('home-view');
    subtopicTitle.textContent = `${topicKey} (Full Overview)`;
    programsContainer.innerHTML = '<p class="placeholder-text">Rendering overview streams...</p>';
    sidebarTreeWrapper.innerHTML = '';

    const parentObj = topicsData[topicKey];
    const rootUL = document.createElement('ul');
    rootUL.className = 'sidebar-list';
    sidebarTreeWrapper.appendChild(rootUL);

    if (parentObj.mdFile) {
        const safeId = generateSafeElementId(parentObj.mdFile);
        const sideLI = document.createElement('li');
        sideLI.className = 'sidebar-item';
        sideLI.innerHTML = `<a href="#${safeId}" class="sidebar-sub-link" style="color: #4df3a9;">📖 ${topicKey} Overview</a>`;
        rootUL.appendChild(sideLI);

        programsContainer.innerHTML = ''; 
        await fetchAndRenderCode(parentObj.mdFile, parentObj.mdFile, programsContainer, safeId);
    } else {
        programsContainer.innerHTML = '';
    }

    for (const sub of parentObj.subtopics) {
        const parentSafeId = generateSafeElementId(sub.path);
        const masterLI = document.createElement('li');
        masterLI.className = 'sidebar-item';
        masterLI.style.marginTop = "1rem";
        masterLI.innerHTML = `<div class="sidebar-header-row"><span class="arrow-icon expanded">▼</span><a href="#${parentSafeId}" class="sidebar-link" style="color: #ffffff;">💡 ${sub.name}</a></div>`;
        
        const subUL = document.createElement('ul');
        subUL.className = 'sidebar-nested-sublist show';
        masterLI.appendChild(subUL);
        rootUL.appendChild(masterLI);

        const subTopicDivider = document.createElement('h2');
        subTopicDivider.id = parentSafeId;
        subTopicDivider.className = 'nested-folder-title';
        subTopicDivider.style.fontSize = '1.6rem';
        subTopicDivider.style.borderBottom = '3px solid #4df3a9';
        subTopicDivider.textContent = sub.name;
        programsContainer.appendChild(subTopicDivider);

        const containerWrapper = document.createElement('div');
        programsContainer.appendChild(containerWrapper);

        await resolveAndBuildContent(sub.path, containerWrapper, subUL, sub.preferredOrder || []);
    }
}

async function triggerContentLoad(topicKey, subtopicObj) {
    updateBrowserTabTitle(subtopicObj.name);
    document.getElementById('main-split-layout').classList.remove('home-view');
    subtopicTitle.textContent = `${topicKey} ➔ ${subtopicObj.name}`;
    programsContainer.innerHTML = '<p class="placeholder-text">Rendering resources...</p>';
    sidebarTreeWrapper.innerHTML = '';
    
    const rootUL = document.createElement('ul');
    rootUL.className = 'sidebar-list';
    sidebarTreeWrapper.appendChild(rootUL);

    programsContainer.innerHTML = '';
    await resolveAndBuildContent(subtopicObj.path, programsContainer, rootUL, subtopicObj.preferredOrder || []);
}

function cleanDisplayName(rawName) {
    return rawName.replace(/\.(py|md|png|jpg|jpeg)$/i, '').replace(/^\d+_/g, '');
}

function generateSafeElementId(rawString) {
    return 'section_' + rawString.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
}

async function resolveAndBuildContent(folderPath, targetContainer, currentSidebarUL, preferredOrder = []) {
    const prefix = folderPath + "/";
    
    let immediateContents = globalRepositoryTreeFlatArray.filter(item => {
        if (!item.path.startsWith(prefix)) return false;
        const relativePart = item.path.substring(prefix.length);
        return !relativePart.includes('/');
    });

    if (preferredOrder.length > 0) {
        immediateContents.sort((a, b) => {
            const nameA = a.path.split('/').pop();
            const nameB = b.path.split('/').pop();
            const cleanA = cleanDisplayName(nameA);
            const cleanB = cleanDisplayName(nameB);

            let idxA = preferredOrder.findIndex(r => r === nameA || r === cleanA);
            let idxB = preferredOrder.findIndex(r => r === nameB || r === cleanB);

            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return nameA.localeCompare(nameB);
        });
    }

    for (const item of immediateContents) {
        const itemRealName = item.path.split('/').pop();
        const safeId = generateSafeElementId(item.path);
        const displayName = cleanDisplayName(itemRealName);

        if (item.type === "blob") { 
            const lowerName = itemRealName.toLowerCase();
            if (lowerName.endsWith('.py') || lowerName.endsWith('.md') || lowerName.endsWith('.png')) {
                
                const li = document.createElement('li');
                li.className = 'sidebar-item';
                li.innerHTML = `<a href="#${safeId}" class="sidebar-sub-link">📄 ${displayName}</a>`;
                currentSidebarUL.appendChild(li);

                if (lowerName.endsWith('.py') || lowerName.endsWith('.md')) {
                    await fetchAndRenderCode(itemRealName, item.path, targetContainer, safeId);
                } else if (lowerName.endsWith('.png')) {
                    renderImageBlock(itemRealName, item.path, targetContainer, safeId);
                }
            }
        } 
        else if (item.type === "tree") { 
            const internalChildren = globalRepositoryTreeFlatArray.filter(child => child.path.startsWith(item.path + "/"));
            
            // Single-file folder flattening mechanic
            if (internalChildren.length === 1 && internalChildren[0].type === "blob") {
                const singleItem = internalChildren[0];
                const singleRealName = singleItem.path.split('/').pop();
                const singleSafeId = generateSafeElementId(singleItem.path);
                const singleDisplayName = cleanDisplayName(singleRealName);

                const li = document.createElement('li');
                li.className = 'sidebar-item';
                li.innerHTML = `<a href="#${singleSafeId}" class="sidebar-sub-link">📄 ${singleDisplayName}</a>`;
                currentSidebarUL.appendChild(li);

                if (singleRealName.toLowerCase().endsWith('.py') || singleRealName.toLowerCase().endsWith('.md')) {
                    await fetchAndRenderCode(singleRealName, singleItem.path, targetContainer, singleSafeId);
                } else {
                    renderImageBlock(singleRealName, singleItem.path, targetContainer, singleSafeId);
                }
            } else {
                // Multi-program dropdown folder layout
                const masterLI = document.createElement('li');
                masterLI.className = 'sidebar-item';
                
                const headerRow = document.createElement('div');
                headerRow.className = 'sidebar-header-row';
                headerRow.innerHTML = `<span class="arrow-icon">▶</span><a href="#${safeId}" class="sidebar-link">📁 ${displayName}</a>`;
                
                const subUL = document.createElement('ul');
                subUL.className = 'sidebar-nested-sublist';
                
                headerRow.addEventListener('click', () => {
                    const arrow = headerRow.querySelector('.arrow-icon');
                    if (arrow) arrow.classList.toggle('expanded');
                    subUL.classList.toggle('show');
                });

                masterLI.appendChild(headerRow);
                masterLI.appendChild(subUL);
                currentSidebarUL.appendChild(masterLI);

                const subHeading = document.createElement('h3');
                subHeading.className = 'nested-folder-title';
                subHeading.id = safeId;
                subHeading.textContent = `📁 ${displayName}`;
                targetContainer.appendChild(subHeading);

                const nestedGroupContainer = document.createElement('div');
                nestedGroupContainer.className = 'nested-group-container';
                targetContainer.appendChild(nestedGroupContainer);

                await resolveAndBuildContent(item.path, nestedGroupContainer, subUL, []);
            }
        }
    }
}

async function fetchAndRenderCode(fileName, downloadUrl, containerElement, elementId) {
    try {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error("File content mismatch.");
        const textData = await response.text();

        const block = document.createElement('div');
        block.className = 'program-block';
        block.id = elementId; 

        const header = document.createElement('div');
        header.className = 'program-header';
        header.textContent = cleanDisplayName(fileName);
        block.appendChild(header);

        if (fileName.toLowerCase().endsWith('.md')) {
            const mdWrapper = document.createElement('div');
            mdWrapper.className = 'markdown-body-render';
            mdWrapper.innerHTML = marked.parse(textData);
            block.appendChild(mdWrapper);
        } else {
            const pre = document.createElement('pre');
            pre.className = "language-python"; 
            
            const code = document.createElement('code');
            code.className = "language-python";
            code.textContent = textData; 

            pre.appendChild(code);
            block.appendChild(pre);
            
            Prism.highlightElement(code);
        }

        containerElement.appendChild(block);
    } catch (err) {
        console.error(err);
    }
}

function renderImageBlock(fileName, downloadUrl, containerElement, elementId) {
    const block = document.createElement('div');
    block.className = 'program-block repo-image-block';
    block.id = elementId;
    block.style.padding = '1.5rem';
    block.style.display = 'flex';
    block.style.flexDirection = 'column';
    block.style.gap = '1rem';
    block.style.alignItems = 'center';
    block.style.borderRadius = '0';

    const header = document.createElement('div');
    header.className = 'program-header';
    header.style.width = '100%';
    header.style.margin = '-1.5rem -1.5rem 0 -1.5rem';
    header.style.padding = '0.85rem 1.5rem';
    header.textContent = cleanDisplayName(fileName);

    const img = document.createElement('img');
    img.src = downloadUrl;
    img.alt = fileName;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.borderRadius = '0';
    img.style.border = '1px solid #1c2541';

    block.appendChild(header);
    block.appendChild(img);
    containerElement.appendChild(block);
}
