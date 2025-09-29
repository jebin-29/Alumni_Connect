import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils/utils';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        collegeEmail: '',
        password: '',
    });
    const [userType, setUserType] = useState('student');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setLoginInfo({
            ...loginInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { collegeEmail, password } = loginInfo;
        if (!collegeEmail || !password) {
            handleError('Please fill all the fields');
            return;
        }

        const url = userType === 'alumni'
            ? `${import.meta.env.VITE_API_BASE_URL}/api/alumni/login` 
            : `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginInfo),
            });
            const result = await response.json();
            const { success, message, token, fullname, profilePhoto, _id } = result;

            if (success) {
                handleSuccess(message);

                const userData = {
                    fullName: fullname,
                    _id: _id,
                    profilePhoto: profilePhoto,
                    isAlumni: userType === 'alumni'
                };

                await login(userData, token);

                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            } else {
                handleError(message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            handleError(error.message || 'Login failed');
        }
    };

    const handleAdminRedirect = () => {
        navigate('/admin');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="collegeEmail" className="sr-only">College Email</label>
                            <input
                                id="collegeEmail"
                                name="collegeEmail"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="College Email"
                                value={loginInfo.collegeEmail}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={loginInfo.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="student"
                                name="userType"
                                type="radio"
                                value="student"
                                checked={userType === 'student'}
                                onChange={handleUserTypeChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="student" className="ml-2 block text-sm text-gray-900">
                                Student
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="alumni"
                                name="userType"
                                type="radio"
                                value="alumni"
                                checked={userType === 'alumni'}
                                onChange={handleUserTypeChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="alumni" className="ml-2 block text-sm text-gray-900">
                                Alumni
                            </label>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/roleselection" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Register here
                        </Link>
                    </p>
                </div>

                <div className="text-center">
                    <button
                        onClick={handleAdminRedirect}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        Admin Login
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;