const REPO_OWNER = 'rhalbhavi';
const REPO_NAME = 'Python-Programming-and-Tkinter';

const topicsData = {
    "Core Foundations": [
        { name: "Keywords and Identifiers", path: "Keywords and Identifiers", preferredOrder: ["Python Keywords.png", "Python Identifiers.md"] },
        { name: "Strings", path: "Strings", preferredOrder: ["Initializing Strings", "String Methods", "Examples"] }
    ],
    "Data Structures": [
        { name: "Lists", path: "Lists", preferredOrder: ["Initializing Lists", "Empty List", "Nested Tuple", "List Methods", "Examples"] },
        { name: "Tuples", path: "Tuples", preferredOrder: ["Initializing Tuples", "Nested Tuple", "Tuple Methods", "Examples"] },
        { name: "Sets", path: "Sets", preferredOrder: ["Initializing Sets", "Set Methods", "Set Operations"] },
        { name: "Dictionaries", path: "Dictionaries", preferredOrder: ["Initializing Dictionaries", "Dictionary Methods", "Examples"] }
    ],
    "Control Flow": [
        { name: "If-Else-Elif Statements", path: "If-Else-Elif", preferredOrder: ["if-else", "Nested if-else", "if-else-elif"] }, 
        { name: "For Loop", path: "For Loop", preferredOrder: ["General Syntax", "for Loop with break and continue statements", "Nested for Loop", "Examples", "for i in Range, List, String"] },
        { name: "While Loop", path: "While Loop", preferredOrder: ["General Syntax", "while Loop with break Statement", "Examples"] },
        { name: "Functions", path: "Functions", preferredOrder: ["Local and Global Variables.py", "Namespaces.py", "def Functions", "lambda Functions", "Recursive Functions", "Built-in Functions"] }
    ],
    "Error Handling": [
        { name: "Try-Except-Finally Statements", path: "Error Handling", preferredOrder: ["Built-in Exceptions.png", "try-except-finally", "try-except-finally with else", "Multiple except Statements in Single except Block", "Error Handling"] }
    ],
    "GUI": [
        { name: "Tkinter", path: "Tkinter", preferredOrder: ["Create a Basic Tkinter Application", "Widgets", "Methods", "Geometry Manager Properties", "Event Handling", "Cursors", "Examples"] }
    ]
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
});

function buildDropdownMenus() {
    const dropdownContainers = document.querySelectorAll('.dropdown-menu');
    dropdownContainers.forEach(menu => {
        const topicKey = menu.getAttribute('data-topic');
        const subtopics = topicsData[topicKey] || [];

        subtopics.forEach(sub => {
            const li = document.createElement('li');
            li.className = 'dropdown-item';
            li.textContent = sub.name;
            
            li.addEventListener('click', () => {
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
            const subtopics = topicsData[parentTopic] || [];
            const sub = subtopics.find(s => s.path === targetPath);
            
            if (sub) triggerContentLoad(parentTopic, sub);
        });
    });
}

// Centered master orchestration engine updating headers, contents, and left sidebar index simultaneously
function triggerContentLoad(topicKey, subtopicObj) {
    subtopicTitle.textContent = `${topicKey} ➔ ${subtopicObj.name}`;
    programsContainer.innerHTML = '<p class="placeholder-text">Loading repository data...</p>';
    sidebarTreeWrapper.innerHTML = '<p class="placeholder-text">Building index layout...</p>';
    
    // Core payload fetch execution
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

/**
 * Enhanced dynamic content processor with real-time automatic sidebar item population.
 */
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

        // Build base layout UL list frame if this is the root level page
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
                    
                    // Create Anchor element map entry inside Left Column index
                    const li = document.createElement('li');
                    li.className = 'sidebar-item';
                    li.innerHTML = `<a href="#${safeId}" class="sidebar-sub-link">📄 ${displayName}</a>`;
                    currentSidebarParentUL.appendChild(li);

                    // Download content and attach it right inside page section container workspace
                    if (lowerName.endsWith('.py') || lowerName.endsWith('.md')) {
                        await fetchAndRenderCode(item.name, item.download_url, targetContainer, safeId);
                    } else if (lowerName.endsWith('.png')) {
                        renderImageBlock(item.name, item.download_url, targetContainer, safeId);
                    }
                }
            } 
            else if (item.type === 'dir') {
                // 1. Sidebar Construction: Expandable Group Component setup
                const masterLI = document.createElement('li');
                masterLI.className = 'sidebar-item';
                
                const headerRow = document.createElement('div');
                headerRow.className = 'sidebar-header-row';
                headerRow.innerHTML = `<span class="arrow-icon">▶</span><a href="#${safeId}" class="sidebar-link">📁 ${displayName}</a>`;
                
                const subUL = document.createElement('ul');
                subUL.className = 'sidebar-nested-sublist';
                
                // Add click handler to toggle slide visibility
                headerRow.addEventListener('click', (e) => {
                    const arrow = headerRow.querySelector('.arrow-icon');
                    arrow.classList.toggle('expanded');
                    subUL.classList.toggle('show');
                });

                masterLI.appendChild(headerRow);
                masterLI.appendChild(subUL);
                currentSidebarParentUL.appendChild(masterLI);

                // 2. Center Content Canvas Area header component initialization
                const subHeading = document.createElement('h3');
                subHeading.className = 'nested-folder-title';
                subHeading.id = safeId;
                subHeading.textContent = `# ${displayName}`;
                targetContainer.appendChild(subHeading);

                const nestedGroupContainer = document.createElement('div');
                nestedGroupContainer.className = 'nested-group-container';
                targetContainer.appendChild(nestedGroupContainer);

                const nextFolderRules = nestedFolderCustomOrders[item.name] || [];
                
                // Fire deep subdirectory crawl tracking thread
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
        block.id = elementId; // Explicit target matching anchor rules

        const header = document.createElement('div');
        header.className = 'program-header';
        header.textContent = cleanDisplayName(fileName);
        block.appendChild(header);

        // NEW: Check if file type format is Markdown or Python script code asset
        if (fileName.toLowerCase().endsWith('.md')) {
            const mdWrapper = document.createElement('div');
            mdWrapper.className = 'markdown-body-render';
            
            // Render structured output instantly with Marked.js
            mdWrapper.innerHTML = marked.parse(textData);
            block.appendChild(mdWrapper);
        } else {
            const pre = document.createElement('pre');
            pre.className = "language-python"; // Lock in PrismJS context classes
            
            const code = document.createElement('code');
            code.className = "language-python";
            code.textContent = textData; 

            pre.appendChild(code);
            block.appendChild(pre);
            
            // Force PrismJS parsing layer onto newly appended asset block canvas loop
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
    img.style.border = '1px solid #1c2541';

    block.appendChild(header);
    block.appendChild(img);
    containerElement.appendChild(block);
}
