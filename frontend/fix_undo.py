import re
import os

target_dir = "/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components"
all_files = [
    "Job/JobManagement.js",
    "Job/Offer_Approved.js",
    "Job/Resume.js",
    "Job/Shortlist.js",
    "Notification/TrainerAndTraining.js",
    "Notification/holidays.js",
    "Promotion/Promotion.js",
    "Promotion/Resignation.js",
    "Task/AttendancePage.js"
]

for rel_path in all_files:
    file = os.path.join(target_dir, rel_path)
    if not os.path.exists(file):
        continue
        
    with open(file, "r") as f:
        content = f.read()

    # The layout was <Grid><Grid><Grid container><Grid sidebar><Grid content>
    # Usually it's 3 Grids: </Grid> (content), </Grid> (container), </Grid> (outer).
    # Since I removed 2 or 3 Grids before <Dialog> or <Modal>, let's just add 3 Grids back before them.
    # Actually wait. If I just add </Grid></Grid></Grid> before the <Dialog> or <Modal> (the first one found at the outer level), that will close them.
    
    # Let's add exactly 3 `</Grid>` tags before the FIRST `<Dialog` or `<Modal` that appears near the end of the file.
    
    # Let's find the last occurrence of </Box> or </Grid> before <Dialog> or <Modal> and insert </Grid></Grid></Grid>
    content = re.sub(r'(\s*)(<Dialog|<Modal)', r'\1</Grid>\n\1</Grid>\n\1</Grid>\n\1\2', content, count=1)

    with open(file, "w") as f:
        f.write(content)
        
    print(f"Fixed {file}")

