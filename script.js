const REPO_OWNER = 'rhalbhavi';
const REPO_NAME = 'Python-Programming-and-Tkinter';

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
            { name: "If-Else-Elif Statements", path: "If-Else-Elif", preferredOrder: ["if-else", "Nested if-else", "if-else-elif"] }, 
            { name: "For Loop", path: "For Loop", preferredOrder: ["General Syntax", "for Loop with break and continue statements", "Nested for Loop", "Examples", "for i in Range, List, String"] },
            { name: "While Loop", path: "While Loop", preferredOrder: ["General Syntax", "while Loop with break Statement", "Examples"] },
            { name: "Functions", path: "Functions", preferredOrder: ["Local and Global Variables.py", "Namespaces.py", "def Functions", "lambda Functions", "Recursive Functions", "Built-in Functions"] }
        ]
    },
    "Error Handling": {
        mdFile: "Error Handling.md",
        subtopics: [
            { name: "Try-Except-Finally Statements", path: "Error Handling", preferredOrder: ["Built-in Exceptions.png", "try-except-finally", "try-except-finally with else", "Multiple except Statements in Single except Block", "Error Handling"] }
        ]
    },
    "GUI": {
        mdFile: "Tkinter.md",
        subtopics: [
            { name: "Tkinter", path: "Tkinter", preferredOrder: ["Create a Basic Tkinter Application", "Widgets", "Methods", "Geometry Manager Properties", "Event Handling", "Cursors", "Examples"] }
        ]
    }
};

const nestedFolderCustomOrders = {
    "def Functions": ["def Functions.py", "Arguments", "Return Statement", "Examples", "Print Docstrings (Comments) in Function.py"],
    "lambda Functions": ["lambda Functions.py", "Examples"],
    "Recursive Functions": ["Recursive Functions.py", "Examples"],
    "Nested Tuple": ["Nested Tuple.py", "Index of Nested Tuple.py"]
};

const subtopicTitle = document.getElementById('current-subtopic-title');
const programsContainer = document.getElementById('programs-container');
const sidebarTreeWrapper = document.getElementById('sidebar-tree-wrapper');

document.addEventListener('DOMContentLoaded', () => {
    buildDropdownMenus();
    setupInlineContentLinks();
    setupParentTopicLinks();
});

