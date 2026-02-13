import axios from 'axios';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMG = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path, size = 'w500') => {
    if (!path) return null;
    return `${TMDB_IMG}/${size}${path}`;
};

export const GENRES = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
};

const GENRE_NAME_TO_ID = Object.fromEntries(
    Object.entries(GENRES).map(([id, name]) => [name.toLowerCase(), parseInt(id)])
);

// Mood to genre mapping — fully client-side, no Gemini needed
const MOOD_GENRE_MAP = {
    // Happy / upbeat
    happy: ['Comedy', 'Animation', 'Family'],
    joyful: ['Comedy', 'Animation', 'Music'],
    excited: ['Action', 'Adventure', 'Science Fiction'],
    energetic: ['Action', 'Adventure'],
    playful: ['Comedy', 'Animation'],
    cheerful: ['Comedy', 'Family', 'Music'],
    upbeat: ['Comedy', 'Music', 'Animation'],
    ecstatic: ['Comedy', 'Adventure', 'Music'],
    fun: ['Comedy', 'Adventure', 'Animation'],

    // Sad / melancholy
    sad: ['Drama', 'Romance'],
    melancholy: ['Drama', 'Romance', 'Music'],
    lonely: ['Drama', 'Romance'],
    heartbroken: ['Romance', 'Drama'],
    depressed: ['Drama'],
    crying: ['Drama', 'Romance'],
    gloomy: ['Drama', 'Mystery'],
    nostalgic: ['Drama', 'Romance', 'History'],
    emotional: ['Drama', 'Romance'],

    // Thrilling / intense
    thrilled: ['Thriller', 'Action'],
    tense: ['Thriller', 'Mystery', 'Crime'],
    suspenseful: ['Thriller', 'Mystery'],
    nervous: ['Thriller', 'Horror'],
    edge: ['Thriller', 'Action', 'Crime'],
    intense: ['Thriller', 'Action', 'War'],
    adrenaline: ['Action', 'Adventure', 'Thriller'],

    // Scared / spooky
    scared: ['Horror', 'Thriller'],
    spooky: ['Horror', 'Mystery'],
    creepy: ['Horror', 'Thriller'],
    terrified: ['Horror'],
    dark: ['Horror', 'Thriller', 'Crime'],
    eerie: ['Horror', 'Mystery'],
    halloween: ['Horror', 'Fantasy'],

    // Romantic / loving
    romantic: ['Romance', 'Drama', 'Comedy'],
    love: ['Romance', 'Drama'],
    loving: ['Romance', 'Drama', 'Family'],
    passionate: ['Romance', 'Drama'],
    date: ['Romance', 'Comedy'],
    valentine: ['Romance', 'Comedy', 'Drama'],
    crush: ['Romance', 'Comedy'],
    flirty: ['Romance', 'Comedy'],

    // Adventurous / curious
    adventurous: ['Adventure', 'Action', 'Fantasy'],
    curious: ['Documentary', 'Mystery', 'Science Fiction'],
    exploring: ['Adventure', 'Documentary'],
    wanderlust: ['Adventure', 'Drama'],
    discovery: ['Documentary', 'Adventure', 'Science Fiction'],
    epic: ['Adventure', 'Fantasy', 'Action'],

    // Calm / relaxed
    relaxed: ['Comedy', 'Animation', 'Family'],
    calm: ['Drama', 'Documentary', 'Animation'],
    peaceful: ['Documentary', 'Animation', 'Family'],
    cozy: ['Comedy', 'Family', 'Animation'],
    chill: ['Comedy', 'Animation'],
    serene: ['Documentary', 'Animation', 'Drama'],
    lazy: ['Comedy', 'Animation', 'Family'],
    weekend: ['Comedy', 'Family', 'Adventure'],

    // Angry / frustrated
    angry: ['Action', 'Thriller', 'War'],
    frustrated: ['Action', 'Thriller'],
    revenge: ['Action', 'Thriller', 'Crime'],
    rebellious: ['Action', 'Crime', 'Drama'],
    fierce: ['Action', 'War', 'Thriller'],

    // Intellectual / thoughtful
    thoughtful: ['Drama', 'Documentary', 'History'],
    philosophical: ['Drama', 'Science Fiction'],
    intellectual: ['Documentary', 'Drama', 'History'],
    brainy: ['Science Fiction', 'Mystery', 'Documentary'],
    deep: ['Drama', 'Science Fiction', 'Documentary'],
    inspired: ['Drama', 'Documentary', 'History'],
    motivational: ['Drama', 'Documentary'],
    mind: ['Science Fiction', 'Mystery', 'Thriller'],

    // Fantasy / imagination
    dreamy: ['Fantasy', 'Animation', 'Romance'],
    magical: ['Fantasy', 'Animation', 'Family'],
    fantasy: ['Fantasy', 'Adventure'],
    mystical: ['Fantasy', 'Mystery'],
    imaginative: ['Fantasy', 'Animation', 'Science Fiction'],
    fairy: ['Fantasy', 'Animation', 'Family'],
    superhero: ['Action', 'Science Fiction', 'Adventure'],

    // Social / party
    party: ['Comedy', 'Music', 'Action'],
    social: ['Comedy', 'Drama'],
    friends: ['Comedy', 'Adventure'],
    family: ['Family', 'Animation', 'Comedy'],
    kids: ['Animation', 'Family', 'Comedy'],
    bored: ['Action', 'Comedy', 'Adventure'],

    // War / historical
    war: ['War', 'History', 'Drama'],
    historical: ['History', 'Drama', 'War'],
    patriotic: ['War', 'History', 'Drama'],

    // Crime / mystery
    crime: ['Crime', 'Thriller', 'Mystery'],
    mystery: ['Mystery', 'Thriller', 'Crime'],
    detective: ['Crime', 'Mystery', 'Thriller'],
    whodunit: ['Mystery', 'Crime'],

    // Sci-fi
    futuristic: ['Science Fiction', 'Action'],
    space: ['Science Fiction', 'Adventure'],
    alien: ['Science Fiction', 'Horror', 'Adventure'],
    tech: ['Science Fiction', 'Thriller'],
    robot: ['Science Fiction', 'Action'],
    dystopian: ['Science Fiction', 'Drama', 'Thriller'],

    // Western
    western: ['Western', 'Action', 'Adventure'],
    cowboy: ['Western', 'Action'],
};

