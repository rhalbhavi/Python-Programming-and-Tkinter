const REPO_OWNER = 'rhalbhavi';
const REPO_NAME = 'Python-Programming-and-Tkinter';

/**
 * Full layout structure with explicit ordering.
 * Maps UI names to their real case-sensitive GitHub repo directory paths, alongside explicit sequence arrays for sorting root-level assets.
 */
const topicsData = {
    "Core Foundations": [
        { 
            name: "Keywords and Identifiers", 
            path: "Keywords and Identifiers",
            preferredOrder: ["Python Keywords.png", "Python Identifiers.md"]
        },
        { 
            name: "Strings", 
            path: "Strings",
            preferredOrder: ["Initializing Strings", "String Methods", "Examples"]
        }
    ],
    "Data Structures": [
        { 
            name: "Lists", 
            path: "Lists",
            preferredOrder: ["Initializing Lists", "Empty List", "Nested Tuple", "List Methods", "Examples"]
        },
        { 
            name: "Tuples", 
            path: "Tuples",
            preferredOrder: ["Initializing Tuples", "Nested Tuple", "Tuple Methods", "Examples"]
        },
        { 
            name: "Sets", 
            path: "Sets",
            preferredOrder: ["Initializing Sets", "Set Methods", "Set Operations"]
        },
        { 
            name: "Dictionaries", 
            path: "Dictionaries",
            preferredOrder: ["Initializing Dictionaries", "Dictionary Methods", "Examples"]
        }
    ],
    "Control Flow": [
        { 
            name: "If-Else-Elif Statements", 
            path: "If-Else-Elif",
            preferredOrder: ["if-else", "Nested if-else", "if-else-elif"]
        }, 
        { 
            name: "For Loop", 
            path: "For Loop",
            preferredOrder: ["General Syntax", "for Loop with break and continue statements", "Nested for Loop", "Examples", "for i in Range, List, String"]
        },
        { 
            name: "While Loop", 
            path: "While Loop",
            preferredOrder: ["General Syntax", "while Loop with break Statement", "Examples"]
        },
        { 
            name: "Functions", 
            path: "Functions",
            preferredOrder: [
                "Local and Global Variables.py", 
                "Namespaces.py", 
                "def Functions", 
                "lambda Functions", 
                "Recursive Functions", 
                "Built-in Functions"
            ]
        }
    ],
    "Error Handling": [
        { 
            name: "Try-Except-Finally Statements", 
            path: "Error Handling",
            preferredOrder: [
                "Built-in Exceptions.png", 
                "try-except-finally", 
                "try-except-finally with else", 
                "Multiple except Statements in Single except Block", 
                "Error Handling"
            ]
        }
    ],
    "GUI": [
        { 
            name: "Tkinter", 
            path: "Tkinter",
            preferredOrder: [
                "Create a Basic Tkinter Application", 
                "Widgets", 
                "Methods", 
                "Geometry Manager Properties", 
                "Event Handling", 
                "Cursors", 
                "Examples"
            ]
        }
    ]
};

// Sub-layer exceptions or structural folder specific layout rules mapped explicitly
const nestedFolderCustomOrders = {
    "def Functions": ["def Functions.py", "Arguments", "Return Statement", "Examples", "Print Docstrings (Comments) in Function.py"],
    "lambda Functions": ["lambda Functions.py", "Examples"],
    "Recursive Functions": ["Recursive Functions.py", "Examples"],
    "Nested Tuple": ["Nested Tuple.py", "Index of Nested Tuple.py"]
};

const subtopicTitle = document.getElementById('current-subtopic-title');
const programsContainer = document.getElementById('programs-container');

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
            li.setAttribute('data-path', sub.path);
            
            li.addEventListener('click', () => {
                subtopicTitle.textContent = `${topicKey} ➔ ${sub.name}`;
                programsContainer.innerHTML = '<p class="placeholder-text">Loading repository data...</p>';
                
                const preferredRules = sub.preferredOrder || [];
                fetchFolderContents(sub.path, programsContainer, false, preferredRules);
            });

            menu.appendChild(li);
        });
    });
}

