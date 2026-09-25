import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Report from "./pages/Report";
import Explore from "./pages/Explore";
import IssueDetails from "./pages/IssueDetails";
import MyReports from "./pages/MyReports";
import EditReport from "./pages/EditReport";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>

          {/* ========================================
              PUBLIC ROUTES
          ======================================== */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/explore"
            element={<Explore />}
          />

          <Route
            path="/issues/:id"
            element={<IssueDetails />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          <Route
            path="/report"
            element={<Report />}
          />


          {/* ========================================
              PROTECTED USER ROUTES
          ======================================== */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/my-reports"
              element={<MyReports />}
            />

            <Route
              path="/edit-report/:id"
              element={<EditReport />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

          </Route>


          {/* ========================================
              ADMIN ROUTES
          ======================================== */}

          <Route element={<AdminRoute />}>

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

          </Route>


          {/* ========================================
              404
          ======================================== */}

          <Route
            path="*"
            element={
              <div className="flex min-h-screen items-center justify-center bg-[#08090b] px-6 text-white">

                <div className="text-center">

                  <h1 className="text-6xl font-bold">
                    404
                  </h1>

                  <p className="mt-4 text-zinc-500">
                    Page not found
                  </p>

                </div>

              </div>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;