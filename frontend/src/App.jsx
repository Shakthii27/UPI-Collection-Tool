import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GenerateLink from "./pages/GenerateLink";
import PaymentHistory from "./pages/PaymentHistory";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
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
  path="/generate"
  element={
    <ProtectedRoute>
      <GenerateLink />
    </ProtectedRoute>
  }
/>

<Route
  path="/payments"
  element={
    <ProtectedRoute>
      <PaymentHistory />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;