import os
import glob
import re

target_dir = "/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components"
all_files = glob.glob(os.path.join(target_dir, "**", "*.js"), recursive=True) + glob.glob(os.path.join(target_dir, "**", "*.jsx"), recursive=True)

layout_wrapper = """<Layout>"""
layout_close = """</Layout>"""

for file in all_files:
    if "Layout.js" in file:
        continue
    
    with open(file, "r") as f:
        content = f.read()

    # Skip files that don't have both Navbar and Sidebar
    if ("Navbar />" not in content and "<Navbar" not in content and "<NavBar" not in content) or ("Sidebar />" not in content and "<Sidebar" not in content):
        continue

    print(f"Updating {file}")

    # Calculate import path
    rel_path = os.path.relpath(file, target_dir)
    depth = rel_path.count(os.sep)
    import_prefix = "../" * depth if depth > 0 else "./"
    import_stmt = f"import Layout from '{import_prefix}Common_Bar/Layout';\n"
    
    if "import Layout" not in content:
        imports = re.findall(r'^import .*;?$', content, re.MULTILINE)
        if imports:
            last_import = imports[-1]
            content = content.replace(last_import, last_import + "\n" + import_stmt)
        else:
            content = import_stmt + content

    # Using regex to find the outermost Grid or Box that contains the Navbar and Sidebar
    # This is a bit tricky, let's look for specific patterns
    # Pattern 1:
    # <Grid container ... >
    #   <Grid item ...><Navbar /></Grid>
    #   <Grid container ...>
    #      <Grid item ...><Sidebar /></Grid>
    #      <Grid item ...> MAIN CONTENT </Grid>
    #   </Grid>
    # </Grid>
    
    # Actually, a simpler way is to write a custom replacement for each common pattern.
    
    # Or just use the tool `sed`/regex to rip out Navbar/Sidebar
    # But since each file is a bit different, maybe I should only apply it to the Add forms right now as requested.
