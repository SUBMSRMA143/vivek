import { useNavigate } from 'react-router-dom';
import { PlusCircle, PlayCircle, Bookmark, MapPin, Globe } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-b-[3rem] shadow-2xl z-0"></div>

            <div className="relative z-10 container mx-auto px-6 pt-20 pb-12">
                <header className="text-center mb-16 text-white animate-in slide-in-from-top-10 duration-700 fade-in">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
                        <MapPin className="text-indigo-200 mr-2" size={20} />
                        <span className="text-indigo-100 font-medium text-sm tracking-wide uppercase">Discover the World</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
                        Place Learner
                    </h1>
                    <p className="text-xl text-indigo-100 max-w-2xl mx-auto font-light leading-relaxed">
                        Track your journey, quiz your knowledge, and build your personal atlas of the world.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <MenuCard
                        title="Add New Place"
                        description="Log a new country, city, or landmark you've learned about."
                        icon={<PlusCircle size={40} />}
                        onClick={() => navigate('/add')}
                        colorClass="text-blue-600 bg-blue-50"
                        hoverClass="hover:border-blue-200 hover:shadow-blue-100"
                        delay="delay-0"
                    />
                    <MenuCard
                        title="All Places"
                        description="Browse your entire collection of tracked locations."
                        icon={<Globe size={40} />}
                        onClick={() => navigate('/all-places')}
                        colorClass="text-indigo-600 bg-indigo-50"
                        hoverClass="hover:border-indigo-200 hover:shadow-indigo-100"
                        delay="delay-100"
                    />
                    <MenuCard
                        title="Start Quiz"
                        description="Test your memory with rapid-fire questions about your places."
                        icon={<PlayCircle size={40} />}
                        onClick={() => navigate('/quiz')}
                        colorClass="text-emerald-600 bg-emerald-50"
                        hoverClass="hover:border-emerald-200 hover:shadow-emerald-100"
                        delay="delay-200"
                    />
                    <MenuCard
                        title="Bookmarks"
                        description="View your curated list of favorites."
                        icon={<Bookmark size={40} />}
                        onClick={() => navigate('/bookmarks')}
                        colorClass="text-purple-600 bg-purple-50"
                        hoverClass="hover:border-purple-200 hover:shadow-purple-100"
                        delay="delay-300"
                    />
                </div>

                <footer className="mt-20 text-center text-slate-400 text-sm animate-in fade-in duration-1000 delay-500">
                    <p>© 2026 Place Learner Inc. Keep exploring.</p>
                </footer>
            </div>
        </div>
    );
}

function MenuCard({ title, description, icon, onClick, colorClass, hoverClass, delay }) {
    return (
        <button
            onClick={onClick}
            className={`bg-white p-8 rounded-3xl shadow-lg border border-transparent text-left transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl group ${hoverClass} animate-in slide-in-from-bottom-8 fade-in duration-500 ${delay}`}
        >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${colorClass}`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{title}</h3>
            <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
        </button>
    );
}
