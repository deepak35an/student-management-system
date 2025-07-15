import axios from 'axios';
import React, { useState, useEffect } from 'react';


export default function TeacherDashboard() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [filtered, setFiltered] = useState([]);
  const [view, setview] = useState("post");
  const [className, setClassName] = useState("");
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [formDatas, setFormDatas] = useState({
    className: '',
    date: new Date().toISOString().split('T')[0],
    records: [],
    markedBy: ''
  });
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    className: '',
    type: '',
    postedBy: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchteacher = async () => {
      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData);
      const response = await axios.get('http://localhost:5005/api/auth/get-teacher');
      const teacher = response.data;
      const filteredList = teacher.filter((t) => t.user.email === user.email);
      setFiltered(filteredList);
    }
    fetchteacher();
    const fetchSudent = async () => {
      const sResponse = await axios('http://localhost:5005/api/auth/get-student');
      const stud = sResponse.data;
      console.log(stud);
      setStudents(stud);
    }
    fetchSudent();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Handle form submission here
    try {
      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData);
      const token = localStorage.getItem('token');
      const uppost = axios.post('http://localhost:5005/api/auth/post',
        {
          "title": formData.title,
          "content": formData.content,
          "className": formData.className,
          "type": formData.type,
          "postedBy": user.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        },
      )
      alert("Post created successfully!");

      // Reset form after submission
      setFormData({
        title: '',
        content: '',
        className: '',
        type: '',
        postedBy: ''
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitAt = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        student: studentId,
        status,
      }));
      const token = localStorage.getItem('token');
      console.log(className, date, records);

      await axios.post(
        "http://localhost:5005/api/auth/attendance",
        {
          className,
          date,
          records,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        },
      );

      alert("Attendance marked successfully!");
      setAttendance({});
    } catch (err) {
      console.error(err);
      alert("Failed to mark attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  return (
    <>
      {/* <h1>{filtered[0]?.user?.name || "Loading..."}</h1> */}
      <header className="flex items-center h-16 bg-black text-white px-7 justify-between">
        <div>
          <h1>{filtered?.[0]?.user?.name ?? "Loading..."}</h1>
        </div>
        <div className="flex gap-x-4 px-5 text-red-500">
          <button onClick={() => {
            setview("post");
          }}
            className="hover:text-red-300">Post
          </button>
          <button onClick={() => {
            setview("attendance");
          }}
            className="hover:text-red-300">
            Take Attendance
          </button>
          <button onClick={() => {
            localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  setview('logout');
                  window.location.reload();
          }}
            className="hover:text-red-300">
            Logout
          </button>
        </div>
      </header>
      {view === "post" && (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md my-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Post</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter post content"
              />
            </div>

            <div>
              <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-2">
                Class Name
              </label>
              <input
                type="text"
                id="className"
                name="className"
                value={formData.className}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter class name"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="assignment">Assignment</option>
                <option value="result">Result</option>
                <option value="notice">Notice</option>
                {/* <option value="discussion">Discussion</option> */}
              </select>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Create Post
            </button>
          </div>
        </div>
      )}

      {view === "attendance" && (
        // <h1>this is attendance section</h1>
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md my-15">
          <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>

          {/* Class Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Name
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="e.g., cse2026"
            />
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Roll No</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {students
                  .filter((s) => !className || s.className === className) // Filter by className
                  .map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border text-center">
                        {student.rollNumber}
                      </td>
                      <td className="px-4 py-2 border">{student.user.name}</td>
                      <td className="px-4 py-2 border text-center">
                        <select
                          value={attendance[student._id] || ""}
                          onChange={(e) =>
                            handleAttendanceChange(student._id, e.target.value)
                          }
                          className="border rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                          <option value="">Select</option>
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                        </select>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitAt}
            disabled={loading}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Marking..." : "Submit Attendance"}
          </button>
        </div>
      )}


    </>
  )
}
