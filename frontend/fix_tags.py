import re
import glob
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

    # The error is because there are extra </Grid> or </Box> tags that were meant to close the layout wrappers that are now replaced by <Layout>
    # The layout wrappers were 3 deep in standard files (Grid, Grid, Grid) or 2 deep (Box, Box) in AdminEmployee.
    
    if "AdminEmployee.js" in file:
        # In AdminEmployee, we need to remove two </Box> tags before the Dialog
        content = re.sub(r'</Box>\s*</Box>(\s*<Dialog)', r'\1', content)
    elif "Configuration.js" in file:
        # We manually fixed this, but the script broke it again. Let's just fix it.
        content = content.replace("</Layout>\n  );", "</Grid>\n    </Layout>\n  );")
    else:
        # For standard files, there's usually </Grid> </Grid> </Grid> before <Dialog> or <Pagination> or just before </Layout>
        # Let's remove up to 3 </Grid> tags that appear consecutively right after the main content (e.g. before <Dialog> or at the end of the main block)
        # We can find the sequence </Grid>\s*</Grid>\s*</Grid> and remove it.
        # But some might only have 2 if one was already removed.
        # Let's look for </Grid>\s*</Grid> followed by <Dialog
        content = re.sub(r'(?:</Grid>\s*){2,3}(<Dialog)', r'\1', content)
        content = re.sub(r'(?:</Grid>\s*){2,3}(<Modal)', r'\1', content)
        
        # If no dialog, it might just be extra tags somewhere.
        # Let's also check for </Grid> right before </Layout> which might be extra or missing.
        # The script `strip_layout.py` actually replaced the very end `</Grid>`s with `</Layout>`.
        # So the extra `</Grid>`s are ONLY the ones before `<Dialog>` or `<Modal>` or `<TablePagination>` etc.

    with open(file, "w") as f:
        f.write(content)
        
    print(f"Fixed {file}")

