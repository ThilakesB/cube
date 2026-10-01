with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Department/AdminAddDepartments.jsx", "r") as f:
    content = f.read()

import_stmt = "import GlobalFormLayout from '../Common_Bar/GlobalFormLayout';\n"
if "import GlobalFormLayout" not in content:
    content = import_stmt + content

import re

# Same structure
pattern = re.compile(
    r'return\s*\(\s*<Grid[^>]*>.*?<Link to=\'/department\'>.*?<Card[^>]*>.*?<Typography[^>]*>Add Department</Typography>',
    re.DOTALL
)

match = pattern.search(content)
if match:
    new_prefix = """return (
    <GlobalFormLayout title="Add Department" backLink="/department">"""
    content = content[:match.start()] + new_prefix + content[match.end():]
    
    # suffix: usually ends with </Card> ... </Grid>s 
    suffix_pattern = re.compile(
        r'</Card>\s*</Grid>\s*</Grid>\s*</Grid>\s*\);\s*};\s*export default AdminAddDepartment;',
        re.DOTALL
    )
    suffix_match = suffix_pattern.search(content)
    if suffix_match:
        new_suffix = """    </GlobalFormLayout>\n  );\n};\n\nexport default AdminAddDepartment;"""
        content = content[:suffix_match.start()] + new_suffix + content[suffix_match.end():]
        
        with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Department/AdminAddDepartments.jsx", "w") as f:
            f.write(content)
        print("Successfully updated AdminAddDepartments.jsx")
    else:
        print("Failed to find suffix in AdminAddDepartments.jsx")
else:
    print("Failed to find prefix in AdminAddDepartments.jsx")
