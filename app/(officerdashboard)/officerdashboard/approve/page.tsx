"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const Myproject = () => {
  const [projects, setProjects] = useState([]);

  const approve = async (id: string) => {
    try {
        const response = await axios.put('/api/projects', { id });
        console.log(response.data); 
        
      } catch (error) {
        console.error('Error approving project:', error);
      }
  }

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
        <div className="p-8 text-center text-4xl font-bold">Pending for approval</div>
        <div>
          <div className="flex flex-row gap-4">
            
            {projects.map((project) => {
              const { id, name, vId, userId, approvalStatus, createdAt, updatedAt,projectId } = project;
              return (
                !approvalStatus && (
                    <div key={id} className="bg-gray-200 p-4">
                      <p> Project Id : {id}</p>
                      <p>Project Name: {name}</p>
                      <video width="320" height="240" controls>
                          <source src={vId} type="video/mp4" />
                          Your browser does not support the video tag.
                      </video>
                      <p>User ID: {userId}</p>
                      <p>Approval Status: {approvalStatus ? 'Approved' : 'Pending'}</p>
                      <p>Created At: {createdAt}</p>
                      <p>Updated At: {updatedAt}</p>
                      <Button variant="destructive" onClick={()=>approve(id)}>Approve</Button>
                    </div>
                )
              );
            })}
          </div>
        </div>
      </div>
      <div>
        <div className="p-8 text-center text-4xl font-bold">Approved</div>
        <div>Approved Videos</div>
        <div>
          <div className="flex flex-row gap-4">
            
            {projects.map((project) => {
              const { id, name, vId, userId, approvalStatus, createdAt, updatedAt } = project;
              return (
                approvalStatus && (
                    <div key={id} className="bg-gray-200 p-4">
                      <p> Project Id : {id}</p>
                      <p>Project Name: {name}</p>
                      <p>Video ID: {vId}</p>
                      <p>User ID: {userId}</p>
                      <p>Approval Status: {approvalStatus ? 'Approved' : 'Pending'}</p>
                      <p>Created At: {createdAt}</p>
                      <p>Updated At: {updatedAt}</p>
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
