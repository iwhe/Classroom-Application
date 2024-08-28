import React, { useEffect, useState } from "react";
import { getAllStudents } from "../services/users";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchuser = async () => {
      try {
        setLoading(true);
        const studentsData = await getAllStudents();
        setStudents(studentsData.data.data);
        console.log(students);
      } catch (error) {
        console.log("Error getting student data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchuser();
  }, []);

  return (
    <div className="studentWrapper px-4 flex flex-col w-full justify-between text-center items-center">
      <div className="p-4 border-b border-gray-300 font-bold uppercase text-green-700 font-serif text-xl">
        All the Students in School
      </div>
      <div className="flex w-full md:w-9/12 mt-4 p-4 bg-customBlue rounded-xl flex-col">
        <div className="flex flex-row justify-around w-full text-gray-700 text-sm md:text-lg font-bold uppercase">
          <div className="flex-1 text-center">Serial No.</div>
          <div className="flex-1 text-center">Student Name</div>
          <div className="flex-1 text-center">Email</div>
          <div className="flex-1 text-center">Student Class</div>
        </div>
        <div className="flex flex-col  w-full">
          {students.map((student, index) => (
            <div
              key={student._id}
              className="flex flex-row justify-around w-full items-center text-center p-4 border-b border-gray-300"
            >
              <div className="flex-1 flex items-center justify-center">
                {" "}
                {index + 1}
              </div>
              <div className="flex-1 flex items-center justify-center">
                {student.name}
              </div>
              <div className="flex-1 flex items-center justify-center">
                {student.email}
              </div>
              <div className="flex-1 flex items-center justify-center">
                {student.classAssigned}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentList;
