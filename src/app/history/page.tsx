"use client";

import { useState, useEffect } from 'react';
import type { SearchHistoryItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { History as HistoryIcon, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history');
        if (!response.ok) throw new Error("Failed to fetch history.");
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) return (
     <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center font-headline">Search History</h1>
      <div className="max-w-2xl mx-auto space-y-4">
        {Array.from({length: 3}).map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/4 mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-28" />
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center font-headline">Search History</h1>
        <Alert variant="destructive" className="max-w-md mx-auto">
            <HistoryIcon className="h-4 w-4" />
            <AlertTitle>Error loading history</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center font-headline">Search History</h1>
      {history.length > 0 ? (
        <div className="max-w-2xl mx-auto space-y-4">
          {history.map(item => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-lg">Mood: "{item.mood}"</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1 text-xs">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground self-center">Generated Genres:</span>
                  {item.genres.map(genre => (
                    <Badge key={genre} variant="secondary">{genre}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Alert className="max-w-md mx-auto">
          <HistoryIcon className="h-4 w-4" />
          <AlertTitle>No History Yet</AlertTitle>
          <AlertDescription>
            Your movie searches will appear here. Go to the home page and find some recommendations!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
