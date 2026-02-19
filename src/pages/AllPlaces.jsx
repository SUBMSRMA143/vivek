import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Tag, Globe, Trash2, Search, List, Filter } from 'lucide-react';

export default function AllPlaces() {
    const navigate = useNavigate();
    const [places, setPlaces] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => {
        const savedPlaces = JSON.parse(localStorage.getItem('myPlaces') || '[]');
        // Handle migration/legacy data by adding category if missing
        const migratedPlaces = savedPlaces.map(p => ({
            ...p,
            category: p.category || 'world'
        }));
        setPlaces(migratedPlaces.reverse()); // Show newest first
    }, []);

    const handleClearAll = () => {
        if (confirm('Are you sure you want to delete all your saved places?')) {
            localStorage.removeItem('myPlaces');
            setPlaces([]);
        }
    };

    const filteredPlaces = places.filter(place => {
        const matchesSearch =
            place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            place.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
            place.type.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterCategory === 'all' || place.category === filterCategory;

        return matchesSearch && matchesFilter;
    });

    const categories = [
        { id: 'all', label: 'All Collection', icon: <List size={16} /> },
        { id: 'india', label: 'India', icon: <span>🇮🇳</span> },
        { id: 'world', label: 'All World', icon: <Globe size={16} /> }
    ];

    return (
        <div className="min-h-screen bg-slate-50 relative">
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

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                                My <span className="text-indigo-600">Collection</span>
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Tracking <strong className="text-indigo-600">{places.length}</strong> unique places across the globe.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                            {/* Category Filter Tabs */}
                            <div className="flex p-1 bg-white border border-slate-200 rounded-xl shadow-sm w-full sm:w-auto">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setFilterCategory(cat.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterCategory === cat.id
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        {cat.icon} {cat.label}
                                    </button>
                                ))}
                            </div>

                            <div className="relative group flex-1 sm:w-64 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search your journey..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm font-medium"
                                />
                            </div>

                            {places.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-all shadow-sm bg-white"
                                    title="Clear All"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {filteredPlaces.length === 0 ? (
                    <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200 animate-in fade-in duration-500">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner text-slate-300">
                            {filterCategory === 'india' ? <span className="text-4xl opacity-40">🇮🇳</span> : <Globe size={40} />}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                            {searchTerm ? "No matches found" : `No ${filterCategory === 'all' ? '' : filterCategory} places yet`}
                        </h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
                            {searchTerm ? "Try a different search term or category." : "Start your collection by adding new places you've learned about."}
                        </p>
                        <button
                            onClick={() => navigate(`/add?category=${filterCategory === 'all' ? 'world' : filterCategory}`)}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all"
                        >
                            Add New Place
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPlaces.map((place, index) => (
                            <div
                                key={index}
                                className="bg-white p-7 rounded-3xl shadow-md border border-slate-100 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
                            >
                                {/* Region Badge */}
                                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest ${place.category === 'india'
                                        ? 'bg-orange-50 text-orange-600'
                                        : 'bg-indigo-50 text-indigo-600'
                                    }`}>
                                    {place.category === 'india' ? '🇮🇳 India' : '🌍 World'}
                                </div>

                                <div className="flex items-start justify-between mb-5">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${place.category === 'india' ? 'bg-orange-600 text-white' : 'bg-indigo-600 text-white'
                                            }`}>
                                            {places.length - index}
                                        </span>
                                        <span className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-wider border border-slate-100">
                                            {place.type}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-extrabold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {place.name}
                                </h3>

                                <div className="flex items-center gap-2 text-slate-500 mb-6 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50 inline-flex">
                                    <MapPin size={16} className="text-slate-400" />
                                    <span className="text-sm font-bold">{place.place}</span>
                                </div>

                                <div className="border-t border-slate-50 pt-5 mt-auto flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5">
                                        <Globe size={14} className="opacity-50" /> Learned
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
