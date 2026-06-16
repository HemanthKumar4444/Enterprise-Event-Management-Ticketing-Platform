import { useAuth } from '../../context/AuthContext';
import { Ticket, CalendarClock, History, QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

export const CustomerDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [savedEvents, setSavedEvents] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [bookingsRes, savedEventsRes] = await Promise.all([
                    api.get('/bookings/my-bookings'),
                    api.get('/events/saved')
                ]);
                
                if (bookingsRes.data.success) {
                    setBookings(bookingsRes.data.data.content);
                }
                if (savedEventsRes.data.success) {
                    setSavedEvents(savedEventsRes.data.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const totalTickets = bookings.reduce((sum, b) => sum + b.ticketCount, 0);

    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, {user?.firstName}!</h1>
                <p className="text-gray-500 mt-2 text-lg">Manage your tickets and bookings from your personal dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-primary/10 rounded-2xl">
                        <Ticket className="text-primary h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Tickets</p>
                        <p className="text-3xl font-extrabold text-gray-900">{totalTickets}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-secondary/10 rounded-2xl">
                        <History className="text-secondary h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Bookings</p>
                        <p className="text-3xl font-extrabold text-gray-900">{bookings.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="p-4 bg-blue-100 rounded-2xl">
                        <CalendarClock className="text-blue-600 h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Saved Events</p>
                        <p className="text-3xl font-extrabold text-gray-900">{savedEvents.length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Tickets</h2>
                
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>)}
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {bookings.map(booking => (
                            <div key={booking.id} className="border border-gray-200 rounded-2xl overflow-hidden flex shadow-sm hover:shadow-md transition-all">
                                <div className="bg-primary text-white p-6 flex flex-col justify-center items-center w-32 border-r border-dashed border-gray-300 relative">
                                    <div className="absolute -right-3 -top-3 w-6 h-6 bg-white rounded-full"></div>
                                    <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-white rounded-full"></div>
                                    <QrCode size={48} className="mb-2 opacity-80" />
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-80">Admit</span>
                                    <span className="text-2xl font-extrabold">{booking.ticketCount}</span>
                                </div>
                                <div className="p-6 bg-white flex-grow flex flex-col justify-center">
                                    <Link to={`/events/${booking.eventId}`} className="font-bold text-xl text-gray-900 hover:text-primary transition-colors">
                                        {booking.eventName}
                                    </Link>
                                    <div className="mt-2 text-sm text-gray-500 space-y-1">
                                        <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                                        <p><strong>Amount Paid:</strong> ${booking.totalAmount.toFixed(2)}</p>
                                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded mt-2">
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Ticket className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No tickets found</h3>
                        <p className="mt-1 text-gray-500">You haven't booked any tickets yet. Explore events and book now!</p>
                        <Link to="/" className="mt-6 inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors">
                            Discover Events
                        </Link>
                    </div>
                )}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Events</h2>
                
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>)}
                    </div>
                ) : savedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedEvents.map(event => (
                            <Link to={`/events/${event.id}`} key={event.id} className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col">
                                <div className="h-32 bg-gray-200 relative overflow-hidden">
                                    {event.bannerUrl ? (
                                        <img src={event.bannerUrl} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                            <CalendarClock className="h-10 w-10 text-primary/40" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 bg-white flex-grow relative">
                                    <h3 className="font-bold text-gray-900 line-clamp-1 pr-8">{event.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{new Date(event.startDate).toLocaleDateString()}</p>
                                    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded mt-3">
                                        {event.category}
                                    </span>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            api.post(`/events/${event.id}/save`).then(() => {
                                                setSavedEvents(prev => prev.filter(e => e.id !== event.id));
                                            });
                                        }}
                                        className="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                                        title="Unsave event"
                                    >
                                        <Ticket className="h-4 w-4 hidden" />
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="text-gray-500">You haven't saved any events yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
