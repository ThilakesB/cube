from sqlalchemy import Column, Integer, String, Float, Text
from database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String)
    email = Column(String, index=True)
    phone_number = Column(String)
    gender = Column(String)
    number = Column(String, nullable=True)
    role = Column(String)
    designation = Column(String)
    staff_id = Column(String, index=True)
    official_email = Column(String, index=True)
    photo = Column(Text, nullable=True)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, index=True)
    client = Column(String)
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    rate = Column(String, nullable=True)
    priority = Column(String, default="Medium")
    project_lead = Column(String, nullable=True)
    team_members = Column(String, nullable=True)
    status = Column(String, default="Active")
    job_description = Column(Text, nullable=True)

class Salary(Base):
    __tablename__ = "salaries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    employee_id = Column(String, index=True)
    role = Column(String, nullable=True)
    email = Column(String, nullable=True)
    mobile = Column(String, nullable=True)
    join_date = Column(String, nullable=True)
    basic = Column(String, nullable=True)
    da = Column(String, nullable=True)
    hra = Column(String, nullable=True)
    conveyance = Column(String, nullable=True)
    allowance = Column(String, nullable=True)
    medical_allowance = Column(String, nullable=True)
    earnings_others = Column(String, nullable=True)
    tds = Column(String, nullable=True)
    esi = Column(String, nullable=True)
    pf = Column(String, nullable=True)
    leave = Column(String, nullable=True)
    prof_tax = Column(String, nullable=True)
    labour_welfare = Column(String, nullable=True)
    deductions_others = Column(String, nullable=True)
    salary = Column(Float, nullable=True)

class Holiday(Base):
    __tablename__ = "holidays"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    date = Column(String, index=True)
    day = Column(String, nullable=True)
    type = Column(String, default="Public Holiday")
    description = Column(Text, nullable=True)

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String, index=True)
    employee_id = Column(String, index=True)
    date = Column(String, index=True)
    status = Column(String, default="Present")
    check_in_time = Column(String, nullable=True)
    check_out_time = Column(String, nullable=True)
    remarks = Column(Text, nullable=True)

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    department_name = Column(String, index=True)
    manager = Column(String, nullable=True)
    parent_department = Column(String, nullable=True)


# ==================== NEW MODELS ====================

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String, index=True)
    department = Column(String, nullable=True)
    job_location = Column(String, nullable=True)
    training_cost = Column(String, nullable=True)
    salary_from = Column(String, nullable=True)
    salary_to = Column(String, nullable=True)
    job_type = Column(String, nullable=True)
    status = Column(String, default="Open")
    start_date = Column(String, nullable=True)
    expire_date = Column(String, nullable=True)
    description = Column(Text, nullable=True)


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String, index=True)
    job_title = Column(String, nullable=True)
    department = Column(String, nullable=True)
    status = Column(String, default="New")
    resume_date = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    experience = Column(String, nullable=True)
    description = Column(Text, nullable=True)


class Shortlist(Base):
    __tablename__ = "shortlists"

    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String, index=True)
    job_title = Column(String, nullable=True)
    department = Column(String, nullable=True)
    job_location = Column(String, nullable=True)
    salary_from = Column(String, nullable=True)
    salary_to = Column(String, nullable=True)
    job_type = Column(String, nullable=True)
    status = Column(String, default="Shortlisted")
    start_date = Column(String, nullable=True)
    expire_date = Column(String, nullable=True)
    description = Column(Text, nullable=True)


class JobOffer(Base):
    __tablename__ = "job_offers"

    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String, index=True)
    department = Column(String, nullable=True)
    job_type = Column(String, nullable=True)
    status = Column(String, default="Pending")
    offered_date = Column(String, nullable=True)
    employee_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    salary = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    job_location = Column(String, nullable=True)
    long_ip = Column(String, nullable=True)


class Trainer(Base):
    __tablename__ = "trainers"

    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String, index=True)
    lastname = Column(String, nullable=True)
    role = Column(String, nullable=True)
    emailid = Column(String, nullable=True)
    phoneno = Column(String, nullable=True)
    status = Column(String, default="Active")


class Training(Base):
    __tablename__ = "trainings"

    id = Column(Integer, primary_key=True, index=True)
    trainingtype = Column(String, index=True)
    trainer = Column(String, nullable=True)
    training_cost = Column(String, nullable=True)
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    status = Column(String, default="Active")


class Resignation(Base):
    __tablename__ = "resignations"

    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String, index=True)
    department = Column(String, nullable=True)
    reason = Column(Text, nullable=True)
    notice = Column(String, nullable=True)
    resignation = Column(String, nullable=True)
    status = Column(String, default="Pending")


class Promotion(Base):
    __tablename__ = "promotions"

    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String, index=True)
    job_title = Column(String, nullable=True)
    promotion_from = Column(String, nullable=True)
    promotion_to = Column(String, nullable=True)
    promotion_date = Column(String, nullable=True)
    status = Column(String, default="Pending")


class Termination(Base):
    __tablename__ = "terminations"

    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String, index=True)
    notice_date = Column(String, nullable=True)
    terminated_date = Column(String, nullable=True)
    reason = Column(Text, nullable=True)


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    task_name = Column(String, index=True)
    client = Column(String, nullable=True)
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    rate = Column(String, nullable=True)
    priority = Column(String, nullable=True)
    project_lead = Column(String, nullable=True)
    team_members = Column(String, nullable=True)
    job_description = Column(Text, nullable=True)
    status = Column(String, default="Pending")


class BudgetExpense(Base):
    __tablename__ = "budget_expenses"

    id = Column(Integer, primary_key=True, index=True)
    notes = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    amount = Column(String, nullable=True)
    revenue_date = Column(String, nullable=True)


class BudgetRevenue(Base):
    __tablename__ = "budget_revenues"

    id = Column(Integer, primary_key=True, index=True)
    notes = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    amount = Column(String, nullable=True)
    revenue_date = Column(String, nullable=True)


class Appraisal(Base):
    __tablename__ = "appraisals"

    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String, index=True)
    department = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    appraisal_date = Column(String, nullable=True)
    status = Column(String, default="Pending")
    rating = Column(String, nullable=True)
    remarks = Column(Text, nullable=True)
