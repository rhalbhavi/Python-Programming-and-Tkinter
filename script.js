const REPO_OWNER = 'rhalbhavi';
const REPO_NAME = 'Python-Programming-and-Tkinter';

const topicsData = {
    "Core Foundations": [
        { name: "Keywords and Identifiers", path: "Keywords and Identifiers" },
        { name: "Strings", path: "Strings" }
    ],
    "Data Structures": [
        { name: "Lists", path: "Lists" },
        { name: "Tuples", path: "Tuples" },
        { name: "Sets", path: "Sets" },
        { name: "Dictionaries", path: "Dictionaries" }
    ],
    "Control Flow": [
        { name: "If-Else-Elif Statements", path: "If-Else-Elif" }, 
        { name: "For Loop", path: "For Loop" },
        { name: "While Loop", path: "While Loop" },
        { name: "Functions", path: "Functions" }
    ],
    "Error Handling": [
        { name: "Try-Except-Finally Statements", path: "Error Handling" }
    ],
    "GUI": [
        { name: "Tkinter", path: "Tkinter" }
    ]
};

const subtopicTitle = document.getElementById('current-subtopic-title');
const programsContainer = document.getElementById('programs-container');

// Core Initialization Entry point
document.addEventListener('DOMContentLoaded', () => {
    buildDropdownMenus();
    setupInlineContentLinks();
});

// Generate and bind subtopic elements under respective dropdown lists
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
            
            // Execute file pull when dropdown item is clicked
            li.addEventListener('click', () => {
                subtopicTitle.textContent = `${topicKey} ➔ ${sub.name}`;
                programsContainer.innerHTML = '<p class="placeholder-text">Loading repository data...</p>';
                fetchFolderContents(sub.path, programsContainer, false);
            });

            menu.appendChild(li);
        });
    });
}

// Map the list anchor tags inside the home screen dashboard to trigger directory fetches
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
            
            // Call dynamic directory fetch engine
            fetchFolderContents(targetPath, programsContainer, false);
            
            // Smoothly snap screen viewpoint focus into code canvas workspace
            programsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// Scans folders and dynamically prints code blocks or handles deeper subdirectories
async function fetchFolderContents(folderPath, targetContainer, isSubFolder = false) {
    if (!isSubFolder) targetContainer.innerHTML = ''; 

    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(folderPath)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`GitHub returned status: ${response.status}`);
        
        const contents = await response.json();
        
        // 1. Fetch and render all Python files
        const pyFiles = contents.filter(item => item.type === 'file' && item.name.endsWith('.py'));
        for (const file of pyFiles) {
            await fetchAndRenderCode(file.name, file.download_url, targetContainer);
        }

        // 2. Discover nested subfolders and recurse into them
        const subDirs = contents.filter(item => item.type === 'dir');
        for (const dir of subDirs) {
            const subHeading = document.createElement('h3');
            subHeading.className = 'nested-folder-title';
            subHeading.textContent = `📁 Subfolder: ${dir.name}`;
            targetContainer.appendChild(subHeading);

            const nestedGroupContainer = document.createElement('div');
            nestedGroupContainer.className = 'nested-group-container';
            targetContainer.appendChild(nestedGroupContainer);

            await fetchFolderContents(dir.path, nestedGroupContainer, true);
        }

        if (pyFiles.length === 0 && subDirs.length === 0 && !isSubFolder) {
            targetContainer.innerHTML = '<p class="placeholder-text">No program files or subfolders found here.</p>';
        }

    } catch (error) {
        console.error(error);
        const errorMsg = document.createElement('p');
        errorMsg.className = 'error-text';
        errorMsg.textContent = `Error scanning folder layers: ${error.message}`;
        targetContainer.appendChild(errorMsg);
    }
}

// Downloads raw source string vectors and inserts markdown block components
async function fetchAndRenderCode(fileName, downloadUrl, containerElement) {
    try {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error("Could not retrieve file text content.");
        const codeText = await response.text();

        const block = document.createElement('div');
        block.className = 'program-block';

        const header = document.createElement('div');
        header.className = 'program-header';
        header.textContent = fileName;

        const pre = document.createElement('pre');
        const code = document.createElement('code');
        
        // Wrapping contents inside precise markdown tags as configured
        code.textContent = `\`\`\`python\n${codeText}\n\`\`\``;

        pre.appendChild(code);
        block.appendChild(header);
        block.appendChild(pre);
        containerElement.appendChild(block);

    } catch (err) {
        const errorBlock = document.createElement('div');
        errorBlock.className = 'program-block';
        errorBlock.innerHTML = `<div class="program-header">${fileName}</div><pre><code class="error-text">Failed to fetch contents: ${err.message}</code></pre>`;
        containerElement.appendChild(errorBlock);
    }
}
