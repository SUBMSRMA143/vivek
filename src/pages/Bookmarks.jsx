import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';

export default function Bookmarks() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 relative flex items-center justify-center">
            <div className="absolute top-6 left-6">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors group"
                >
                    <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all">
                        <ArrowLeft size={20} />
                    </div>
                    <span className="font-medium">Back to Home</span>
                </button>
            </div>

            <div className="text-center max-w-lg px-6">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <Star size={48} className="text-purple-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-800 mb-4">Curated Bookmarks</h1>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    This space is reserved for your favorite places. Select items from your collection to appear here.
                </p>
                <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold tracking-wide">
                    Coming Soon
                </span>
            </div>
        </div>
    );
}
