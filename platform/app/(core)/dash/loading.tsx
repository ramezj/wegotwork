export default function Loading() {
  return (
    <div className="p-8">
      <div className="text-xl font-bold text-blue-500 mb-4 animate-pulse">
        🔄 Loading Dashboard...
      </div>
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-blue-200 dark:bg-blue-900 rounded w-1/4"></div>
        <div className="h-24 bg-blue-200 dark:bg-blue-900 rounded"></div>
      </div>
    </div>
  );
}
