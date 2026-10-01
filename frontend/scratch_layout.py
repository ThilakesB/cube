import os
import glob
import re

target_dir = "/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components"
all_files = glob.glob(os.path.join(target_dir, "**", "*.js"), recursive=True) + glob.glob(os.path.join(target_dir, "**", "*.jsx"), recursive=True)

for file in all_files:
    if "Layout.js" in file:
        continue
        
    with open(file, "r") as f:
        content = f.read()

    # Skip files that don't have both Navbar and Sidebar
    if "Navbar />" not in content and "<Navbar" not in content and "<NavBar" not in content:
        continue
    if "Sidebar />" not in content and "<Sidebar" not in content:
        continue

    print(f"Processing {file}")

    # We need to add the import for Layout
    # First, find if we need to adjust import path
    # Depth from src/components is:
    rel_path = os.path.relpath(file, target_dir)
    depth = rel_path.count(os.sep)
    import_prefix = "../" * depth if depth > 0 else "./"
    
    # Check if Layout is already imported
    if "import Layout" not in content:
        import_stmt = f"import Layout from '{import_prefix}Common_Bar/Layout';\n"
        # Insert after last import
        imports = re.findall(r'^import .*;?$', content, re.MULTILINE)
        if imports:
            last_import = imports[-1]
            content = content.replace(last_import, last_import + "\n" + import_stmt)
        else:
            content = import_stmt + content

    # Strategy: 
    # Look for the outer Grid/Box that contains Navbar and Sidebar and replace it with Layout.
    # This is tricky because every file is a bit different.
    
    # We might just print the files first to see what we're dealing with.

