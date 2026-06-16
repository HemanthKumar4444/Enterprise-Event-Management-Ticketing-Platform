import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { Calendar, MapPin, Ticket, AlertCircle, CheckCircle2, ArrowLeft, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [selectedTicket, setSelectedTicket] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${id}`);
                if (response.data.success) {
                    setEvent(response.data.data);
                    if (response.data.data.ticketTypes?.length > 0) {
                        setSelectedTicket(response.data.data.ticketTypes[0].id);
                    }
                }
            } catch (err: any) {
                setError('Event not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            const checkSavedStatus = async () => {
                try {
                    const savedRes = await api.get('/events/saved');
                    if (savedRes.data.success) {
                        const savedEvents = savedRes.data.data;
                        if (savedEvents.some((e: any) => e.id === id)) {
                            setIsSaved(true);
                        }
                    }
                } catch (e) {
                    console.error("Error fetching saved status");
                }
            };
            checkSavedStatus();
        }
    }, [id, isAuthenticated]);

    const handleToggleSave = async () => {
        if (!isAuthenticated) return;
        try {
            await api.post(`/events/${id}/save`);
            setIsSaved(!isSaved);
        } catch (error) {
            console.error("Error toggling save status");
        }
    };

    const handleBookTicket = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!selectedTicket || quantity < 1) return;

        setBookingLoading(true);
        setBookingError('');
        setBookingSuccess(false);

        try {
            const response = await api.post('/bookings', {
                eventId: event.id,
                ticketTypeId: selectedTicket,
                quantity: quantity
            });
            if (response.data.success) {
                setBookingSuccess(true);
            }
        } catch (err: any) {
            setBookingError(err.response?.data?.message || 'Failed to book ticket. The event might be sold out.');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return <div className="animate-pulse h-96 bg-gray-200 rounded-2xl max-w-5xl mx-auto"></div>;
    }

    if (error || !event) {
        return (
            <div className="text-center py-20">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">{error}</h2>
                <Link to="/" className="text-primary mt-4 inline-block hover:underline">Return Home</Link>
            </div>
        );
    }

    const selectedTicketDetails = event.ticketTypes?.find((t: any) => t.id === selectedTicket);
    const totalAmount = selectedTicketDetails ? selectedTicketDetails.price * quantity : 0;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-primary transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Events
            </Link>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-64 sm:h-96 bg-gray-200 relative">
                    {event.bannerUrl ? (
                        <img src={event.bannerUrl} alt={event.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                            <Calendar className="h-20 w-20 text-primary/30" />
                        </div>
                    )}
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-primary shadow-lg">
                        {event.category}
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row gap-12">
                        {/* Event Details */}
                        <div className="flex-1 space-y-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">{event.name}</h1>
                                    <p className="text-lg text-gray-600 leading-relaxed">{event.description}</p>
                                </div>
                                {isAuthenticated && (
                                    <button 
                                        onClick={handleToggleSave}
                                        className={`px-4 py-2 rounded-xl border-2 flex items-center gap-2 font-bold transition-all ${isSaved ? 'bg-primary border-primary text-white hover:bg-primary-dark hover:border-primary-dark' : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}
                                        title={isSaved ? "Remove from saved events" : "Save this event"}
                                    >
                                        <Bookmark className={isSaved ? "fill-current" : ""} size={20} />
                                        {isSaved ? 'Saved Event' : 'Save Event'}
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-xl">
                                        <Calendar className="text-primary h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Date & Time</h3>
                                        <p className="text-gray-500">{new Date(event.startDate).toLocaleString()}</p>
                                        <p className="text-gray-500 text-sm">to {new Date(event.endDate).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-secondary/10 rounded-xl">
                                        <MapPin className="text-secondary h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Location</h3>
                                        <p className="text-gray-500">{event.venue?.name}</p>
                                        <p className="text-gray-500 text-sm">{event.venue?.address}, {event.venue?.city}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ticketing Widget */}
                        <div className="w-full md:w-96 shrink-0">
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 sticky top-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Ticket className="text-primary" /> Book Tickets
                                </h2>

                                {bookingSuccess ? (
                                    <div className="text-center py-8 space-y-4">
                                        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
                                        <h3 className="text-xl font-bold text-gray-900">Booking Confirmed!</h3>
                                        <p className="text-gray-500">Your tickets have been sent to your email.</p>
                                        <Link to="/dashboard" className="block w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors">
                                            View My Tickets
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {bookingError && (
                                            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
                                                {bookingError}
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Ticket Type</label>
                                            <div className="space-y-2">
                                                {event.ticketTypes?.map((type: any) => (
                                                    <label key={type.id} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedTicket === type.id ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <input type="radio" name="ticketType" value={type.id} checked={selectedTicket === type.id} onChange={(e) => setSelectedTicket(e.target.value)} className="text-primary focus:ring-primary h-4 w-4" />
                                                            <div>
                                                                <p className="font-bold text-gray-900">{type.name}</p>
                                                                <p className="text-xs text-gray-500">{type.availableQuantity} remaining</p>
                                                            </div>
                                                        </div>
                                                        <span className="font-extrabold text-gray-900">${type.price.toFixed(2)}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                                            <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                    <option key={num} value={num}>{num}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="font-bold text-gray-600">Total</span>
                                                <span className="text-3xl font-extrabold text-gray-900">${totalAmount.toFixed(2)}</span>
                                            </div>
                                            <button 
                                                onClick={handleBookTicket} 
                                                disabled={bookingLoading || !selectedTicket}
                                                className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 transform hover:-translate-y-0.5">
                                                {bookingLoading ? 'Processing...' : isAuthenticated ? 'Confirm Booking' : 'Login to Book'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
