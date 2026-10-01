import re

# 1. Update NavBar.js height from 100px to 70px
with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Common_Bar/NavBar.js", "r") as f:
    navbar = f.read()
navbar = navbar.replace('height: "100px",', 'height: "70px",')
with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Common_Bar/NavBar.js", "w") as f:
    f.write(navbar)

# 2. Update Sidebar.js width from 260 to 100% (so it fills its container)
with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Common_Bar/Sidebar.js", "r") as f:
    sidebar = f.read()
sidebar = sidebar.replace('width: 260, // Set the width to 260px', 'width: "100%",')
with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Common_Bar/Sidebar.js", "w") as f:
    f.write(sidebar)

# 3. Update AdminEmployee.js layout
with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Employee/AdminEmployee.js", "r") as f:
    emp = f.read()
emp = emp.replace("height: 'calc(100vh - 100px)'", "height: 'calc(100vh - 70px)'")
# Replace Grid items with Box for exact fixed width layout
emp = emp.replace("<Grid item lg={2} md={2} sm={2} xs={12} sx={{ height: '100%' }}>", "<Box sx={{ width: '260px', flexShrink: 0, height: '100%' }}>")
emp = emp.replace("</Sidebar>\n        </Grid>", "</Sidebar>\n        </Box>") # actually it's just <Sidebar />\n        </Grid>
emp = emp.replace("<Sidebar />\n        </Grid>", "<Sidebar />\n        </Box>")
emp = emp.replace("<Grid item lg={10} md={10} sm={10} xs={12} sx={{ p: 4, height: '100%', overflowY: 'auto' }}>", "<Box sx={{ p: 4, height: '100%', overflowY: 'auto', flexGrow: 1, width: 'calc(100% - 260px)' }}>")
emp = emp.replace("</Pagination>\n          </Box>\n        </Grid>", "</Pagination>\n          </Box>\n        </Box>")

with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Employee/AdminEmployee.js", "w") as f:
    f.write(emp)

# 4. Update Dashboard.jsx layout
with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Department/Dashboard.jsx", "r") as f:
    dash = f.read()
dash = dash.replace("height: 'calc(100vh - 100px)'", "height: 'calc(100vh - 70px)'")
dash = dash.replace("<Grid item lg={2} md={2} sm={2} xs={12} sx={{ height: '100%' }}>", "<Box sx={{ width: '260px', flexShrink: 0, height: '100%' }}>")
dash = dash.replace("<Sidebar />\n        </Grid>", "<Sidebar />\n        </Box>")
dash = dash.replace("<Grid item lg={10} md={10} sm={10} xs={12} sx={{ p: 4, height: '100%', overflowY: 'auto' }}>", "<Box sx={{ p: 4, height: '100%', overflowY: 'auto', flexGrow: 1, width: 'calc(100% - 260px)' }}>")
dash = dash.replace("</TableContainer>\n</Grid>\n\n          </Grid>\n        </Grid>\n      </Grid>\n    </Grid>", "</TableContainer>\n</Grid>\n\n          </Grid>\n        </Box>\n      </Grid>\n    </Grid>")

with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Department/Dashboard.jsx", "w") as f:
    f.write(dash)

