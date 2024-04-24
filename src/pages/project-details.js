import { useState, useEffect } from "react";

const ProjectDetails = ({ project }) => {
    const parsedProject = JSON.parse(project);

    const [user, setUser] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://142.93.46.22:3000/getuser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ uid: parsedProject.userId })
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }
                const data = await response.json();
                setUser(data.user);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);


    return (
        <div className="flex flex-col justify-between w-1/2 m-10 bg-gray-300 p-4 rounded-md gap-5">
            <h2 className="text-5xl">Title: {parsedProject.title}</h2>
            <p><b>Description:</b> {parsedProject.description}</p>
            <p><b>Start Date:</b> {new Date(parsedProject.start_date).toLocaleDateString()}</p>
            <p><b>End Date:</b> {new Date(parsedProject.end_date).toLocaleDateString()}</p>
            <p><b>Phase:</b> {parsedProject.phase}</p>
            <p><b>Author ID:</b> {user.email}</p>
        </div>
    );
};

export async function getServerSideProps(context) {
    const { query } = context;
    const { project } = query;
    return {
        props: {
            project,
        },
    };
}

export default ProjectDetails;