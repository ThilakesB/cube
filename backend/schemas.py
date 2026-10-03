from pydantic import BaseModel
from typing import Optional, List, Any

# Employee Schemas
class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone_number: str
    gender: str
    number: Optional[str] = ""
    role: str
    designation: str
    staff_id: str
    official_email: str
    photo: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int

    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    projectName: Optional[str] = None
    project_name: Optional[str] = None
    client: str
    startDate: Optional[str] = None
    start_date: Optional[str] = None
    endDate: Optional[str] = None
    end_date: Optional[str] = None
    rate: Optional[str] = None
    priority: Optional[str] = "Medium"
    projectLead: Optional[str] = None
    project_lead: Optional[str] = None
    teamMembers: Optional[str] = None
    team_members: Optional[str] = None
    status: Optional[str] = "Active"
    jobDescription: Optional[str] = None
    job_description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectOut(BaseModel):
    id: int
    projectName: str
    client: str
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    rate: Optional[str] = None
    priority: Optional[str] = "Medium"
    projectLead: Optional[str] = None
    teamMembers: Optional[str] = None
    status: Optional[str] = "Active"
    jobDescription: Optional[str] = None

# Salary Schemas
class SalaryBase(BaseModel):
    name: str
    id: Optional[str] = None
    employee_id: Optional[str] = None
    role: Optional[str] = "Web Developer"
    email: Optional[str] = ""
    mobile: Optional[str] = ""
    joinDate: Optional[str] = None
    join_date: Optional[str] = None
    basic: Optional[str] = "0"
    da: Optional[str] = "0"
    hra: Optional[str] = "0"
    conveyance: Optional[str] = "0"
    allowance: Optional[str] = "0"
    medicalAllowance: Optional[str] = "0"
    medical_allowance: Optional[str] = "0"
    earningsOthers: Optional[str] = "0"
    earnings_others: Optional[str] = "0"
    tds: Optional[str] = "0"
    esi: Optional[str] = "0"
    pf: Optional[str] = "0"
    leave: Optional[str] = "0"
    profTax: Optional[str] = "0"
    prof_tax: Optional[str] = "0"
    labourWelfare: Optional[str] = "0"
    labour_welfare: Optional[str] = "0"
    deductionsOthers: Optional[str] = "0"
    deductions_others: Optional[str] = "0"
    salary: Optional[float] = 0
    netSalary: Optional[float] = 0

class SalaryCreate(SalaryBase):
    pass

# Holiday Schemas
class HolidayBase(BaseModel):
    name: str
    date: str
    day: Optional[str] = ""
    type: Optional[str] = "Public Holiday"
    description: Optional[str] = ""

class HolidayCreate(HolidayBase):
    pass

# Attendance Schemas
class AttendanceBase(BaseModel):
    employeeName: Optional[str] = None
    employee_name: Optional[str] = None
    employeeId: Optional[str] = None
    employee_id: Optional[str] = None
    date: str
    status: Optional[str] = "Present"
    checkInTime: Optional[str] = "09:00"
    check_in_time: Optional[str] = "09:00"
    checkOutTime: Optional[str] = "18:00"
    check_out_time: Optional[str] = "18:00"
    remarks: Optional[str] = ""

class AttendanceCreate(AttendanceBase):
    pass

# Department Schemas
class DepartmentBase(BaseModel):
    departmentName: Optional[str] = None
    department_name: Optional[str] = None
    section: Optional[str] = ""
    headOfDepartment: Optional[str] = ""
    head_of_department: Optional[str] = ""
    manager: Optional[str] = ""
    parentDepartment: Optional[str] = ""
    parent_department: Optional[str] = ""
    staffCount: Optional[str] = ""
    staff_count: Optional[str] = ""
    budgetExpense: Optional[str] = ""
    budget_expense: Optional[str] = ""
    inventoryResources: Optional[str] = ""
    inventory_resources: Optional[str] = ""
    description: Optional[str] = ""

class DepartmentCreate(DepartmentBase):
    pass


# ==================== NEW SCHEMAS ====================

