import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin } from 'lucide-react';
import { PLACES_DATA } from '../data/places';

export default function Bookmarks() {
    const navigate = useNavigate();
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('myPlaces') || '[]');
        const staticIds = new Set(PLACES_DATA.map(p => p.id));

        // Purge stale items from categories managed by the system (india, world, special-1, special-2)
        const syncedData = saved.filter(p =>
            staticIds.has(p.id) ||
            (!['india', 'world', 'special-1', 'special-2'].includes(p.category))
        );

        if (syncedData.length !== saved.length) {
            localStorage.setItem('myPlaces', JSON.stringify(syncedData));
        }

        setBookmarks(syncedData.filter(p => p.isBookmarked));
    }, []);

    const removeBookmark = (id) => {
        const saved = JSON.parse(localStorage.getItem('myPlaces') || '[]');
        const updated = saved.map(p => p.id === id ? { ...p, isBookmarked: false } : p);
        localStorage.setItem('myPlaces', JSON.stringify(updated));
        setBookmarks(updated.filter(p => p.isBookmarked));
    };

    return (
        <div className="min-h-screen bg-slate-50 relative">
            <div className="absolute top-0 right-0 w-1/2 h-96 bg-purple-100/50 rounded-bl-[10rem] -z-0"></div>

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

                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                            My <span className="text-purple-600">Bookmarks</span>
                        </h1>
                        <p className="text-slate-500 font-medium">
                            You have <strong className="text-purple-600">{bookmarks.length}</strong> favorite landmarks saved.
                        </p>
                    </div>
                </header>

                {bookmarks.length === 0 ? (
                    <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200 animate-in fade-in duration-500">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner text-slate-300">
                            <Star size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No bookmarks yet</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
                            Select the star icon on any place in your collection to save it here for quick access.
                        </p>
                        <button
                            onClick={() => navigate('/all-places')}
                            className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 hover:shadow-purple-200 hover:-translate-y-0.5 transition-all"
                        >
                            Browse Collection
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {bookmarks.map((place) => (
                            <div
                                key={place.id}
                                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in slide-in-from-bottom-2 duration-500"
                            >
                                {/* Left: Info */}
                                <div className="flex-1 min-w-[200px]">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
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
                                <div className="flex items-center gap-6 shrink-0">
                                    <button
                                        onClick={() => removeBookmark(place.id)}
                                        className="p-3 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 hover:bg-amber-100 transition-all shadow-sm"
                                        title="Remove Bookmark"
                                    >
                                        <Star size={20} fill="currentColor" />
                                    </button>
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
