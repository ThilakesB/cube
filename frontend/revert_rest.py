import re
import os

target_dir = "/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components"
all_files = [
    "Payroll/Payslip.js",
    "Payroll/Payroll.js",
    "Budget/Accounting.js",
    "Task/Termination.js",
    "Department/Dashboard.jsx"
]

for rel_path in all_files:
    file = os.path.join(target_dir, rel_path)
    if not os.path.exists(file):
        continue
        
    with open(file, "r") as f:
        content = f.read()

    # Revert <Layout> at the top
    # Note that Dashboard.jsx was manually edited before strip_layout.py.
    # Wait! I manually edited Dashboard.jsx in a previous turn to fix its spacing!
    # If I blindly revert it to <Grid container style={{ height: "100vh" }}>, I lose my manual fix for Dashboard.jsx!
    
    if "Dashboard.jsx" in file:
        pass # I will fix Dashboard.jsx manually
    else:
        # Revert <Layout> at the top
        content = content.replace("return (\n    <Layout>\n", 'return (\n    <Grid container style={{ height: "100vh" }}>\n      <Grid item xs={12}>\n        <Navbar />\n      </Grid>\n      <Grid container>\n        <Grid item xs={12} sm={3} md={2}>\n          <Sidebar />\n        </Grid>\n        <Grid item xs={12} sm={9} md={10} style={{ padding: "40px" }}>\n')
        content = content.replace("return (\n    <Layout>", 'return (\n    <Grid container style={{ height: "100vh" }}>\n      <Grid item xs={12}>\n        <Navbar />\n      </Grid>\n      <Grid container>\n        <Grid item xs={12} sm={3} md={2}>\n          <Sidebar />\n        </Grid>\n        <Grid item xs={12} sm={9} md={10} style={{ padding: "40px" }}>\n')

        # Revert import
        content = re.sub(r'import Layout from \'[./]+Common_Bar/Layout\';\n', '', content)
        # Revert </Layout> at the bottom
        content = content.replace("</Layout>", "</Grid>\n        </Grid>\n      </Grid>")

        with open(file, "w") as f:
            f.write(content)
        print("Reverted", file)

