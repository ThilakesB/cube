import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Common_Bar/Sidebar";
import Projects from "./components/Job/Projects";
import TaskView from "./components/Task/TaskView";
import Taskboard from "./components/Task/Taskboard";
import JobManagement from "./components/Job/JobManagement";
import Resume from "./components/Job/Resume";
import Shortlist from "./components/Job/Shortlist";
import AdminDepartments from "./components/Department/AdminAddDepartments";
import EmployeeInputFields from "./components/Task/Termination";
import Offer_Approved from "./components/Job/Offer_Approved";
import AdminAddDepartment from './components/Department/AdminAddDepartments';
import AdminDepartmentView from './components/Department/AdminViewDepartment';
import AttendancePage from "./components/Task/AttendancePage";
import Payroll from "./components/Payroll/Payroll";
import Payslip from "./components/Payroll/Payslip";
import Report from "./components/Report/Report";
import NotificationContainer from "./components/Notification/Notification";
import Promotion from "./components/Promotion/Promotion";
import SettingContainer from "./components/Notification/SettingContainer";
import ConfigurationPage from "./components/configuration/Configuration";
import Apraisal from "./components/configuration/ApraisalOrganization";
import PerformanceAppraisal from "./components/configuration/PerfoemaceAppraisale";
import Resignation from "./components/Promotion/Resignation";
import AttendanceData from "./components/Task/AttendanceData";
import EmployeeAdd from "./components/Employee/AddEmployee";
import AdminEmployee from "./components/Employee/AdminEmployee";
import EditEmployee from "./components/Employee/EditEmployee";
import AdminLogin from "./components/Employee/AdminLogin";
import ChatUI from "./components/Employee/Message";
import TrainerList from "./components/Notification/TrainerAndTraining";
import Holidays from "./components/Notification/holidays";
import LeaveReport from "./components/Report/Leave_Report";
import DailyReport from "./components/Report/Daily_Report";
import UserReport from "./components/Report/User_Report";
import ExpenseReport from "./components/Report/ExpenseReport";
import ProjectReport from "./components/Report/ProjectReport";
import TaskReport from "./components/Report/TaskReport";
import Accounting from "./components/Budget/Accounting";
import Dashboard from "./components/Department/Dashboard";


const App = () => {
  return (
    <Router>
      
          <Routes>

           {/* Anusha */}
           <Route path="/projects" element={<Projects />} />
            <Route path='/' element={<AdminDepartments/>}/>
            <Route path="/termination" element={<EmployeeInputFields/>}/>
            <Route path="/taskview" element={<TaskView />} />
            <Route path="/taskboard" element={<Taskboard/>}/>
            <Route path="/accounting" element={<Accounting/>}/>
            
         {/* sabarish */}   
            <Route path='/adddepartment' element={<AdminAddDepartment/>}/>
          <Route path='/department' element={<AdminDepartmentView/>}/>
          <Route path="/report" element={<Report/>}/>
          <Route path="/user" element={<UserReport/>}/>
          <Route path="/report" element={<Report/>}/>
          <Route path="/expense" element={<ExpenseReport/>}/>
          <Route path="/project" element={<ProjectReport/>}/>
          <Route path="/task" element={<TaskReport/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>

            {/* Nandhini */}
          <Route path="/manage-jobs-view" element={<JobManagement/>}/>
          <Route path="/shortlist" element={<Shortlist/>}/>
            <Route path="/resume" element={<Resume/>}/>
            <Route path="/offer-approval-view" element={<Offer_Approved/>}/>
          <Route path='/attendance' element={<AttendancePage/>}/>
          <Route path="/payroll" element={<Payroll/>}/>
          <Route path="/resignation-view" element={<Resignation/>}/>
          <Route path="/slip/:employeeId" element={<Payslip/>}/>
          <Route path="/promotion" element={<Promotion/>}/>
            {/*Harshini */}
          <Route path="/notification" element={<NotificationContainer/>}/>
          <Route path="/settings" element={<SettingContainer/>}/>
          <Route path="/attendancedata" element={<AttendanceData/>}/>
          <Route path='/leave_report' element={<LeaveReport/>}/>
          <Route path='/daily_report' element={<DailyReport/>}/>
          {/*Dharun */}
          <Route path="/configuration" element={<ConfigurationPage/>}/>
          <Route path="/apraisal" element={<Apraisal/>}/>
          <Route path="/performance" element={<PerformanceAppraisal/>}/>
          <Route path='/employeeAdd' element={<EmployeeAdd/>}/>
        <Route path='/employee' element={<AdminEmployee/>}/>
        <Route path='/editEmployee' element={<EditEmployee/>}/>
        <Route path='/chat' element={<ChatUI/>}/>
        <Route path='/training' element={<TrainerList/>}/>
        <Route path='/holidays' element={<Holidays/>}/>

        <Route path='/login' element={<AdminLogin/>}/>

          </Routes>
          
        
    </Router>
  );
};

export default App;




