import {Component} from 'react'
import './User_Report.css'

import { TbArrowsSort } from "react-icons/tb";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import { FaRegCircleDot } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";

import user_g from '../../assets/user_g.png'
import user_b from '../../assets/user_b.png'

const userData = [];

  const role = [
    "Software Engineer",
    "Project Manager",
    "UI/UX Designer",
    "Data Analyst",
    "Machine Learning Engineer",
  ];
  
  class UserReport extends Component {
    state = {
      userDataList: userData,
      currentPage: 1,
      recordsPerPage: 10,
      sortColumn: null,
      isAscending: true,
      searchName: '',
      searchDept: '',
    };
  
    handleNextPage = () => {
      const { currentPage, recordsPerPage, userDataList } = this.state;
      if ((currentPage * recordsPerPage) < userDataList.length) {
        this.setState({ currentPage: currentPage + 1 });
      }
    };
  
    handlePreviousPage = () => {
      if (this.state.currentPage > 1) {
        this.setState({ currentPage: this.state.currentPage - 1 });
      }
    };
  
    sortData = (column) => {
      const { userDataList, isAscending, sortColumn } = this.state;
      const sortedList = [...userDataList].sort((a, b) => {
        const comparison = typeof a[column] === 'string'
          ? a[column].localeCompare(b[column])
          : a[column] - b[column];
        return (sortColumn === column && isAscending) ? -comparison : comparison;
      });
  
      this.setState({
        userDataList: sortedList,
        sortColumn: column,
        isAscending: sortColumn === column ? !isAscending : true,
      });
    };
  
    filterData = () => {
      const { searchName, searchDept } = this.state;
      const filteredList = userData.filter(({ username, role }) => {
        const matchesName = searchName ? username.toLowerCase().includes(searchName.toLowerCase()) : true;
        const matchesDept = searchDept ? role.toLowerCase().includes(searchDept.toLowerCase()) : true;
        return matchesName && matchesDept;
      });
  
      this.setState({ userDataList: filteredList, currentPage: 1 });
    };
  
    render() {
      const { userDataList, currentPage, recordsPerPage } = this.state;
      const indexOfLastRecord = currentPage * recordsPerPage;
      const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
      const currentRecords = userDataList.slice(indexOfFirstRecord, indexOfLastRecord);
      const startRecord = indexOfFirstRecord + 1;
      const endRecord = Math.min(indexOfLastRecord, userDataList.length);
      const totalRecords = userDataList.length;
  
      return (
        <div className="report-container">
          <p className='report-description'>Reporting / User Report</p>
          <h1 className='report-title'>User Report</h1>
          <p className='report-para'>Dashboard User Report</p>
  
          <div className='report-search-container'>
            <select
              value={this.state.searchName}
              onChange={(e) => this.setState({ searchName: e.target.value })}
              className='report-select'
            >
              <option value="" disabled selected>User</option>
              {userData.map((eachData) => (
                <option key={eachData.id} value={eachData.username}>{eachData.username}</option>
              ))}
            </select>
            <select
              value={this.state.searchDept}
              onChange={(e) => this.setState({ searchDept: e.target.value })}
              className='report-select'
            >
              <option value="" disabled selected>Role</option>
              {role.map((eachData) => (
                <option key={eachData} value={eachData}>{eachData}</option>
              ))}
            </select>
            <button onClick={this.filterData} className='report-search-btn'>SEARCH</button>
          </div>
          <br />
  
          <p className='report-para show-items-container'>
            Show <div className='show-count-container'>{currentRecords.length}</div> entries
          </p>
  
          <table>
            <thead>
              <tr className='attendance-table-heading'>
                <th className='emp-name' onClick={() => this.sortData('username')}>User Name <TbArrowsSort /></th>
                <th onClick={() => this.sortData('companyName')}>Company Name <TbArrowsSort /></th>
                <th onClick={() => this.sortData('email')}>Email <TbArrowsSort /></th>
                <th onClick={() => this.sortData('role')}>Role <TbArrowsSort /></th>
                <th onClick={() => this.sortData('status')}>Status <TbArrowsSort /></th>
                <th onClick={() => this.sortData('assignTo')}>Assign To <TbArrowsSort /></th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map(({ id, username, companyName, email, role, status, assignTo }) => (
                <tr key={id} className='attendance-table-body'>
                  <td>{username}</td>
                  <td>{companyName}</td>
                  <td>{email}</td>
                  <td>{role}</td>
                  <td className='work-status-container'>
                    <FaRegCircleDot className={`work-status-icon ${status}`} />
                    <select className='work-status'>
                      <option value={status}>{status}</option>
                      {status === 'active' ? <option>inactive</option> : <option>active</option>}
                    </select>
                  </td>
                  <td className='work-location'>
                    <img className='user-icon' src={assignTo} alt="userImg"/>
                    <BsThreeDotsVertical className='location-icon'/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
          <div className='count-container'>
            <p className='report-para out-of-container'>
              Showing {startRecord} to {endRecord} of {totalRecords} entries
            </p>
            <div className='pagination-controls'>
              <button className='arrow-btn' onClick={this.handlePreviousPage} disabled={currentPage === 1}>
                <MdOutlineNavigateBefore />
              </button>
              <span className='current-page'>{currentPage}</span>
              <button className='arrow-btn' onClick={this.handleNextPage} disabled={(currentPage * recordsPerPage) >= totalRecords}>
                <MdOutlineNavigateNext />
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
  
  export default UserReport;