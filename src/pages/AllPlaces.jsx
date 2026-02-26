import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Tag, Globe, Search, List, Star } from 'lucide-react';
import { PLACES_DATA } from '../data/places';

export default function AllPlaces() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [places, setPlaces] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || 'all');

    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            setFilterCategory(categoryFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('myPlaces') || '[]');

        // Sync static PLACES_DATA with local storage
        const syncedData = PLACES_DATA.map(staticPlace => {
            const savedPlace = saved.find(p => p.id === staticPlace.id);
            return {
                ...staticPlace,
                isBookmarked: savedPlace ? savedPlace.isBookmarked : false
            };
        });

        const staticIds = new Set(PLACES_DATA.map(p => p.id));
        const customPlaces = saved.filter(p => !staticIds.has(p.id) && !['india', 'world', 'special-1', 'special-2'].includes(p.category));
        const finalData = [...syncedData, ...customPlaces];

        setPlaces(finalData);
        localStorage.setItem('myPlaces', JSON.stringify(finalData));
    }, []);

    const savePlaces = (updatedPlaces) => {
        setPlaces(updatedPlaces);
        localStorage.setItem('myPlaces', JSON.stringify(updatedPlaces));
    };

    const toggleBookmark = (id) => {
        const updated = places.map(p => p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p);
        savePlaces(updated);
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
        { id: 'all', label: 'All', icon: <List size={16} /> },
        { id: 'india', label: 'India', icon: <span>🇮🇳</span> },
        { id: 'world', label: 'World', icon: <Globe size={16} /> },
        { id: 'special-1', label: 'Sp-1', icon: <span>🌟</span> },
        { id: 'special-2', label: 'Sp-2', icon: <span>✨</span> }
    ];

    return (
        <div className="min-h-screen bg-slate-50 relative">
            <div className="absolute top-0 right-0 w-1/2 h-96 bg-blue-100/50 rounded-bl-[10rem] -z-0"></div>

            <div className="relative z-10 container mx-auto px-6 py-8">
                <header className="mb-8">
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
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                                My <span className="text-indigo-600">Collection</span>
                            </h1>
                            <p className="text-xs text-slate-500 font-medium">
                                Exploring <strong className="text-indigo-600">{filteredPlaces.length}</strong> unique places in this view.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                            {/* Category Filter Tabs */}
                            <div className="flex p-1 bg-white border border-slate-200 rounded-xl shadow-sm w-full sm:w-auto">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setFilterCategory(cat.id)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterCategory === cat.id
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
                                    placeholder="Search the world..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm font-medium text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {filteredPlaces.length === 0 ? (
                    <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200 animate-in fade-in duration-500">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner text-slate-300">
                            {filterCategory === 'india' ? <span className="text-4xl opacity-40">🇮🇳</span> : <Globe size={40} />}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                            Oops! No places found
                        </h3>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium">
                            Try a different search term or change the category filter to see more places.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filteredPlaces.map((place, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-500"
                            >
                                {/* Left: Info */}
                                <div className="flex-1 min-w-[200px]">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                            {place.name}
                                        </h3>
                                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${place.category === 'india'
                                            ? 'bg-orange-50 text-orange-600 border border-orange-100'
                                            : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                            }`}>
                                            {place.category === 'india' ? 'India' : 'World'}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <MapPin size={12} />
                                        <span className="text-[10px] font-semibold">{place.place}</span>
                                    </div>
                                </div>

                                {/* Middle: Badges */}
                                <div className="flex flex-wrap items-center gap-2 md:justify-center flex-1">
                                    <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-wider border border-slate-100">
                                        {place.type}
                                    </span>
                                    {place.subtype && (
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-wider border border-indigo-100">
                                            {place.subtype}
                                        </span>
                                    )}
                                </div>

                                {/* Right: Actions */}
                                <div className="flex items-center gap-4 shrink-0">
                                    <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
                                        <button
                                            onClick={() => toggleBookmark(place.id)}
                                            className={`p-2 rounded-lg transition-all ${place.isBookmarked
                                                ? 'text-amber-500 bg-white shadow-sm'
                                                : 'text-slate-300 hover:text-amber-500 hover:bg-white'
                                                }`}
                                            title={place.isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                                        >
                                            <Star size={16} fill={place.isBookmarked ? "currentColor" : "none"} />
                                        </button>
                                    </div>
                                    <div className="hidden lg:block text-right min-w-[60px]">
                                        <p className="text-[10px] font-black text-slate-300 uppercase leading-none">ID</p>
                                        <p className="text-sm font-black text-slate-400">{place.id}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
