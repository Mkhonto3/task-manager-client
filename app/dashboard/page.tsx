"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm, { TaskFormData } from '../components/TaskForm';
import jwt_decode from 'jwt-decode';

const API_URL = 'http://localhost:3005/auth';


interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  userId: number;
}

export default function TaskManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tasks, setTasks] = useState<Task[]>([]);
  

  useEffect(() => {
    fetchTasks();
  }, []);

  const countOutstandingTasksForLoggedInUser = (): number => {
    const loggedInUserId = getCurrentUserId(); 
    return tasks.filter(task => task.userId === loggedInUserId && task.status !== 'Completed').length;
  };


  const getCurrentUserId = (): number | null => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const decodedToken: { userId: number } = jwt_decode(accessToken);
        console.log(decodedToken);
        return decodedToken.userId;
      }
    }
    return null;
  };

  const fetchTasks = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const openTaskForm = () => {
    setIsFormOpen(true);
  };

  const closeTaskForm = () => {
    setIsFormOpen(false);
  };

  const handleAddTask = async (formData: TaskFormData) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('Access token is missing');
        return;
      }
  
      const response = await axios.post(`${API_URL}/tasks`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Task added successfully:', response.data);
      closeTaskForm();
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  

  const calculateDaysUntilDue = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const filteredTasks = tasks.filter(task => {
    const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const matchStatus = statusFilter === 'All' || task.status === statusFilter;
    return matchSearch && matchPriority && matchStatus;
  });

  const countOutstandingTasksPerUser = (userId: number): number => {
    return tasks.filter(task => task.userId === userId && task.status !== 'Completed').length;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Tasks</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all tasks including their details such as title, description, due date, priority, and status.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={openTaskForm}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Task
          </button>
        </div>
      </div>
      {isFormOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <TaskForm onSubmit={handleAddTask} onCancel={closeTaskForm} />
        </div>
      )}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="ml-2 block border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="ml-2 block border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="mt-8">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Title
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Description
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Due Date
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Priority
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Overdue (Days)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredTasks.map((task) => (
              <tr key={task.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {task.title}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{task.description}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{task.dueDate}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{task.priority}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{task.status}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{calculateDaysUntilDue(task.dueDate)}</td>
                {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {users.find(user => user.id === task.userId)?.name || 'Unknown'}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Outstanding Tasks for Logged-in User</h2>
        <p>Outstanding Tasks: {countOutstandingTasksForLoggedInUser()}</p>
      </div>
    </div>
  );
}
