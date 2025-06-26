import { Route, Routes } from "react-router-dom"
import { HomePage } from "@/pages/HomePage"
import { UsersPage } from "@/pages/users/UsersPage"
import { UserCreatePage } from "@/pages/users/UserCreatePage"
import { UserEditPage } from "@/pages/users/UserEditPage"
import { MainLayout } from "@/layout/MainLayout"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/new" element={<UserCreatePage />} />
        <Route path="users/:id/edit" element={<UserEditPage />} />
        <Route path="*" />
      </Route>
    </Routes>
  )
}
