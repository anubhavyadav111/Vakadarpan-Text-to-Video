"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

const Myproject = () => {
  const [projects, setProjects] = useState([]);

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

  return (
    <div>
      <div>
        <div className="p-8 text-center text-4xl font-bold">Feedbacks from officer</div>
        <div>
          <div className="flex flex-row gap-4">
            
            {projects.map((project) => {
              const { id, name, vId, userId, approvalStatus, createdAt, updatedAt, feedback } = project;
              return (
                feedback && (
                    <div key={id} className="bg-gray-200 p-4 gap-4">
                        <div>
                            <p> Project Id : {id}</p>
                            <p>Project Name: {name}</p>
                            <p>Video ID: {vId}</p>
                            <p>User ID: {userId}</p>
                            <p>Approval Status: {approvalStatus ? 'Approved' : 'Pending'}</p>
                            <p>Created At: {createdAt}</p>
                            <p>Updated At: {updatedAt}</p>
                        </div>
                        <div>
                            <p>Feedback: {feedback}</p>
                        </div>
                      
                    </div>
                )
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myproject;
