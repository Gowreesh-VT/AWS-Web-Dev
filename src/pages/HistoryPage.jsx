import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Trash2, RotateCcw, Search, X } from 'lucide-react';
import { getHistory, clearHistory, deleteHistoryEntry } from '../lib/storage';

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const handleClearAll = () => {
        if (window.confirm('Clear all search history? This cannot be undone.')) {
            clearHistory();
            setHistory([]);
        }
    };

    const handleDelete = (id) => {
        const updated = deleteHistoryEntry(id);
        setHistory(updated);
    };

    const handleReSearch = (mood) => {
        // Navigate to home with mood as search param
        navigate(`/?mood=${encodeURIComponent(mood)}`);
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen pt-20">
            <div className="bg-ambient" />

            <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-6 h-6 text-accent" />
                            <h1 className="text-3xl font-bold font-[var(--font-heading)]">
                                Search <span className="gradient-text">History</span>
                            </h1>
                        </div>
                        <p className="text-text-muted text-sm">
                            {history.length} past search{history.length !== 1 ? 'es' : ''}
                        </p>
                    </div>

                    {history.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-danger/80 hover:text-danger hover:bg-danger/10 transition-all duration-300 border border-transparent hover:border-danger/20"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear All
                        </button>
                    )}
                </div>

                {/* History List */}
                {history.length > 0 ? (
                    <div className="space-y-3">
                        {history.map((entry, i) => (
                            <div
                                key={entry.id}
                                className="glass glass-hover rounded-xl p-4 animate-fade-in-up group"
                                style={{ animationDelay: `${i * 40}ms` }}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        {/* Mood text */}
                                        <p className="text-text font-medium text-sm mb-2 truncate">
                                            "{entry.mood}"
                                        </p>

                                        {/* Genres + meta */}
                                        <div className="flex items-center gap-3 flex-wrap">
                                            {entry.genres?.map((genre) => (
                                                <span key={genre} className="genre-chip text-xs py-0.5 px-2">
                                                    {genre}
                                                </span>
                                            ))}
                                            <span className="text-text-dim text-xs">
                                                {entry.movieCount} movies · {formatTime(entry.timestamp)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <button
                                            onClick={() => handleReSearch(entry.mood)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-accent hover:bg-accent/10 transition-all duration-200"
                                            title="Search again"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(entry.id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                            title="Delete"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 rounded-2xl bg-surface-light flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-text-dim" />
                        </div>
                        <h2 className="text-xl font-semibold text-text mb-2">No search history</h2>
                        <p className="text-text-muted max-w-md mx-auto">
                            Your mood searches will appear here so you can revisit them anytime.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
