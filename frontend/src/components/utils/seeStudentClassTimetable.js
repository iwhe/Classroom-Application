import React, { useState, useEffect } from "react";
import { getTimetable } from "../../services/timeTable.services";

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const timeResponse = await getTimetable();
        setTimetable(timeResponse.data.data);
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 404:
              setError(
                "Not Found: Timetable for this class has not been created."
              );
              break;
            case 500:
              setError("Server Error: Something went wrong on the server.");
              break;
            default:
              setError("An unexpected error occurred.");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full p-4 text-center flex flex-col justify-center item-center">
      <p className="font-bold p-2 text-3xl font-serif text-amber-500 uppercase">
        Timetable
      </p>
      {error && (
        <div className="bg-red-500 p-2 rounded-2xl text-white text-center">
          {error}
        </div>
      )}
      {timetable && (
        <div className="timeWrapper flex flex-col relative items-center justify-center  w-full mt-4 bg-neutral-300 rounded-2xl p-2 py-6">
          <p className="font-bold p-2 text-xl font-serif text-rose-800 capitalise">
            Class Name: {timetable.classroomName.name}
          </p>
          <div className="timeTable flex flex-col justify-center items-center relative w-full ">
            <p className="p-2 text-xl font-serif text-green-800 capitalise">
              No. of lectures: {timetable.lectureCount}
            </p>
            <table className="w-full bg-white relative md:w-9/12 ">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left  text-sm font-medium text-gray-500 uppercase tracking-wider">
                    S.No.
                  </th>
                  <th className="px-6 py-3 text-left  text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Lecture
                  </th>
                  <th className="px-6 py-3 text-left  text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left  text-sm font-medium text-gray-500 uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left  text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Lecturer
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timetable.lectures.map((lecture, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lecture.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lecture.startTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lecture.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lecture.teacher}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTimetable;
