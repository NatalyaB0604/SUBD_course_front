import axios from 'axios';

const REVIEWS_BASE_URL = "http://localhost:8080/vunder-kids/reviews";

class ReviewsService {
  getAllReviews() {
    return axios.get(`${REVIEWS_BASE_URL}/get-all`);
  }

  createReview(courseId, parentId, review) {
    return axios.post(`${REVIEWS_BASE_URL}/save/${courseId}/${parentId}`, review);
  }

  getReviewById(reviewId) {
    return axios.get(`${REVIEWS_BASE_URL}/get/${reviewId}`);
  }

  getReviewByCourseId(courseId) {
    return axios.get(`${REVIEWS_BASE_URL}/course/${courseId}`);
  }

  getReviewByParentId(parentId) {
    return axios.get(`${REVIEWS_BASE_URL}/parent/${parentId}`);
  }

  updateReview(reviewId, reviews) {
    return axios.put(`${REVIEWS_BASE_URL}/update/${reviewId}`, reviews);
  }

  deleteReview(reviewId) {
    return axios.delete(`${REVIEWS_BASE_URL}/delete/${reviewId}`);
  }
}

const instance = new ReviewsService();
export default instance;
