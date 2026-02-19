import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, PlayCircle, Bookmark, MapPin, Globe, ArrowLeft } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();
    const [showAddSelection, setShowAddSelection] = useState(false);

    if (showAddSelection) {
        return (
            <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0"></div>

                <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                    <button
                        onClick={() => setShowAddSelection(false)}
                        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group"
                    >
                        <ArrowLeft size={20} /> <span className="font-medium">Back to Menu</span>
                    </button>

                    <h2 className="text-4xl font-black text-slate-900 mb-12 tracking-tight">Select <span className="text-indigo-600">Region</span></h2>

                    <div className="flex flex-col gap-6 w-full max-w-sm">
                        <button
                            onClick={() => navigate('/add?category=world')}
                            className="w-full py-8 bg-white border-2 border-slate-100 rounded-3xl shadow-xl hover:border-indigo-500 hover:shadow-indigo-100 transition-all text-2xl font-bold text-slate-800 flex flex-col items-center justify-center gap-4 group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                <Globe size={32} />
                            </div>
                            All World
                        </button>

                        <button
                            onClick={() => navigate('/add?category=india')}
                            className="w-full py-8 bg-white border-2 border-slate-100 rounded-3xl shadow-xl hover:border-orange-500 hover:shadow-orange-100 transition-all text-2xl font-bold text-slate-800 flex flex-col items-center justify-center gap-4 group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform text-3xl">
                                🇮🇳
                            </div>
                            India
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
                    <MenuCard
                        title="Add New"
                        description="Log a new landmark."
                        icon={<PlusCircle size={32} />}
                        onClick={() => setShowAddSelection(true)}
                        colorClass="text-blue-600 bg-blue-50"
                        hoverClass="hover:border-blue-200 hover:shadow-blue-100"
                        delay="delay-0"
                    />
                    <MenuCard
                        title="All Places"
                        description="Browse your collection."
                        icon={<Globe size={32} />}
                        onClick={() => navigate('/all-places')}
                        colorClass="text-indigo-600 bg-indigo-50"
                        hoverClass="hover:border-indigo-200 hover:shadow-indigo-100"
                        delay="delay-75"
                    />
                    <MenuCard
                        title="Start Quiz"
                        description="Test your knowledge."
                        icon={<PlayCircle size={32} />}
                        onClick={() => navigate('/quiz')}
                        colorClass="text-emerald-600 bg-emerald-50"
                        hoverClass="hover:border-emerald-200 hover:shadow-emerald-100"
                        delay="delay-150"
                    />
                    <MenuCard
                        title="Bookmarks"
                        description="View your favorites."
                        icon={<Bookmark size={32} />}
                        onClick={() => navigate('/bookmarks')}
                        colorClass="text-purple-600 bg-purple-50"
                        hoverClass="hover:border-purple-200 hover:shadow-purple-100"
                        delay="delay-225"
                    />
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
