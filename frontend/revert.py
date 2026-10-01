import re
import os

target_dir = "/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components"
all_files = [
    "Employee/EditEmployee.js",
    "Employee/AdminEmployee.js",
    "Job/JobManagement.js",
    "Job/Offer_Approved.js",
    "Job/Resume.js",
    "Job/Shortlist.js",
    "Notification/TrainerAndTraining.js",
    "Notification/holidays.js",
    "Promotion/Promotion.js",
    "Promotion/Resignation.js",
    "Task/AttendancePage.js",
    "configuration/Configuration.js"
]

for rel_path in all_files:
    file = os.path.join(target_dir, rel_path)
    if not os.path.exists(file):
        continue
        
    with open(file, "r") as f:
        content = f.read()

    # AdminEmployee.js was manually fixed originally, I'll leave it or revert the layout. Wait, actually I can just run sed on it.
    if "AdminEmployee" in file or "Configuration" in file:
        pass
    else:
        # Revert <Layout> at the top
        content = content.replace("return (\n    <Layout>\n", 'return (\n    <Grid container style={{ height: "100vh" }}>\n      <Grid item xs={12}>\n        <Navbar />\n      </Grid>\n      <Grid container>\n        <Grid item xs={12} sm={3} md={2}>\n          <Sidebar />\n        </Grid>\n        <Grid item xs={12} sm={9} md={10} style={{ padding: "40px" }}>\n')
        # Revert import
        content = re.sub(r'import Layout from \'[./]+Common_Bar/Layout\';\n', '', content)
        # Revert </Layout> at the bottom
        content = content.replace("</Layout>", "</Grid>\n        </Grid>\n      </Grid>")

    with open(file, "w") as f:
        f.write(content)

