import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "@/pages/DashboardPage";
import AgentDetailPage from "@/pages/AgentDetailPage";
import AttacksPage from "@/pages/AttacksPage";
import TargetsPage from "@/pages/TargetsPage";
import AppLayout from "@/components/AppLayout";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/agents/:id" element={<AgentDetailPage />} />
        <Route path="/attacks" element={<AttacksPage />} />
        <Route path="/targets" element={<TargetsPage />} />
        <Route path="/settings" element={<div className="text-text-muted">Settings coming soon.</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}