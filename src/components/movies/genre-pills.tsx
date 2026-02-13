import { Badge } from '@/components/ui/badge';

interface GenrePillsProps {
  genres: string[];
}

export function GenrePills({ genres }: GenrePillsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      <span className="text-sm font-medium text-muted-foreground self-center">Suggested Genres:</span>
      {genres.map(genre => (
        <Badge key={genre} variant="secondary" className="text-base px-3 py-1">{genre}</Badge>
      ))}
    </div>
  );
}
