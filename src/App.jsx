import React from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import Login from "./Login";
import Profits from "./components/Profits";
import Header from "./components/header/Header";
import FundAdded from "./components/FundAdded";
import Profile from "./components/Profile";
import Order1 from "./components/Order1";
import Order2 from "./components/Order2";

import FundWithdraw from "./components/FundWithdraw";

const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken");
  return authToken ? children : <Navigate to="/login" />;
};

const App = () => {
  const location = useLocation(); // 👈 get current route

  // hide header on login page
  const hideHeaderRoutes = ["/login", "/"]; 
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div>
      {<Header />}  {/* 👈 only show when not on login */}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/profits"
          element={
            <ProtectedRoute>
              <Profits />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/fundAdded"
          element={
            <ProtectedRoute>
              <FundAdded />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/fundWithDraw"
          element={
            <ProtectedRoute>
              <FundWithdraw />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/order1"
          element={
            <ProtectedRoute>
              <Order1 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/order2"
          element={
            <ProtectedRoute>
              <Order2 />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
