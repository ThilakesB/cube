from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Any
import models
import schemas
from database import engine, get_db

# Create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cube AI ERP Backend API")

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "service": "local ERP API"}

# ==================== EMPLOYEES ====================

def serialize_employee(emp: models.Employee):
    return {
        "id": emp.id,
        "no": emp.id,
        "first_name": emp.first_name,
        "last_name": emp.last_name,
        "firstname": emp.first_name,
        "lastname": emp.last_name,
        "email": emp.email,
        "phone_number": emp.phone_number,
        "phoneNumber": emp.phone_number,
        "gender": emp.gender,
        "number": emp.number or "",
        "role": emp.role,
        "designation": emp.designation,
        "staff_id": emp.staff_id,
        "staffId": emp.staff_id,
        "official_email": emp.official_email,
        "photo": emp.photo,
    }

@app.post("/employees/", response_model=dict)
@app.post("/api/employees", response_model=dict)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    data = employee.model_dump()
    db_employee = models.Employee(
        first_name=data.get("first_name", ""),
        last_name=data.get("last_name", ""),
        email=data.get("email", ""),
        phone_number=data.get("phone_number", ""),
        gender=data.get("gender", ""),
        number=data.get("number", ""),
        role=data.get("role", ""),
        designation=data.get("designation", ""),
        staff_id=data.get("staff_id", ""),
        official_email=data.get("official_email", ""),
        photo=data.get("photo"),
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return serialize_employee(db_employee)

@app.get("/employees/", response_model=List[dict])
@app.get("/api/employees", response_model=List[dict])
def read_employees(skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    employees = db.query(models.Employee).offset(skip).limit(limit).all()
    return [serialize_employee(e) for e in employees]

@app.delete("/employees/{identifier}")
@app.delete("/api/employees/{identifier}")
def delete_employee(identifier: str, db: Session = Depends(get_db)):
    # Search by id or staff_id
    emp = None
    if identifier.isdigit():
        emp = db.query(models.Employee).filter(models.Employee.id == int(identifier)).first()
    if not emp:
        emp = db.query(models.Employee).filter(models.Employee.staff_id == identifier).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(emp)
    db.commit()
    return {"status": "success", "message": f"Employee {identifier} deleted"}

# ==================== PROJECTS ====================

def serialize_project(proj: models.Project):
    return {
        "id": proj.id,
        "projectName": proj.project_name,
        "project_name": proj.project_name,
        "projectCode": proj.project_code or f"PRJ-{proj.id:04d}",
        "project_code": proj.project_code or f"PRJ-{proj.id:04d}",
        "client": proj.client,
        "clientEmail": proj.client_email or "",
        "client_email": proj.client_email or "",
        "category": proj.category or "Software Development",
        "startDate": proj.start_date,
        "start_date": proj.start_date,
        "endDate": proj.end_date,
        "end_date": proj.end_date,
        "duration": proj.duration or "",
        "budget": proj.budget or "",
        "rate": proj.rate or "",
        "priority": proj.priority or "Medium",
        "projectLead": proj.project_lead or "",
        "project_lead": proj.project_lead or "",
        "teamMembers": proj.team_members or "",
        "team_members": proj.team_members or "",
        "status": proj.status or "Ongoing",
        "progress": proj.progress if proj.progress is not None else 0,
        "jobDescription": proj.job_description or "",
        "job_description": proj.job_description or "",
    }

@app.get("/api/projects", response_model=List[dict])
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(models.Project).all()
    return [serialize_project(p) for p in projects]

@app.post("/api/projects", response_model=dict)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    p_name = project.projectName or project.project_name or "Untitled Project"
    p_code = project.projectCode or project.project_code or ""
    c_email = project.clientEmail or project.client_email or ""
    cat = project.category or "Software Development"
    s_date = project.startDate or project.start_date or ""
    e_date = project.endDate or project.end_date or ""
    dur = project.duration or ""
    bud = project.budget or ""
    p_lead = project.projectLead or project.project_lead or ""
    t_members = project.teamMembers or project.team_members or ""
    stat = project.status or "Ongoing"
    prog = project.progress or 0
    j_desc = project.jobDescription or project.job_description or ""

    db_project = models.Project(
        project_name=p_name,
        project_code=p_code,
        client=project.client,
        client_email=c_email,
        category=cat,
        start_date=s_date,
        end_date=e_date,
        duration=dur,
        budget=bud,
        rate=project.rate or "",
        priority=project.priority or "Medium",
        project_lead=p_lead,
        team_members=t_members,
        status=stat,
        progress=prog,
        job_description=j_desc,
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return serialize_project(db_project)

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db)):
    proj = None
    if project_id.isdigit():
        proj = db.query(models.Project).filter(models.Project.id == int(project_id)).first()
    if not proj:
        proj = db.query(models.Project).filter(models.Project.project_name == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(proj)
    db.commit()
    return {"status": "success", "message": "Project deleted"}

# ==================== SALARIES / PAYROLL ====================

def serialize_salary(sal: models.Salary):
    return {
        "id": sal.employee_id or f"FT-{sal.id:04d}",
        "db_id": sal.id,
        "name": sal.name,
        "employee_id": sal.employee_id,
        "role": sal.role,
        "email": sal.email,
        "mobile": sal.mobile,
        "joinDate": sal.join_date,
        "join_date": sal.join_date,
        "basic": sal.basic,
        "da": sal.da,
        "hra": sal.hra,
        "conveyance": sal.conveyance,
        "allowance": sal.allowance,
        "medicalAllowance": sal.medical_allowance,
        "earningsOthers": sal.earnings_others,
        "tds": sal.tds,
        "esi": sal.esi,
        "pf": sal.pf,
        "leave": sal.leave,
        "profTax": sal.prof_tax,
        "labourWelfare": sal.labour_welfare,
        "deductionsOthers": sal.deductions_others,
        "salary": sal.salary or 0,
        "netSalary": sal.salary or 0,
    }

@app.get("/api/salaries", response_model=List[dict])
def get_salaries(db: Session = Depends(get_db)):
    salaries = db.query(models.Salary).all()
    return [serialize_salary(s) for s in salaries]

@app.post("/api/salaries", response_model=dict)
def create_salary(salary_data: schemas.SalaryCreate, db: Session = Depends(get_db)):
    s_dict = salary_data.model_dump()
    emp_id = s_dict.get("id") or s_dict.get("employee_id") or ""
    j_date = s_dict.get("joinDate") or s_dict.get("join_date") or ""
    m_allowance = s_dict.get("medicalAllowance") or s_dict.get("medical_allowance") or "0"
    e_others = s_dict.get("earningsOthers") or s_dict.get("earnings_others") or "0"
    p_tax = s_dict.get("profTax") or s_dict.get("prof_tax") or "0"
    l_welfare = s_dict.get("labourWelfare") or s_dict.get("labour_welfare") or "0"
    d_others = s_dict.get("deductionsOthers") or s_dict.get("deductions_others") or "0"
    net_sal = s_dict.get("salary") or s_dict.get("netSalary") or 0.0

    db_salary = models.Salary(
        name=s_dict.get("name", ""),
        employee_id=emp_id,
        role=s_dict.get("role", "Web Developer"),
        email=s_dict.get("email", ""),
        mobile=s_dict.get("mobile", ""),
        join_date=j_date,
        basic=str(s_dict.get("basic", "0")),
        da=str(s_dict.get("da", "0")),
        hra=str(s_dict.get("hra", "0")),
        conveyance=str(s_dict.get("conveyance", "0")),
        allowance=str(s_dict.get("allowance", "0")),
        medical_allowance=str(m_allowance),
        earnings_others=str(e_others),
        tds=str(s_dict.get("tds", "0")),
        esi=str(s_dict.get("esi", "0")),
        pf=str(s_dict.get("pf", "0")),
        leave=str(s_dict.get("leave", "0")),
        prof_tax=str(p_tax),
        labour_welfare=str(l_welfare),
        deductions_others=str(d_others),
        salary=float(net_sal),
    )
    db.add(db_salary)
    db.commit()
    db.refresh(db_salary)
    return serialize_salary(db_salary)

@app.delete("/api/salaries/{salary_id}")
def delete_salary(salary_id: int, db: Session = Depends(get_db)):
    sal = db.query(models.Salary).filter(models.Salary.id == salary_id).first()
    if not sal:
        raise HTTPException(status_code=404, detail="Salary record not found")
    db.delete(sal)
    db.commit()
    return {"status": "success", "message": "Salary record deleted"}

# ==================== HOLIDAYS ====================

def serialize_holiday(h: models.Holiday):
    return {
        "id": h.id,
        "_id": str(h.id),
        "name": h.name,
        "date": h.date,
        "day": h.day or "",
        "type": h.type or "Public Holiday",
        "description": h.description or "",
    }

@app.get("/api/holidays")
def get_holidays(db: Session = Depends(get_db)):
    holidays = db.query(models.Holiday).order_by(models.Holiday.date.asc()).all()
    serialized = [serialize_holiday(h) for h in holidays]
    return {"holidays": serialized}

@app.post("/api/holidays")
@app.post("/api/holidays/add")
def create_holiday(holiday: schemas.HolidayCreate, db: Session = Depends(get_db)):
    db_holiday = db.query(models.Holiday).filter(models.Holiday.name == holiday.name).first()
    if db_holiday:
        db_holiday.date = holiday.date
        db_holiday.day = holiday.day or ""
        db_holiday.type = holiday.type or "Public Holiday"
        db_holiday.description = holiday.description or ""
    else:
        db_holiday = models.Holiday(
            name=holiday.name,
            date=holiday.date,
            day=holiday.day or "",
            type=holiday.type or "Public Holiday",
            description=holiday.description or "",
        )
        db.add(db_holiday)
    db.commit()
    db.refresh(db_holiday)
    return {"status": "success", "holiday": serialize_holiday(db_holiday)}

@app.delete("/api/holidays/{holiday_id}")
def delete_holiday(holiday_id: str, db: Session = Depends(get_db)):
    h = None
    if holiday_id.isdigit():
        h = db.query(models.Holiday).filter(models.Holiday.id == int(holiday_id)).first()
    if not h:
        h = db.query(models.Holiday).filter(models.Holiday.name == holiday_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Holiday not found")
    db.delete(h)
    db.commit()
    return {"status": "success", "message": "Holiday deleted"}


from datetime import datetime

# ==================== ATTENDANCE ====================

def serialize_attendance(att: models.Attendance):
    return {
        "id": att.id,
        "empName": att.employee_name,
        "employeeName": att.employee_name,
        "empCode": att.employee_id,
        "employeeId": att.employee_id,
        "date": att.date,
        "status": att.status,
        "workStatus": att.status,
        "inTime": f"{att.check_in_time or '09:00 AM'} {att.date}",
        "outTime": f"{att.check_out_time or '06:00 PM'} {att.date}",
        "checkInTime": att.check_in_time,
        "checkOutTime": att.check_out_time,
        "remarks": att.remarks or "",
        "workLocation": "Office",
    }

@app.get("/api/attendance")
def get_attendance(db: Session = Depends(get_db)):
    records = db.query(models.Attendance).order_by(models.Attendance.id.desc()).all()
    return [serialize_attendance(r) for r in records]

@app.post("/api/attendance")
def create_attendance(att_data: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    name = att_data.employeeName or att_data.employee_name or "Unknown Employee"
    emp_code = att_data.employeeId or att_data.employee_id or "E-001"
    c_in = att_data.checkInTime or att_data.check_in_time or "09:00 AM"
    c_out = att_data.checkOutTime or att_data.check_out_time or "06:00 PM"
    record_date = att_data.date or datetime.now().strftime("%Y-%m-%d")

    # Check if duplicate exists for same employee and date, update if so
    existing = db.query(models.Attendance).filter(
        (models.Attendance.employee_id == emp_code) | (models.Attendance.employee_name == name),
        models.Attendance.date == record_date
    ).first()

    if existing:
        existing.status = att_data.status or existing.status
        existing.check_in_time = c_in
        existing.check_out_time = c_out
        existing.remarks = att_data.remarks or existing.remarks
        db.commit()
        db.refresh(existing)
        return serialize_attendance(existing)

    db_att = models.Attendance(
        employee_name=name,
        employee_id=emp_code,
        date=record_date,
        status=att_data.status or "Present",
        check_in_time=c_in,
        check_out_time=c_out,
        remarks=att_data.remarks or "",
    )
    db.add(db_att)
    db.commit()
    db.refresh(db_att)
    return serialize_attendance(db_att)

# ⚡ Fast 5-Second Quick Clock-In / Clock-Out Endpoint
@app.post("/api/attendance/quick-clock-in")
def quick_clock_in(payload: dict, db: Session = Depends(get_db)):
    emp_identifier = str(payload.get("employee_id") or payload.get("employeeId") or "").strip()
    emp_name = str(payload.get("employee_name") or payload.get("employeeName") or "").strip()
    action = payload.get("action", "check_in") # 'check_in', 'check_out', or 'toggle'
    status = payload.get("status", "Present")
    current_date = payload.get("date") or datetime.now().strftime("%Y-%m-%d")
    current_time = payload.get("time") or datetime.now().strftime("%I:%M %p")

    # Look up employee in database
    emp = None
    if emp_identifier:
        emp = db.query(models.Employee).filter(
            (models.Employee.staff_id == emp_identifier) | 
            (models.Employee.id == int(emp_identifier) if emp_identifier.isdigit() else False)
        ).first()
    if not emp and emp_name:
        emp = db.query(models.Employee).filter(
            (models.Employee.first_name + " " + models.Employee.last_name).ilike(f"%{emp_name}%")
        ).first()

    final_name = emp_name or (f"{emp.first_name} {emp.last_name}" if emp else "Staff Member")
    final_code = emp.staff_id if emp else (emp_identifier or "EMP-001")

    # Find existing record for today
    existing = db.query(models.Attendance).filter(
        (models.Attendance.employee_id == final_code) | (models.Attendance.employee_name == final_name),
        models.Attendance.date == current_date
    ).first()

    if existing:
        if action == "check_out":
            existing.check_out_time = current_time
        elif action == "check_in":
            existing.check_in_time = current_time
            existing.status = status
        else: # toggle or update
            existing.status = status
            if not existing.check_in_time:
                existing.check_in_time = current_time
        db.commit()
        db.refresh(existing)
        return {
            "status": "success",
            "message": f"Successfully recorded {action.replace('_', ' ')} for {final_name} at {current_time}",
            "data": serialize_attendance(existing)
        }

    # New attendance record
    new_att = models.Attendance(
        employee_name=final_name,
        employee_id=final_code,
        date=current_date,
        status=status,
        check_in_time=current_time if action != "check_out" else "09:00 AM",
        check_out_time=current_time if action == "check_out" else "06:00 PM",
        remarks=f"Fast Punch: {action}"
    )
    db.add(new_att)
    db.commit()
    db.refresh(new_att)
    return {
        "status": "success",
        "message": f"Successfully clocked in {final_name} at {current_time}",
        "data": serialize_attendance(new_att)
    }

# ⚡ Bulk Attendance (1-Click Mark All / Selected Present)
@app.post("/api/attendance/bulk")
def bulk_attendance(payload: dict, db: Session = Depends(get_db)):
    target_date = payload.get("date") or datetime.now().strftime("%Y-%m-%d")
    status = payload.get("status", "Present")
    mark_all = payload.get("mark_all", False)
    employee_ids = payload.get("employee_ids", [])
    records = payload.get("records", [])

    created_or_updated = 0

    if mark_all:
        all_employees = db.query(models.Employee).all()
        for emp in all_employees:
            name = f"{emp.first_name} {emp.last_name}".strip() or "Employee"
            code = emp.staff_id or f"EMP-{emp.id}"
            existing = db.query(models.Attendance).filter(
                (models.Attendance.employee_id == code) | (models.Attendance.employee_name == name),
                models.Attendance.date == target_date
            ).first()
            if existing:
                existing.status = status
            else:
                new_rec = models.Attendance(
                    employee_name=name,
                    employee_id=code,
                    date=target_date,
                    status=status,
                    check_in_time="09:00 AM",
                    check_out_time="06:00 PM",
                    remarks="Bulk marked present"
                )
                db.add(new_rec)
            created_or_updated += 1
    elif employee_ids:
        for eid in employee_ids:
            emp = db.query(models.Employee).filter(
                (models.Employee.staff_id == str(eid)) | 
                (models.Employee.id == int(eid) if str(eid).isdigit() else False)
            ).first()
            if emp:
                name = f"{emp.first_name} {emp.last_name}".strip()
                code = emp.staff_id or f"EMP-{emp.id}"
                existing = db.query(models.Attendance).filter(
                    (models.Attendance.employee_id == code) | (models.Attendance.employee_name == name),
                    models.Attendance.date == target_date
                ).first()
                if existing:
                    existing.status = status
                else:
                    new_rec = models.Attendance(
                        employee_name=name,
                        employee_id=code,
                        date=target_date,
                        status=status,
                        check_in_time="09:00 AM",
                        check_out_time="06:00 PM",
                        remarks="Batch marked"
                    )
                    db.add(new_rec)
                created_or_updated += 1
    elif records:
        for r in records:
            name = r.get("employeeName") or r.get("employee_name") or "Staff"
            code = r.get("employeeId") or r.get("employee_id") or "E-001"
            rec_date = r.get("date") or target_date
            rec_status = r.get("status") or status
            existing = db.query(models.Attendance).filter(
                (models.Attendance.employee_id == code) | (models.Attendance.employee_name == name),
                models.Attendance.date == rec_date
            ).first()
            if existing:
                existing.status = rec_status
                if r.get("checkInTime"):
                    existing.check_in_time = r.get("checkInTime")
                if r.get("checkOutTime"):
                    existing.check_out_time = r.get("checkOutTime")
            else:
                new_rec = models.Attendance(
                    employee_name=name,
                    employee_id=code,
                    date=rec_date,
                    status=rec_status,
                    check_in_time=r.get("checkInTime", "09:00 AM"),
                    check_out_time=r.get("checkOutTime", "06:00 PM"),
                    remarks=r.get("remarks", "")
                )
                db.add(new_rec)
            created_or_updated += 1

    db.commit()
    return {
        "status": "success",
        "message": f"Successfully processed attendance for {created_or_updated} employees on {target_date}",
        "count": created_or_updated
    }

@app.delete("/api/attendance/{att_id}")
def delete_attendance(att_id: int, db: Session = Depends(get_db)):
    att = db.query(models.Attendance).filter(models.Attendance.id == att_id).first()
    if not att:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    db.delete(att)
    db.commit()
    return {"status": "success", "message": "Attendance record deleted"}

# Employee attendance endpoint for AttendancePage.js compatibility
@app.get("/api/employee-attendance")
def get_employee_attendance(db: Session = Depends(get_db)):
    employees = db.query(models.Employee).all()
    attendance_records = db.query(models.Attendance).all()
    
    data = []
    current_year = datetime.now().year
    for emp in employees:
        emp_att = [a for a in attendance_records if a.employee_id == emp.staff_id or a.employee_name == f"{emp.first_name} {emp.last_name}"]
        months_list = []
        for m in range(1, 13):
            days_in_m = 31
            days = [False] * days_in_m
            for a in emp_att:
                try:
                    parts = a.date.split("-")
                    if len(parts) == 3 and int(parts[1]) == m and int(parts[0]) == current_year:
                        day_num = int(parts[2])
                        if 1 <= day_num <= days_in_m:
                            days[day_num - 1] = True if a.status.lower() == "present" else False
                except Exception:
                    pass
            months_list.append({"month": m, "year": current_year, "days": days})

        data.append({
            "_id": str(emp.id),
            "staff_id": emp.staff_id,
            "name": f"{emp.first_name} {emp.last_name}".strip() or "Employee",
            "attendance": months_list
        })
    return {"data": data}

@app.post("/api/employee-attendance/add")
def add_employee_attendance(payload: dict, db: Session = Depends(get_db)):
    name = payload.get("name", "New Employee")
    parts = name.split()
    first_n = parts[0] if parts else "Staff"
    last_n = " ".join(parts[1:]) if len(parts) > 1 else ""
    db_emp = models.Employee(
        first_name=first_n,
        last_name=last_n,
        email=f"{first_n.lower()}{db.query(models.Employee).count() + 1}@company.com",
        phone_number="0000000000",
        gender="Other",
        role="Employee",
        designation="General Staff",
        staff_id=f"EMP-{db.query(models.Employee).count() + 1:03d}",
        official_email=f"{first_n.lower()}@company.com",
    )
    db.add(db_emp)
    db.commit()
    db.refresh(db_emp)
    return {"data": {"_id": str(db_emp.id), "name": name, "attendance": []}}

@app.post("/api/employee-attendance/{emp_id}")
def update_employee_attendance(emp_id: str, payload: dict, db: Session = Depends(get_db)):
    # Find employee
    emp = db.query(models.Employee).filter(
        (models.Employee.id == int(emp_id) if emp_id.isdigit() else False) |
        (models.Employee.staff_id == emp_id)
    ).first()

    if not emp:
        return {"status": "error", "message": "Employee not found"}

    att_list = payload.get("attendance", [])
    emp_name = f"{emp.first_name} {emp.last_name}".strip()
    emp_code = emp.staff_id or f"EMP-{emp.id}"

    for entry in att_list:
        month = entry.get("month")
        year = entry.get("year", datetime.now().year)
        days = entry.get("days", [])
        for day_idx, is_present in enumerate(days):
            day_num = day_idx + 1
            date_str = f"{year:04d}-{month:02d}-{day_num:02d}"
            existing = db.query(models.Attendance).filter(
                (models.Attendance.employee_id == emp_code) | (models.Attendance.employee_name == emp_name),
                models.Attendance.date == date_str
            ).first()

            if is_present:
                if not existing:
                    new_rec = models.Attendance(
                        employee_name=emp_name,
                        employee_id=emp_code,
                        date=date_str,
                        status="Present",
                        check_in_time="09:00 AM",
                        check_out_time="06:00 PM",
                        remarks="Marked from sheet"
                    )
                    db.add(new_rec)
                else:
                    existing.status = "Present"
            else:
                if existing:
                    existing.status = "Absent"

    db.commit()
    return {"status": "success", "message": "Attendance updated in database successfully"}

# ==================== DEPARTMENTS ====================

def serialize_department(dept: models.Department):
    return {
        "id": dept.id,
        "departmentName": dept.department_name,
        "department_name": dept.department_name,
        "name": dept.department_name,
        "section": dept.section or "",
        "headOfDepartment": dept.head_of_department or dept.manager or "",
        "head_of_department": dept.head_of_department or dept.manager or "",
        "manager": dept.manager or dept.head_of_department or "",
        "parentDepartment": dept.parent_department or "",
        "parent_department": dept.parent_department or "",
        "staffCount": dept.staff_count or "0",
        "staff_count": dept.staff_count or "0",
        "budgetExpense": dept.budget_expense or "0",
        "budget_expense": dept.budget_expense or "0",
        "inventoryResources": dept.inventory_resources or "",
        "inventory_resources": dept.inventory_resources or "",
        "description": dept.description or "",
    }

@app.get("/api/departments")
def get_departments(db: Session = Depends(get_db)):
    departments = db.query(models.Department).all()
    return [serialize_department(d) for d in departments]

@app.post("/api/departments")
def create_department(dept: schemas.DepartmentCreate, db: Session = Depends(get_db)):
    d_name = dept.departmentName or dept.department_name or "General"
    p_dept = dept.parentDepartment or dept.parent_department or ""
    head = dept.headOfDepartment or dept.head_of_department or dept.manager or ""
    staff = dept.staffCount or dept.staff_count or "0"
    budget = dept.budgetExpense or dept.budget_expense or "0"
    inventory = dept.inventoryResources or dept.inventory_resources or ""

    db_dept = models.Department(
        department_name=d_name,
        section=dept.section or "",
        head_of_department=head,
        manager=head,
        parent_department=p_dept,
        staff_count=str(staff),
        budget_expense=str(budget),
        inventory_resources=inventory,
        description=dept.description or "",
    )
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return serialize_department(db_dept)

@app.delete("/api/departments/{dept_id}")
def delete_department(dept_id: str, db: Session = Depends(get_db)):
    d = None
    if dept_id.isdigit():
        d = db.query(models.Department).filter(models.Department.id == int(dept_id)).first()
    if not d:
        d = db.query(models.Department).filter(models.Department.department_name == dept_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Department not found")
    db.delete(d)
    db.commit()
    return {"status": "success", "message": "Department deleted"}

# ==================== JOBS (DB-backed) ====================

def serialize_job(job: models.Job):
    return {
        "_id": str(job.id),
        "id": job.id,
        "jobTitle": job.job_title,
        "department": job.department,
        "jobLocation": job.job_location,
        "trainingCost": job.training_cost,
        "salaryFrom": job.salary_from,
        "salaryTo": job.salary_to,
        "jobType": job.job_type,
        "status": job.status,
        "startDate": job.start_date,
        "expireDate": job.expire_date,
        "description": job.description,
    }

@app.get("/api/jobs")
def get_jobs(db: Session = Depends(get_db)):
    jobs = db.query(models.Job).all()
    return {"jobs": [serialize_job(j) for j in jobs]}

@app.post("/api/jobs/add")
def add_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    db_job = models.Job(
        job_title=job.jobTitle or "",
        department=job.department or "",
        job_location=job.jobLocation or "",
        training_cost=job.trainingCost or "",
        salary_from=job.salaryFrom or "",
        salary_to=job.salaryTo or "",
        job_type=job.jobType or "",
        status=job.status or "Open",
        start_date=job.startDate or "",
        expire_date=job.expireDate or "",
        description=job.description or "",
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return {"status": "success", "job": serialize_job(db_job)}

@app.delete("/api/jobs/{job_id}")
def delete_job(job_id: str, db: Session = Depends(get_db)):
    j = db.query(models.Job).filter(models.Job.id == int(job_id)).first()
    if not j:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(j)
    db.commit()
    return {"status": "success"}

# ==================== RESUMES (DB-backed) ====================

def serialize_resume(r: models.Resume):
    return {
        "_id": str(r.id),
        "id": r.id,
        "employeeName": r.employee_name,
        "jobTitle": r.job_title,
        "department": r.department,
        "status": r.status,
        "resumeDate": r.resume_date,
        "email": r.email,
        "phone": r.phone,
        "experience": r.experience,
        "description": r.description,
    }

@app.get("/api/resumes")
def get_resumes(db: Session = Depends(get_db)):
    resumes = db.query(models.Resume).all()
    return {"resumes": [serialize_resume(r) for r in resumes]}

@app.post("/api/resumes/add")
def add_resume(resume: schemas.ResumeCreate, db: Session = Depends(get_db)):
    db_resume = models.Resume(
        employee_name=resume.employeeName or "",
        job_title=resume.jobTitle or "",
        department=resume.department or "",
        status=resume.status or "New",
        resume_date=resume.resumeDate or "",
        email=resume.email or "",
        phone=resume.phone or "",
        experience=resume.experience or "",
        description=resume.description or "",
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return {"status": "success", "resume": serialize_resume(db_resume)}

@app.delete("/api/resumes/{resume_id}")
def delete_resume(resume_id: str, db: Session = Depends(get_db)):
    r = db.query(models.Resume).filter(models.Resume.id == int(resume_id)).first()
    if not r:
        raise HTTPException(status_code=404, detail="Resume not found")
    db.delete(r)
    db.commit()
    return {"status": "success"}

# ==================== SHORTLISTS (DB-backed) ====================

def serialize_shortlist(s: models.Shortlist):
    return {
        "_id": str(s.id),
        "id": s.id,
        "employeeName": s.employee_name,
        "jobTitle": s.job_title,
        "department": s.department,
        "jobLocation": s.job_location,
        "salaryFrom": s.salary_from,
        "salaryTo": s.salary_to,
        "jobType": s.job_type,
        "status": s.status,
        "startDate": s.start_date,
        "expireDate": s.expire_date,
        "description": s.description,
    }

@app.get("/api/shortlists")
def get_shortlists(db: Session = Depends(get_db)):
    shortlists = db.query(models.Shortlist).all()
    return {"shortlistEntries": [serialize_shortlist(s) for s in shortlists]}

@app.post("/api/shortlists/add")
def add_shortlist(entry: schemas.ShortlistCreate, db: Session = Depends(get_db)):
    db_entry = models.Shortlist(
        employee_name=entry.employeeName or "",
        job_title=entry.jobTitle or "",
        department=entry.department or "",
        job_location=entry.jobLocation or "",
        salary_from=entry.salaryFrom or "",
        salary_to=entry.salaryTo or "",
        job_type=entry.jobType or "",
        status=entry.status or "Shortlisted",
        start_date=entry.startDate or "",
        expire_date=entry.expireDate or "",
        description=entry.description or "",
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return {"status": "success", "shortlistEntry": serialize_shortlist(db_entry)}

@app.delete("/api/shortlists/{entry_id}")
def delete_shortlist(entry_id: str, db: Session = Depends(get_db)):
    s = db.query(models.Shortlist).filter(models.Shortlist.id == int(entry_id)).first()
    if not s:
        raise HTTPException(status_code=404, detail="Shortlist entry not found")
    db.delete(s)
    db.commit()
    return {"status": "success"}

# ==================== JOB OFFERS (DB-backed) ====================

def serialize_job_offer(jo: models.JobOffer):
    return {
        "_id": str(jo.id),
        "id": jo.id,
        "jobTitle": jo.job_title,
        "department": jo.department,
        "jobType": jo.job_type,
        "status": jo.status,
        "offeredDate": jo.offered_date,
        "employeeName": jo.employee_name,
        "email": jo.email,
        "salary": jo.salary,
        "address": jo.address,
        "jobLocation": jo.job_location,
        "longIP": jo.long_ip,
    }

@app.get("/api/job-offers")
def get_job_offers(db: Session = Depends(get_db)):
    offers = db.query(models.JobOffer).all()
    return {"jobOffers": [serialize_job_offer(o) for o in offers]}

@app.post("/api/job-offers/add")
def add_job_offer(offer: schemas.JobOfferCreate, db: Session = Depends(get_db)):
    db_offer = models.JobOffer(
        job_title=offer.jobTitle or "",
        department=offer.department or "",
        job_type=offer.jobType or "",
        status=offer.status or "Pending",
        offered_date=offer.offeredDate or "",
        employee_name=offer.employeeName or "",
        email=offer.email or "",
        salary=offer.salary or "",
        address=offer.address or "",
        job_location=offer.jobLocation or "",
        long_ip=offer.longIP or "",
    )
    db.add(db_offer)
    db.commit()
    db.refresh(db_offer)
    return {"status": "success", "jobOffer": serialize_job_offer(db_offer)}

@app.put("/api/job-offers/{offer_id}/status")
def update_job_offer_status(offer_id: str, status_data: schemas.JobOfferStatusUpdate, db: Session = Depends(get_db)):
    offer = db.query(models.JobOffer).filter(models.JobOffer.id == int(offer_id)).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Job offer not found")
    offer.status = status_data.status
    db.commit()
    db.refresh(offer)
    return {"status": "success", "jobOffer": serialize_job_offer(offer)}

@app.delete("/api/job-offers/{offer_id}")
def delete_job_offer(offer_id: str, db: Session = Depends(get_db)):
    o = db.query(models.JobOffer).filter(models.JobOffer.id == int(offer_id)).first()
    if not o:
        raise HTTPException(status_code=404, detail="Job offer not found")
    db.delete(o)
    db.commit()
    return {"status": "success"}

# ==================== TRAINERS (DB-backed) ====================

def serialize_trainer(t: models.Trainer):
    return {
        "_id": str(t.id),
        "id": t.id,
        "firstname": t.firstname,
        "lastname": t.lastname,
        "role": t.role,
        "emailid": t.emailid,
        "phoneno": t.phoneno,
        "status": t.status,
    }

@app.get("/api/trainers")
def get_trainers(db: Session = Depends(get_db)):
    trainers = db.query(models.Trainer).all()
    return {"trainers": [serialize_trainer(t) for t in trainers]}

@app.post("/api/trainers/add")
def add_trainer(trainer: schemas.TrainerCreate, db: Session = Depends(get_db)):
    db_trainer = models.Trainer(
        firstname=trainer.firstname or "",
        lastname=trainer.lastname or "",
        role=trainer.role or "",
        emailid=trainer.emailid or "",
        phoneno=trainer.phoneno or "",
        status=trainer.status or "Active",
    )
    db.add(db_trainer)
    db.commit()
    db.refresh(db_trainer)
    return {"status": "success", "trainer": serialize_trainer(db_trainer)}

@app.delete("/api/trainers/{trainer_id}")
def delete_trainer(trainer_id: str, db: Session = Depends(get_db)):
    t = db.query(models.Trainer).filter(models.Trainer.id == int(trainer_id)).first()
    if not t:
        raise HTTPException(status_code=404, detail="Trainer not found")
    db.delete(t)
    db.commit()
    return {"status": "success"}

# ==================== TRAININGS (DB-backed) ====================

def serialize_training(tr: models.Training):
    return {
        "_id": str(tr.id),
        "id": tr.id,
        "trainingtype": tr.trainingtype,
        "trainer": tr.trainer,
        "Training_cost": tr.training_cost,
        "startDate": tr.start_date,
        "endDate": tr.end_date,
        "status": tr.status,
    }

@app.get("/api/trainings")
def get_trainings(db: Session = Depends(get_db)):
    trainings = db.query(models.Training).all()
    return {"trainings": [serialize_training(t) for t in trainings]}

@app.post("/api/trainings/add")
def add_training(training: schemas.TrainingCreate, db: Session = Depends(get_db)):
    db_training = models.Training(
        trainingtype=training.trainingtype or "",
        trainer=training.trainer or "",
        training_cost=training.Training_cost or "",
        start_date=training.startDate or "",
        end_date=training.endDate or "",
        status=training.status or "Active",
    )
    db.add(db_training)
    db.commit()
    db.refresh(db_training)
    return {"status": "success", "training": serialize_training(db_training)}

@app.delete("/api/trainings/{training_id}")
def delete_training(training_id: str, db: Session = Depends(get_db)):
    t = db.query(models.Training).filter(models.Training.id == int(training_id)).first()
    if not t:
        raise HTTPException(status_code=404, detail="Training not found")
    db.delete(t)
    db.commit()
    return {"status": "success"}

# ==================== RESIGNATIONS (DB-backed) ====================

def serialize_resignation(r: models.Resignation):
    return {
        "_id": str(r.id),
        "id": r.id,
        "employeeName": r.employee_name,
        "department": r.department,
        "reason": r.reason,
        "notice": r.notice,
        "resignation": r.resignation,
        "status": r.status,
    }

@app.get("/api/resignations")
def get_resignations(db: Session = Depends(get_db)):
    resignations = db.query(models.Resignation).all()
    return {"resignations": [serialize_resignation(r) for r in resignations]}

@app.post("/api/resignations/add")
def add_resignation(resignation: schemas.ResignationCreate, db: Session = Depends(get_db)):
    db_res = models.Resignation(
        employee_name=resignation.employeeName or "",
        department=resignation.department or "",
        reason=resignation.reason or "",
        notice=resignation.notice or "",
        resignation=resignation.resignation or "",
        status=resignation.status or "Pending",
    )
    db.add(db_res)
    db.commit()
    db.refresh(db_res)
    return {"status": "success", "resignation": serialize_resignation(db_res)}

@app.delete("/api/resignations/delete/{res_id}")
def delete_resignation(res_id: str, db: Session = Depends(get_db)):
    r = db.query(models.Resignation).filter(models.Resignation.id == int(res_id)).first()
    if not r:
        raise HTTPException(status_code=404, detail="Resignation not found")
    db.delete(r)
    db.commit()
    return {"status": "success"}

# ==================== PROMOTIONS (DB-backed) ====================

def serialize_promotion(p: models.Promotion):
    return {
        "_id": str(p.id),
        "id": p.id,
        "employeeName": p.employee_name,
        "jobTitle": p.job_title,
        "promotionFrom": p.promotion_from,
        "promotionTo": p.promotion_to,
        "promotionDate": p.promotion_date,
        "status": p.status,
    }

@app.get("/api/promotions")
def get_promotions(db: Session = Depends(get_db)):
    promotions = db.query(models.Promotion).all()
    return {"promotions": [serialize_promotion(p) for p in promotions]}

@app.post("/api/promotions/add")
def add_promotion(promotion: schemas.PromotionCreate, db: Session = Depends(get_db)):
    db_prom = models.Promotion(
        employee_name=promotion.employeeName or "",
        job_title=promotion.jobTitle or "",
        promotion_from=promotion.promotionFrom or "",
        promotion_to=promotion.promotionTo or "",
        promotion_date=promotion.promotionDate or "",
        status=promotion.status or "Pending",
    )
    db.add(db_prom)
    db.commit()
    db.refresh(db_prom)
    return {"status": "success", "promotion": serialize_promotion(db_prom)}

@app.delete("/api/promotions/delete/{prom_id}")
def delete_promotion(prom_id: str, db: Session = Depends(get_db)):
    p = db.query(models.Promotion).filter(models.Promotion.id == int(prom_id)).first()
    if not p:
        raise HTTPException(status_code=404, detail="Promotion not found")
    db.delete(p)
    db.commit()
    return {"status": "success"}

# ==================== TERMINATIONS (DB-backed) ====================

def serialize_termination(t: models.Termination):
    return {
        "_id": str(t.id),
        "id": t.id,
        "employeeName": t.employee_name,
        "noticeDate": t.notice_date,
        "terminatedDate": t.terminated_date,
        "reason": t.reason,
    }

@app.get("/api/terminations")
def get_terminations(db: Session = Depends(get_db)):
    terminations = db.query(models.Termination).all()
    return {"terminations": [serialize_termination(t) for t in terminations]}

@app.post("/api/terminations/add")
def add_termination(termination: schemas.TerminationCreate, db: Session = Depends(get_db)):
    db_term = models.Termination(
        employee_name=termination.employeeName or "",
        notice_date=termination.noticeDate or "",
        terminated_date=termination.terminatedDate or "",
        reason=termination.reason or "",
    )
    db.add(db_term)
    db.commit()
    db.refresh(db_term)
    return {"status": "success", "termination": serialize_termination(db_term)}

@app.delete("/api/terminations/{term_id}")
def delete_termination(term_id: str, db: Session = Depends(get_db)):
    t = db.query(models.Termination).filter(models.Termination.id == int(term_id)).first()
    if not t:
        raise HTTPException(status_code=404, detail="Termination not found")
    db.delete(t)
    db.commit()
    return {"status": "success"}

# ==================== TASKS (DB-backed) ====================

def serialize_task(t: models.Task):
    return {
        "_id": str(t.id),
        "id": t.id,
        "taskName": t.task_name,
        "client": t.client,
        "startDate": t.start_date,
        "endDate": t.end_date,
        "rate": t.rate,
        "priority": t.priority,
        "projectLead": t.project_lead,
        "teamMembers": t.team_members,
        "jobDescription": t.job_description,
        "status": t.status,
    }

@app.get("/api/tasks")
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(models.Task).all()
    return {"tasks": [serialize_task(t) for t in tasks]}

@app.post("/api/tasks/add")
def add_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(
        task_name=task.taskName or "",
        client=task.client or "",
        start_date=task.startDate or "",
        end_date=task.endDate or "",
        rate=task.rate or "",
        priority=task.priority or "",
        project_lead=task.projectLead or "",
        team_members=task.teamMembers or "",
        job_description=task.jobDescription or "",
        status=task.status or "Pending",
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return {"status": "success", "task": serialize_task(db_task)}

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str, db: Session = Depends(get_db)):
    t = db.query(models.Task).filter(models.Task.id == int(task_id)).first()
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(t)
    db.commit()
    return {"status": "success"}

# ==================== BUDGET EXPENSES (DB-backed) ====================

def serialize_budget_expense(be: models.BudgetExpense):
    return {
        "_id": str(be.id),
        "id": be.id,
        "notes": be.notes,
        "category": be.category,
        "amount": be.amount,
        "revenueDate": be.revenue_date,
    }

@app.get("/api/budget-expenses")
def get_budget_expenses(db: Session = Depends(get_db)):
    expenses = db.query(models.BudgetExpense).all()
    return {"expenses": [serialize_budget_expense(e) for e in expenses]}

@app.post("/api/budget-expenses/add")
def add_budget_expense(expense: schemas.BudgetExpenseCreate, db: Session = Depends(get_db)):
    db_exp = models.BudgetExpense(
        notes=expense.notes or "",
        category=expense.category or "",
        amount=expense.amount or "",
        revenue_date=expense.revenueDate or "",
    )
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return {"status": "success", "expense": serialize_budget_expense(db_exp)}

@app.delete("/api/budget-expenses/{expense_id}")
def delete_budget_expense(expense_id: str, db: Session = Depends(get_db)):
    e = db.query(models.BudgetExpense).filter(models.BudgetExpense.id == int(expense_id)).first()
    if not e:
        raise HTTPException(status_code=404, detail="Budget expense not found")
    db.delete(e)
    db.commit()
    return {"status": "success"}

# ==================== BUDGET REVENUES (DB-backed) ====================

def serialize_budget_revenue(br: models.BudgetRevenue):
    return {
        "_id": str(br.id),
        "id": br.id,
        "notes": br.notes,
        "category": br.category,
        "amount": br.amount,
        "revenueDate": br.revenue_date,
    }

@app.get("/api/budget-revenues")
def get_budget_revenues(db: Session = Depends(get_db)):
    revenues = db.query(models.BudgetRevenue).all()
    return {"revenues": [serialize_budget_revenue(r) for r in revenues]}

@app.post("/api/budget-revenues/add")
def add_budget_revenue(revenue: schemas.BudgetRevenueCreate, db: Session = Depends(get_db)):
    db_rev = models.BudgetRevenue(
        notes=revenue.notes or "",
        category=revenue.category or "",
        amount=revenue.amount or "",
        revenue_date=revenue.revenueDate or "",
    )
    db.add(db_rev)
    db.commit()
    db.refresh(db_rev)
    return {"status": "success", "revenue": serialize_budget_revenue(db_rev)}

@app.delete("/api/budget-revenues/{revenue_id}")
def delete_budget_revenue(revenue_id: str, db: Session = Depends(get_db)):
    r = db.query(models.BudgetRevenue).filter(models.BudgetRevenue.id == int(revenue_id)).first()
    if not r:
        raise HTTPException(status_code=404, detail="Budget revenue not found")
    db.delete(r)
    db.commit()
    return {"status": "success"}

# ==================== APPRAISALS (DB-backed) ====================

def serialize_appraisal(a: models.Appraisal):
    return {
        "_id": str(a.id),
        "id": a.id,
        "employeeName": a.employee_name,
        "department": a.department,
        "designation": a.designation,
        "appraisalDate": a.appraisal_date,
        "status": a.status,
        "rating": a.rating,
        "remarks": a.remarks,
    }

@app.get("/api/appraisals")
def get_appraisals(db: Session = Depends(get_db)):
    appraisals = db.query(models.Appraisal).all()
    return {"appraisals": [serialize_appraisal(a) for a in appraisals]}

@app.post("/api/appraisals/add")
def add_appraisal(appraisal: schemas.AppraisalCreate, db: Session = Depends(get_db)):
    db_apr = models.Appraisal(
        employee_name=appraisal.employeeName or "",
        department=appraisal.department or "",
        designation=appraisal.designation or "",
        appraisal_date=appraisal.appraisalDate or "",
        status=appraisal.status or "Pending",
        rating=appraisal.rating or "",
        remarks=appraisal.remarks or "",
    )
    db.add(db_apr)
    db.commit()
    db.refresh(db_apr)
    return {"status": "success", "appraisal": serialize_appraisal(db_apr)}

@app.delete("/api/appraisals/{appraisal_id}")
def delete_appraisal(appraisal_id: str, db: Session = Depends(get_db)):
    a = db.query(models.Appraisal).filter(models.Appraisal.id == int(appraisal_id)).first()
    if not a:
        raise HTTPException(status_code=404, detail="Appraisal not found")
    db.delete(a)
    db.commit()
    return {"status": "success"}

