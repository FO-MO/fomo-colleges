export default function StudentsLoading() {
  return (
    <div className="flex h-[calc(100vh-5rem)] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="h-12 w-12 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
        <p className="text-sm font-medium text-gray-600">Loading content…</p>
      </div>
    </div>
  );
}
