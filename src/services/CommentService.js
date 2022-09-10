import axios from "axios";
import config from "../../config/index";

export default class CommentService {
  static async GetComments(id, model) {
    const res = await axios.get(`${config.commentsUrl}/`, { params: { id, model } });
    return res.data;
  }

  static async CreateComment(comment) {
    const res = await axios.post(`${config.commentsUrl}/`, { comment });
    return res.data;
  }

  static async DeleteComment(id) {
    const res = await axios.delete(`${config.commentsUrl}/${id}`);
    return res.data;
  }
}