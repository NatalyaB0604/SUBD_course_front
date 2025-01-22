import axios from 'axios';

const CATEGORY_BASE_URL = "http://localhost:8080/vunder-kids/age-category";

class AgeCategoryService {
  getAgeCategories() {
    return axios.get(`${CATEGORY_BASE_URL}/get-all`);
  }

  createAgeCategory(ageCategory) {
    return axios.post(`${CATEGORY_BASE_URL}/save`, ageCategory)
  }

  getAgeCategoryById(cageCategoryId) {
    return axios.get(`${CATEGORY_BASE_URL}/get/${cageCategoryId}`);
  }

  getAgeCategoryByCourseId(courseId) {
    return axios.get(`${CATEGORY_BASE_URL}/course/${courseId}`);
  }

  updateAgeCategory(ageCategoryId, ageCategory) {
    return axios.put(`${CATEGORY_BASE_URL}/update/${ageCategoryId}`, ageCategory);
  }

  deleteAgeCategory(ageCategoryId) {
    return axios.delete(`${CATEGORY_BASE_URL}/delete/${ageCategoryId}`);
  }
}

const instance = new AgeCategoryService();
export default instance;
