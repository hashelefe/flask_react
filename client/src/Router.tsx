import React from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import QuizComponent from './pages/Quiz'
import Scores from './pages/Scores'

const Router = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" Component={LandingPage}/>
            <Route path="/login" Component={Login}/>
            <Route path="/register" Component={Register}/>
            <Route path="/quizes" Component={QuizComponent}/>
            <Route path="/scores" Component={Scores}/>

            <Route Component={NotFound}/>
        </Routes>
    </BrowserRouter>
  )
}

export default Router