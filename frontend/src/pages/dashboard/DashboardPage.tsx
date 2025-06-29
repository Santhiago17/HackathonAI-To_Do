import { CustomCard } from "@/components/ui/custom-card"
import { ButtonWithNavIcon } from "../../components/ui/button-with-nav-icon"
import { useEffect, useMemo, useState } from "react"
import type { User } from "@/types/User"
import type { Task } from "@/types/Task"
import { getTasks } from "@/services/taskService"
import { getUsers } from "@/services/userService"
import { DashboardTasksContent } from "../../components/dashboard/DashboardTasksContent"
import { DashboardUsersContent } from "../../components/dashboard/DashboardUsersContent"

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const responseTasks = await getTasks()
        const responseUsers = await getUsers()
        setTasks(responseTasks)
        setUsers(responseUsers)
      } catch {
        return
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const cards = useMemo(
    () => [
      {
        cardName: "Tarefas",
        cardAction: <ButtonWithNavIcon path="/tasks/new" />,
        cardContent: <DashboardTasksContent tasks={tasks} loading={loading} />,
      },
      {
        cardName: "Usuários",
        cardAction: <ButtonWithNavIcon path="/users/new" />,
        cardContent: <DashboardUsersContent users={users} loading={loading} />,
      },
    ],
    [tasks, users, loading]
  )

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {cards?.map((card, index) => (
          <CustomCard
            key={index}
            cardName={card.cardName}
            cardAction={card.cardAction}
            cardContent={card.cardContent}
          />
        ))}
      </div>
    </section>
  )
}
