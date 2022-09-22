import axios from "axios";

export const IP = "localhost";
export const PORT = 8892;

export const request = axios.create({
  baseURL: `http://${IP}:${PORT}`,
});
