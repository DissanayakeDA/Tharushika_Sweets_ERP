import React, { useState, useEffect } from "react";
import HRNav from "../HRNav/HRNav";
import axios from "axios";
import "./ViewEmployee.css";
import HeadBar from "../HeadBar/HeadBar";
import { useNavigate } from "react-router-dom";

function ViewEmployees() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:5000/api/employee");
      if (response.data.success) {
        setData(response.data.data);
        setFilteredData(response.data.data);
      } else {
        setError("Failed to fetch employees.");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Error fetching employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = data.filter((employee) =>
      employee.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleEdit = (id) => {
    console.log("Navigating to edit employee with ID:", id);
    navigate(`/updateemployee/${id}`);
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/employee/${employeeToDelete._id}`
      );
      if (response.data.success) {
        fetchData();
        setError(null);
      } else {
        setError(response.data.message || "Failed to delete employee.");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError(error.response?.data?.message || "Error deleting employee.");
    } finally {
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleNameClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsPopup(true);
  };

  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedEmployee(null);
  };

  return (
    <div>
      <HRNav />
      <HeadBar />
      <div className="HRViewStockContainer">
        <div className="HRHeader">
          <h2 className="HRViewStockTitle">View Employees</h2>

          <div className="HRSearchContainer">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearch}
              className="HRSearchInput"
            />
          </div>

          {loading && <p>Loading data...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="HRTableContainer">
            <table className="HRViewStockTable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile No</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>NIC No</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      {searchTerm
                        ? "No matching employees found"
                        : "No employees available"}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((employee) => (
                    <tr key={employee._id}>
                      <td>
                        <span
                          className="HREmployeeName"
                          onClick={() => handleNameClick(employee)}
                        >
                          {employee.name}
                        </span>
                      </td>
                      <td>{employee.mobileNo}</td>
                      <td>{employee.position}</td>
                      <td>{employee.salary}</td>
                      <td>{employee.nicNo}</td>
                      <td>{employee.address}</td>
                      <td>
                        <div className="HRActionIcons">
                          <button
                            className="HRAction"
                            onClick={() => handleEdit(employee._id)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="HRAction"
                            onClick={() => handleDeleteClick(employee)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="HRModalOverlay">
          <div className="HRModalContent">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{employeeToDelete?.name}</strong> (NIC:{" "}
              {employeeToDelete?.nicNo})?
            </p>
            <div className="HRModalButtons">
              <button className="HRModalBtn HRCancelBtn" onClick={cancelDelete}>
                Cancel
              </button>
              <button
                className="HRModalBtn HRDeleteBtn"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Details Popup */}
      {showDetailsPopup && selectedEmployee && (
        <div className="HRModalOverlay">
          <div className="HRModalContent">
            <h3>Employee Details</h3>
            <div className="HREmployeeDetails">
              <p>
                <strong>Name:</strong> {selectedEmployee.name}
              </p>
              <p>
                <strong>Mobile No:</strong> {selectedEmployee.mobileNo}
              </p>
              <p>
                <strong>Position:</strong> {selectedEmployee.position}
              </p>
              <p>
                <strong>Salary:</strong> {selectedEmployee.salary}
              </p>
              <p>
                <strong>Bank Account No:</strong>{" "}
                {selectedEmployee.bankAccountNo}
              </p>
              <p>
                <strong>Bank:</strong> {selectedEmployee.bank}
              </p>
              <p>
                <strong>Branch:</strong> {selectedEmployee.branch}
              </p>
              <p>
                <strong>NIC No:</strong> {selectedEmployee.nicNo}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {new Date(selectedEmployee.dateOfBirth).toLocaleDateString()}
              </p>
              <p>
                <strong>Address:</strong> {selectedEmployee.address}
              </p>
            </div>
            <div className="HRModalButtons">
              <button
                className="HRModalBtn HRCancelBtn"
                onClick={closeDetailsPopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewEmployees;
