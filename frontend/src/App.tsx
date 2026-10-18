import { useState } from "react";
import Dashboard from "./pages/dashboard/DashboardPage";
import LoginPage from "./pages/auth/LoginPage";

export default function App() {
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  if (showAdminDashboard) {
    return <Dashboard />;
  }

  return <LoginPage onAdminLogin={() => setShowAdminDashboard(true)} />;
}
