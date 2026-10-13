import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateTicket from "./pages/CreateTicket";
import TicketDetail from "./pages/TicketDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import Agent from "./pages/Agent";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets/create"
          element={
            <ProtectedRoute>
              <CreateTicket />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute>
              <TicketDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Admin />
            </RoleRoute>
          }
        />

        <Route
          path="/agent"
          element={
            <RoleRoute allowedRoles={["AGENT"]}>
              <Agent />
            </RoleRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;