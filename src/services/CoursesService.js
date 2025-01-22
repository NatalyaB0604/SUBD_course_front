import axios from 'axios';

const COURSES_BASE_URL = "http://localhost:8080/vunder-kids/courses";

class CoursesService {
  getCourses() {
    return axios.get(`${COURSES_BASE_URL}/get-all`);
  }

  createCourses(courses) {
    return axios.post(`${COURSES_BASE_URL}/save`, courses)
  }

  getCoursesById(id){
    return axios.get(`${COURSES_BASE_URL}/get/${id}`);
  };

  updateCourses(courseId, courses) {
    return axios.put(`${COURSES_BASE_URL}/update/${courseId}`, courses);
  }

  deleteCourses(courseId) {
    return axios.delete(`${COURSES_BASE_URL}/delete/${courseId}`);
  }
}

const instance = new CoursesService();
export default instance;
