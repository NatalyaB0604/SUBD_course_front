import axios from 'axios';

const PRICING_BASE_URL = "http://localhost:8080/vunder-kids/course-pricing";

class CoursePricingService {
  getCoursePricing() {
    return axios.get(`${PRICING_BASE_URL}/get-all`);
  }

  createCoursePricing(coursePricing) {
    return axios.post(`${PRICING_BASE_URL}/save`, coursePricing)
  }

  getCoursePricingById(coursePricingId) {
    return axios.get(`${PRICING_BASE_URL}/get/${coursePricingId}`);
  }

  getCoursePricingByCourseId(courseId) {
    return axios.get(`${PRICING_BASE_URL}/course/${courseId}`);
  }

  updateCoursePricing(coursePricingId, coursePricing) {
    return axios.put(`${PRICING_BASE_URL}/update/${coursePricingId}`, coursePricing);
  }

  deleteCoursePricing(coursePricingId) {
    return axios.delete(`${PRICING_BASE_URL}/delete/${coursePricingId}`);
  }
}

const instance = new CoursePricingService();
export default instance;
