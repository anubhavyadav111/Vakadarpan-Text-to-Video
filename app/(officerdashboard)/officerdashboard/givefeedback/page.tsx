"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChangeEvent } from 'react'; // Add this import for ChangeEvent
import { Button } from '@/components/ui/button';

type Project = {
  id: string;
  name: string;
  vId: string;
  userId: string;
  approvalStatus: boolean;
  createdAt: string; // Change the type according to your data
  updatedAt: string; // Change the type according to your data
  pId: string;
};

const Myproject = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleProjectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(event.target.value);
  };

  const handleFeedbackChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFeedback(event.target.value);
  };

  const handleUpdateFeedback = async () => {
    try {
      const selectedProjectData = projects.find(project => project.pId === selectedProject);
      if (!selectedProjectData) {
        console.error('Selected project not found');
        return;
      }

      const { id, pId, name } = selectedProjectData;
      const response = await axios.put(`/api/feedback`, {
        id: id,
        pId: pId,
        name: name,
        feedback: feedback
      });
      console.log('Feedback updated:', response.data);
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center w-3/4 md:max-w-md">
        <h1 className="text-4xl mb-6">Feedbacks</h1>
        <div>
          {projects.map((project) => {
            const { id, name, vId, userId, approvalStatus, createdAt, updatedAt, pId } = project;
            return (
              <div key={pId}>
                <p>Project Name: {name}</p>
                <p>Project ID: {pId}</p>
                <hr className="my-4" />
              </div>
            );
          })}
          <select
            value={selectedProject}
            onChange={handleProjectChange}
            className="block w-full border rounded py-2 px-3 mt-4"
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.pId} value={project.pId}>
                {project.name}
              </option>
            ))}
          </select>
          {selectedProject && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Enter feedback"
                value={feedback}
                onChange={handleFeedbackChange}
                className="block w-full border rounded py-2 px-3"
              />
              <Button className="mt-12" onClick={handleUpdateFeedback}>Submit Feedback</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Myproject;
