import os
import glob
import re

target_dir = "/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components"
all_files = glob.glob(os.path.join(target_dir, "**", "*.js"), recursive=True) + glob.glob(os.path.join(target_dir, "**", "*.jsx"), recursive=True)

# We know the specific files mentioned: AddEmployee, AdminAddDepartments, etc.
# But it's safer to use an AST or exact match for known bad patterns.

pattern1 = re.compile(
    r'<\s*Grid\s+container\s+(?:style=\{\{\s*height:\s*"100vh"\s*\}\}|bgcolor=\{\'#E5F1FF\'\}\s+sx=\{\{\s*height:\s*\'100vh\',\s*overflowY:\s*"auto"\s*\}\})[^>]*>.*?'
    r'<\s*Grid\s+item[^>]*>\s*<\s*Navbar\s*/?>\s*</Grid>.*?'
    r'<\s*Grid\s+item[^>]*>\s*<\s*Sidebar\s*/?>\s*</Grid>.*?'
    r'<\s*Grid\s+item[^>]*>\s*',
    re.DOTALL
)

for file in all_files:
    if "Layout.js" in file:
        continue
    
    with open(file, "r") as f:
        content = f.read()

    # Skip files that don't have Navbar and Sidebar
    if ("Navbar />" not in content and "<Navbar" not in content and "<NavBar" not in content) or ("Sidebar />" not in content and "<Sidebar" not in content):
        continue

    # Try to find the start of the layout
    match = re.search(r'(return\s*\(\s*)<\s*Grid[^>]*>.*?<\s*Navbar\s*/?>.*?<\s*Sidebar\s*/?>.*?<\s*Grid\s+item[^>]*lg=\{?10\}?[^>]*>', content, re.DOTALL)
    if not match:
        match = re.search(r'(return\s*\(\s*)<\s*Grid[^>]*>.*?<\s*Navbar\s*/?>.*?<\s*Sidebar\s*/?>.*?<\s*Grid\s+item[^>]*sm=\{?9\}?[^>]*>', content, re.DOTALL)
        
    if match:
        print(f"Matched in {file}")
        
        # We replace the matched prefix with `return ( <Layout>`
        new_content = content[:match.start()] + match.group(1) + "<Layout>\n" + content[match.end():]
        
        # Now we need to replace the suffix closing tags
        # The closing tags for this pattern are generally:
        # </Grid>
        # </Grid>
        # </Grid>
        # );
        
        # We can find the last `);` and replace the preceding </Grid>s
        suffix_match = re.search(r'</Grid>\s*</Grid>\s*</Grid>\s*\)\s*;\s*}\s*$', new_content)
        if suffix_match:
            new_content = new_content[:suffix_match.start()] + "</Layout>\n  );\n}" + new_content[suffix_match.end():]
            
            # Also add the import
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
            print(f"-> Successfully updated {file}")
        else:
            print(f"-> Failed to find closing tags for {file}")

