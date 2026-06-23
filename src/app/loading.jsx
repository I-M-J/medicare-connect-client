export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
                <p className="text-sky-600 dark:text-sky-400 font-medium animate-pulse">Loading MediCare...</p>
            </div>
        </div>
    );
}
