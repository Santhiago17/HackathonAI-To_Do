import { Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { UsersPage } from '@/pages/users/UsersPage'
import { UserCreatePage } from '@/pages/users/UserCreatePage'
import { TaskListPage } from '@/pages/tasks/TaskListPage'
import { TaskCreatePage } from '@/pages/tasks/TaskCreatePage'
import { MainLayout } from '@/layout/MainLayout'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/new" element={<UserCreatePage />} />
        <Route path="tasks" element={<TaskListPage />} />
        <Route path="tasks/new" element={<TaskCreatePage />} />
        <Route path="*" />
      </Route>
    </Routes>
  )
}
