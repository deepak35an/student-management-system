// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthContext";

const App = () => {
  const userEmail = "john.doe@school.edu";

  const userData = {
    user: {
      name: "John Doe",
      email: userEmail,
      role: "student"
    },
    rollNumber: "CS2024001",
    className: "Computer Science - Year 3",
    feesPaid: true
  };

  const posts = [
    {
      _id: "1",
      title: "Assignment 1: Data Structures",
      type: "assignment",
      content: "Complete the binary tree implementation assignment. Due date: March 15, 2024.",
      className: "Computer Science - Year 3",
      postedBy: { name: "Dr. Smith" },
      createdAt: new Date("2024-03-01")
    },
    {
      _id: "2",
      title: "Mid-term Results Published",
      type: "result",
      content: "Mid-term examination results are now available. Check your grades in the results section.",
      className: "Computer Science - Year 3",
      postedBy: { name: "Prof. Johnson" },
      createdAt: new Date("2024-03-05")
    },
    {
      _id: "3",
      title: "Holiday Notice",
      type: "notice",
      content: "University will be closed on March 20th for Spring Festival. Classes will resume on March 21st.",
      className: "Computer Science - Year 3",
      postedBy: { name: "Admin Office" },
      createdAt: new Date("2024-03-10")
    }
  ];

  const attendanceData = [
    { date: "2024-03-01", status: "present" },
    { date: "2024-03-02", status: "present" },
    { date: "2024-03-03", status: "absent" },
    { date: "2024-03-04", status: "present" },
    { date: "2024-03-05", status: "present" },
    { date: "2024-03-06", status: "present" },
    { date: "2024-03-07", status: "absent" },
  ];

  const handleViewAssignments = (email) => {
    console.log("View assignments for:", email);
    // Handle navigation or API call
  };

  const handleCheckResults = (email) => {
    console.log("Check results for:", email);
    // Handle navigation or API call
  };

  const handleViewAttendance = (email) => {
    console.log("View attendance for:", email);
    // Handle navigation or API call
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/teacher" element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />

          <Route path="/student" element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard
                userEmail={userEmail}
                userData={userData}
                posts={posts}
                attendanceData={attendanceData}
                onViewAssignments={handleViewAssignments}
                onCheckResults={handleCheckResults}
                onViewAttendance={handleViewAttendance}
              />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
