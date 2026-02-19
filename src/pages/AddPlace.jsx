import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowRight, ArrowLeft, Trash2, MapPin, Tag, Globe, CheckCircle2 } from 'lucide-react';

export default function AddPlace() {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [currentEntry, setCurrentEntry] = useState({ name: '', type: '', place: '' });
    const formRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentEntry(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (!currentEntry.name.trim() && !currentEntry.type.trim() && !currentEntry.place.trim()) return;

        const newEntries = [...entries, currentEntry];
        setEntries(newEntries);

        // Scroll to bottom after adding
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSaveAll = () => {
        let finalEntries = [...entries];
        if (currentEntry.name.trim() || currentEntry.type.trim() || currentEntry.place.trim()) {
            finalEntries.push(currentEntry);
        }

        if (finalEntries.length === 0) return;

        const existingData = JSON.parse(localStorage.getItem('myPlaces') || '[]');
        const updatedData = [...existingData, ...finalEntries];
        localStorage.setItem('myPlaces', JSON.stringify(updatedData));

        // Could add a toast here in a real app
        navigate('/all-places');
    };

    const removeEntry = (index) => {
        setEntries(entries.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-64 bg-indigo-600 z-0"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 text-white">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-full transition-colors">
                        <ArrowLeft size={18} />
                        <span className="font-medium">Back to Home</span>
                    </button>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Places</h1>
                    <div className="w-24"></div> {/* Spacer for center alignment */}
                </div>

                <div className="space-y-6">
                    {/* List of completed entries */}
                    {entries.map((entry, index) => (
                        <div key={index} className="glass-panel p-6 rounded-2xl relative group animate-in slide-in-from-bottom-4 duration-500 fade-in">
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => removeEntry(index)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                    title="Remove entry"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <div className="p-2 text-green-500">
                                    <CheckCircle2 size={20} />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Entry #{index + 1}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                        <Tag size={12} /> Name
                                    </label>
                                    <p className="text-lg font-medium text-slate-800">{entry.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                        <Globe size={12} /> Type
                                    </label>
                                    <p className="text-lg font-medium text-slate-800">{entry.type}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                        <MapPin size={12} /> Place
                                    </label>
                                    <p className="text-lg font-medium text-slate-800">{entry.place}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Current Form */}
                    <div ref={formRef} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-8 duration-700">
                        <div className="bg-indigo-50/50 p-4 border-b border-indigo-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm shadow-md">
                                    {entries.length + 1}
                                </span>
                                <span>New Entry Details</span>
                            </div>
                            <span className="text-xs text-indigo-400 font-medium px-2 py-1 bg-white rounded-md border border-indigo-100">
                                Editing Now
                            </span>
                        </div>

                        <div className="p-8 grid grid-cols-1 gap-6">
                            <InputField
                                label="Name"
                                icon={<Tag size={18} />}
                                name="name"
                                value={currentEntry.name}
                                onChange={handleInputChange}
                                placeholder="e.g. The Colosseum"
                                autoFocus
                            />
                            <InputField
                                label="Type/Category"
                                icon={<Globe size={18} />}
                                name="type"
                                value={currentEntry.type}
                                onChange={handleInputChange}
                                placeholder="e.g. Historic Site / Monument"
                            />
                            <InputField
                                label="Place/Location"
                                icon={<MapPin size={18} />}
                                name="place"
                                value={currentEntry.place}
                                onChange={handleInputChange}
                                placeholder="e.g. Rome, Italy"
                            />
                        </div>

                        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
                            <p className="text-xs text-slate-400 italic">
                                Note: Clicking "Next" will save this and start a new entry with these details pre-filled.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-200 p-4 shadow-2xl z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <div className="hidden md:block">
                        <p className="text-sm text-slate-500">
                            <span className="font-bold text-slate-800">{entries.length}</span> places ready to save
                        </p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={handleNext}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-all active:scale-95"
                        >
                            Add Next <ArrowRight size={18} />
                        </button>
                        <div className="w-px h-8 bg-slate-200 hidden md:block"></div>
                        <button
                            onClick={handleSaveAll}
                            disabled={entries.length === 0 && !currentEntry.name}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save All <Save size={18} />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

function InputField({ label, icon, name, value, onChange, placeholder, autoFocus }) {
    return (
        <div className="relative group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 pl-1">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    {icon}
                </div>
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    rows={2}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-100 outline-none transition-all resize-none shadow-sm placeholder:text-slate-400 text-slate-800 font-medium"
                />
            </div>
        </div>
    );
}
