from sqlalchemy import Column, Integer, String
from database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String)
    gender = Column(String)
    number = Column(String)
    role = Column(String)
    designation = Column(String)
    staff_id = Column(String, unique=True, index=True)
    official_email = Column(String, unique=True, index=True)
    photo = Column(String, nullable=True)
