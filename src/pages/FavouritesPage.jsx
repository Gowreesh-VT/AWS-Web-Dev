import { useState, useEffect } from 'react';
import { Heart, Trash2, Film } from 'lucide-react';
import { getFavourites, removeFavourite } from '../lib/storage';
import MovieCard from '../components/MovieCard';

export default function FavouritesPage() {
    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        setFavourites(getFavourites());
    }, []);

    const handleFavToggle = (movieId, isFav) => {
        if (!isFav) {
            const updated = removeFavourite(movieId);
            setFavourites(updated);
        }
    };

    const handleClearAll = () => {
        if (window.confirm('Remove all favourites? This cannot be undone.')) {
            localStorage.removeItem('moodflix_favourites');
            setFavourites([]);
        }
    };

    return (
        <div className="min-h-screen pt-20">
            <div className="bg-ambient" />

            <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Heart className="w-6 h-6 text-danger fill-current" />
                            <h1 className="text-3xl font-bold font-[var(--font-heading)]">
                                My <span className="gradient-text">Favourites</span>
                            </h1>
                        </div>
                        <p className="text-text-muted text-sm">
                            {favourites.length} movie{favourites.length !== 1 ? 's' : ''} saved
                        </p>
                    </div>

                    {favourites.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-danger/80 hover:text-danger hover:bg-danger/10 transition-all duration-300 border border-transparent hover:border-danger/20"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear All
                        </button>
                    )}
                </div>

                {/* Favourites Grid */}
                {favourites.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                        {favourites.map((movie, i) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                index={i}
                                onFavToggle={handleFavToggle}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 rounded-2xl bg-surface-light flex items-center justify-center mx-auto mb-6">
                            <Film className="w-10 h-10 text-text-dim" />
                        </div>
                        <h2 className="text-xl font-semibold text-text mb-2">No favourites yet</h2>
                        <p className="text-text-muted max-w-md mx-auto">
                            Start discovering movies and tap the heart icon to save your favourites here.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
