import React, { useState, useEffect } from 'react';
import httpClient from '../httpClient';
import { Score } from '../types';

const base_url = "http://localhost:5000/"

const Scores: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get(base_url + '/api/get_scores');
        console.log(resp.data[0])
        setScores(resp.data[0])
      } catch (error) {
        console.log("Cannot fetch scores");
      }
    })();
  }, []);

  return (
    <div className="container mx-auto mt-5">
      <table className="table-auto w-1/2 m-auto">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-left">
            <th className="py-2 px-6">User</th>
            <th className="py-2 px-6">Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score) => (
            <tr key={score.user} className="border-b">
              <td className="py-4 px-6">{score.user}</td>
              <td className="py-4 px-6">{score.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scores;
