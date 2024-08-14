// src/components/PrincipalDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PrincipalDashboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [classrooms, setClassrooms] = useState([]);

    useEffect(() => {
        // Fetch data
        axios.get('/api/users?role=teacher').then(res => setTeachers(res.data));
        axios.get('/api/users?role=student').then(res => setStudents(res.data));
        axios.get('/api/classrooms').then(res => setClassrooms(res.data));
    }, []);

    const handleDelete = async (userId) => {
        await axios.delete(`/api/users/${userId}`);
        // Refresh data after deletion
        setTeachers(teachers.filter(teacher => teacher._id !== userId));
        setStudents(students.filter(student => student._id !== userId));
    };

    return (
        <div>
            <h1>Principal Dashboard</h1>
            <h2>Teachers</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map(teacher => (
                        <tr key={teacher._id}>
                            <td>{teacher.name}</td>
                            <td>{teacher.email}</td>
                            <td><button onClick={() => handleDelete(teacher._id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
                            <td><button onClick={() => handleDelete(student._id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Classrooms</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Teacher</th>
                        <th>Students</th>
                    </tr>
                </thead>
                <tbody>
                    {classrooms.map(classroom => (
                        <tr key={classroom._id}>
                            <td>{classroom.name}</td>
                            <td>{classroom.teacher ? classroom.teacher.name : 'None'}</td>
                            <td>{classroom.students.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PrincipalDashboard;