# Job Schemas
class JobCreate(BaseModel):
    jobTitle: Optional[str] = ""
    department: Optional[str] = ""
    jobLocation: Optional[str] = ""
    trainingCost: Optional[str] = ""
    salaryFrom: Optional[str] = ""
    salaryTo: Optional[str] = ""
    jobType: Optional[str] = ""
    status: Optional[str] = "Open"
    startDate: Optional[str] = ""
    expireDate: Optional[str] = ""
    description: Optional[str] = ""

# Resume Schemas
class ResumeCreate(BaseModel):
    employeeName: Optional[str] = ""
    jobTitle: Optional[str] = ""
    department: Optional[str] = ""
    status: Optional[str] = "New"
    resumeDate: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    experience: Optional[str] = ""
    description: Optional[str] = ""

# Shortlist Schemas
class ShortlistCreate(BaseModel):
    employeeName: Optional[str] = ""
    jobTitle: Optional[str] = ""
    department: Optional[str] = ""
    jobLocation: Optional[str] = ""
    salaryFrom: Optional[str] = ""
    salaryTo: Optional[str] = ""
    jobType: Optional[str] = ""
    status: Optional[str] = "Shortlisted"
    startDate: Optional[str] = ""
    expireDate: Optional[str] = ""
    description: Optional[str] = ""

# JobOffer Schemas
class JobOfferCreate(BaseModel):
    jobTitle: Optional[str] = ""
    department: Optional[str] = ""
    jobType: Optional[str] = ""
    status: Optional[str] = "Pending"
    offeredDate: Optional[str] = ""
    employeeName: Optional[str] = ""
    email: Optional[str] = ""
    salary: Optional[str] = ""
    address: Optional[str] = ""
    jobLocation: Optional[str] = ""
    longIP: Optional[str] = ""

class JobOfferStatusUpdate(BaseModel):
    status: str

# Trainer Schemas
class TrainerCreate(BaseModel):
    firstname: Optional[str] = ""
    lastname: Optional[str] = ""
    role: Optional[str] = ""
    emailid: Optional[str] = ""
    phoneno: Optional[str] = ""
    status: Optional[str] = "Active"

# Training Schemas
class TrainingCreate(BaseModel):
    trainingtype: Optional[str] = ""
    trainer: Optional[str] = ""
    Training_cost: Optional[str] = ""
    startDate: Optional[str] = ""
    endDate: Optional[str] = ""
    status: Optional[str] = "Active"

# Resignation Schemas
class ResignationCreate(BaseModel):
    employeeName: Optional[str] = ""
    department: Optional[str] = ""
    reason: Optional[str] = ""
    notice: Optional[str] = ""
    resignation: Optional[str] = ""
    status: Optional[str] = "Pending"

# Promotion Schemas
class PromotionCreate(BaseModel):
    employeeName: Optional[str] = ""
    jobTitle: Optional[str] = ""
    promotionFrom: Optional[str] = ""
    promotionTo: Optional[str] = ""
    promotionDate: Optional[str] = ""
    status: Optional[str] = "Pending"

# Termination Schemas
class TerminationCreate(BaseModel):
    employeeName: Optional[str] = ""
    noticeDate: Optional[str] = ""
    terminatedDate: Optional[str] = ""
    reason: Optional[str] = ""

# Task Schemas
class TaskCreate(BaseModel):
    taskName: Optional[str] = ""
    client: Optional[str] = ""
    startDate: Optional[str] = ""
    endDate: Optional[str] = ""
    rate: Optional[str] = ""
    priority: Optional[str] = ""
    projectLead: Optional[str] = ""
    teamMembers: Optional[str] = ""
    jobDescription: Optional[str] = ""
    status: Optional[str] = "Pending"

# Budget Expense Schemas
class BudgetExpenseCreate(BaseModel):
    notes: Optional[str] = ""
    category: Optional[str] = ""
    amount: Optional[str] = ""
    revenueDate: Optional[str] = ""

# Budget Revenue Schemas
class BudgetRevenueCreate(BaseModel):
    notes: Optional[str] = ""
    category: Optional[str] = ""
    amount: Optional[str] = ""
    revenueDate: Optional[str] = ""

# Appraisal Schemas
class AppraisalCreate(BaseModel):
    employeeName: Optional[str] = ""
    department: Optional[str] = ""
    designation: Optional[str] = ""
    appraisalDate: Optional[str] = ""
    status: Optional[str] = "Pending"
    rating: Optional[str] = ""
    remarks: Optional[str] = ""
