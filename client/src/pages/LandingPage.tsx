import React, { useEffect, useState } from 'react'
import httpClient from '../httpClient';
import { User } from "../types";
import WeatherWidget from './WeatherWidget';

const LandingPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      if(localStorage.getItem("accessToken"))
       {
         try {
           const resp = await httpClient.get("//localhost:5000/@me", {
             headers: {"Authorization": `Bearer ${localStorage.getItem("accessToken")}`}
           });
           setUser(resp.data);
         } catch (error) {
           console.log("Not authenticated");
         }
       }
    })();
  }, []);

  return (
    <div>

      <WeatherWidget />
      <div className="bg-blue-200 p-4 rounded-md flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">Sprawdź się w quizie!</h2>
      <p className="text-lg">Sztuczna inteligencja przygotowała dla Ciebie wyzwanie.</p>
      <a href="/quizes">
  <button className="bg-blue-500 text-white rounded-md p-2 mt-4">Rozpocznij quiz</button>
</a>
    </div>
    </div>
  )
}

export default LandingPage