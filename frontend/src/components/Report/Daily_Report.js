import {Component} from 'react'
import './Daily_Report.css'

import { TbArrowsSort } from "react-icons/tb";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import { FaRegCircleDot } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import Sidebar from '../Common_Bar/Sidebar';
import TopBar from '../Common_Bar/TopBar';
import Navbar from '../Common_Bar/NavBar';

const leaveData = [
        { id: 1, empName: 'John Doe', date: '2024-01-06', dept: 'HR', leaveType: 'Sick Leave', noOfDays: 2, remainingLeave: 5, status: 'Approved', workLocation: 'Office' },
        { id: 2, empName: 'Jane Smith', date: '2024-01-05', dept: 'Finance', leaveType: 'Casual Leave', noOfDays: 1, remainingLeave: 4, status: 'Pending', workLocation: 'Home' },
        { id: 3, empName: 'Alex Johnson', date: '2024-01-04', dept: 'IT', leaveType: 'Vacation', noOfDays: 5, remainingLeave: 7, status: 'Approved', workLocation: 'Home' },
        { id: 4, empName: 'Emily Davis', date: '2024-01-03', dept: 'Marketing', leaveType: 'Medical Leave', noOfDays: 3, remainingLeave: 6, status: 'Rejected', workLocation: 'Office' },
        { id: 5, empName: 'Chris Martin', date: '2024-01-02', dept: 'Sales', leaveType: 'Paternity Leave', noOfDays: 10, remainingLeave: 12, status: 'Approved', workLocation: 'Home' },
        { id: 6, empName: 'Sophia Brown', date: '2023-12-28', dept: 'Support', leaveType: 'Casual Leave', noOfDays: 2, remainingLeave: 8, status: 'Pending', workLocation: 'Office' },
        { id: 7, empName: 'Michael Wilson', date: '2023-12-26', dept: 'IT', leaveType: 'Sick Leave', noOfDays: 1, remainingLeave: 9, status: 'Approved', workLocation: 'Home' },
        { id: 8, empName: 'Emma Thomas', date: '2023-12-24', dept: 'HR', leaveType: 'Maternity Leave', noOfDays: 20, remainingLeave: 25, status: 'Approved', workLocation: 'Home' },
        { id: 9, empName: 'Liam Anderson', date: '2023-12-20', dept: 'Finance', leaveType: 'Casual Leave', noOfDays: 1, remainingLeave: 3, status: 'Rejected', workLocation: 'Home' },
        { id: 10, empName: 'Olivia Garcia', date: '2023-12-18', dept: 'Marketing', leaveType: 'Vacation', noOfDays: 7, remainingLeave: 10, status: 'Approved', workLocation: 'Office' },
        { id: 11, empName: 'Noah Martinez', date: '2023-12-15', dept: 'Support', leaveType: 'Medical Leave', noOfDays: 5, remainingLeave: 15, status: 'Pending', workLocation: 'Remote' },
        { id: 12, empName: 'Ava Rodriguez', date: '2023-12-10', dept: 'IT', leaveType: 'Sick Leave', noOfDays: 2, remainingLeave: 6, status: 'Approved', workLocation: 'Home' },
        { id: 13, empName: 'Isabella Lee', date: '2023-12-08', dept: 'HR', leaveType: 'Paternity Leave', noOfDays: 10, remainingLeave: 12, status: 'Approved', workLocation: 'Remote' },
        { id: 14, empName: 'Elijah Harris', date: '2023-12-06', dept: 'Finance', leaveType: 'Casual Leave', noOfDays: 1, remainingLeave: 2, status: 'Rejected', workLocation: 'Office' },
        { id: 15, empName: 'James Clark', date: '2023-12-04', dept: 'Sales', leaveType: 'Medical Leave', noOfDays: 4, remainingLeave: 8, status: 'Pending', workLocation: 'Home' },
        { id: 16, empName: 'Benjamin Lewis', date: '2023-12-02', dept: 'Marketing', leaveType: 'Vacation', noOfDays: 6, remainingLeave: 10, status: 'Approved', workLocation: 'Home' },
        { id: 17, empName: 'Charlotte Walker', date: '2023-12-01', dept: 'Support', leaveType: 'Sick Leave', noOfDays: 1, remainingLeave: 7, status: 'Approved', workLocation: 'Office' },
        { id: 18, empName: 'Lucas Hall', date: '2023-11-29', dept: 'IT', leaveType: 'Casual Leave', noOfDays: 3, remainingLeave: 5, status: 'Approved', workLocation: 'Home' },
        { id: 19, empName: 'Mia Young', date: '2023-11-27', dept: 'HR', leaveType: 'Medical Leave', noOfDays: 2, remainingLeave: 6, status: 'Rejected', workLocation: 'Remote' },
        { id: 20, empName: 'William King', date: '2023-11-24', dept: 'Finance', leaveType: 'Vacation', noOfDays: 5, remainingLeave: 9, status: 'Approved', workLocation: 'Office' },
        { id: 21, empName: 'Evelyn Wright', date: '2023-11-22', dept: 'Marketing', leaveType: 'Sick Leave', noOfDays: 2, remainingLeave: 4, status: 'Pending', workLocation: 'Remote' },
        { id: 22, empName: 'Henry Scott', date: '2023-11-19', dept: 'Support', leaveType: 'Casual Leave', noOfDays: 1, remainingLeave: 3, status: 'Approved', workLocation: 'Home' },
        { id: 23, empName: 'Amelia Green', date: '2023-11-17', dept: 'IT', leaveType: 'Medical Leave', noOfDays: 6, remainingLeave: 10, status: 'Rejected', workLocation: 'Office' },
        { id: 24, empName: 'Alexander Baker', date: '2023-11-15', dept: 'HR', leaveType: 'Paternity Leave', noOfDays: 8, remainingLeave: 10, status: 'Approved', workLocation: 'Remote' },
        { id: 25, empName: 'Sophia Adams', date: '2023-11-12', dept: 'Finance', leaveType: 'Vacation', noOfDays: 3, remainingLeave: 5, status: 'Approved', workLocation: 'Home' },
        { id: 26, empName: 'Jack Turner', date: '2023-11-10', dept: 'Sales', leaveType: 'Sick Leave', noOfDays: 2, remainingLeave: 8, status: 'Pending', workLocation: 'Office' },
        { id: 27, empName: 'Grace Hill', date: '2023-11-08', dept: 'Marketing', leaveType: 'Casual Leave', noOfDays: 1, remainingLeave: 4, status: 'Approved', workLocation: 'Remote' },
        { id: 28, empName: 'Samuel Phillips', date: '2023-11-06', dept: 'Support', leaveType: 'Medical Leave', noOfDays: 5, remainingLeave: 9, status: 'Rejected', workLocation: 'Home' },
        { id: 29, empName: 'Victoria Evans', date: '2023-11-04', dept: 'IT', leaveType: 'Vacation', noOfDays: 7, remainingLeave: 11, status: 'Approved', workLocation: 'Office' }
      ];

    const department =  [
        'HR',
        'Finance',
        'IT',
        'Marketing',
        'Sales',
        'Support'
      ]
      

      class DailyReport extends Component {
        state = {
          leaveDataList: leaveData,
          currentPage: 1,
          recordsPerPage: 10,
          sortColumn: null,
          isAscending: true,
          searchName: '',
          searchDept: '',
        };
      
        handleNextPage = () => {
          const { currentPage, recordsPerPage, leaveDataList } = this.state;
          if ((currentPage * recordsPerPage) < leaveDataList.length) {
            this.setState({ currentPage: currentPage + 1 });
          }
        };
      
        handlePreviousPage = () => {
          if (this.state.currentPage > 1) {
            this.setState({ currentPage: this.state.currentPage - 1 });
          }
        };
      
        sortData = (column) => {
          const { leaveDataList, isAscending, sortColumn } = this.state;
          const sortedList = [...leaveDataList].sort((a, b) => {
            const comparison = typeof a[column] === 'string'
              ? a[column].localeCompare(b[column])
              : a[column] - b[column];
            return (sortColumn === column && isAscending) ? -comparison : comparison;
          });
      
          this.setState({
            leaveDataList: sortedList,
            sortColumn: column,
            isAscending: sortColumn === column ? !isAscending : true,
          });
        };
      
        filterData = () => {
            const { searchName,searchDept } = this.state;
            const filteredList = leaveData.filter(({ empName, dept }) => {
              const matchesName = searchName ? empName.toLowerCase().includes(searchName.toLowerCase()) : true;
              const matchesDept = searchDept ? dept.toLowerCase().includes(searchDept.toLowerCase()) : true;
              //Date Search is in pending
              return matchesName && matchesDept;
            });
          
            this.setState({ leaveDataList: filteredList, currentPage: 1 });
          };
          
      
        render() {
            const { leaveDataList, currentPage, recordsPerPage } = this.state;
            const indexOfLastRecord = currentPage * recordsPerPage;
            const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
            const currentRecords = leaveDataList.slice(indexOfFirstRecord, indexOfLastRecord);
            const startRecord = indexOfFirstRecord + 1;
            const endRecord = Math.min(indexOfLastRecord, leaveDataList.length);
            const totalRecords = leaveDataList.length;

            const totalEmployee = 1000
            const totalNonLeaveApplicant = 1000 - leaveData.length 
            const count = leaveData.reduce((count, eachData) => 
                eachData.status === 'Rejected' ? count + 1 : count, 
              0);
            const totalPresent = totalNonLeaveApplicant + count 
            const totalAbsent = leaveData.reduce((count, eachData)=> 
                eachData.status === 'Approved' ? count + 1: count,0
            );
            const totalPending = leaveData.reduce((count, eachData)=> 
                eachData.status === 'Pending' ? count + 1: count,0
            );
      
          return (
            <div className="container">
  <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <Navbar />
      <TopBar/>
      {/* Main layout with Sidebar and content */}
      <div>
        {/* Sidebar */}
        <Sidebar />
  
            <div className="report-container">
                <p className='report-description'>Reporting / Daily Report</p>
                <h1 className='report-title'>Daily Report</h1>
                <p className='report-para'>Dashboard Daily Report</p>

                <div className='countings-dashboard'>
                    <div className='countings-container'> 
                        <h1>{totalEmployee}</h1>
                        <p>Total Employees</p>
                    </div>
                    <div className='countings-container'>
                        <h1>{totalPresent}</h1>
                        <p>Total Present</p>
                    </div>
                    <div className='countings-container'>
                        <h1>{totalAbsent}</h1>
                        <p>Total Absent</p>
                    </div>
                    <div className='countings-container'>
                        <h1>{totalPending}</h1>
                        <p>Total Left</p>
                    </div>
                </div>
             
                <div className='report-search-container'>
                    <select value={this.state.searchName}
                        onChange={(e) => this.setState({ searchName: e.target.value })} className='report-select'>
                        <option value="" disabled selected>Employee Name</option>
                        {leaveData.map((eachData) => (
                            <option key={eachData.id} value={eachData.empName}>{eachData.empName}</option>
                        ))}
                    </select>
                    <select value={this.state.searchDept}
                        onChange={(e) => this.setState({ searchDept: e.target.value })} className='report-select'>
                        <option value="" disabled selected>Department</option>
                        {department.map((eachData) => (
                            <option key={eachData} value={eachData}>{eachData}</option>
                        ))}
                    </select>
                    <button onClick={this.filterData} className='report-search-btn'>SEARCH</button>
                </div>
                <br/>
             
                <p className='report-para show-items-container'>Show <div className='show-count-container'>{currentRecords.length}</div> entries</p>
      
              <table>
                <thead>
                  <tr className='attendance-table-heading'>
                    <th className='emp-name' onClick={() => this.sortData('empName')}>Employee Name <TbArrowsSort /></th>
                    <th onClick={() => this.sortData('date')}>Date <TbArrowsSort /></th>
                    <th onClick={() => this.sortData('dept')}>Department <TbArrowsSort /></th>
                    <th onClick={() => this.sortData('leaveType')}>Leave Type <TbArrowsSort /></th>
                    <th onClick={() => this.sortData('noOfDays')}>No. of Days <TbArrowsSort /></th>
                    <th onClick={() => this.sortData('remainingLeave')}>Remaining Leave <TbArrowsSort /></th>
                    <th onClick={() => this.sortData('status')}>Status <TbArrowsSort /></th>
                    <th onClick={() => this.sortData('workLocation')}>Work Location <TbArrowsSort /></th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map(({ id, empName, date, dept, leaveType, noOfDays, remainingLeave, status, workLocation }) => (
                    <tr key={id}  className='attendance-table-body'>
                      <td>{empName}</td>
                      <td>{date}</td>
                      <td>{dept}</td>
                      <td className='work-status-container'> <FaRegCircleDot className='work-status-icon'/> <p className='work-status'>{leaveType}</p></td>
                      <td className='work-status-container'><p className='work-status'>{noOfDays}</p></td>
                      <td className='work-status-container'><p className='work-status'>{remainingLeave}</p></td>
                      <td className='work-status-container'>
                            <FaRegCircleDot className='work-status-icon'/>
                            <select className='work-status'>
                                <option value={status}>{status}</option>  
                                {status !== 'Approved' && <option value="Approved">Approved</option>}  
                                {status !== 'Pending' && <option value="Pending">Pending</option>}    
                                {status !== 'Rejected' && <option value="Rejected">Rejected</option>}    
                            </select>
                       </td>
                       <td className='work-location'>{workLocation} <BsThreeDotsVertical className='location-icon'/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
      
              <div className='count-container'>
                    <p className='report-para out-of-container'>
                        Showing {startRecord} to {endRecord} of {totalRecords} entries
                    </p>
                    <div className='pagination-controls'>
                        <button className='arrow-btn' onClick={this.handlePreviousPage} disabled={currentPage === 1}><MdOutlineNavigateBefore /></button>
                        <span className='current-page'>{currentPage}</span>
                        <button className='arrow-btn' onClick={this.handleNextPage} disabled={(currentPage * recordsPerPage) >= leaveDataList.length}><MdOutlineNavigateNext /></button>
                    </div>
                </div>
            </div>
            </div>
            </div>
            </div>
          );
        }
      }
      
      

export default DailyReport;
