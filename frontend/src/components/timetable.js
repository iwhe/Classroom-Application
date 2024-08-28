import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/timetable.css";
import { createTimetablewithClassID } from "../services/timeTable.services";

const Timetable = () => {
  // const [classroomName, setClassroomName] = useState("");
  const [numLectures, setNumLectures] = useState(1);
  const [lectures, setLectures] = useState([
    { name: "", startTime: "", endTime: "", teacher: "" },
  ]);
  const classroomName = useParams().classroom;
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const handleNumLecturesChange = (e) => {
    const number = parseInt(e.target.value, 10);
    setNumLectures(number);
    const newLectures = [];
    for (let i = 0; i < number; i++) {
      newLectures.push({ name: "", startTime: "", endTime: "", teacher: "" });
    }
    setLectures(newLectures);
  };

  const handleLectureChange = (index, field, value) => {
    const newLectures = [...lectures];
    newLectures[index][field] = value;
    setLectures(newLectures);
  };

  const handleCreateTimetable = async (e) => {
    e.preventDefault();
    try {
      await createTimetablewithClassID({
        classroomName,
        numLectures,
        lectures,
      });
      window.alert("Time Table Created Successfully!");
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrors(
          " Validation Error: Missing required fields. All fields required"
        );
      } else if (error.response && error.response.status === 404) {
        setErrors("Not found: Classroom does not exist!");
      } else if (error.response && error.response.status === 409) {
        setErrors("Server Error: Timetable cannot be created");
      } else {
        setErrors("Error creating timetable", error);
      }
    }
  };

  return (
    <div className="timetable">
      <h2 className="font-bold text-xl uppercase font-serif">
        {" "}
        Create Timetable
      </h2>
      <div className="error-container" style={{ color: "red" }}>
        <p className="error-message">{errors}</p>
      </div>
      <form
        className="timetable-form w-full md:w-9/12"
        onSubmit={handleCreateTimetable}
      >
        <div>
          <div className="timetable-class font-bold text-amber-400 p-6 uppercase ">
            <p>
              Class: <span>{classroomName}</span>{" "}
            </p>
          </div>

          <div className="flex flex-col gap-4 ">
            <label>No. of Lectures:</label>
            <input
              type="number"
              value={numLectures}
              onChange={handleNumLecturesChange}
              min="1"
              required
            />

            {lectures.map((lecture, index) => (
              <div
                className="lecture flex flex-col md:flex-row gap-2 w-full"
                key={index}
              >
                <h4 className="font-bold">Lecture {index + 1}</h4>

                <input
                  type="text"
                  placeholder="Name"
                  value={lecture.name}
                  onChange={(e) =>
                    handleLectureChange(index, "name", e.target.value)
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Teacher"
                  value={lecture.teacher}
                  onChange={(e) =>
                    handleLectureChange(index, "teacher", e.target.value)
                  }
                  required
                />
                <div className="flex flex-row w-full justify-around">
                  <label className="text-sm">
                    Starting Time
                    <input
                      type="time"
                      placeholder="Start Time"
                      value={lecture.startTime}
                      onChange={(e) =>
                        handleLectureChange(index, "startTime", e.target.value)
                      }
                      required
                    />
                  </label>
                  <label className="text-sm">
                    Ending Time
                    <input
                      type="time"
                      placeholder="End Time"
                      value={lecture.endTime}
                      onChange={(e) =>
                        handleLectureChange(index, "endTime", e.target.value)
                      }
                      required
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button type="submit">Create Timetable</button>
      </form>
    </div>
  );
};

export default Timetable;
