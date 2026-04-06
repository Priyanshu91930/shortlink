import api from "./api";

const userService = {
  getApiKey: async () => {
    const response = await api.get("/user/api-key");
    return response.data;
  },
  generateApiKey: async () => {
    const response = await api.post("/user/api-key/generate");
    return response.data;
  },
};

export default userService;
