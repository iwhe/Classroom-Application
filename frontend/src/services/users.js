import { http } from "./http";

export const handleLogin = async (data) => {
  return http.post(`/auth/login`, data);
};

export const handleRegister = async (userData) => {
  console.log("user data===", userData);
  return http.post("/auth/register", userData);
};

export const getCurrentUser = async () => {
  return http.get("/auth/me");
};

export const getAllUsers = async () => {
  return http.get("/user");
};

export const getAllStudents = async () => {
  return http.get("/user/students");
};

export const getAllTeachers = async () => {
  return http.get("/user/teachers");
};

export const logOutUser = async () => {
  return http.post("/auth/logout", {});
};

export const removeUserFromClass = async (id) => {
  return http.put(`user/student/removeClass/${id}`);
};

export const deleteStudent = async (id) => {
  return http.delete(`/user/student/${id}`);
};

export const deleteTeacher = async (id) => {
  return http.delete(`user/teacher/${id}`);
};
