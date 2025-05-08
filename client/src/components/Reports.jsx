import React, { useState } from 'react'
import axios from 'axios'
import Dialog from './Dialog'

export default function Reports({ workoutPlans = [] }) {
  const [selectedWorkout, setSelectedWorkout] = useState('all');
  const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', type: 'error' });

  const closeDialog = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  };

  const showDialog = (title, message, type = 'error') => {
    setDialog({ isOpen: true, title, message, type });
  };

  const downloadMealsReport = async () => {
    try {
      const response = await axios.get('/api/reports/meals', {
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'meals_report.csv');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading meals report:', error);
      showDialog('Download Error', 'Failed to download meals report. Please try again.', 'error');
    }
  };

  const downloadWorkoutsReport = async () => {
    try {
      const endpoint = selectedWorkout === 'all' 
        ? '/api/reports/workouts' 
        : `/api/reports/workouts/${selectedWorkout}`;
      
      const response = await axios.get(endpoint, {
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'workouts_report.csv');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading workouts report:', error);
      showDialog('Download Error', 'Failed to download workouts report. Please try again.', 'error');
    }
  };

  return (
    <div className="reports-container">
      <h2>Reports</h2>
      
      {/* Meals Report Section */}
      <div className="report-card">
        <h3>Meals Report</h3>
        <p>Download a CSV report of all your meal plans with nutritional information.</p>
        <button 
          onClick={downloadMealsReport} 
          className="report-button"
        >
          Download Meals CSV
        </button>
      </div>
      
      {/* Workouts Report Section */}
      <div className="report-card">
        <h3>Workouts Report</h3>
        <p>Download a CSV report of your workout plans with exercise details.</p>
        
        <div className="report-select-container">
          <label htmlFor="workout-select" className="select-label">Select Workout: </label>
          <select 
            id="workout-select"
            value={selectedWorkout}
            onChange={(e) => setSelectedWorkout(e.target.value)}
            className="report-select"
          >
            <option value="all">All Workouts</option>
            {workoutPlans.map(plan => (
              <option key={plan._id} value={plan._id}>
                {plan.title}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={downloadWorkoutsReport} 
          className="report-button"
        >
          Download Workouts CSV
        </button>
      </div>
      
      {/* Dialog Component */}
      <Dialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
      />
    </div>
  );
} 