// src/components/TeacherDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeacherDashboard = () => {
    const [students, setStudents] = useState([]);
    const [timetable, setTimetable] = useState([]);

    useEffect(() => {
        // Fetch data
        axios.get('/api/users?role=student').then(res => setStudents(res.data));
        // Fetch timetable if applicable
    }, []);

    const handleDeleteStudent = async (studentId) => {
        await axios.delete(`/api/users/${studentId}`);
        setStudents(students.filter(student => student._id !== studentId));
    };

    return (
        <div>
            <h1>Teacher Dashboard</h1>
            <h2>Students</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student._id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td><button onClick={() => handleDeleteStudent(student._id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeacherDashboard;
