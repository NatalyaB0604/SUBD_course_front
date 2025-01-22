import axios from 'axios';

const DEPARTMENTS_BASE_URL = "http://localhost:8080/vunder-kids/departments";

class DepartmentsService {
  getAllDepartments() {
    return axios.get(`${DEPARTMENTS_BASE_URL}/get-all`);
  }

  createDepartment(department) {
    return axios.post(`${DEPARTMENTS_BASE_URL}/save`, department);
  }

  getDepartmentById(departmentId){
    return axios.get(`${DEPARTMENTS_BASE_URL}/get/${departmentId}`);
  };

  addCourseToDepartment(departmentId, courseId) {
    return axios.post(`${DEPARTMENTS_BASE_URL}/${departmentId}/add-course/${courseId}`);
  }

  getCoursesByDepartmentId(departmentId){
    return axios.get(`${DEPARTMENTS_BASE_URL}/${departmentId}/courses`);
  }

  updateDepartment(departmentId, department) {
    return axios.put(`${DEPARTMENTS_BASE_URL}/update/${departmentId}`, department);
  }

  updateDepartmentsForCourse(courseId, departments) {
    return axios.put(`${DEPARTMENTS_BASE_URL}/${courseId}/update-departments`, departments);
  }

  deleteDepartment(departmentId) {
    return axios.delete(`${DEPARTMENTS_BASE_URL}/delete/${departmentId}`);
  }
}

const instance = new DepartmentsService();
export default instance;
