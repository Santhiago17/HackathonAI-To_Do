import App from "@/App"
import { Route, Routes } from "react-router-dom"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />}></Route>
    </Routes>
  )
}
