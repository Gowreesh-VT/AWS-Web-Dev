import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };

        await dbConnect();
        const user = await User.findById(decoded.userId);

        if (!user) {
            return null;
        }

        return user;
    } catch (error) {
        return null;
    }
}
