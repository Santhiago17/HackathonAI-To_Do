import type { UserProfileProps } from "./types"

export function UserProfile({ userName }: UserProfileProps) {
  return (
    <section
      className="flex items-center mb-6"
      role="banner"
      aria-label="User profile"
    >
      <figure
        className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 flex items-center justify-center text-white font-bold mr-2"
        aria-label={`${userName} avatar`}
      >
        <span className="sr-only">{userName} avatar</span>
      </figure>
      <div className="text-white">
        <h1 className="font-bold text-sm">{userName}</h1>
        <p className="text-xs text-gray-400">To Do List</p>
      </div>
    </section>
  )
}
