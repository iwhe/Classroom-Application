import { http } from "./http";

export const getClassRoomDetails = async (id) => {
  return http.get(`/classroom/${id}`);
};

export const deleteClassroom = async (id) => {
  return http.delete(`/classroom/${id}`);
};

export const classroomLists = async () => {
  return http.get("/classroom");
};

export const createClassroom = async (classData) => {
  return http.post("/classroom/create", classData);
};

export const updateClass = async (id, updatedData) => {
  console.log("update---", updatedData);
  return http.put(`/classroom/update/${id}`, updatedData);
};

export const allStudentInUserClassroom = async () => {
  return http.get("/classroom/allStudentInClass");
};

export const getClassProfile = async (id) => {
  return http.get(`/classroom/viewClassroomProfile/${id}`);
};
