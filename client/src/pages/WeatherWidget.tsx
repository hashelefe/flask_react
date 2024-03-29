import { useState } from "react";
import { WeatherData } from "../types";

const API_KEY = "3538fc3af6ee964b3b9e502588f2a74f"

const WeatherWidget = () => {
  const [city, setCity] = useState('Warszawa');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<WeatherData['list'] | null>(null); // Adjusted type for forecast
  const [errorMessage, setErrorMessage] = useState('');

  const fetchWeather = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
      if (!response.ok) {
        throw new Error(`Błąd pobierania pogody: ${response.statusText}`);
      }
      const data = await response.json();
      setWeatherData(data);

      // Pobieranie prognozy pogody
      const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`);
      if (!forecastResponse.ok) {
        throw new Error(`Błąd pobierania prognozy pogody: ${forecastResponse.statusText}`);
      }
      const forecastData = await forecastResponse.json();
      setWeatherForecast(forecastData.list); // Assuming 'list' exists in the response
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };
  
    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCity(event.target.value);
    };
  
    const handleButtonClick = () => {
      fetchWeather();
    };
  
    return (
      <div className="bg-gray-200 p-20 rounded-md flex flex-col items-center">
        <div className="bg-white w-100 p-5 rounded-md">
        <h2 className="text-2xl font-bold mb-2">Pogoda w {city} ({new Date().toLocaleDateString('pl-PL')})</h2>
        
        {errorMessage && <p className="text-red-500 text-lg mb-4">{errorMessage}</p>}
        {weatherData && (
          <div className="flex">
            <img
                        src={`https://openweathermap.org/img/wn/${weatherData.weather[0]?.icon}.png`}
                        alt="Ikona pogody"
                        className="w-32 h-32"
                    />
        <div className="flex-column h-100 pt-5">
            <p className="text-lg">Temperatura: {(weatherData?.main?.temp - 273.15).toFixed(1)}°C</p>
            <p className="text-lg">Odczuwalna: {(weatherData?.main?.feels_like - 273.15).toFixed(1)}°C</p>
            <p className="text-lg">Niebo: {weatherData?.weather?.[0]?.description}</p>
        </div>
        </div>
        )}
        {weatherForecast && (
            <div className="mt-4">
                <h2 className="text-lg font-bold">Prognoza pogody na 3 dni:</h2>
                <div className="flex">
                {weatherForecast.slice(0, 3).map((day, index) => ( // Limit to 3 days
                <div className="m-5">
                    <p className="text-lg">
                        {new Date(day.dt * 1000).toLocaleDateString('pl-PL')}
                    </p>
                    <img
                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                        alt="Ikona pogody"
                        className="w-10 h-10"
                    />
                    <p className="text-lg">Temperatura: {(day.main.temp- 273.15).toFixed(1)}°C</p>
                </div>
                ))}
                </div>
            </div>
            )}
        <input
          className="border border-gray-300 rounded-md p-2 mt-4"
          type="text"
          placeholder="Wpisz nazwę miasta"
          value={city}
          onChange={handleCityChange}
        />
        <button
          className="bg-blue-500 text-white rounded-md p-2 mt-4 ml-2"
          onClick={handleButtonClick}
        >
          Sprawdź pogodę
        </button>
      </div>
    </div>
    );
  };
  
  export default WeatherWidget;
  