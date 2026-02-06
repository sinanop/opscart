import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get("/users/profile");
                setUser(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load profile");
                setLoading(false);
            
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                Loading profile...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                User not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950 p-6">
            <div className="max-w-md w-full bg-black/60 backdrop-blur-md border border-red-500/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-red-600/10 blur-3xl rounded-full pointer-events-none"></div>

                <div className="relative z-10 text-center">

                    <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-red-600 to-orange-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg mb-6 border-4 border-black">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>

                    <h2 className="text-3xl font-bold text-red-500 mb-2">{user.name}</h2>
                    <p className="text-gray-400 mb-6">{user.role === 'admin' ? 'Administrator' : 'Customer'}</p>

                    <div className="space-y-4 text-left p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                            <span className="text-gray-400 font-semibold">Email</span>
                            <span className="text-white truncate max-w-[200px]">{user.email}</span>
                        </div>
                        {user.phoneNumber && (
                            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                                <span className="text-gray-400 font-semibold">Phone</span>
                                <span className="text-white">{user.phoneNumber}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                            <span className="text-gray-400 font-semibold">User ID</span>
                            <span className="text-white text-xs opacity-70">{user._id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-semibold">Status</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${user.status === 'Blocked' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                {user.status || 'Active'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/orders')}
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition shadow-md"
                        >
                            My Orders
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem("loggedInUser");
                                navigate('/login');
                            }}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition shadow-lg shadow-red-500/30"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
