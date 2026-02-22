import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, MapPin, Globe, Award, CheckCircle2, HelpCircle, PlayCircle, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PLACES_DATA } from '../data/places';

export default function Quiz() {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizState, setQuizState] = useState('intro'); // intro, playing, finished
    const [questionPlaces, setQuestionPlaces] = useState([]);
    const [quizCategory, setQuizCategory] = useState('all'); // all, india, world
    const [geoFilter, setGeoFilter] = useState('all'); // all, mountain, water, plains, deserts, lakes, rivers
    const [selectedCategory, setSelectedCategory] = useState(null); // For two-step selection
    const [userResults, setUserResults] = useState([]); // Store { name, status: 'known' | 'unknown' }
    const [localPlaces, setLocalPlaces] = useState([]);

    // Hints state for current question
    const [hints, setHints] = useState({ type: false, subtype: false, location: false });

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('myPlaces') || '[]');
        if (saved.length === 0) {
            const initialData = PLACES_DATA.map(p => ({ ...p, isBookmarked: false }));
            setLocalPlaces(initialData);
            localStorage.setItem('myPlaces', JSON.stringify(initialData));
        } else {
            setLocalPlaces(saved);
        }
    }, []);

    const startQuiz = (category = 'all') => {
        setQuizCategory(category);

        let filtered = [...localPlaces];

        // 1. Regional Filter
        if (category === 'bookmarks') {
            filtered = filtered.filter(p => p.isBookmarked);
        } else if (category !== 'all') {
            filtered = filtered.filter(p => p.category === category);
        }

        // 2. Geography Filter
        if (geoFilter !== 'all') {
            if (geoFilter === 'water bodies') {
                filtered = filtered.filter(p => p.type === 'Water Body');
            } else if (geoFilter === 'lakes only') {
                filtered = filtered.filter(p => p.subtype === 'Lake');
            } else if (geoFilter === 'rivers only') {
                filtered = filtered.filter(p => p.subtype === 'River');
            } else if (geoFilter === 'mountain') {
                filtered = filtered.filter(p => p.type === 'Mountain');
            } else if (geoFilter === 'plains') {
                filtered = filtered.filter(p => p.type === 'Plains');
            } else if (geoFilter === 'deserts') {
                filtered = filtered.filter(p => p.type === 'Desert');
            }
        }

        if (filtered.length === 0) {
            alert(`No places found matching your selection! Try a different combination.`);
            return;
        }

        // Shuffle all places in the category
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        setQuestionPlaces(shuffled);

        setQuizState('playing');
        setCurrentQuestionIndex(0);
        setUserResults([]);
        resetQuestionState();
    };

    const handleCategoryClick = (category) => {
        if (category === 'india' || category === 'world') {
            setSelectedCategory(category);
        } else {
            startQuiz(category);
        }
    };

    const toggleBookmark = (id) => {
        setLocalPlaces(prev => {
            const updated = prev.map(p => p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p);
            localStorage.setItem('myPlaces', JSON.stringify(updated));

            // If we are currently in a quiz, we need to update the questionPlaces as well
            // so the current card reflects the change immediately
            setQuestionPlaces(qPrev => qPrev.map(p => p.id === id ? { ...p, isBookmarked: !p.isBookmarked } : p));

            return updated;
        });
    };

    const resetQuestionState = () => {
        setHints({ type: false, subtype: false, location: false });
    };

    const currentPlace = questionPlaces[currentQuestionIndex];

    const handleRevealType = () => setHints(prev => ({ ...prev, type: true }));
    const handleRevealSubtype = () => setHints(prev => ({ ...prev, subtype: true }));
    const handleRevealLocation = () => setHints(prev => ({ ...prev, location: true }));

    const handleResult = (isKnown) => {
        // Store result
        const result = {
            name: currentPlace.name,
            correctAnswer: currentPlace.place,
            status: isKnown ? 'known' : 'unknown'
        };

        setUserResults(prev => [...prev, result]);

        if (currentQuestionIndex < questionPlaces.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            resetQuestionState();
        } else {
            setQuizState('finished');
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#4f46e5', '#818cf8', '#fbbf24']
            });
        }
    };

    if (quizState === 'intro') return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-100/40 rounded-bl-full -z-0"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-orange-100/30 rounded-tr-full -z-0"></div>

            <div className="relative z-10 text-center max-w-2xl animate-in zoom-in duration-700">
                <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-200 rotate-3">
                    <Award size={40} className="text-white" />
                </div>
                <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
                    Place <span className="text-indigo-600">Flashcards</span>
                </h1>
                <p className="text-lg text-slate-600 mb-10 font-medium leading-relaxed">
                    Test your knowledge! {selectedCategory ? `Customize your ${selectedCategory} review.` : 'Pick a region to start your review.'}
                </p>

                {selectedCategory ? (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        {/* Geography Dropdown */}
                        <div className="max-w-xs mx-auto mb-8">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Filter by Terrain</label>
                            <div className="relative">
                                <select
                                    value={geoFilter}
                                    onChange={(e) => setGeoFilter(e.target.value)}
                                    className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all font-bold text-slate-800 appearance-none shadow-sm cursor-pointer"
                                >
                                    <option value="all">All Terrains</option>
                                    <option value="mountain">Mountains</option>
                                    <option value="water bodies">Water Bodies (All)</option>
                                    <option value="plains">Plains</option>
                                    <option value="deserts">Deserts</option>
                                    <option value="lakes only">Lakes Only</option>
                                    <option value="rivers only">Rivers Only</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <Globe size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 mb-12 max-w-xs mx-auto">
                            <button
                                onClick={() => startQuiz(selectedCategory)}
                                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
                            >
                                <PlayCircle size={24} /> Start {selectedCategory} Quiz
                            </button>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="text-slate-400 font-bold hover:text-slate-600 transition-colors py-2"
                            >
                                ← Switch Category
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 w-full mb-12 animate-in fade-in duration-500">
                        <QuizCategoryCard
                            title="India"
                            icon="🇮🇳"
                            count={localPlaces.filter(p => p.category === 'india').length}
                            onClick={() => handleCategoryClick('india')}
                            accent="orange"
                        />
                        <QuizCategoryCard
                            title="World"
                            icon="🌍"
                            count={localPlaces.filter(p => p.category === 'world').length}
                            onClick={() => handleCategoryClick('world')}
                            accent="indigo"
                        />
                        {localPlaces.some(p => p.isBookmarked) && (
                            <QuizCategoryCard
                                title="Bookmarks"
                                icon="⭐"
                                count={localPlaces.filter(p => p.isBookmarked).length}
                                onClick={() => handleCategoryClick('bookmarks')}
                                accent="amber"
                            />
                        )}
                        <QuizCategoryCard
                            title="Special-1"
                            icon="🌟"
                            count={localPlaces.filter(p => p.category === 'special-1').length}
                            onClick={() => handleCategoryClick('special-1')}
                            accent="purple"
                        />
                        <QuizCategoryCard
                            title="Special-2"
                            icon="✨"
                            count={localPlaces.filter(p => p.category === 'special-2').length}
                            onClick={() => handleCategoryClick('special-2')}
                            accent="orange"
                        />
                        <QuizCategoryCard
                            title="Mixed"
                            icon="🎭"
                            count={localPlaces.length}
                            onClick={() => handleCategoryClick('all')}
                            accent="slate"
                        />
                    </div>
                )}

                <button
                    onClick={() => navigate('/')}
                    className="text-slate-400 font-bold hover:text-slate-600 transition-colors"
                >
                    Back to Collection
                </button>
            </div>
        </main>
    );

    if (quizState === 'playing') return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-6">
            {/* Progress HUD */}
            <header className="w-full max-w-2xl mb-12 flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <button
                    onClick={() => {
                        setQuizState('intro');
                        setSelectedCategory(null);
                    }}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Progress</span>
                    <div className="flex items-center gap-1.5 font-black text-slate-900 text-xl">
                        <span className="text-indigo-600">{currentQuestionIndex + 1}</span>
                        <span className="text-slate-300">/</span>
                        <span>{questionPlaces.length}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => toggleBookmark(currentPlace.id)}
                        className={`p-3 rounded-xl transition-all ${currentPlace.isBookmarked
                            ? 'bg-amber-50 text-amber-500 shadow-sm'
                            : 'text-slate-300 hover:text-slate-400'}`}
                        title={currentPlace.isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                    >
                        <Star size={24} fill={currentPlace.isBookmarked ? "currentColor" : "none"} />
                    </button>
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center font-black text-indigo-600">
                        ID:{currentPlace.id}
                    </div>
                </div>
            </header>

            {/* Main Question Card */}
            <div className="w-full max-w-2xl bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 p-12 border border-slate-50 relative overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[4rem] -z-0 opacity-50"></div>

                <div className="relative z-10 text-center">
                    <div className="mb-12">
                        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block border border-indigo-100/50">
                            Identify the place
                        </span>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            {currentPlace.name}
                        </h2>
                    </div>

                    {/* Sequential Hints */}
                    <div className="space-y-4 mb-12">
                        <HintButton
                            label="Type"
                            icon={<Tag size={18} />}
                            content={currentPlace.type}
                            isRevealed={hints.type}
                            onClick={handleRevealType}
                            accent="orange"
                        />
                        <HintButton
                            label="Sub-category"
                            icon={<Globe size={18} />}
                            content={currentPlace.subtype}
                            isRevealed={hints.subtype}
                            onClick={handleRevealSubtype}
                            accent="purple"
                        />
                        <HintButton
                            label="Exact Location"
                            icon={<MapPin size={18} />}
                            content={currentPlace.place}
                            isRevealed={hints.location}
                            onClick={handleRevealLocation}
                            accent="indigo"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={() => handleResult(false)}
                            className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-[2rem] font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3 border-b-4 border-slate-200 active:border-b-0 active:translate-y-1"
                        >
                            <HelpCircle size={24} /> I DON'T KNOW
                        </button>
                        <button
                            onClick={() => handleResult(true)}
                            className="flex-1 py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1"
                        >
                            <CheckCircle2 size={24} /> I KNOW THIS
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );

    if (quizState === 'finished') return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-6">
            <div className="w-full max-w-4xl bg-white rounded-[3.5rem] shadow-2xl p-12 text-center border border-slate-50 relative overflow-hidden animate-in slide-in-from-bottom-6 duration-700">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-indigo-500 to-purple-600"></div>

                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-600 border-4 border-white shadow-lg">
                    <Award size={48} />
                </div>

                <h1 className="text-5xl font-black text-slate-900 mb-4">Review Complete!</h1>
                <p className="text-slate-500 mb-12 font-medium bg-slate-50 py-3 px-6 rounded-2xl inline-block border border-slate-100">
                    Category: <strong className="capitalize text-indigo-600">{quizCategory}</strong> collection
                </p>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-6 mb-12">
                    <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Knowledge Mastered</p>
                        <p className="text-5xl font-black text-green-700">{userResults.filter(r => r.status === 'known').length}</p>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Needs Refreshing</p>
                        <p className="text-5xl font-black text-orange-700">{userResults.filter(r => r.status === 'unknown').length}</p>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="text-left mb-12 bg-slate-50 rounded-3xl p-4 border border-slate-100 max-h-96 overflow-y-auto custom-scrollbar">
                    <table className="w-full">
                        <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-100">
                            <tr>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Landmark</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct Location</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Self Assessment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {userResults.map((result, idx) => (
                                <tr key={idx} className="hover:bg-white transition-colors">
                                    <td className="p-4 font-bold text-slate-800">{result.name}</td>
                                    <td className="p-4 text-sm text-slate-500 font-medium">{result.correctAnswer}</td>
                                    <td className="p-4 text-right">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${result.status === 'known'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {result.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => {
                            setQuizState('intro');
                            setSelectedCategory(null);
                        }}
                        className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                    >
                        <ArrowLeft size={20} /> TRY ANOTHER REGION
                    </button>
                    <button
                        onClick={() => navigate('/all-places')}
                        className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
                    >
                        BACK TO COLLECTION
                    </button>
                </div>
            </div>
        </main>
    );

    return null;
}

function QuizCategoryCard({ title, icon, count, onClick, accent }) {
    const accents = {
        orange: 'hover:border-orange-200 hover:shadow-orange-100/50 text-orange-600 bg-orange-50/50',
        indigo: 'hover:border-indigo-200 hover:shadow-indigo-100/50 text-indigo-600 bg-indigo-50/50',
        amber: 'hover:border-amber-200 hover:shadow-amber-100/50 text-amber-600 bg-amber-50/50',
        purple: 'hover:border-purple-200 hover:shadow-purple-100/50 text-purple-600 bg-purple-50/50',
        slate: 'hover:border-slate-200 hover:shadow-slate-100/50 text-slate-600 bg-slate-50/50'
    };

    return (
        <button
            onClick={onClick}
            className={`p-6 rounded-3xl border-2 border-white shadow-sm transition-all flex flex-col items-center gap-2 group ${accents[accent]} bg-white`}
        >
            <span className="text-3xl mb-1 group-hover:scale-125 transition-transform duration-500">{icon}</span>
            <span className="font-black text-slate-900 tracking-tight">{title}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{count} items</span>
        </button>
    );
}

function HintButton({ label, icon, content, isRevealed, onClick, accent }) {
    const accents = {
        orange: 'bg-orange-50 border-orange-100 text-orange-600',
        purple: 'bg-purple-50 border-purple-100 text-purple-600',
        indigo: 'bg-indigo-50 border-indigo-100 text-indigo-600'
    };

    return (
        <button
            onClick={onClick}
            disabled={isRevealed}
            className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between group/hint ${isRevealed
                ? accents[accent]
                : 'bg-white border-slate-100 hover:border-slate-200 text-slate-400'
                }`}
        >
            <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl transition-colors ${isRevealed ? 'bg-white/80' : 'bg-slate-50 group-hover/hint:bg-slate-100'}`}>
                    {icon}
                </div>
                <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">{label}</p>
                    <p className={`font-bold tracking-tight ${isRevealed ? 'text-slate-800' : 'text-slate-300'}`}>
                        {isRevealed ? content || 'N/A' : 'Click to reveal hint'}
                    </p>
                </div>
            </div>
            {!isRevealed && (
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover/hint:text-slate-500 transition-colors">Reveal</span>
            )}
        </button>
    );
}
