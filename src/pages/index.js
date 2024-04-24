import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [userId, setUserId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data.projects);

        // Get user ID from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserId(parsedUserData.uid);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSeeMore = (project) => {
    router.push({
      pathname: '/project-details',
      query: { project: JSON.stringify(project) },
    });
  };

  const handleEditProject = (project) => {
    router.push({
      pathname: '/edit-project',
      query: { project: JSON.stringify(project) },
    });
  };

  return (
    <div>
      {projects.map(project => (
        <div className="flex flex-col justify-between w-1/2 my-10 bg-gray-300 p-4 rounded-md" key={project.pid}>
          <h2><b>Title:</b> {project.title}</h2>
          <p><b>Description: </b>{project.description}</p>
          <p><b>Start Date: </b>{new Date(project.start_date).toLocaleDateString()}</p>
          {userId === project.userId && (
            <button onClick={() => handleEditProject(project)} className="w-[120px] bg-blue-500 text-white p-1 rounded-md self-end">Edit Project</button>
          )}
          <button onClick={() => handleSeeMore(project)} className="w-[120px] bg-black text-white p-1 rounded-md self-end">See more</button>
        </div>
      ))}
    </div>
  );
};


const SearchProjects = () => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title.trim(),
          startDate: startDate.trim() ? new Date(startDate) : ''
        })
      });

      if (!response.ok) {
        throw new Error('Failed to search projects');
      }

      const data = await response.json();
      setProjects(data.projects);

      if (data.projects.length === 0) {
        setError('No projects found');
      }
    } catch (error) {
      console.error('Error searching projects:', error);
      setError('No Projects Found');
    } finally {
      setLoading(false);
    }
  };

  const handleSeeMore = (project) => {
    router.push({
      pathname: '/project-details',
      query: { project: JSON.stringify(project) },
    });
  };

  return (
    <div>
      <h1 className="text-2xl">Filter Projects</h1>
      <div className="my-5">
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='w-[300px] border border-black rounded-md p-1'
          placeholder="Title"
        />
      </div>
      <div className="my-5">
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className='w-[300px] border border-black rounded-md p-1'
          placeholder="Date"
        />
      </div>
      <button className='w-[300px] bg-black text-white p-1 rounded-md' onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search Projects'}
      </button>
      {error && <p>{error}</p>}
      {projects.length > 0 ? (
        <div>
          <h2>Projects Found:</h2>
          {projects.map(project => (
            <div key={project.pid}>
              <div className="flex flex-col justify-between w-1/2 my-10 bg-gray-300 p-4 rounded-md" key={project.pid}>
                <h2><b>Title:</b> {project.title}</h2>
                <p><b>Description: </b>{project.description}</p>
                <p><b>Start Date: </b>{new Date(project.start_date).toLocaleDateString()}</p>
                <button onClick={() => handleSeeMore(project)} className="w-[120px] bg-black text-white p-1 rounded-md self-end">See more</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p></p>
      )}
    </div>
  );
};


const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleLogout = () => {
    // Clear token and user data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    // Redirect to login page
    router.push('/login');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        // User is logged in
        const userData = JSON.parse(localStorage.getItem('user'));
        setUsername(userData.username);
        setLoggedIn(true);
      }
    }
  }, []);

  if (loggedIn) {
    return (
      <div className="flex flex-col h-screen gap-4 p-10">
        <div className="flex flex-row justify-end gap-x-5">
          <h1>Welcome, {username}</h1>
          <Link href={"/add-project"} className="w-[100px] bg-black text-white p-1 rounded-md">Add Project</Link>
          <button onClick={handleLogout} className="w-[100px] bg-black text-white p-1 rounded-md">Logout</button>
        </div>
      <h1>Email: testuser@email.com Password: 123123</h1>
        <h1 className="text-2xl">Projects</h1>
        <Projects />
        <SearchProjects />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen gap-4 p-10">
      <div className="flex flex-row justify-end gap-x-2">
        <Link href={"/login"} className="w-[100px] bg-black text-white p-1 rounded-md">
          Login
        </Link>
        <Link href={"/register"} className="w-[100px] bg-black text-white p-1 rounded-md">
          Register
        </Link>
      </div>
      <h1>Email: testuser@email.com Password: 123123</h1>
      <h1 className="text-2xl">Projects</h1>
      <Projects />
      <SearchProjects />
    </div>
  );
};



export default Home;