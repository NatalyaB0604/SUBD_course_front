import axios from 'axios';

const CHILDREN_BASE_URL = "http://localhost:8080/vunder-kids/children";

class ChildrenService {
  getAllChildren() {
    return axios.get(`${CHILDREN_BASE_URL}/get-all`);
  }

  getChildrenById(childId) {
    return axios.get(`${CHILDREN_BASE_URL}/get/${childId}`);
  }

  getChildrenByParentId(parentId) {
    return axios.get(`${CHILDREN_BASE_URL}/get-by-parent/${parentId}`);
  }

  getChildrenByParentPhoneNumber(phoneNumber) {
    return axios.get(`${CHILDREN_BASE_URL}/get-by-parent-phone/${phoneNumber}`);
  }

  saveChildren(parentId, children) {
    return axios.post(`${CHILDREN_BASE_URL}/save/${parentId}`, children);
  }

  updateChildren(childId, children, parentId) {
    return axios.put(`${CHILDREN_BASE_URL}/update/${childId}`, children, {
      params: { parentId },
    });
  }

  deleteChildren(childId) {
    return axios.delete(`${CHILDREN_BASE_URL}/delete/${childId}`);
  }
}

const instance = new ChildrenService();
export default instance;
