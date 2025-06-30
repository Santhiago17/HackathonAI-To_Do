import type { Status } from "@/types/Task"

export const getStatusName = (status: Status): string => {
  const statusMap = {
    todo: "A Fazer",
    "in-progress": "Em Progresso",
    review: "Em Revisão",
    done: "Concluído",
  }
  return statusMap[status] || status
}
