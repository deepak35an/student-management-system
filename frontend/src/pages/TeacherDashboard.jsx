import axios from 'axios';
import React, { useState, useEffect } from 'react';


export default function TeacherDashboard() {
  const [filtered, setFiltered] = useState([]);
  const [view, setview] = useState("post");
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
    const fetchSudent = async() => {
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
            setview("logout");
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
        <h1>this is attendance section</h1>
      )}


    </>
  )
}
