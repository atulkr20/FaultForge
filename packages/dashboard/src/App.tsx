import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import OverviewPage from "@/pages/OverviewPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import AgentDetailPage from "@/pages/AgentDetailPage";
import AttacksPage from "@/pages/AttacksPage";
import TargetsPage from "@/pages/TargetsPage";
import DashboardLayout from "@/components/DashboardLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<DashboardLayout><OverviewPage /></DashboardLayout>} />
      <Route path="/experiments" element={<DashboardLayout><AttacksPage /></DashboardLayout>} />
      <Route path="/agents" element={<DashboardLayout><div className="text-gray-400">Agents page coming soon</div></DashboardLayout>} />
      <Route path="/agents/:id" element={<DashboardLayout><AgentDetailPage /></DashboardLayout>} />
      <Route path="/logs" element={<DashboardLayout><div className="text-gray-400">Live Logs coming soon</div></DashboardLayout>} />
      <Route path="/metrics" element={<DashboardLayout><div className="text-gray-400">Metrics coming soon</div></DashboardLayout>} />
      <Route path="/settings" element={<DashboardLayout><div className="text-gray-400">Settings coming soon</div></DashboardLayout>} />
      <Route path="/targets" element={<DashboardLayout><TargetsPage /></DashboardLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}