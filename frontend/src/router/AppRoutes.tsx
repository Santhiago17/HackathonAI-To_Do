import App from "@/App";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/HomePage"; // Import HomePage
import { UsersPage } from "@/pages/users/UsersPage";
import { UserCreatePage } from "@/pages/users/UserCreatePage";
import { UserEditPage } from "@/pages/users/UserEditPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />}> {/* App.tsx is now the layout for child routes */}
        <Route index element={<HomePage />} /> {/* Default component for "/" */}
        <Route path="users" element={<UsersPage />} />
        <Route path="users/new" element={<UserCreatePage />} />
        <Route path="users/:id/edit" element={<UserEditPage />} />
        {/* Add other application routes as children of App or at the same level if they don't use App's layout */}
      </Route>
    </Routes>
  );
}
