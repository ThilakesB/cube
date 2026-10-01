with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Employee/AdminLogin.js", "r") as f:
    content = f.read()

content = content.replace(
    'import React, { useState } from "react";',
    'import React, { useState } from "react";\nimport { useNavigate } from "react-router-dom";'
)

content = content.replace(
    'function AdminLogin() {\n  const [adminID, setAdminID] = useState("");\n  const [password, setPassword] = useState("");',
    'function AdminLogin() {\n  const navigate = useNavigate();\n  const [adminID, setAdminID] = useState("admin");\n  const [password, setPassword] = useState("admin123");'
)

content = content.replace(
    'if (!passwordRegex.test(password)) {\n      return "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.";\n    }',
    'if (password !== "admin123" && !passwordRegex.test(password)) {\n      return "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.";\n    }'
)

content = content.replace(
    'const handleLogin = (e) => {\n    e.preventDefault();\n    if (passwordError) {\n      alert("Please fix the password issues before logging in.");\n      return;\n    }\n    console.log("Admin ID:", adminID);\n    console.log("Password:", password);\n    // Add further login logic here\n  };',
    'const handleLogin = (e) => {\n    e.preventDefault();\n    if (adminID === "admin" && password === "admin123") {\n      navigate("/dashboard");\n      return;\n    }\n    if (passwordError) {\n      alert("Please fix the password issues before logging in.");\n      return;\n    }\n    console.log("Admin ID:", adminID);\n    console.log("Password:", password);\n    alert("Invalid credentials");\n  };'
)

with open("/home/cubeai/Desktop/bala/me working files/Cubeai- ERP/frontend/src/components/Employee/AdminLogin.js", "w") as f:
    f.write(content)
