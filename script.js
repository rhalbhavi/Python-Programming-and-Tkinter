// Configuration mapping UI sections to real folder paths in your GitHub Repository
const REPO_OWNER = 'rhalbhavi';
const REPO_NAME = 'Python-Programming-and-Tkinter';

// Full layout structure based on your provided topics and subtopics
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
        { name: "If-Else-Elif Statements", path: "If-Else-Elif Statements" }, 
        { name: "For Loop", path: "For Loop" },
        { name: "While Loop", path: "While Loop" },
        { name: "Functions", path: "Functions" }
    ],
    "Error Handling": [
        { name: "Try-Except-Finally Statements", path: "Try-Except-Finally Statements" }
    ],
    "GUI": [
        { name: "Tkinter", path: "Tkinter" }
    ]
};

// State tracker
let currentTopic = "Core Foundations";

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const subtopicSelect = document.getElementById('subtopic-select');
const subtopicTitle = document.getElementById('current-subtopic-title');
const programsContainer = document.getElementById('programs-container');

// Initialize layout
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    populateSubtopics(currentTopic);
});

// Setup click events on navigation
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            currentTopic = link.getAttribute('data-topic');
            populateSubtopics(currentTopic);
        });
    });

    subtopicSelect.addEventListener('change', (e) => {
        const selectedPath = e.target.value;
        const selectedName = e.target.options[e.target.selectedIndex].text;
        
        if (selectedPath) {
            subtopicTitle.textContent = `${currentTopic} ➔ ${selectedName}`;
            programsContainer.innerHTML = '<p class="placeholder-text">Loading repository data...</p>';
            
            // Start reading the folder contents
            fetchFolderContents(selectedPath, programsContainer);
        } else {
            subtopicTitle.textContent = "Select a topic and subtopic to view programs";
            programsContainer.innerHTML = '<p class="placeholder-text">Please pick a subtopic from the dropdown above...</p>';
        }
    });
}

// Populate Dropdown according to top-level tab choice
function populateSubtopics(topicKey) {
    subtopicSelect.innerHTML = '<option value="">-- Choose a Subtopic --</option>';
    programsContainer.innerHTML = '<p class="placeholder-text">Please pick a subtopic from the dropdown above...</p>';
    subtopicTitle.textContent = "Select a topic and subtopic to view programs";

    const subtopics = topicsData[topicKey] || [];
    subtopics.forEach(sub => {
        const option = document.createElement('option');
        option.value = sub.path;
        option.textContent = sub.name;
        subtopicSelect.appendChild(option);
    });
}

/**
 * Dynamically reads a folder from GitHub.
 * If it discovers a file, it downloads and displays it.
 * If it discovers a nested directory, it appends a sub-heading and loops inside it.
 */
async function fetchFolderContents(folderPath, targetContainer, isSubFolder = false) {
    if (!isSubFolder) {
        targetContainer.innerHTML = ''; // Clear initial placeholder text
    }

    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(folderPath)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`GitHub returned status: ${response.status}`);
        }
        
        const contents = await response.json();
        
        // 1. Process files first
        const pyFiles = contents.filter(item => item.type === 'file' && item.name.endsWith('.py'));
        for (const file of pyFiles) {
            await fetchAndRenderCode(file.name, file.download_url, targetContainer);
        }

        // 2. Process any nested directories discovered inside this folder
        const subDirs = contents.filter(item => item.type === 'dir');
        for (const dir of subDirs) {
            // Create a sub-heading dynamically for this nested folder structural layer
            const subHeading = document.createElement('h3');
            subHeading.className = 'nested-folder-title';
            subHeading.textContent = `📁 Subfolder: ${dir.name}`;
            targetContainer.appendChild(subHeading);

            // Create a local wrapper container for this subfolder's items
            const nestedGroupContainer = document.createElement('div');
            nestedGroupContainer.className = 'nested-group-container';
            targetContainer.appendChild(nestedGroupContainer);

            // Recurse down into the nested folder path
            await fetchFolderContents(dir.path, nestedGroupContainer, true);
        }

        // Catch edge case where folder is completely barren of code assets
        if (pyFiles.length === 0 && subDirs.length === 0 && !isSubFolder) {
            targetContainer.innerHTML = '<p class="placeholder-text">No target files or subfolders found in this directory.</p>';
        }

    } catch (error) {
        console.error(error);
        const errorMsg = document.createElement('p');
        errorMsg.className = 'error-text';
        errorMsg.textContent = `Error scanning folder layers: ${error.message}`;
        targetContainer.appendChild(errorMsg);
    }
}

// Downloads individual files and formats them into strict markdown syntax
async function fetchAndRenderCode(fileName, downloadUrl, containerElement) {
    try {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error("Could not retrieve file stream content.");
        const codeText = await response.text();

        // Build HTML Code structures
        const block = document.createElement('div');
        block.className = 'program-block';

        const header = document.createElement('div');
        header.className = 'program-header';
        header.textContent = fileName;

        const pre = document.createElement('pre');
        const code = document.createElement('code');
        
        // Formatted code injected inside raw markdown strings
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
