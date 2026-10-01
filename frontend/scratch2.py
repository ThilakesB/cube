import re

with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Department/Dashboard.jsx", "r") as f:
    content = f.read()

# Replace the layout structure
new_structure = """  return (
    <Grid container sx={{ height: '100vh', overflowY: "auto", backgroundColor: "#F8F9FD" }}>
      <Grid item lg={12} xs={12} sx={{ flexShrink: 0 }}>
        <Navbar />
      </Grid>
      <Grid container item lg={12} xs={12} sx={{ height: 'calc(100vh - 100px)' }}>
        <Grid item lg={2} md={2} sm={2} xs={12} sx={{ height: '100%' }}>
          <Sidebar />
        </Grid>
        <Grid item lg={10} md={10} sm={10} xs={12} sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
          <Typography variant='h4' fontWeight={'bold'} color={'#004E69'} sx={{ mb: 2 }}>Dashboard</Typography>
          <Grid container spacing={2}>
            {card.map((card) => (
"""

content = re.sub(
    r'return \(\s*<Grid container style={{ height: "100vh" }}>\s*<Grid item xs={12}>\s*<Navbar />\s*<Grid container>\s*\{\/\* SideBar \*\/\}\s*<Grid item xs={12} sm={3} md={2}>\s*<Sidebar />\s*</Grid>\s*\{\/\* Main Content \*\/\}\s*<Grid item xs={12} sm={9} md={10} style={{ padding: "40px" }}>\s*<Typography variant=\'h4\' fontWeight={\'bold\'} color={\'#004E69\'} marginLeft={2}>Dashboard</Typography>\s*<Grid container spacing={2}\s*rowGap={4} sx={{ padding: 2 }}\s*>',
    new_structure,
    content,
    flags=re.MULTILINE | re.DOTALL
)

# And fix the closing tags at the very bottom
content = content.replace(
    "        </Grid>\n      </Grid>\n    </Grid>\n    </Grid>\n    </Grid>\n  );",
    "          </Grid>\n        </Grid>\n      </Grid>\n    </Grid>\n  );"
)

with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Department/Dashboard.jsx", "w") as f:
    f.write(content)
