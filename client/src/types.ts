export interface User {
    id: string;
    email: string;
    name: string;
  }

export interface WeatherData {
    main: {
      temp: number;
      feels_like: number;
    };
    weather: [{ description: string, icon: string }];
    list?: {
        dt: number;
        weather: [{ icon: string }]
        main: { temp: number };
      }[];
  }

export interface Question {
    id: number;
    quiz_id: number;
    question: string;
    answers: string[];
    correctAnswer: number;
  }

export interface ForecastData {
    dt: number;
    weather: [{ icon: string }];
    main: { temp: number };
  }

export interface Score {
  user: string;
  score: number;
}