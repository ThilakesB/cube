with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Department/AdminAddDepartments.jsx", "r") as f:
    content = f.read()

import_stmt = "import GlobalFormLayout from '../Common_Bar/GlobalFormLayout';\n"
if "import GlobalFormLayout" not in content:
    content = import_stmt + content

import re

# Match prefix
pattern = re.compile(r'return \(\s*<Grid container style=\{\{\s*height: "100vh"\s*\}\}>\s*<Grid item xs=\{12\}>\s*\{\/\*\s*NavBar\s*\*\/\}\s*<Navbar />\s*<Grid container>\s*\{\/\*\s*SideBar\s*\*\/\}\s*<Grid item xs=\{12\} sm=\{3\} md=\{2\}>\s*<Sidebar />\s*</Grid>\s*\{\/\*\s*Main Content\s*\*\/\}\s*<Grid item xs=\{12\} sm=\{9\} md=\{10\} style=\{\{ padding: "40px" \}\}>\s*\{\/\*\s*Form\s*\*\/\}')

match = pattern.search(content)
if match:
    new_prefix = """return (
    <GlobalFormLayout title="Add Department" backLink="/department">
        {/* Form */}"""
    content = content[:match.start()] + new_prefix + content[match.end():]

    # match suffix
    suffix_pattern = re.compile(r'</Grid>\s*</Grid>\s*</Grid>\s*</Grid>\s*\);\s*};\s*export default AdminAddDepartment;')
    suffix_match = suffix_pattern.search(content)
    if suffix_match:
        new_suffix = """    </GlobalFormLayout>\n  );\n};\n\nexport default AdminAddDepartment;"""
        content = content[:suffix_match.start()] + new_suffix + content[suffix_match.end():]
        
        with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Department/AdminAddDepartments.jsx", "w") as f:
            f.write(content)
        print("Updated AdminAddDepartments.jsx")
    else:
        print("Failed to match suffix")
else:
    print("Failed to match prefix")
