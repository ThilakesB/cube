import {Component} from 'react'
import './AttendanceData.css'

import { TbArrowsSort } from "react-icons/tb";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import { FaRegCircleDot } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import Sidebar from '../Common_Bar/Sidebar';
import TopBar from '../Common_Bar/TopBar';
import Navbar from '../Common_Bar/NavBar';
import { API_BASE_URL } from '../../config/api';

class AttendanceData extends Component {
    state = {
        attendanceData: [],
        attendanceDataList: [],
        currentPage: 1,
        recordsPerPage: 10,
        sortColumn: null,
        isAscending: true,
        searchName: '',
        searchInTime: '',
        searchOutTime: '',
    };

    componentDidMount() {
        this.fetchAttendance();
    }

    fetchAttendance = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/attendance`);
            if (response.ok) {
                const apiRecords = await response.json();
                const localRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
                const formattedLocal = localRecords.map((r, i) => ({
                    id: 1000 + i,
                    empName: r.employeeName,
                    empCode: r.employeeId,
                    inTime: `${r.checkInTime || '9:00 AM'} ${r.date}`,
                    outTime: `${r.checkOutTime || '6:00 PM'} ${r.date}`,
                    workStatus: r.status,
                    workLocation: 'Office'
                }));
                const combined = [...apiRecords, ...formattedLocal];
                this.setState({ attendanceData: combined, attendanceDataList: combined });
            }
        } catch (err) {
            console.warn("Could not fetch attendance from backend:", err);
            const localRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
            const formattedLocal = localRecords.map((r, i) => ({
                id: 1000 + i,
                empName: r.employeeName,
                empCode: r.employeeId,
                inTime: `${r.checkInTime || '9:00 AM'} ${r.date}`,
                outTime: `${r.checkOutTime || '6:00 PM'} ${r.date}`,
                workStatus: r.status,
                workLocation: 'Office'
            }));
            this.setState({ attendanceData: formattedLocal, attendanceDataList: formattedLocal });
        }
    };

    handleNextPage = () => {
        const { currentPage, recordsPerPage, attendanceDataList } = this.state;
        if ((currentPage * recordsPerPage) < attendanceDataList.length) {
            this.setState({ currentPage: currentPage + 1 });
        }
    };

    handlePreviousPage = () => {
        const { currentPage } = this.state;
        if (currentPage > 1) {
            this.setState({ currentPage: currentPage - 1 });
        }
    };

    sortData = (column) => {
        const { attendanceDataList, isAscending, sortColumn } = this.state;
        
        const sortedList = [...attendanceDataList].sort((a, b) => {
            const comparison = typeof a[column] === 'string' 
                ? a[column].localeCompare(b[column]) 
                : a[column] - b[column];
            return (sortColumn === column && isAscending) ? -comparison : comparison;
        });
    
        this.setState({
            attendanceDataList: sortedList,
            sortColumn: column,
            isAscending: sortColumn === column ? !isAscending : true,
        });
    };

    filterData = () => {
        const { attendanceData, searchName, searchInTime, searchOutTime } = this.state;
    
        const formatDate = (dateTimeString) => {
            const [time, , day, month, year] = dateTimeString.split(' ');
            const monthMap = {
                Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
            };
            return new Date(year, monthMap[month], parseInt(day), ...time.split(':').map(Number));
        };
    
        const filteredList = attendanceData.filter((entry) => {
            const matchesName = searchName ? entry.empName.toLowerCase().includes(searchName.toLowerCase()) : true;
    
            const inTimeDate = formatDate(entry.inTime);
            const outTimeDate = formatDate(entry.outTime);
    
            const matchesInTime = searchInTime ? new Date(searchInTime) <= inTimeDate : true;
            const matchesOutTime = searchOutTime ? new Date(searchOutTime) >= outTimeDate : true;
    
            return matchesName && matchesInTime && matchesOutTime;
        });
    
        this.setState({ attendanceDataList: filteredList, currentPage: 1 });
    };
    


    render() {
        const { attendanceDataList, currentPage, recordsPerPage } = this.state;
        const indexOfLastRecord = currentPage * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        const currentRecords = attendanceDataList.slice(indexOfFirstRecord, indexOfLastRecord);
        const startRecord = indexOfFirstRecord + 1;
        const endRecord = Math.min(indexOfLastRecord, attendanceDataList.length);
        const totalRecords = attendanceDataList.length;

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
            <div className='report-container'>
                <p className='report-description'>Reporting / Attendance Report</p>
                <h1 className='report-title'>Attendance Report</h1>
                <p className='report-para'>Dashboard Attendance Report</p>
                <div className='report-search-container'>
                    <select value={this.state.searchName}
                        onChange={(e) => this.setState({ searchName: e.target.value })} className='report-select'>
                        <option value="" disabled selected>Employee Name</option>
                        {this.state.attendanceData.map((eachData) => (
                            <option key={eachData.id} value={eachData.empName}>{eachData.empName}</option>
                        ))}
                    </select>
                    <div className='report-input-container'>
                        <label htmlFor='dateInputFrom'>From</label>
                        <input  value={this.state.searchInTime}
                        onChange={(e) => this.setState({ searchInTime: e.target.value })} className='report-date-input' type="date" id="dateInputFrom" />
                    </div>
                    <div className='report-input-container'>
                        <label htmlFor='dateInputTo'>To</label>
                        <input value={this.state.searchOutTime}
                        onChange={(e) => this.setState({ searchOutTime: e.target.value })} className='report-date-input' type="date" id="dateInputTo" />
                    </div>
                    <button onClick={this.filterData} className='report-search-btn'>SEARCH</button>
                </div>
                <p className='report-para show-items-container'>Show <div className='show-count-container'>{recordsPerPage}</div> entries</p>
                <table>
                    <thead>
                        <tr className='attendance-table-heading'>
                            <th onClick={()=>{this.sortData('empName')}}>Employee Name <TbArrowsSort  /></th>
                            <th onClick={()=>{this.sortData('empCode')}}>Employee Code <TbArrowsSort  /></th>
                            <th onClick={()=>{this.sortData('inTime')}}>In Time <TbArrowsSort  /></th>
                            <th onClick={()=>{this.sortData('outTime')}}>Out Time <TbArrowsSort  /></th>
                            <th onClick={()=>{this.sortData('workStatus')}}>Work Status <TbArrowsSort  /></th>
                            <th onClick={()=>{this.sortData('workLocation')}}>Work Location <TbArrowsSort  /></th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentRecords.map((eachData) => (
                            <tr key={eachData.id} className='attendance-table-body'>
                                <td className='emp-name'>{eachData.empName}</td>
                                <td>{eachData.empCode}</td>
                                <td>{eachData.inTime}</td>
                                <td>{eachData.outTime}</td>
                                <td className='work-status-container'>
                                    <FaRegCircleDot className='work-status-icon'/>
                                    <select className='work-status'>
                                        <option>{eachData.workStatus}</option>
                                        <option>{eachData.workStatus==='Login'? 'Logout': 'Login'}</option>
                                    </select>
                                </td>
                                <td className='work-location'>{eachData.workLocation} <BsThreeDotsVertical className='location-icon'/></td>
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
                        <button className='arrow-btn' onClick={this.handleNextPage} disabled={(currentPage * recordsPerPage) >= attendanceDataList.length}><MdOutlineNavigateNext /></button>
                    </div>
                </div>
               
            </div>
            </div>
            </div>
            </div>
        );
    }
}

export default AttendanceData;