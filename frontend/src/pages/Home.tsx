import { useEffect, useState } from 'react';
import { Calendar, Search, MapPin } from 'lucide-react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                if (response.data.success) {
                    setEvents(response.data.data.content);
                }
            } catch (error) {
                console.error("Error fetching events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="space-y-12">
            <section className="text-center py-20 px-4 bg-primary text-white rounded-3xl shadow-xl mt-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                    <h1 className="text-5xl font-extrabold tracking-tight">Discover Incredible Events</h1>
                    <p className="text-xl text-primary-100">Book tickets for conferences, concerts, workshops, and more.</p>
                    <div className="mt-8 flex justify-center gap-4 flex-col sm:flex-row">
                        <div className="relative w-full max-w-md text-left">
                            <input type="text" placeholder="Search events..." className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-white" />
                            <Search className="absolute left-4 top-4 text-gray-400" />
                        </div>
                        <button className="bg-white text-primary font-bold px-8 py-4 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                            Find Events
                        </button>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex justify-between items-end">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Upcoming Events</h2>
                    <Link to="/events" className="text-primary font-medium hover:text-primary-dark">View all &rarr;</Link>
                </div>
                
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event: any) => (
                            <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col group cursor-pointer">
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    {event.bannerUrl ? (
                                        <img src={event.bannerUrl} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-colors">
                                            <Calendar className="h-12 w-12 text-primary/30 group-hover:text-primary/50 transition-colors" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-primary shadow-sm">
                                        {event.category}
                                    </div>
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{event.name}</h3>
                                    <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                        <Calendar size={16} className="text-primary" />
                                        <span>{new Date(event.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                        <MapPin size={16} className="text-primary" />
                                        <span>{event.venue?.city || 'Online'}</span>
                                    </div>
                                    <p className="text-gray-600 line-clamp-2 text-sm mb-6 flex-grow">{event.description}</p>
                                    <Link to={`/events/${event.id}`} className="w-full text-center py-3 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white font-semibold rounded-xl transition-colors">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No events found</h3>
                        <p className="mt-2 text-gray-500 max-w-md mx-auto">We couldn't find any upcoming events at the moment. Check back later for new ones!</p>
                    </div>
                )}
            </section>
        </div>
    );
};
