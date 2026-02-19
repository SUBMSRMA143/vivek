import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Tag, Globe, Trash2, Search, List } from 'lucide-react';

export default function AllPlaces() {
    const navigate = useNavigate();
    const [places, setPlaces] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const savedPlaces = JSON.parse(localStorage.getItem('myPlaces') || '[]');
        setPlaces(savedPlaces.reverse()); // Show newest first
    }, []);

    const handleClearAll = () => {
        if (confirm('Are you sure you want to delete all your saved places?')) {
            localStorage.removeItem('myPlaces');
            setPlaces([]);
        }
    };

    const filteredPlaces = places.filter(place =>
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* Background decoration - Distinct from Home/Bookmarks */}
            <div className="absolute top-0 right-0 w-1/2 h-96 bg-blue-100/50 rounded-bl-[10rem] -z-0"></div>

            <div className="relative z-10 container mx-auto px-6 py-12">
                <header className="mb-12">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 group"
                    >
                        <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="font-medium">Back to Home</span>
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-2">My Full Collection</h1>
                            <p className="text-slate-500">You have collected <strong className="text-indigo-600">{places.length}</strong> places so far.</p>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative group flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search collection..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm"
                                />
                            </div>
                            {places.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Clear All"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {places.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <List size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No places saved yet</h3>
                        <p className="text-slate-400 mb-8 max-w-sm mx-auto">Start your journey by adding new places you've learned about.</p>
                        <button
                            onClick={() => navigate('/add')}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                            Add Your First Place
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPlaces.map((place, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                            {places.length - index}
                                        </span>
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md uppercase tracking-wider">
                                            {place.type}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-indigo-700 transition-colors">
                                    {place.name}
                                </h3>

                                <div className="flex items-center gap-2 text-slate-500 mb-4">
                                    <MapPin size={16} />
                                    <span className="text-sm font-medium">{place.place}</span>
                                </div>

                                <div className="border-t border-slate-50 pt-4 mt-4 flex justify-between items-center text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Globe size={12} /> Learned
                                    </span>
                                    <span>Just now</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
