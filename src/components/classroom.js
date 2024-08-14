// src/components/Classroom.js
import React, { useState } from 'react';
import axios from 'axios';

const Classroom = () => {
    const [name, setName] = useState('');
    const [teacherId, setTeacherId] = useState('');

    const handleCreateClassroom = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/classroom/create', { name, teacherId }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Handle success
        } catch (error) {
            console.error('Error creating classroom', error);
        }
    };

    return (
        <div>
            <h2>Create Classroom</h2>
            <form onSubmit={handleCreateClassroom}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Classroom Name"
                    required
                />
                <input
                    type="text"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    placeholder="Teacher ID"
                    required
                />
                <button type="submit">Create Classroom</button>
            </form>
        </div>
    );
};

export default Classroom;
