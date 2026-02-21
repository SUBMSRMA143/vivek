import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Tag, Globe, Search, List, Edit2, Trash2, Star } from 'lucide-react';
import { PLACES_DATA } from '../data/places';

export default function AllPlaces() {
    const navigate = useNavigate();
    const [places, setPlaces] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [editingPlace, setEditingPlace] = useState(null); // For edit modal

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('myPlaces') || '[]');
        if (saved.length === 0) {
            // Initial load from static data
            const initialData = PLACES_DATA.map(p => ({ ...p, isBookmarked: false }));
            setPlaces(initialData);
            localStorage.setItem('myPlaces', JSON.stringify(initialData));
        } else {
            // Migration: ensure new fields from static data are present if they exist there
            const migrated = saved.map(p => {
                const staticMatch = PLACES_DATA.find(s => s.id === p.id);
                return {
                    ...p,
                    subtype: p.subtype || (staticMatch ? staticMatch.subtype : '')
                };
            });
            setPlaces(migrated);
        }
    }, []);

    const savePlaces = (updatedPlaces) => {
        setPlaces(updatedPlaces);
        localStorage.setItem('myPlaces', JSON.stringify(updatedPlaces));
    };

    const toggleBookmark = (id) => {
        const updated = places.map(p => p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p);
        savePlaces(updated);
    };

    const deletePlace = (id) => {
        if (confirm('Are you sure you want to delete this place?')) {
            const updated = places.filter(p => p.id !== id);
            savePlaces(updated);
        }
    };

    const startEditing = (place) => {
        setEditingPlace({ ...place });
    };

    const saveEdit = (e) => {
        e.preventDefault();
        const updated = places.map(p => p.id === editingPlace.id ? editingPlace : p);
        savePlaces(updated);
        setEditingPlace(null);
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
                                    placeholder="Search the world..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm font-medium"
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
                                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in slide-in-from-bottom-2 duration-500"
                            >
                                {/* Left: Info */}
                                <div className="flex-1 min-w-[200px]">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
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
                                        <MapPin size={14} />
                                        <span className="text-xs font-semibold">{place.place}</span>
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
                                            <Star size={18} fill={place.isBookmarked ? "currentColor" : "none"} />
                                        </button>
                                        <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>
                                        <button
                                            onClick={() => startEditing(place)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => deletePlace(place.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
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

            {/* Edit Modal */}
            {editingPlace && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingPlace(null)}></div>
                    <form
                        onSubmit={saveEdit}
                        className="relative bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md animate-in zoom-in-95 duration-200"
                    >
                        <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">
                            Edit <span className="text-indigo-600">Place</span>
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Landmark Name</label>
                                <input
                                    type="text"
                                    required
                                    value={editingPlace.name}
                                    onChange={(e) => setEditingPlace({ ...editingPlace, name: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all font-bold text-slate-800"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Type</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingPlace.type}
                                        onChange={(e) => setEditingPlace({ ...editingPlace, type: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all font-bold text-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Subtype</label>
                                    <input
                                        type="text"
                                        value={editingPlace.subtype || ''}
                                        onChange={(e) => setEditingPlace({ ...editingPlace, subtype: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all font-bold text-slate-800"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Location</label>
                                <input
                                    type="text"
                                    required
                                    value={editingPlace.place}
                                    onChange={(e) => setEditingPlace({ ...editingPlace, place: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all font-bold text-slate-800"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-10">
                            <button
                                type="button"
                                onClick={() => setEditingPlace(null)}
                                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                            >
                                CANCEL
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
                            >
                                SAVE CHANGES
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
