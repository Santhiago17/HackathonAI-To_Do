import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { Link } from "react-router-dom"

export function ButtonWithNavIcon({ path }: { path: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-orange-500 hover:text-orange-800"
      asChild
    >
      <Link to={path}>
        <PlusIcon className="h-4 w-4" />
      </Link>
    </Button>
  )
}
