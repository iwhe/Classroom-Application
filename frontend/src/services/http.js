import axios from "axios";

export const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 50000,
  timeoutErrorMessage: "Server timeout",
  withCredentials: true,
});
