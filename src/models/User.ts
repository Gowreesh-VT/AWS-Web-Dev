import mongoose, { Schema, Document, Model } from 'mongoose';
import { Movie, SearchHistoryItem } from '@/lib/types';

export interface IUser extends Document {
    email: string;
    password?: string;
    name?: string;
    favorites: Movie[];
    history: SearchHistoryItem[];
    createdAt: Date;
}

const MovieSchema = new Schema<Movie>({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    overview: { type: String },
    poster_path: { type: String },
    release_date: { type: String },
    vote_average: { type: Number },
    genre_ids: [{ type: Number }],
}, { _id: false });

const HistoryItemSchema = new Schema<SearchHistoryItem>({
    id: { type: String, required: true },
    mood: { type: String, required: true },
    genres: [{ type: String }],
    timestamp: { type: String, required: true },
}, { _id: false });

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    favorites: [MovieSchema],
    history: [HistoryItemSchema],
    createdAt: { type: Date, default: Date.now },
});

// Prevent model recompilation error in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
