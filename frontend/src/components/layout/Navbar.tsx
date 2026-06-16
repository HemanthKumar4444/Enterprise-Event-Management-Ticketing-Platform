
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <Calendar className="h-8 w-8 text-primary-dark" />
                            <span className="font-bold text-xl tracking-tight text-dark">EventSphere</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link 
                                    to={user?.role === 'ORGANIZER' ? '/organizer/dashboard' : '/dashboard'} 
                                    className="text-gray-700 hover:text-primary-dark px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <div className="flex items-center gap-2 px-3 py-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {user?.firstName?.charAt(0) || <UserIcon size={16} />}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.firstName}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-500 hover:text-red-600 p-2 rounded-md transition-colors"
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-primary-dark px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
