// src/components/Timetable.js
import React, { useState } from 'react';
import axios from 'axios';

const Timetable = () => {
    const [classroomId, setClassroomId] = useState('');
    const [timetable, setTimetable] = useState([]);

    const handleCreateTimetable = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/timetable/create', { classroomId, timetable }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Handle success
        } catch (error) {
            console.error('Error creating timetable', error);
        }
    };

    return (
        <div>
            <h2>Create Timetable</h2>
            <form onSubmit={handleCreateTimetable}>
                <input
                    type="text"
                    value={classroomId}
                    onChange={(e) => setClassroomId(e.target.value)}
                    placeholder="Classroom ID"
                    required
                />
                <textarea
                    value={JSON.stringify(timetable)}
                    onChange={(e) => setTimetable(JSON.parse(e.target.value))}
                    placeholder="Timetable (JSON format)"
                    required
                />
                <button type="submit">Create Timetable</button>
            </form>
        </div>
    );
};

export default Timetable;
