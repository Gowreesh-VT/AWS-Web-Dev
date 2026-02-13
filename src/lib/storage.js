const FAVOURITES_KEY = 'moodflix_favourites';
const HISTORY_KEY = 'moodflix_history';

// ─── Favourites ────────────────────────

export function getFavourites() {
    try {
        const data = localStorage.getItem(FAVOURITES_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function addFavourite(movie) {
    const favourites = getFavourites();
    if (favourites.some(f => f.id === movie.id)) return favourites;
    const updated = [{ ...movie, saved_at: new Date().toISOString() }, ...favourites];
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(updated));
    return updated;
}

export function removeFavourite(movieId) {
    const favourites = getFavourites();
    const updated = favourites.filter(f => f.id !== movieId);
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(updated));
    return updated;
}

export function isFavourite(movieId) {
    return getFavourites().some(f => f.id === movieId);
}

// ─── Search History ────────────────────

export function getHistory() {
    try {
        const data = localStorage.getItem(HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function addHistory(mood, genres, movieCount) {
    const history = getHistory();
    const entry = {
        id: Date.now(),
        mood,
        genres,
        movieCount,
        timestamp: new Date().toISOString(),
    };
    const updated = [entry, ...history].slice(0, 50); // keep last 50
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
}

export function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
    return [];
}

export function deleteHistoryEntry(id) {
    const history = getHistory();
    const updated = history.filter(h => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
}
