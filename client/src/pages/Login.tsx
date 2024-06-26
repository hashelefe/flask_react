import React, { useState } from 'react'
import httpClient from '../httpClient'


const Login = () => {
    const [email, setEmail] = useState<string>("")
    const [pwd, setPwd] = useState<string>("")
    const base_url = "https://flask-back-cj5j.onrender.com/"

    const login_user = async (e:any) => {
        e.preventDefault()
        try{
            const resp = await httpClient.post(base_url+"login", {
                email,
                password: pwd,
            })
            localStorage.setItem("accessToken",resp.data.token)

        } catch(error: any) {
            console.log(error)
            alert("There was an error, try again later")
        }

    }

  return (
    <section className="bg-white dark:bg-gray-900">
        <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
            <form className="w-full max-w-md">

                <div className="relative flex items-center mt-6">
                    <span className="absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </span>

                    <input 
                        type="email"
                        value={email}
                        onChange = {(e) => setEmail(e.target.value)}  
                        className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Adres mailowy"/>
                </div>

                <div className="relative flex items-center mt-4">
                    <span className="absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </span>

                    <input 
                        type="password"
                        value={pwd}
                        onChange = {(e) => setPwd(e.target.value)} 
                        className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Hasło"/>
                </div>

                <div className="mt-6">
                    <button 
                        type="button" 
                        onClick={(e) => login_user(e)}
                        className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                        Zaloguj
                    </button>

                    <div className="mt-6 text-center ">
                        <a href="/register" className="text-sm text-blue-500 hover:underline dark:text-blue-400">
                            Nie masz jeszcze konta?
                        </a>
                    </div>
                </div>
            </form>
        </div>
</section>
  )
}

export default Login