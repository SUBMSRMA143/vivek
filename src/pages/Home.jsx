import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, PlayCircle, Bookmark, MapPin, Globe, ArrowLeft } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center">
            {/* Subtle background pattern */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0"></div>

            <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
                <header className="mb-16 animate-in slide-in-from-top-10 duration-700 fade-in flex flex-col items-center">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-full mb-6 border border-indigo-100 shadow-sm">
                        <MapPin className="text-indigo-600 mr-2" size={20} />
                        <span className="text-indigo-600 font-bold text-xs tracking-widest uppercase">Personal Learning Atlas</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
                        Place <span className="text-indigo-600">Learner</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Track your journey, quiz your knowledge, and build your personal map of the world.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                    <MenuCard
                        title="All Places"
                        description="Browse the full collection."
                        icon={<Globe size={32} />}
                        onClick={() => navigate('/all-places')}
                        colorClass="text-indigo-600 bg-indigo-50"
                        hoverClass="hover:border-indigo-200 hover:shadow-indigo-100"
                        delay="delay-0"
                    />
                    <MenuCard
                        title="Start Quiz"
                        description="Test your knowledge."
                        icon={<PlayCircle size={32} />}
                        onClick={() => navigate('/quiz')}
                        colorClass="text-emerald-600 bg-emerald-50"
                        hoverClass="hover:border-emerald-200 hover:shadow-emerald-100"
                        delay="delay-75"
                    />
                    <MenuCard
                        title="Bookmarks"
                        description="View your favorites."
                        icon={<Bookmark size={32} />}
                        onClick={() => navigate('/bookmarks')}
                        colorClass="text-purple-600 bg-purple-50"
                        hoverClass="hover:border-purple-200 hover:shadow-purple-100"
                        delay="delay-150"
                    />
                </div>

                <div className="mt-16 w-full max-w-5xl animate-in slide-in-from-bottom-10 duration-700 delay-300">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Specialized Curations</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <button
                            onClick={() => navigate('/all-places?category=special-1')}
                            className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-lg hover:shadow-xl transition-all group flex items-center gap-6 text-left"
                        >
                            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-black">🌟</span>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 tracking-tight">Special-1 Collection</h3>
                                <p className="text-xs text-slate-500 font-medium tracking-wide">Explore your primary curated set</p>
                            </div>
                        </button>
                        <button
                            onClick={() => navigate('/all-places?category=special-2')}
                            className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-lg hover:shadow-xl transition-all group flex items-center gap-6 text-left"
                        >
                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-black">✨</span>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 tracking-tight">Special-2 Collection</h3>
                                <p className="text-xs text-slate-500 font-medium tracking-wide">Browse your secondary curated set</p>
                            </div>
                        </button>
                    </div>
                </div>

                <footer className="mt-20 text-center text-slate-400 text-sm animate-in fade-in duration-1000 delay-500">
                    <p className="font-medium tracking-wide">© 2026 Place Learner • Keep exploring</p>
                </footer>
            </div>
        </div>
    );
}

function MenuCard({ title, description, icon, onClick, colorClass, hoverClass, delay }) {
    return (
        <button
            onClick={onClick}
            className={`bg-white p-8 rounded-3xl shadow-lg border border-transparent text-center flex flex-col items-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl group ${hoverClass} animate-in slide-in-from-bottom-8 fade-in duration-500 ${delay}`}
        >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${colorClass}`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{title}</h3>
            <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
        </button>
    );
}
