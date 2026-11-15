import axios from "axios";

const api = axios.create({
    baseURL: "https://agrovision-api-68vv.onrender.com/",
    timeout: 70000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;
