
import React, { useState } from 'react';
import Card from './Card';

interface LoginPageProps {
    onLogin: () => void;
}

const ADMIN_PASSWORD = 'admin123';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setError('');
            onLogin();
        } else {
            setError('ভুল পাসওয়ার্ড। আবার চেষ্টা করুন।');
        }
    };

    return (
        <div className="flex justify-center items-center py-12">
            <Card className="w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">অ্যাডমিন লগইন</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            পাসওয়ার্ড
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-teal-600 text-white rounded-md font-semibold hover:bg-teal-700 transition-colors duration-300"
                    >
                        লগইন করুন
                    </button>
                </form>
            </Card>
        </div>
    );
};

export default LoginPage;
