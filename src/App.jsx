import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Notifications from "@/components/pages/Notifications";
import React from "react";
import Layout from "@/components/organisms/Layout";
import StudentDetail from "@/components/pages/StudentDetail";
import Dashboard from "@/components/pages/Dashboard";
import Students from "@/components/pages/Students";
import Grades from "@/components/pages/Grades";
import Attendance from "@/components/pages/Attendance";
import Assignments from "@/components/pages/Assignments";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;