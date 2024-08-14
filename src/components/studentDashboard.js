// src/components/StudentDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
    const [students, setStudents] = useState([]);
    const [timetable, setTimetable] = useState([]);

    useEffect(() => {
        // Fetch students
        axios.get('/api/users?role=student').then(res => setStudents(res.data));
        // Fetch timetable if applicable
    }, []);

    return (
        <div>
            <h1>Student Dashboard</h1>
            <h2>Classmates</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student._id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentDashboard;