function buildDropdownMenus() {
    const dropdownContainers = document.querySelectorAll('.dropdown-menu');
    dropdownContainers.forEach(menu => {
        const topicKey = menu.getAttribute('data-topic');
        const subtopics = topicsData[topicKey].subtopics || [];

        subtopics.forEach(sub => {
            const li = document.createElement('li');
            li.className = 'dropdown-item';
            li.textContent = sub.name;
            
            li.addEventListener('click', (e) => {
                e.stopPropagation(); // Stop parent triggers
                triggerContentLoad(topicKey, sub);
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
            const targetPath = link.getAttribute('data-path');
            const subtopics = topicsData[parentTopic].subtopics || [];
            const sub = subtopics.find(s => s.path === targetPath);
            
            if (sub) triggerContentLoad(parentTopic, sub);
        });
    });
}

// NEW: Wire event triggers when clicking the master category title itself in navbar
function setupParentTopicLinks() {
    document.querySelectorAll('.nav-topic-title').forEach(titleSpan => {
        titleSpan.addEventListener('click', () => {
            const topicKey = titleSpan.getAttribute('data-topic');
            triggerParentTopicLoad(topicKey);
        });
    });
}

// NEW: Loads full Parent layout (Parent markdown file + merges all subtopic contents continuously)
async function triggerParentTopicLoad(topicKey) {
    document.getElementById('main-split-layout').classList.remove('home-view');
    subtopicTitle.textContent = `${topicKey} (Full Overview)`;
    programsContainer.innerHTML = '<p class="placeholder-text">Loading multi-tier parent repository streams...</p>';
    sidebarTreeWrapper.innerHTML = '';

    const parentObj = topicsData[topicKey];
    const rootUL = document.createElement('ul');
    rootUL.className = 'sidebar-list';
    sidebarTreeWrapper.appendChild(rootUL);

    // 1. Fetch parent markdown overview header documentation file if declared
    if (parentObj.mdFile) {
        const safeId = generateSafeElementId(parentObj.mdFile);
        
        const sideLI = document.createElement('li');
        sideLI.className = 'sidebar-item';
        sideLI.innerHTML = `<a href="#${safeId}" class="sidebar-sub-link" style="color: #4df3a9;">📖 ${topicKey} Overview</a>`;
        rootUL.appendChild(sideLI);

        const parentMdUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/master/${parentObj.mdFile}`;
        programsContainer.innerHTML = ''; // reset loading text
        await fetchAndRenderCode(parentObj.mdFile, parentMdUrl, programsContainer, safeId);
    } else {
        programsContainer.innerHTML = '';
    }

    // 2. Loop continuously and inject all subsections sequentially
    for (const sub of parentObj.subtopics) {
        const parentSafeId = generateSafeElementId(sub.path);

        // Append subsection breaker inside sidebar
        const masterLI = document.createElement('li');
        masterLI.className = 'sidebar-item';
        masterLI.style.marginTop = "1rem";
        masterLI.innerHTML = `<div class="sidebar-header-row"><span class="arrow-icon expanded">▼</span><a href="#${parentSafeId}" class="sidebar-link" style="color: #ffffff;">💡 ${sub.name}</a></div>`;
        
        const subUL = document.createElement('ul');
        subUL.className = 'sidebar-nested-sublist show';
        masterLI.appendChild(subUL);
        rootUL.appendChild(masterLI);

        // Append subsection breaker inside the page
        const subTopicDivider = document.createElement('h2');
        subTopicDivider.id = parentSafeId;
        subTopicDivider.className = 'nested-folder-title';
        subTopicDivider.style.fontSize = '1.6rem';
        subTopicDivider.style.borderBottom = '3px solid #4df3a9';
        subTopicDivider.textContent = sub.name;
        programsContainer.appendChild(subTopicDivider);

        const containerWrapper = document.createElement('div');
        programsContainer.appendChild(containerWrapper);

        // Fetch using recursive method passing active structural layouts
        await fetchFolderContents(sub.path, containerWrapper, true, sub.preferredOrder || [], subUL);
    }
}

function triggerContentLoad(topicKey, subtopicObj) {
    document.getElementById('main-split-layout').classList.remove('home-view');
    subtopicTitle.textContent = `${topicKey} ➔ ${subtopicObj.name}`;
    programsContainer.innerHTML = '<p class="placeholder-text">Loading repository data...</p>';
    sidebarTreeWrapper.innerHTML = '<p class="placeholder-text">Building index layout...</p>';
    
    fetchFolderContents(subtopicObj.path, programsContainer, false, subtopicObj.preferredOrder || []);
}

function cleanDisplayName(rawName) {
    return rawName.replace(/\.(py|md|png|jpg|jpeg)$/i, '');
}

function generateSafeElementId(rawString) {
    return 'section_' + rawString.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
}

function applyCustomSorting(itemsArray, rulesArray) {
    if (!rulesArray || rulesArray.length === 0) return itemsArray;
    return itemsArray.sort((a, b) => {
        const baseA = cleanDisplayName(a.name);
        const baseB = cleanDisplayName(b.name);
        let idxA = rulesArray.findIndex(r => r === a.name || r === baseA);
        let idxB = rulesArray.findIndex(r => r === b.name || r === baseB);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.name.localeCompare(b.name);
    });
}

async function fetchFolderContents(folderPath, targetContainer, isSubFolder = false, orderRules = [], currentSidebarParentUL = null) {
    if (!isSubFolder) {
        targetContainer.innerHTML = '';
        sidebarTreeWrapper.innerHTML = '';
    }

    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(folderPath)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`GitHub status: ${response.status}`);
        const rawContents = await response.json();
        const sortedContents = applyCustomSorting(rawContents, orderRules);

        if (!isSubFolder) {
            const rootUL = document.createElement('ul');
            rootUL.className = 'sidebar-list';
            sidebarTreeWrapper.appendChild(rootUL);
            currentSidebarParentUL = rootUL;
        }

        for (const item of sortedContents) {
            const safeId = generateSafeElementId(item.path);
            const displayName = cleanDisplayName(item.name);

            if (item.type === 'file') {
                const lowerName = item.name.toLowerCase();
                if (lowerName.endsWith('.py') || lowerName.endsWith('.md') || lowerName.endsWith('.png')) {
                    
                    const li = document.createElement('li');
                    li.className = 'sidebar-item';
                    li.innerHTML = `<a href="#${safeId}" class="sidebar-sub-link">📄 ${displayName}</a>`;
                    currentSidebarParentUL.appendChild(li);

                    if (lowerName.endsWith('.py') || lowerName.endsWith('.md')) {
                        await fetchAndRenderCode(item.name, item.download_url, targetContainer, safeId);
                    } else if (lowerName.endsWith('.png')) {
                        renderImageBlock(item.name, item.download_url, targetContainer, safeId);
                    }
                }
            } 
            else if (item.type === 'dir') {
                const masterLI = document.createElement('li');
                masterLI.className = 'sidebar-item';
                
                const headerRow = document.createElement('div');
                headerRow.className = 'sidebar-header-row';
                headerRow.innerHTML = `<span class="arrow-icon">▶</span><a href="#${safeId}" class="sidebar-link">📁 ${displayName}</a>`;
                
                const subUL = document.createElement('ul');
                subUL.className = 'sidebar-nested-sublist';
                
                headerRow.addEventListener('click', (e) => {
                    const arrow = headerRow.querySelector('.arrow-icon');
                    if (arrow) arrow.classList.toggle('expanded');
                    subUL.classList.toggle('show');
                });

                masterLI.appendChild(headerRow);
                masterLI.appendChild(subUL);
                currentSidebarParentUL.appendChild(masterLI);

                const subHeading = document.createElement('h3');
                subHeading.className = 'nested-folder-title';
                subHeading.id = safeId;
                subHeading.textContent = `📁 ${displayName}`;
                targetContainer.appendChild(subHeading);

                const nestedGroupContainer = document.createElement('div');
                nestedGroupContainer.className = 'nested-group-container';
                targetContainer.appendChild(nestedGroupContainer);

                const nextFolderRules = nestedFolderCustomOrders[item.name] || [];
                await fetchFolderContents(item.path, nestedGroupContainer, true, nextFolderRules, subUL);
            }
        }
    } catch (error) {
        console.error(error);
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
