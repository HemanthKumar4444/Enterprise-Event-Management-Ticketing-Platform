
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const AppLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <Navbar />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
            <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-500 text-sm mt-auto">
                <p>&copy; {new Date().getFullYear()} EventSphere Enterprise. All rights reserved.</p>
            </footer>
        </div>
    );
};
