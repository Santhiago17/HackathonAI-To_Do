import { Card, CardContent } from "./card"
import React from "react"

export type CustomCardProps = {
  cardName?: React.ReactNode
  cardAction?: React.ReactNode
  cardContent: React.ReactNode
  className?: string
}

export function CustomCard({
  cardName,
  cardAction,
  cardContent,
  className = "",
}: CustomCardProps) {
  return (
    <Card className={`bg-[#252525] border-none text-white ${className}`}>
      <div
        className={`p-4 flex items-center ${
          cardName ? "justify-between" : "justify-end"
        }`}
      >
        {cardName && <h2 className="text-sm font-medium">{cardName}</h2>}
        {cardAction}
      </div>
      <CardContent className="pt-0 overflow-y-auto custom-scrollbar">
        {cardContent}
      </CardContent>
    </Card>
  )
}