/**
 * Convert a mood description into TMDB genre IDs
 */
export function moodToGenres(moodText) {
    const words = moodText.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
    const genreScores = {};

    for (const word of words) {
        // Direct match
        if (MOOD_GENRE_MAP[word]) {
            for (const genre of MOOD_GENRE_MAP[word]) {
                genreScores[genre] = (genreScores[genre] || 0) + 2;
            }
            continue;
        }
        // Partial match (e.g., "scary" matches "scared")
        for (const [key, genres] of Object.entries(MOOD_GENRE_MAP)) {
            if (key.startsWith(word.slice(0, 4)) || word.startsWith(key.slice(0, 4))) {
                for (const genre of genres) {
                    genreScores[genre] = (genreScores[genre] || 0) + 1;
                }
            }
        }
    }

    // Sort by score, take top 3
    const sorted = Object.entries(genreScores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([genre]) => genre);

    // Fallback: if no match, return popular genres
    if (sorted.length === 0) {
        return {
            genres: ['Action', 'Comedy', 'Drama'],
            genreIds: [28, 35, 18],
        };
    }

    const genreIds = sorted.map(g => GENRE_NAME_TO_ID[g.toLowerCase()]).filter(Boolean);

    return { genres: sorted, genreIds };
}

/**
 * Discover movies by genre IDs from TMDB
 */
export async function discoverMovies(genreIds, page = 1) {
    const response = await axios.get(`${TMDB_BASE}/discover/movie`, {
        params: {
            api_key: TMDB_API_KEY,
            with_genres: genreIds.join(','),
            sort_by: 'popularity.desc',
            'vote_count.gte': 100,
            language: 'en-US',
            page,
        },
    });
    return response.data.results;
}

/**
 * Search movies by query
 */
export async function searchMovies(query, page = 1) {
    const response = await axios.get(`${TMDB_BASE}/search/movie`, {
        params: {
            api_key: TMDB_API_KEY,
            query,
            language: 'en-US',
            page,
        },
    });
    return response.data.results;
}

/**
 * Get trending movies
 */
export async function getTrending() {
    const response = await axios.get(`${TMDB_BASE}/trending/movie/week`, {
        params: { api_key: TMDB_API_KEY },
    });
    return response.data.results;
}

/**
 * Get movie details
 */
export async function getMovieDetails(movieId) {
    const response = await axios.get(`${TMDB_BASE}/movie/${movieId}`, {
        params: {
            api_key: TMDB_API_KEY,
            append_to_response: 'credits,videos,similar',
            language: 'en-US',
        },
    });
    return response.data;
}
