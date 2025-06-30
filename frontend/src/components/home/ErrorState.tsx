import { AlertCircle } from "lucide-react"

interface ErrorStateProps {
  error: string
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1A1A1A]">
      <div className="text-center bg-[#252525] p-8 rounded-xl shadow-lg border border-gray-700">
        <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Oops! Algo deu errado
        </h2>
        <p className="text-gray-300 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
}
