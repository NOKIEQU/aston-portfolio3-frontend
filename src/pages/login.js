import { useState } from 'react';
import { useRouter } from 'next/router';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [show, isShow] = useState(false)
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": username,
                    "password": password
                })
            });

            if (!response.ok) {
                isShow(true);
                return
            }
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/');
            console.log('Login successful');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className='flex flex-col h-screen gap-4 p-10'>
      <h1>Email: testuser@email.com Password: 123123</h1>

            <h1 className='text-3xl'>Login</h1>
            <div>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='w-[300px] border border-black rounded-md p-1'
                    placeholder='Enter your Email'
                    required={true}
                />
            </div>
            <div>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-[300px] border border-black rounded-md p-1'
                    placeholder='Enter your password'
                    required={true}
                />
            </div>
            <button className='w-[300px] bg-black text-white p-1 rounded-md' onClick={handleLogin}>Login</button>
            {show && <p className='text-red-400'>Your email or password are incorrect or empty.</p>}
        </div>
    );
};

export default LoginPage;