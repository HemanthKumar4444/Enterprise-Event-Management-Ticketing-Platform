
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { CreateEvent } from './pages/events/CreateEvent';
import { EventDetails } from './pages/events/EventDetails';
import { CustomerDashboard } from './pages/dashboard/CustomerDashboard';
import { OrganizerDashboard } from './pages/dashboard/OrganizerDashboard';

import type { ReactNode } from 'react';

const ProtectedRoute = ({ children, roles }: { children: ReactNode, roles?: string[] }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (roles && user && !roles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="events/:id" element={<EventDetails />} />
                
                {/* Customer Routes */}
                <Route path="dashboard" element={
                    <ProtectedRoute roles={['CUSTOMER', 'SUPER_ADMIN']}>
                        <CustomerDashboard />
                    </ProtectedRoute>
                } />

                {/* Organizer Routes */}
                <Route path="organizer/dashboard" element={
                    <ProtectedRoute roles={['ORGANIZER', 'SUPER_ADMIN']}>
                        <OrganizerDashboard />
                    </ProtectedRoute>
                } />
                <Route path="organizer/events/new" element={
                    <ProtectedRoute roles={['ORGANIZER', 'SUPER_ADMIN']}>
                        <CreateEvent />
                    </ProtectedRoute>
                } />
            </Route>
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
