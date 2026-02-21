import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Globe } from 'lucide-react';

export default function Bookmarks() {
    const navigate = useNavigate();
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('myPlaces') || '[]');
        setBookmarks(saved.filter(p => p.isBookmarked));
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bookmarks.map((place) => (
                            <div
                                key={place.id}
                                className="bg-white p-7 rounded-3xl shadow-md border border-slate-100 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
                            >
                                <div className="flex items-center gap-3 absolute top-6 right-6">
                                    <button
                                        onClick={() => removeBookmark(place.id)}
                                        className="p-2 rounded-xl bg-amber-100 border border-amber-200 text-amber-600 transition-all shadow-sm"
                                        title="Remove Bookmark"
                                    >
                                        <Star size={18} fill="currentColor" />
                                    </button>
                                </div>

                                <div className={`inline-block px-3 py-1 mb-4 rounded-lg text-[10px] font-black uppercase tracking-widest ${place.category === 'india'
                                    ? 'bg-orange-50 text-orange-600'
                                    : 'bg-indigo-50 text-indigo-600'
                                    }`}>
                                    {place.category === 'india' ? '🇮🇳 India' : '🌍 World'}
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-wider border border-slate-100">
                                        {place.type}
                                    </span>
                                    {place.subtype && (
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-wider border border-indigo-100">
                                            {place.subtype}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-2xl font-extrabold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                                    {place.name}
                                </h3>

                                <div className="flex items-center gap-2 text-slate-500 mb-6 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50 inline-flex">
                                    <MapPin size={16} className="text-slate-400" />
                                    <span className="text-sm font-bold">{place.place}</span>
                                </div>

                                <div className="border-t border-slate-50 pt-5 mt-auto flex justify-end items-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <Globe size={12} /> ID: {place.id}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
