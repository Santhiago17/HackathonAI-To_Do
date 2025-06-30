export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1A1A1A]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-300">Carregando dashboard...</p>
      </div>
    </div>
  )
}
