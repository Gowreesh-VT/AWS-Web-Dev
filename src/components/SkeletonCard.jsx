export default function SkeletonCard() {
    return (
        <div className="glass rounded-2xl overflow-hidden">
            <div className="aspect-[2/3] shimmer" />
            <div className="p-4 space-y-2.5">
                <div className="h-4 w-3/4 shimmer rounded" />
                <div className="h-3 w-1/2 shimmer rounded" />
                <div className="h-3 w-full shimmer rounded" />
            </div>
        </div>
    );
}
