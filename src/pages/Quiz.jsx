import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, MapPin, Award, RefreshCw, HelpCircle, Check, X, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti'; // We'll need to install this or just simulate it for now

export default function Quiz() {
    const navigate = useNavigate();
    const [places, setPlaces] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [quizState, setQuizState] = useState('loading'); // loading, intro, playing, finished
    const [allPlaces, setAllPlaces] = useState([]);
    const [questionPlaces, setQuestionPlaces] = useState([]);
    const [quizCategory, setQuizCategory] = useState('all'); // all, india, world
    const [userResults, setUserResults] = useState([]); // Store { name, userAnswer, correctAnswer, isCorrect, points }

    // Hints state for current question
    const [hints, setHints] = useState({ type: false, location: false });

    useEffect(() => {
        const savedPlaces = JSON.parse(localStorage.getItem('myPlaces') || '[]');
        if (savedPlaces.length < 1) {
            setQuizState('empty');
            return;
        }

        // Handle migration for legacy data
        const migrated = savedPlaces.map(p => ({ ...p, category: p.category || 'world' }));
        setAllPlaces(migrated);
        setQuizState('intro');
    }, []);

    const startQuiz = (category = 'all') => {
        setQuizCategory(category);

        let filtered = [...allPlaces];
        if (category !== 'all') {
            filtered = allPlaces.filter(p => p.category === category);
        }

        if (filtered.length === 0) {
            alert(`You don't have any places in the ${category} category yet!`);
            return;
        }

        // Shuffle and pick max 5 or 10 questions
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        setQuestionPlaces(shuffled.slice(0, 10)); // Limit to 10 for play

        setQuizState('playing');
        setCurrentQuestionIndex(0);
        setScore(0);
        setUserResults([]);
        resetQuestionState();
    };

    const resetQuestionState = () => {
        setUserAnswer('');
        setHints({ type: false, location: false });
    };

    const currentPlace = questionPlaces[currentQuestionIndex];

    const handleRevealType = () => {
        if (!hints.type) {
            setHints(prev => ({ ...prev, type: true }));
        }
    };

    const handleRevealLocation = () => {
        if (!hints.location) {
            setHints(prev => ({ ...prev, location: true }));
            setUserAnswer(currentPlace.place); // Auto-fill answer
        }
    };

    const handleNext = () => {
        const isCorrect = userAnswer.toLowerCase().trim() === currentPlace.place.toLowerCase().trim();

        let pointsEarned = 0;
        if (isCorrect) {
            if (hints.location) {
                pointsEarned = 0;
            } else {
                pointsEarned = 10;
                if (hints.type) pointsEarned -= 2;
            }
        }

        // Store result
        const result = {
            name: currentPlace.name,
            userAnswer: userAnswer.trim() || '(No Answer)',
            correctAnswer: currentPlace.place,
            isCorrect,
            points: pointsEarned
        };

        setUserResults(prev => [...prev, result]);
        setScore(prev => prev + pointsEarned);

        if (currentQuestionIndex < questionPlaces.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            resetQuestionState();
        } else {
            setQuizState('finished');
        }
    };

    if (quizState === 'loading') return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;

    if (quizState === 'empty') return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <HelpCircle size={48} className="text-indigo-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">No Places to Quiz!</h1>
            <p className="text-slate-500 mb-8 max-w-md">You need to add some places to your collection before you can take a quiz.</p>
            <button onClick={() => navigate('/add')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-md hover:bg-indigo-700">Add Places</button>
            <button onClick={() => navigate('/')} className="mt-4 text-slate-500 hover:text-indigo-600">Back to Home</button>
        </div>
    );

    if (quizState === 'intro') return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shrink-0 mt-8">
                <Lightbulb size={48} className="text-indigo-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Quiz <span className="text-indigo-600">Time!</span></h1>
            <p className="text-lg text-slate-500 mb-10 font-medium">Choose what you want to test yourself on:</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-12">
                <QuizCategoryCard
                    title="India Only"
                    icon="🇮🇳"
                    count={allPlaces.filter(p => p.category === 'india').length}
                    onClick={() => startQuiz('india')}
                    accent="orange"
                />
                <QuizCategoryCard
                    title="All World"
                    icon="🌍"
                    count={allPlaces.filter(p => p.category === 'world').length}
                    onClick={() => startQuiz('world')}
                    accent="indigo"
                />
                <QuizCategoryCard
                    title="Mixed"
                    icon={<Award size={24} className="text-amber-500" />}
                    count={allPlaces.length}
                    onClick={() => startQuiz('all')}
                    accent="slate"
                />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-lg w-full mb-8 text-left">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <HelpCircle size={18} className="text-indigo-500" /> How it works:
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-green-50 rounded-xl">
                        <div className="text-xs font-black text-green-700 uppercase mb-1">Correct</div>
                        <div className="font-black text-green-600">10</div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl">
                        <div className="text-xs font-black text-amber-700 uppercase mb-1">Hint 1</div>
                        <div className="font-black text-amber-600">-2</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                        <div className="text-xs font-black text-slate-400 uppercase mb-1">Hint 2</div>
                        <div className="font-black text-slate-500">0</div>
                    </div>
                </div>
            </div>

            <button onClick={() => navigate('/')} className="mb-8 font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest text-xs">Back to Home</button>
        </div>
    );

    if (quizState === 'finished') return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-6">
            <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
                        <Award size={64} className="text-indigo-600" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-4xl font-black text-slate-900 mb-2">Quiz Complete!</h1>
                        <p className="text-slate-500 font-medium text-lg">You've tested your knowledge on {questionPlaces.length} places.</p>
                    </div>
                    <div className="bg-indigo-600 text-white px-8 py-6 rounded-3xl text-center shadow-lg shadow-indigo-100">
                        <div className="text-xs font-black uppercase tracking-widest mb-1 opacity-80">Final Score</div>
                        <div className="text-5xl font-black">{score}</div>
                        <div className="text-[10px] font-bold mt-1 opacity-60">OUT OF {questionPlaces.length * 10}</div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-slate-50 border-b border-slate-100 px-8 py-4 flex items-center justify-between">
                        <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs">Results Summary</h2>
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {userResults.filter(r => r.isCorrect).length} Correct
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Place</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Answer</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct Answer</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {userResults.map((result, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4 font-bold text-slate-800">{result.name}</td>
                                        <td className={`px-8 py-4 font-medium ${result.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                            {result.userAnswer}
                                        </td>
                                        <td className="px-8 py-4 font-medium text-slate-500">{result.correctAnswer}</td>
                                        <td className="px-8 py-4">
                                            {result.isCorrect ? (
                                                <div className="flex items-center gap-1 text-green-600 font-black text-[10px] uppercase tracking-widest">
                                                    <Check size={14} /> Correct
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-red-500 font-black text-[10px] uppercase tracking-widest">
                                                    <X size={14} /> Incorrect
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-10 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-black hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 group"
                    >
                        <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        TRY ANOTHER REGION
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        BACK TO HOME
                    </button>
                </div>
            </div>
        </div>
    );

    // Playing State
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Progress Bar */}
            <div className="h-2 bg-slate-200 w-full">
                <div
                    className="h-full bg-indigo-600 transition-all duration-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                    style={{ width: `${((currentQuestionIndex) / questionPlaces.length) * 100}%` }}
                ></div>
            </div>

            <div className="container mx-auto px-4 py-8 flex-1 flex flex-col max-w-2xl">
                <div className="flex justify-between items-center mb-12 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                    <div className="flex flex-col">
                        <span className="mb-1">Progress</span>
                        <span className="text-sm font-bold text-slate-800 tracking-normal">
                            Question <span className="text-indigo-600">{currentQuestionIndex + 1}</span> of {questionPlaces.length}
                        </span>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 mb-8 flex-1 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-50 rounded-full opacity-40 blur-3xl z-0 group-hover:bg-indigo-100 transition-colors duration-1000"></div>

                    <div className="relative z-10 text-center">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-12">
                            Where is <span className="text-indigo-600 underline decoration-indigo-200 decoration-8 underline-offset-8">{currentPlace.name}</span> located?
                        </h2>

                        <div className="mb-12 relative">
                            <input
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Type your answer..."
                                className="w-full text-center text-3xl font-black pb-4 border-b-4 border-slate-100 focus:border-indigo-600 outline-none bg-transparent transition-all placeholder:text-slate-200 text-slate-800 selection:bg-indigo-100 uppercase"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                            />
                        </div>

                        {/* Hints Area */}
                        <div className="grid grid-cols-2 gap-6">
                            <button
                                onClick={handleRevealType}
                                disabled={hints.type}
                                className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all group/hint ${hints.type
                                    ? 'bg-orange-50 border-orange-200 text-orange-700'
                                    : 'bg-white border-slate-100 text-slate-400 hover:border-orange-200 hover:text-orange-600 hover:shadow-lg hover:shadow-orange-50'}`}
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest">{hints.type ? 'Category Revealed' : 'Hint 1 (-2pts)'}</span>
                                <span className="font-black text-xl">{hints.type ? currentPlace.type : 'Reveal Category'}</span>
                            </button>

                            <button
                                onClick={handleRevealLocation}
                                disabled={hints.location}
                                className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all group/hint ${hints.location
                                    ? 'bg-slate-100 border-slate-200 text-slate-500'
                                    : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-lg hover:shadow-indigo-50'}`}
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest">{hints.location ? 'Answer Shown' : 'Hint 2 (0pts)'}</span>
                                <span className="font-black text-xl">{hints.location ? 'Location Shown' : 'Give Me Answer'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleNext}
                    className="w-full py-6 bg-indigo-600 text-white text-2xl font-black rounded-[2rem] shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-3 group"
                >
                    {currentQuestionIndex === questionPlaces.length - 1 ? 'FINISH QUIZ' : 'NEXT PLACE'}
                    <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
        </div>
    );
}

function QuizCategoryCard({ title, icon, count, onClick, accent }) {
    const accentClasses = {
        orange: 'hover:border-orange-500 hover:shadow-orange-100 text-orange-600 bg-orange-50',
        indigo: 'hover:border-indigo-500 hover:shadow-indigo-100 text-indigo-600 bg-indigo-50',
        slate: 'hover:border-slate-500 hover:shadow-slate-100 text-slate-600 bg-slate-50'
    };

    return (
        <button
            onClick={onClick}
            className={`p-6 bg-white border-2 border-slate-100 rounded-2xl shadow-sm transition-all flex flex-col items-center gap-3 group ${accentClasses[accent]}`}
        >
            <div className="text-3xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className="text-center">
                <div className="font-bold text-slate-800">{title}</div>
                <div className="text-xs font-medium text-slate-400">{count} Places</div>
            </div>
        </button>
    );
}
