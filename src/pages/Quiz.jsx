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
    const [quizState, setQuizState] = useState('loading'); // loading, intro, playing, feedback, finished
    const [questionPlaces, setQuestionPlaces] = useState([]);

    // Hints state for current question
    const [hints, setHints] = useState({ type: false, location: false });
    const [feedback, setFeedback] = useState({ isCorrect: false, message: '' });

    useEffect(() => {
        const savedPlaces = JSON.parse(localStorage.getItem('myPlaces') || '[]');
        if (savedPlaces.length < 1) {
            setQuizState('empty');
            return;
        }

        // Shuffle and pick max 5 or 10 questions
        const shuffled = [...savedPlaces].sort(() => 0.5 - Math.random());
        setQuestionPlaces(shuffled.slice(0, 5)); // Limit to 5 for quick play
        setPlaces(savedPlaces);
        setQuizState('intro');
    }, []);

    const startQuiz = () => {
        setQuizState('playing');
        setCurrentQuestionIndex(0);
        setScore(0);
        resetQuestionState();
    };

    const resetQuestionState = () => {
        setUserAnswer('');
        setHints({ type: false, location: false });
        setFeedback({ isCorrect: false, message: '' });
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

    const submitAnswer = () => {
        const isCorrect = userAnswer.toLowerCase().trim() === currentPlace.place.toLowerCase().trim();

        let pointsEarned = 0;
        if (isCorrect) {
            // Scoring Logic
            // Base: 10
            // Hint 1 used: -2
            // Hint 2 used: 0 points total (since answer was revealed)

            if (hints.location) {
                pointsEarned = 0;
            } else {
                pointsEarned = 10;
                if (hints.type) pointsEarned -= 2;
            }
        }

        setScore(prev => prev + pointsEarned);
        setFeedback({
            isCorrect,
            message: isCorrect
                ? `Correct! +${pointsEarned} points`
                : `Incorrect. The correct location was ${currentPlace.place}.`
        });

        if (isCorrect) {
            // Trigger generic confetti if strictly correct
            // confetti(); 
        }

        setQuizState('feedback');
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questionPlaces.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            resetQuestionState();
            setQuizState('playing');
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
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center mb-8 animate-bounce-slow">
                <Lightbulb size={64} className="text-indigo-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Ready to Quiz?</h1>
            <p className="text-xl text-slate-600 mb-8 max-w-lg">
                We've selected <strong className="text-indigo-600">{questionPlaces.length} random places</strong> from your collection.
                Test your memory and see how high you can score!
            </p>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-md w-full mb-8 text-left">
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <Award size={18} className="text-amber-500" /> Scoring Rules:
                </h3>
                <ul className="text-sm text-slate-600 space-y-2">
                    <li className="flex items-center justify-between">
                        <span>Correct Answer</span>
                        <span className="font-bold text-green-600">+10 pts</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <span>Use Type Hint</span>
                        <span className="font-bold text-amber-600">-2 pts</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <span>Reveal Location</span>
                        <span className="font-bold text-slate-400">0 pts</span>
                    </li>
                </ul>
            </div>

            <button
                onClick={startQuiz}
                className="px-10 py-4 bg-indigo-600 text-white text-lg font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all"
            >
                Start Quiz
            </button>
            <button onClick={() => navigate('/')} className="mt-8 text-slate-400 hover:text-slate-600">Cancel</button>
        </div>
    );

    if (quizState === 'finished') return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-700 flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-8">
                <Award size={64} className="text-yellow-300 drop-shadow-lg" />
            </div>
            <h1 className="text-5xl font-extrabold mb-2">Quiz Complete!</h1>
            <p className="text-indigo-100 text-xl mb-12">You've tested your knowledge on {questionPlaces.length} places.</p>

            <div className="bg-white text-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full mb-10 transform hover:scale-105 transition-transform duration-500">
                <h2 className="text-slate-500 uppercase tracking-widest text-sm font-semibold mb-2">Total Score</h2>
                <div className="text-7xl font-black text-indigo-600 mb-2">
                    {score}
                </div>
                <div className="text-sm font-medium text-slate-400">
                    out of possible {questionPlaces.length * 10}
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    className="flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
                    onClick={() => window.location.reload()} // Easy way to reshuffle for now
                >
                    <RefreshCw size={20} /> Play Again
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-4 bg-indigo-800/50 text-indigo-100 rounded-xl font-bold hover:bg-indigo-800 transition-colors"
                >
                    Home
                </button>
            </div>
        </div>
    );

    // Playing & Feedback State
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Progress Bar */}
            <div className="h-2 bg-slate-200 w-full">
                <div
                    className="h-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${((currentQuestionIndex) / questionPlaces.length) * 100}%` }}
                ></div>
            </div>

            <div className="container mx-auto px-4 py-8 flex-1 flex flex-col max-w-2xl">
                <div className="flex justify-between items-center mb-8">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                        Question {currentQuestionIndex + 1} of {questionPlaces.length}
                    </span>
                    <div className="bg-white px-4 py-2 rounded-full shadow-sm text-indigo-600 font-bold border border-indigo-50">
                        Score: {score}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-8 flex-1 flex flex-col justify-center relative overflow-hidden">
                    {/* Decorative blob */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50 rounded-full opacity-50 z-0"></div>

                    <div className="relative z-10 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight mb-8">
                            Where is <span className="text-indigo-600 underline decoration-indigo-200 decoration-4 underline-offset-4">{currentPlace.name}</span> situated at?
                        </h2>

                        {quizState === 'feedback' ? (
                            <div className={`p-6 rounded-2xl mb-8 ${feedback.isCorrect ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'} animate-in fade-in zoom-in duration-300`}>
                                <div className="flex items-center justify-center gap-3 text-xl font-bold mb-2">
                                    {feedback.isCorrect ? <Check size={28} /> : <X size={28} />}
                                    {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
                                </div>
                                <p>{feedback.message}</p>
                            </div>
                        ) : (
                            <div className="mb-8">
                                <input
                                    type="text"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="Type the location name..."
                                    className="w-full text-center text-2xl p-4 border-b-2 border-slate-200 focus:border-indigo-600 outline-none bg-transparent transition-colors placeholder:text-slate-300 font-medium"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
                                />
                            </div>
                        )}

                        {/* Hints Area */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                onClick={handleRevealType}
                                disabled={hints.type || quizState === 'feedback'}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${hints.type
                                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'}`}
                            >
                                <span className="text-xs font-bold uppercase tracking-wider">{hints.type ? 'Type Revealed' : 'Hint 1 (-2pts)'}</span>
                                <span className="font-medium text-lg">{hints.type ? currentPlace.type : 'Reveal Type'}</span>
                            </button>

                            <button
                                onClick={handleRevealLocation}
                                disabled={hints.location || quizState === 'feedback'}
                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${hints.location
                                    ? 'bg-slate-100 border-slate-200 text-slate-500'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'}`}
                            >
                                <span className="text-xs font-bold uppercase tracking-wider">{hints.location ? 'Answer Revealed' : 'Hint 2 (0pts)'}</span>
                                <span className="font-medium text-lg">{hints.location ? 'Location Shown' : 'Reveal Location'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                {quizState === 'feedback' ? (
                    <button
                        onClick={nextQuestion}
                        className="w-full py-4 bg-indigo-600 text-white text-xl font-bold rounded-2xl shadow-lg hover:bg-indigo-700 transition-transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        Next Question <ArrowRight size={24} />
                    </button>
                ) : (
                    <button
                        onClick={submitAnswer}
                        disabled={!userAnswer.trim()}
                        className="w-full py-4 bg-indigo-600 text-white text-xl font-bold rounded-2xl shadow-lg hover:bg-indigo-700 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Submit Answer
                    </button>
                )}
            </div>
        </div>
    );
}
