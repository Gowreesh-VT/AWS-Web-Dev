"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

interface MoodFormProps {
  onSubmit: (mood: string) => void;
  isLoading: boolean;
}

export function MoodForm({ onSubmit, isLoading }: MoodFormProps) {
  const [mood, setMood] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mood.trim()) {
      onSubmit(mood);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Textarea
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="e.g., 'Feeling adventurous and want to see something epic'"
        rows={3}
        disabled={isLoading}
        className="text-base"
      />
      <Button type="submit" disabled={isLoading || !mood.trim()} className="self-center" size="lg">
        {isLoading ? (
          'Brewing up recommendations...'
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Find Movies
          </>
        )}
      </Button>
    </form>
  );
}
