"use client"

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
      <div className="p-8 text-center text-4xl font-bold">Pending for approval</div>
      <div className="flex">
        {projects.map((project) => {
          const {
            id,
            name,
            vId,
            userId,
            approvalStatus,
            createdAt,
            updatedAt,
            Reels,
            approvalStatus1,
            approvalStatus2,
          } = project;

          return (
            <div key={id} className="flex rounded-lg bg-black text-white p-4 m-4">
              <div className="flex-1 p-8">
                <div>Project Name: {name}</div>
                <div>User ID: {userId}</div>
                <div className="pt-4">
                  <video width="320" height="240" controls>
                    <source src={vId} type="video/mp4" />
                  </video>
                </div>
                <div className="flex flex-row gap-12 pt-8">
                  <div>Approval Status of PIB officer1: {approvalStatus ? 'Approved' : 'Pending'}</div>
                  <div>Approval Status of PIB officer2: {approvalStatus1 ? 'Approved' : 'Pending'}</div>
                  <div>Approval Status of PIB officer3: {approvalStatus2 ? 'Approved' : 'Pending'}</div>
                </div>
                <div className="pt-8">Final Status: {approvalStatus && approvalStatus1 && approvalStatus2 && <div>ALL APPROVED</div>}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Myproject;
