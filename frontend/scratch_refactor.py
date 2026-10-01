with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Employee/AddEmployee.js", "r") as f:
    content = f.read()

# Replace the giant layout wrapper with GlobalFormLayout
import_stmt = "import GlobalFormLayout from '../Common_Bar/GlobalFormLayout';\n"
if "import GlobalFormLayout" not in content:
    content = import_stmt + content

import re

# We want to replace from the start of the return ( ... ) up to the internal grid with GlobalFormLayout
# The internal grid is <Grid container spacing={3} sx={{ mt: '40px' }}>

pattern = re.compile(
    r'return\s*\(\s*<Grid[^>]*>.*?<Link to=\'/employee\'>.*?<Card[^>]*>.*?<Typography[^>]*>Add a New Staff</Typography>',
    re.DOTALL
)

match = pattern.search(content)
if match:
    new_prefix = """return (
    <GlobalFormLayout title="Add a New Staff" backLink="/employee">"""
    content = content[:match.start()] + new_prefix + content[match.end():]
    
    # Replace the trailing wrappers
    suffix_pattern = re.compile(
        r'</Card>\s*</Grid>\s*</Grid>\s*</Grid>\s*\);\s*};\s*export default EmployeeAdd;',
        re.DOTALL
    )
    suffix_match = suffix_pattern.search(content)
    if suffix_match:
        new_suffix = """    </GlobalFormLayout>\n  );\n};\n\nexport default EmployeeAdd;"""
        content = content[:suffix_match.start()] + new_suffix + content[suffix_match.end():]
        
        with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Employee/AddEmployee.js", "w") as f:
            f.write(content)
        print("Successfully updated AddEmployee.js")
    else:
        print("Failed to find suffix in AddEmployee.js")
else:
    print("Failed to find prefix in AddEmployee.js")
