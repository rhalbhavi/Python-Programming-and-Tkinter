import os
import json

# Scans folder locally where it is executed
REPO_ROOT = '.'  

# Skip local web operational files and configuration caches
IGNORE_DIRS = {'.git', '.github', 'assets', 'node_modules'}

def build_flat_tree(root_dir):
    flat_tree = []
    
    for root, dirs, files in os.walk(root_dir):
        # Prevent indexing tracking loops
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        for d in dirs:
            rel_path = os.path.relpath(os.path.join(root, d), root_dir).replace('\\', '/')
            flat_tree.append({
                "path": rel_path,
                "type": "tree"
            })
            
        for f in files:
            # Skip core site files so only curriculum code and diagrams populate the layout array
            if f.startswith('.') or f.endswith(('.pyc', '.json', '.html', '.css', '.js')):
                continue
            
            rel_path = os.path.relpath(os.path.join(root, f), root_dir).replace('\\', '/')
            flat_tree.append({
                "path": rel_path,
                "type": "blob"
            })
            
    return flat_tree

if __name__ == "__main__":
    print("Compiling localized workspace configuration blueprint mapping...")
    manifest_data = build_flat_tree(REPO_ROOT)
    
    # Outputs right next to index.html file
    output_file = './tree_manifest.json'
    
    with open(output_file, 'w', encoding='utf-8') as json_file:
        json.dump(manifest_data, json_file, indent=2, ensure_ascii=False)
        
    print(f"Success! {output_file} generated locally with {len(manifest_data)} mapped records.")
