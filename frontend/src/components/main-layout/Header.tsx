import { BellIcon } from "lucide-react"
import { Button } from "../ui/button"
import { SearchToggle, type SearchToggleProps } from "../ui/search-toggle"

export type HeaderProps = SearchToggleProps & {
  pageName: string
}

export function Header({ pageName, value, setValue }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold text-white">{pageName}</h1>
      <div className="flex items-center space-x-4">
        <SearchToggle value={value} setValue={setValue} />
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <BellIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
