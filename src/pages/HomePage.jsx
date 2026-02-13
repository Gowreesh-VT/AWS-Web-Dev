import { useState, useEffect } from 'react';
import { Search, Sparkles, TrendingUp, Loader2, AlertCircle, Popcorn } from 'lucide-react';
import { moodToGenres, discoverMovies, getTrending } from '../lib/tmdb';
import { addHistory } from '../lib/storage';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';

const MOOD_SUGGESTIONS = [
    '😊 Feeling happy and cheerful',
    '😢 Sad and need comfort',
    '😱 Want something scary',
    '💕 In a romantic mood',
    '🚀 Craving adventure',
    '🧠 Want something thought-provoking',
    '😂 Need a good laugh',
    '🌙 Cozy night in',
    '💪 Feeling energetic',
    '🔍 Love a good mystery',
];

export default function HomePage() {
    const [mood, setMood] = useState('');
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // Load trending on mount
    useEffect(() => {
        getTrending()
            .then(setTrendingMovies)
            .catch(() => { });
    }, []);

    const handleSearch = async (moodText) => {
        const searchMood = moodText || mood;
        if (!searchMood.trim()) return;

        setLoading(true);
        setError('');
        setShowResults(true);

        try {
            const { genres: matchedGenres, genreIds } = moodToGenres(searchMood);
            setGenres(matchedGenres);

            const results = await discoverMovies(genreIds);
            setMovies(results);

            // Save to history
            addHistory(searchMood.trim(), matchedGenres, results.length);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch movies. Please check your TMDB API key and try again.');
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        const text = suggestion.replace(/^[^\s]+\s/, ''); // remove emoji
        setMood(text);
        handleSearch(text);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen pt-20">
            <div className="bg-ambient" />

            {/* Hero Section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-12 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm font-medium mb-6">
                    <Sparkles className="w-4 h-4" />
                    AI-Powered Movie Recommendations
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[var(--font-heading)] mb-4 leading-tight">
                    What's your <span className="gradient-text">mood</span> tonight?
                </h1>

                <p className="text-text-muted text-lg max-w-2xl mx-auto mb-8">
                    Tell us how you're feeling and we'll find the perfect movies for you
                </p>

                {/* Search Input */}
                <div className="max-w-2xl mx-auto">
                    <div className="gradient-border">
                        <div className="glass rounded-2xl p-2 flex items-center gap-2">
                            <input
                                type="text"
                                value={mood}
                                onChange={(e) => setMood(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g., I'm feeling adventurous and want something epic..."
                                className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-text placeholder:text-text-dim text-base"
                                disabled={loading}
                            />
                            <button
                                onClick={() => handleSearch()}
                                disabled={loading || !mood.trim()}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm hover:opacity-90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Search className="w-4 h-4" />
                                )}
                                <span className="hidden sm:inline">Find Movies</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mood Suggestions */}
                {!showResults && (
                    <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto animate-fade-in-up">
                        {MOOD_SUGGESTIONS.map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="genre-chip hover:scale-105 active:scale-95 transition-transform cursor-pointer text-xs sm:text-sm"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </section>

            {/* Error */}
            {error && (
                <div className="max-w-4xl mx-auto px-4 mb-8">
                    <div className="glass rounded-xl p-4 flex items-center gap-3 border-danger/30">
                        <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
                        <p className="text-danger text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Results Section */}
            {showResults && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
                    {/* Matched Genres */}
                    {genres.length > 0 && (
                        <div className="mb-8 text-center animate-fade-in-up">
                            <p className="text-text-muted text-sm mb-3">Matched genres for your mood:</p>
                            <div className="flex justify-center gap-2 flex-wrap">
                                {genres.map((genre) => (
                                    <span key={genre} className="genre-chip">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    )}

                    {/* Movie Grid */}
                    {!loading && movies.length > 0 && (
                        <>
                            <h2 className="text-xl font-bold font-[var(--font-heading)] mb-6 text-center">
                                🎬 <span className="gradient-text">{movies.length} Movies</span> for your mood
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                                {movies.map((movie, i) => (
                                    <MovieCard key={movie.id} movie={movie} index={i} />
                                ))}
                            </div>
                        </>
                    )}

                    {/* No results */}
                    {!loading && movies.length === 0 && !error && (
                        <div className="text-center py-16">
                            <p className="text-text-muted text-lg">No movies found. Try a different mood!</p>
                        </div>
                    )}
                </section>
            )}

            {/* Trending Section */}
            {!showResults && trendingMovies.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        <h2 className="text-xl font-bold font-[var(--font-heading)]">
                            Trending This Week
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                        {trendingMovies.slice(0, 10).map((movie, i) => (
                            <MovieCard key={movie.id} movie={movie} index={i} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
