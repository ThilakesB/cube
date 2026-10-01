import os
import glob
import re

target_dir = "/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components"
all_files = glob.glob(os.path.join(target_dir, "**", "*.js"), recursive=True) + glob.glob(os.path.join(target_dir, "**", "*.jsx"), recursive=True)

for file in all_files:
    if "Layout.js" in file or "GlobalFormLayout.js" in file:
        continue
        
    with open(file, "r") as f:
        content = f.read()

    # Skip files that don't have Navbar and Sidebar
    if ("Navbar />" not in content and "<Navbar" not in content and "<NavBar" not in content) or ("Sidebar />" not in content and "<Sidebar" not in content):
        continue

    # Attempt to use regex to find the start of the main content
    # Look for `<Sidebar />` then the very next `<Grid item ...>` or `<Box ...>`
    match = re.search(r'<\s*Sidebar\s*/?>\s*</(?:Grid|Box)>\s*<(?:Grid\s+item|Box)[^>]*>', content)
    if not match:
        continue

    start_idx = match.end()
    
    # We want to replace everything from `return (` up to `start_idx`
    return_match = re.search(r'return\s*\(\s*(<[^>]+>)', content[:start_idx])
    if not return_match:
        continue
        
    prefix_to_replace = content[return_match.start():start_idx]
    
    # Replace the prefix
    new_prefix = "return (\n    <Layout>\n"
    
    new_content = content[:return_match.start()] + new_prefix + content[start_idx:]
    
    # Now we need to find the closing tags at the very end of the return statement
    # The return statement ends with `);`
    # We'll just replace the last few closing tags before `);` with `</Layout>`
    # Find the last `);`
    last_semi = new_content.rfind(');')
    if last_semi != -1:
        # Find the tags before it
        suffix_area = new_content[:last_semi]
        # We replace the sequence of closing grids/boxes right before it
        # Actually, if we just find the last block of closing tags:
        replaced_suffix = re.sub(r'(</(?:Grid|Box)>\s*)+$', '</Layout>\n  ', suffix_area)
        new_content = replaced_suffix + new_content[last_semi:]
        
        # Add import
        rel_path = os.path.relpath(file, target_dir)
        depth = rel_path.count(os.sep)
        import_prefix = "../" * depth if depth > 0 else "./"
        import_stmt = f"import Layout from '{import_prefix}Common_Bar/Layout';\n"
        
        if "import Layout" not in new_content:
            imports = re.findall(r'^import .*;?$', new_content, re.MULTILINE)
            if imports:
                last_import = imports[-1]
                new_content = new_content.replace(last_import, last_import + "\n" + import_stmt)
            else:
                new_content = import_stmt + new_content

        with open(file, "w") as f:
            f.write(new_content)
        print(f"Updated {file}")

