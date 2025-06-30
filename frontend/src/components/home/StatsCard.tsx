import { Card } from "@/components/ui/card"

export interface StatCard {
  key: string
  title: string
  value: number
  textColor: string
  bgColor: string
  icon: React.ComponentType<{ className?: string }>
}

interface StatsCardsProps {
  cards: StatCard[]
}

export function StatsCards({ cards }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 flex-shrink-0">
      {cards.map((card) => {
        const IconComponent = card.icon

        return (
          <Card
            key={card.key}
            className="p-4 lg:p-6 bg-[#252525] border-gray-600 rounded-xl hover:shadow-lg transition-all hover-lift"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm lg:text-base font-medium text-gray-300">
                  {card.title}
                </p>
                <p
                  className={`text-2xl lg:text-3xl font-bold ${card.textColor}`}
                >
                  {card.value}
                </p>
              </div>
              <div
                className={`h-12 w-12 lg:h-16 lg:w-16 ${card.bgColor} rounded-lg flex items-center justify-center`}
              >
                <IconComponent className="h-6 w-6 lg:h-8 lg:w-8" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
