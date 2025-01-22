import axios from 'axios';

const ADVANTAGES_BASE_URL = "http://localhost:8080/vunder-kids/course-advantages";

class CourseAdvantagesService {
  getCourseAdvantages() {
    return axios.get(`${ADVANTAGES_BASE_URL}/get-all`);
  }

  createCourseAdvantage(courseAdvantages) {
    return axios.post(`${ADVANTAGES_BASE_URL}/save`, courseAdvantages)
  }

  getCourseAdvantageById(courseAdvantageId) {
    return axios.get(`${ADVANTAGES_BASE_URL}/get/${courseAdvantageId}`);
  }

  getCourseAdvantagesByCourseId(courseId) {
    return axios.get(`${ADVANTAGES_BASE_URL}/course/${courseId}`);
  }

  updateCourseAdvantage(courseAdvantageId, courseAdvantages) {
    return axios.put(`${ADVANTAGES_BASE_URL}/update/${courseAdvantageId}`, courseAdvantages);
  }

  deleteCourseAdvantage(courseAdvantageId) {
    return axios.delete(`${ADVANTAGES_BASE_URL}/delete/${courseAdvantageId}`);
  }
}

const instance = new CourseAdvantagesService();
export default instance;
