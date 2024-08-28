import { http } from "./http";

export const getTimetable = async () => {
  return http.get("/timetable/view");
};

export const createTimetablewithClassID = async (data) => {
  return http.post("/timetable/create", data);
};
