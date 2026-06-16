import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Calendar, MapPin, Ticket, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CreateEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'CONFERENCE',
        bannerUrl: '',
        startDate: '',
        endDate: '',
        capacity: 100,
        venue: {
            name: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        },
        ticketTypes: [
            { name: 'General Admission', price: 0, quantity: 100 }
        ]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleVenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            venue: { ...formData.venue, [name]: value }
        });
    };

    const handleTicketChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newTicketTypes = [...formData.ticketTypes];
        newTicketTypes[index] = { ...newTicketTypes[index], [name]: value };
        setFormData({ ...formData, ticketTypes: newTicketTypes });
    };

    const addTicketType = () => {
        setFormData({
            ...formData,
            ticketTypes: [...formData.ticketTypes, { name: '', price: 0, quantity: 0 }]
        });
    };

    const removeTicketType = (index: number) => {
        if (formData.ticketTypes.length > 1) {
            const newTicketTypes = formData.ticketTypes.filter((_, i) => i !== index);
            setFormData({ ...formData, ticketTypes: newTicketTypes });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Fix LocalDateTime format (remove the Z and milliseconds)
            const formatLocalDateTime = (dateString: string) => {
                const date = new Date(dateString);
                return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 19);
            };

            const payload = {
                ...formData,
                capacity: Number(formData.capacity),
                startDate: formatLocalDateTime(formData.startDate),
                endDate: formatLocalDateTime(formData.endDate),
                ticketTypes: formData.ticketTypes.map(t => ({
                    name: t.name,
                    price: Number(t.price),
                    quantity: Number(t.quantity)
                }))
            };
            
            const response = await api.post('/events', payload);
            if (response.data.success) {
                navigate('/organizer/dashboard');
            }
            } catch (err: any) {
            console.error("API Error", err.response?.data);
            if (err.response?.data?.data) {
                const fieldErrors = Object.entries(err.response.data.data)
                    .map(([field, msg]) => `${field}: ${msg}`)
                    .join(', ');
                setError(`Validation failed: ${fieldErrors}`);
            } else {
                setError(err.response?.data?.message || 'Failed to create event. Please check your inputs.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/organizer/dashboard" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-500 hover:text-primary">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New Event</h1>
                    <p className="text-gray-500 mt-1">Fill in the details to publish your event to the world.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm">
                    <p className="text-sm text-red-700 font-medium whitespace-pre-wrap">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Details */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
                        <Calendar className="text-primary" size={24} />
                        <h2 className="text-xl font-bold text-gray-800">Event Details</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Event Name</label>
                            <input name="name" type="text" required value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Tech Conference 2026" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea name="description" required value={formData.description} onChange={handleChange} rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Describe your event in detail..." />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white">
                                <option value="CONFERENCE">Conference</option>
                                <option value="WORKSHOP">Workshop</option>
                                <option value="CONCERT">Concert</option>
                                <option value="MEETUP">Meetup</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Total Capacity</label>
                            <input name="capacity" type="number" required min="1" value={formData.capacity} onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date & Time</label>
                            <input name="startDate" type="datetime-local" required value={formData.startDate} onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date & Time</label>
                            <input name="endDate" type="datetime-local" required value={formData.endDate} onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Image URL</label>
                            <input name="bannerUrl" type="url" value={formData.bannerUrl} onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="https://example.com/image.jpg" />
                        </div>
                    </div>
                </div>

                {/* Venue Details */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
                        <MapPin className="text-secondary" size={24} />
                        <h2 className="text-xl font-bold text-gray-800">Location Details</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Venue Name</label>
                            <input name="name" type="text" required value={formData.venue.name} onChange={handleVenueChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Convention Center" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                            <input name="address" type="text" required value={formData.venue.address} onChange={handleVenueChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="123 Event Street" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                            <input name="city" type="text" required value={formData.venue.city} onChange={handleVenueChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">State/Region</label>
                            <input name="state" type="text" required value={formData.venue.state} onChange={handleVenueChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code</label>
                            <input name="zipCode" type="text" required value={formData.venue.zipCode} onChange={handleVenueChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                            <input name="country" type="text" required value={formData.venue.country} onChange={handleVenueChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                        </div>
                    </div>
                </div>

                {/* Ticket Types */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-2">
                            <Ticket className="text-purple-500" size={24} />
                            <h2 className="text-xl font-bold text-gray-800">Tickets</h2>
                        </div>
                        <button type="button" onClick={addTicketType} className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1">
                            <Plus size={16} /> Add Ticket Type
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {formData.ticketTypes.map((ticket, index) => (
                            <div key={index} className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="flex-grow">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Ticket Name</label>
                                    <input name="name" type="text" required value={ticket.name} onChange={(e) => handleTicketChange(index, e)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="VIP Access" />
                                </div>
                                <div className="w-32">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Price ($)</label>
                                    <input name="price" type="number" required min="0" step="0.01" value={ticket.price} onChange={(e) => handleTicketChange(index, e)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                                </div>
                                <div className="w-32">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Quantity</label>
                                    <input name="quantity" type="number" required min="1" value={ticket.quantity} onChange={(e) => handleTicketChange(index, e)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                                </div>
                                {formData.ticketTypes.length > 1 && (
                                    <button type="button" onClick={() => removeTicketType(index)} className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors">
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/organizer/dashboard')}
                        className="px-8 py-4 font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading}
                        className="px-8 py-4 font-bold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg disabled:opacity-50">
                        {loading ? 'Creating Event...' : 'Publish Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};
