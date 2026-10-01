from pydantic import BaseModel
from typing import Optional

class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone_number: str
    gender: str
    number: str
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
