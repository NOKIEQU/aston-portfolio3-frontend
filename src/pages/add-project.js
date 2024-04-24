import { useState } from 'react';

const AddProject = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [phase, setPhase] = useState('design');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(false)

        // Validate form fields
        if (!title || !description || !startDate || !endDate || !phase) {
            setError('All fields are required');
            return;
        }

        const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';
        try {
            const response = await fetch('http://localhost:3000/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    "title": title,
                    "description": description,
                    "startDate": startDate,
                    "endDate": endDate,
                    "phase": phase,
                    "uid": userId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add project');
            }

            setSuccess(true)
            setError("")

        } catch (error) {
            console.error('Error adding project:', error);
            setError('Failed to add project');
        }
    };

    return (
        <div className='w-full h-screen p-10'>
            <h1 className='text-3xl'>Add New Project</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='w-[300px] border border-black rounded-md p-1 my-2'
                        placeholder='Title'
                    />
                </div>
                <div>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='w-[300px] border border-black rounded-md p-1 my-2'
                        placeholder='Description'
                    />
                </div>
                <div>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className='w-[300px] border border-black rounded-md p-1 my-2'
                        placeholder='Start Date'
                    />
                </div>
                <div>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className='w-[300px] border border-black rounded-md p-1 my-2'
                        placeholder='End Date'
                    />
                </div>
                <div className='flex flex-col justify-center'>
                    <label htmlFor="phase">Phase:</label>
                    <select
                        id="phase"
                        value={phase}
                        onChange={(e) => setPhase(e.target.value)}
                        className='w-[300px] border border-black rounded-md p-1 my-2'
                    >
                        <option value="design">Design</option>
                        <option value="development">Development</option>
                        <option value="testing">Testing</option>
                        <option value="deployment">Deployment</option>
                        <option value="complete">Complete</option>
                    </select>
                </div>
                <button className='w-[300px] bg-black text-white p-1 rounded-md my-2' type="submit">Add Project</button>
                {error && <p>{error}</p>}
                {success && <p>New project was added!</p>}
            </form>
        </div>
    );
};

export default AddProject;