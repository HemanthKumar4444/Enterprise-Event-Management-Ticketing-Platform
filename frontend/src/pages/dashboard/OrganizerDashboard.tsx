import { PlusCircle, Calendar, Users, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/axios';

export const OrganizerDashboard = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events/organizer');
                if (response.data.success) {
                    setEvents(response.data.data.content);
                }
            } catch (error) {
                console.error("Error fetching organizer events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const totalRevenue = 0; // To be implemented in Phase 5
    const totalAttendees = 0; // To be implemented in Phase 5

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Organizer Dashboard</h1>
                    <p className="text-gray-500 mt-2 text-lg">Manage your events, view analytics, and track revenue.</p>
                </div>
                <Link to="/organizer/events/new" className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    <PlusCircle size={20} />
                    Create Event
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-purple-100 rounded-2xl">
                        <Calendar className="text-purple-600 h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Events</p>
                        <p className="text-3xl font-extrabold text-gray-900">{events.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-secondary/10 rounded-2xl">
                        <DollarSign className="text-secondary h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Revenue</p>
                        <p className="text-3xl font-extrabold text-gray-900">${totalRevenue.toFixed(2)}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-orange-100 rounded-2xl">
                        <Users className="text-orange-600 h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Attendees</p>
                        <p className="text-3xl font-extrabold text-gray-900">{totalAttendees}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Events</h2>
                
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>)}
                    </div>
                ) : events.length > 0 ? (
                    <div className="space-y-4">
                        {events.map(event => (
                            <div key={event.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                                        {new Date(event.startDate).getDate()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{event.name}</h3>
                                        <p className="text-sm text-gray-500">{new Date(event.startDate).toLocaleDateString()} &bull; {event.category}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                                    {event.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No events yet</h3>
                        <p className="mt-1 text-gray-500">Get started by creating your first event.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
