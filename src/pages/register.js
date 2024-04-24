import { useState } from 'react';
import { useRouter } from 'next/router';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [show, isShow] = useState(false)
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username": username,
                    "email": email,
                    "password": password,
                    "confirmPassword": confirmPassword

                })
            });

            if (!response.ok) {
                isShow(true);
                return
            }
            router.push('/login');
            console.log('Register successful');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className='flex flex-col h-screen gap-4 p-10'>
            <h1 className='text-3xl'>Register</h1>
            <div>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='w-[300px] border border-black rounded-md p-1'
                    placeholder='Enter your Username'
                    required={true}
                />
            </div>
            <div>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
            <div>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='w-[300px] border border-black rounded-md p-1'
                    placeholder='Confirm your password'
                    required={true}
                />
            </div>
            <button className='w-[300px] bg-black text-white p-1 rounded-md' onClick={handleLogin}>Register</button>
            {show && <p className='text-red-400'>Something went wrong.</p>}
        </div>
    );
};

export default RegisterPage;