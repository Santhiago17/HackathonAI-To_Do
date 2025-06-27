import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { motion } from "framer-motion"

export type SearchToggleProps = {
  value: string
  setValue: (value: string) => void
}

export function SearchToggle({ value, setValue }: SearchToggleProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center gap-2">
      {open ? (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 200, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <Input
            type="text"
            placeholder="Buscar..."
            className="transition-all duration-300"
            onBlur={() => setOpen(false)}
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
          />
        </motion.div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
