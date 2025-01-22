import axios from 'axios';

const PARENTS_BASE_URL = "http://localhost:8080/vunder-kids/parents";

class ParentsService {
  getParents() {
    return axios.get(`${PARENTS_BASE_URL}/get-all`);
  }

  createParents(parents) {
    return axios.post(`${PARENTS_BASE_URL}/save`, parents);
  }

  getParentsById(parentId) {
    return axios.get(`${PARENTS_BASE_URL}/get/${parentId}`);
  }

  updateParents(parentId, parents) {
    return axios.put(`${PARENTS_BASE_URL}/update/${parentId}`, parents);
  }

  deleteParents(parentId) {
    return axios.delete(`${PARENTS_BASE_URL}/delete/${parentId}`);
  }
}

const instance = new ParentsService();
export default instance;
