import { useState } from 'react';
import { Heart, Star, Calendar, ExternalLink } from 'lucide-react';
import { getImageUrl, GENRES } from '../lib/tmdb';
import { isFavourite, addFavourite, removeFavourite } from '../lib/storage';

export default function MovieCard({ movie, index = 0, onFavToggle }) {
    const [fav, setFav] = useState(isFavourite(movie.id));
    const [imgLoaded, setImgLoaded] = useState(false);
    const posterUrl = getImageUrl(movie.poster_path, 'w500');
    const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const genreNames = (movie.genre_ids || [])
        .slice(0, 2)
        .map(id => GENRES[id])
        .filter(Boolean);

    const handleFavToggle = (e) => {
        e.stopPropagation();
        if (fav) {
            removeFavourite(movie.id);
            setFav(false);
        } else {
            addFavourite(movie);
            setFav(true);
        }
        onFavToggle?.(movie.id, !fav);
    };

    return (
        <div
            className="glass glass-hover rounded-2xl overflow-hidden group cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {/* Poster */}
            <div className="relative aspect-[2/3] overflow-hidden">
                {!imgLoaded && (
                    <div className="absolute inset-0 shimmer" />
                )}
                {posterUrl ? (
                    <img
                        src={posterUrl}
                        alt={movie.title}
                        loading="lazy"
                        onLoad={() => setImgLoaded(true)}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                    />
                ) : (
                    <div className="w-full h-full bg-surface-light flex items-center justify-center">
                        <Film className="w-12 h-12 text-text-dim" />
                    </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Favourite button */}
                <button
                    onClick={handleFavToggle}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${fav
                            ? 'bg-danger/90 text-white scale-100'
                            : 'bg-black/50 text-white/70 hover:bg-black/70 hover:text-white opacity-0 group-hover:opacity-100'
                        }`}
                    title={fav ? 'Remove from favourites' : 'Add to favourites'}
                >
                    <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
                </button>

                {/* Rating badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-xs font-semibold">
                    <Star className="w-3 h-3 text-star fill-current" />
                    <span className="text-white">{rating}</span>
                </div>

                {/* Bottom info on hover */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex gap-1.5 flex-wrap">
                        {genreNames.map(g => (
                            <span key={g} className="genre-chip text-xs py-1 px-2.5">
                                {g}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="font-semibold text-sm text-text truncate group-hover:text-primary-light transition-colors">
                    {movie.title}
                </h3>
                <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1 text-text-dim text-xs">
                        <Calendar className="w-3 h-3" />
                        <span>{year}</span>
                    </div>
                    <a
                        href={`https://www.themoviedb.org/movie/${movie.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-text-dim hover:text-accent transition-colors"
                        title="View on TMDB"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
                {movie.overview && (
                    <p className="text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed">
                        {movie.overview}
                    </p>
                )}
            </div>
        </div>
    );
}

function Film(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
            <line x1="7" y1="2" x2="7" y2="22" />
            <line x1="17" y1="2" x2="17" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="2" y1="7" x2="7" y2="7" />
            <line x1="2" y1="17" x2="7" y2="17" />
            <line x1="17" y1="17" x2="22" y2="17" />
            <line x1="17" y1="7" x2="22" y2="7" />
        </svg>
    );
}
