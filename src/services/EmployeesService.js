import axios from 'axios';

const EMPLYEES_BASE_URL = "http://localhost:8080/vunder-kids/employees";

class EmployeesService {
  getAllEmplyees() {
    return axios.get(`${EMPLYEES_BASE_URL}/get-all`);
  }

  createEmployee(employee) {
    return axios.post(`${EMPLYEES_BASE_URL}/save`, employee);
  }

  getEmployeeById(employeeId) {
    return axios.get(`${EMPLYEES_BASE_URL}/get/${employeeId}`);
  }

  updateEmployee(employeeId, employee) {
    return axios.put(`${EMPLYEES_BASE_URL}/update/${employeeId}`, employee);
  }

  deleteEmployee(employeeId) {
    return axios.delete(`${EMPLYEES_BASE_URL}/delete/${employeeId}`);
  }
}

export default new EmployeesService();
