'use server';
/**
 * @fileOverview This file defines a Genkit flow for converting a user's mood or situation
 * into a list of relevant movie genres using an AI model.
 *
 * - convertMoodToGenres - A function that handles the mood to genre conversion process.
 * - MoodInput - The input type for the convertMoodToGenres function.
 * - GenresOutput - The return type for the convertMoodToGenres function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MoodInputSchema = z.object({
  mood: z.string().describe('The user\'s current mood or situation.'),
});
export type MoodInput = z.infer<typeof MoodInputSchema>;

const GenresOutputSchema = z.object({
  genres: z
    .array(z.string())
    .describe('An array of movie genres that match the user\'s mood.'),
});
export type GenresOutput = z.infer<typeof GenresOutputSchema>;

export async function convertMoodToGenres(input: MoodInput): Promise<GenresOutput> {
  return moodToGenreFlow(input);
}

const moodToGenrePrompt = ai.definePrompt({
  name: 'moodToGenrePrompt',
  input: { schema: MoodInputSchema },
  output: { schema: GenresOutputSchema },
  prompt: `You are an expert movie genre recommender.
Given a user's mood or situation, convert it into a list of relevant movie genres.
Provide the output as a JSON object with a single key 'genres' which is an array of strings.

User's mood: {{{mood}}}

Examples:
Mood: 'Happy, I want something uplifting and fun.'
Genres: ["Comedy", "Musical", "Family"]

Mood: 'Feeling adventurous, want to escape reality.'
Genres: ["Fantasy", "Action", "Adventure", "Sci-Fi"]

Mood: 'Relaxed and want something thought-provoking.'
Genres: ["Drama", "Documentary", "Mystery"]

Mood: 'Scared, want a good scare.'
Genres: ["Horror", "Thriller"]

Mood: 'Romantic and cozy.'
Genres: ["Romance", "Drama"]`,
});

const moodToGenreFlow = ai.defineFlow(
  {
    name: 'moodToGenreFlow',
    inputSchema: MoodInputSchema,
    outputSchema: GenresOutputSchema,
  },
  async (input) => {
    const { output } = await moodToGenrePrompt(input);
    return output!;
  }
);
