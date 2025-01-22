import axios from 'axios';

const SIGNUPS_BASE_URL = "http://localhost:8080/vunder-kids/sign-ups";
const CHILDREN_BASE_URL = "http://localhost:8080/vunder-kids/children";
const COURSES_BASE_URL = "http://localhost:8080/vunder-kids/courses";

class SignUpsService {

  createSignUp(courseId, parentId, childId, signUp) {
    return axios.post(`${SIGNUPS_BASE_URL}/save/${courseId}/${parentId}/${childId}`, signUp);
  }

  getSignUpById(signUpId) {
    return axios.get(`${SIGNUPS_BASE_URL}/get/${signUpId}`);
  }

  getAllSignUps() {
    return axios.get(`${SIGNUPS_BASE_URL}/get-all`);
  }

  getSignUpsByParentId(parentId) {
    return axios.get(`${SIGNUPS_BASE_URL}/parent/${parentId}`);
  }

  getSignUpsByChildId(childId) {
    return axios.get(`${SIGNUPS_BASE_URL}/child/${childId}`);
  }

  getSignUpsByCourseId(courseId) {
    return axios.get(`${SIGNUPS_BASE_URL}/course/${courseId}`);
  }

  confirmSignUp(signUpId) {
    return axios.put(`${SIGNUPS_BASE_URL}/confirm/${signUpId}`);
  }

  cancelSignUp(signUpId) {
    return axios.put(`${SIGNUPS_BASE_URL}/cancel/${signUpId}`);
  }

  deleteSignUp(signUpId) {
    return axios.delete(`${SIGNUPS_BASE_URL}/delete/${signUpId}`);
  }

  getChildById(childId) {
    return axios.get(`${CHILDREN_BASE_URL}/get/${childId}`);
  }

  getCourseById(courseId) {
    return axios.get(`${COURSES_BASE_URL}/get/${courseId}`);
  }

  getParentById(parentId) {
    return axios.get(`http://localhost:8080/vunder-kids/parents/get/${parentId}`);
  }
}

const instance = new SignUpsService();
export default instance;
