import axios from 'axios';

const DEPARTMENTS_BASE_URL = "http://localhost:8080/vunder-kids/departments";

class DepartmentsService {
  getCourses() {
    return axios.get(`${DEPARTMENTS_BASE_URL}/get-all`);
  }

  createCourses(courses) {
    return axios.post(`${DEPARTMENTS_BASE_URL}/save`, courses)
  }

  getCoursesById(id){
    return axios.get(`${DEPARTMENTS_BASE_URL}/get/${id}`);
  };

  updateCourses(courseId, courses) {
    return axios.put(`${DEPARTMENTS_BASE_URL}/update/${courseId}`, courses);
  }

  deleteCourses(courseId) {
    return axios.delete(`${DEPARTMENTS_BASE_URL}/delete/${courseId}`);
  }
}

const instance = new DepartmentsService();
export default instance;