function setupInlineContentLinks() {
    const pageLinks = document.querySelectorAll('.page-link');
    
    pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const parentTopic = link.getAttribute('data-parent');
            const targetPath = link.getAttribute('data-path');
            const displayTitle = link.textContent;
            
            subtopicTitle.textContent = `${parentTopic} ➔ ${displayTitle}`;
            programsContainer.innerHTML = '<p class="placeholder-text">Loading repository data...</p>';
            
            // Extract sorting parameters for the home page selection flow path
            let preferredRules = [];
            for (const key in topicsData) {
                const foundSub = topicsData[key].find(s => s.path === targetPath);
                if (foundSub && foundSub.preferredOrder) {
                    preferredRules = foundSub.preferredOrder;
                    break;
                }
            }

            fetchFolderContents(targetPath, programsContainer, false, preferredRules);
            programsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/**
 * Universal Formatter to clean out text formats, extensions, or code markers from header visuals.
 */
function cleanDisplayName(rawName) {
    // Remove extension wrappers cleanly
    return rawName.replace(/\.(py|md|png|jpg|jpeg)$/i, '');
}

/**
 * Sorts array content parameters dynamically based on a preference sequence template array.
 */
function applyCustomSorting(itemsArray, rulesArray) {
    if (!rulesArray || rulesArray.length === 0) return itemsArray;

    return itemsArray.sort((a, b) => {
        // Look for matching names with extensions or raw base titles
        const baseA = cleanDisplayName(a.name);
        const baseB = cleanDisplayName(b.name);

        let idxA = rulesArray.findIndex(r => r === a.name || r === baseA);
        let idxB = rulesArray.findIndex(r => r === b.name || r === baseB);

        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        
        // Default alpha backup sort
        return a.name.localeCompare(b.name);
    });
}

/**
 * Main Fetching Engine handling multi-format repo resources (.py, .png, .md, directories).
 */
async function fetchFolderContents(folderPath, targetContainer, isSubFolder = false, orderRules = []) {
    if (!isSubFolder) targetContainer.innerHTML = ''; 

    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(folderPath)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`GitHub returned status: ${response.status}`);
        
        const rawContents = await response.json();
        
        // Group all contents collectively so custom explicit items sort can blend files and folders together 
        const sortedContents = applyCustomSorting(rawContents, orderRules);

        let itemsRenderedCount = 0;

        for (const item of sortedContents) {
            if (item.type === 'file') {
                const lowerName = item.name.toLowerCase();
                
                if (lowerName.endsWith('.py') || lowerName.endsWith('.md')) {
                    itemsRenderedCount++;
                    await fetchAndRenderCode(item.name, item.download_url, targetContainer);
                } 
                else if (lowerName.endsWith('.png') || lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) {
                    itemsRenderedCount++;
                    renderImageBlock(item.name, item.download_url, targetContainer);
                }
            } 
            else if (item.type === 'dir') {
                itemsRenderedCount++;
                
                // Establish folder element structure
                const subHeading = document.createElement('h3');
                subHeading.className = 'nested-folder-title';
                subHeading.textContent = `📁 ${cleanDisplayName(item.name)}`;
                targetContainer.appendChild(subHeading);

                const nestedGroupContainer = document.createElement('div');
                nestedGroupContainer.className = 'nested-group-container';
                targetContainer.appendChild(nestedGroupContainer);

                // Fetch custom subfolder internal layout order schema if defined
                const nextFolderRules = nestedFolderCustomOrders[item.name] || [];
                
                // Recurse downwards
                await fetchFolderContents(item.path, nestedGroupContainer, true, nextFolderRules);
            }
        }

        if (itemsRenderedCount === 0 && !isSubFolder) {
            targetContainer.innerHTML = '<p class="placeholder-text">No target program assets found in this folder area.</p>';
        }

    } catch (error) {
        console.error(error);
        const errorMsg = document.createElement('p');
        errorMsg.className = 'error-text';
        errorMsg.textContent = `Error processing directory layer: ${error.message}`;
        targetContainer.appendChild(errorMsg);
    }
}

async function fetchAndRenderCode(fileName, downloadUrl, containerElement) {
    try {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error("Could not retrieve source file string stream.");
        const codeText = await response.text();

        const block = document.createElement('div');
        block.className = 'program-block';

        const header = document.createElement('div');
        header.className = 'program-header';
        
        // Clean display layout name output using cleanDisplayName helper
        header.textContent = cleanDisplayName(fileName);

        const pre = document.createElement('pre');
        const code = document.createElement('code');
        
        // Fallback styling format checks if resource is textual markdown or executable script code
        if (fileName.toLowerCase().endsWith('.md')) {
            pre.style.background = '#101014'; 
            pre.style.whiteSpace = 'pre-wrap';
        }
        
        code.textContent = codeText; 

        pre.appendChild(code);
        block.appendChild(header);
        block.appendChild(pre);
        containerElement.appendChild(block);

    } catch (err) {
        const errorBlock = document.createElement('div');
        errorBlock.className = 'program-block';
        errorBlock.innerHTML = `<div class="program-header">${cleanDisplayName(fileName)}</div><pre><code class="error-text">Failed to fetch content block: ${err.message}</code></pre>`;
        containerElement.appendChild(errorBlock);
    }
}

function renderImageBlock(fileName, downloadUrl, containerElement) {
    const block = document.createElement('div');
    block.className = 'program-block repo-image-block';
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
    
    // Formatted context header label string text out cleaned
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
