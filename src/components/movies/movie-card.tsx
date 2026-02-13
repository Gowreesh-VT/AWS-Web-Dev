"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Movie } from '@/lib/types';
import { getMoviePosterUrl } from '@/lib/tmdb';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface MovieCardProps {
  movie: Movie;
  isFavoriteInitially?: boolean;
  onFavoriteChange?: (movie: Movie, isFavorite: boolean) => void;
}

export function MovieCard({ movie, isFavoriteInitially = false, onFavoriteChange }: MovieCardProps) {
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitially);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const fallbackImage = PlaceHolderImages.find(img => img.id === 'movie-poster-fallback');

  const handleFavoriteToggle = async () => {
    setIsUpdating(true);
    const newIsFavorite = !isFavorite;
    try {
      if (isFavorite) {
        const response = await fetch(`/api/favorites?id=${movie.id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error("Failed to remove favorite");
        toast({ title: "Removed from favorites", description: `"${movie.title}" removed.` });
      } else {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movie),
        });
        if (!response.ok) throw new Error("Failed to add favorite");
        toast({ title: "Added to favorites", description: `"${movie.title}" saved.` });
      }
      setIsFavorite(newIsFavorite);
      onFavoriteChange?.(movie, newIsFavorite);
    } catch (error) {
      toast({ variant: 'destructive', title: "Uh oh!", description: error instanceof Error ? error.message : "Something went wrong." });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="overflow-hidden group transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-primary">
      <CardContent className="p-0 relative">
        <Image
          src={getMoviePosterUrl(movie.poster_path)}
          alt={`Poster for ${movie.title}`}
          width={500}
          height={750}
          className="w-full h-auto object-cover aspect-[2/3]"
          data-ai-hint={movie.poster_path ? 'movie poster' : fallbackImage?.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="font-bold text-lg text-white line-clamp-2">{movie.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="text-white text-sm font-semibold">{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
        <Button
          size="icon"
          variant="secondary"
          className={cn(
            "absolute top-2 right-2 rounded-full h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity",
            isFavorite && "opacity-100"
          )}
          onClick={handleFavoriteToggle}
          disabled={isUpdating}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={cn("w-5 h-5 transition-colors", isFavorite ? "text-red-500 fill-red-500" : "text-muted-foreground")} />
        </Button>
      </CardContent>
    </Card>
  );
}
