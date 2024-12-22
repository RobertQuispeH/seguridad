import { useState, useEffect } from 'react'
import { login } from '../services/api'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await login(email, password)
      if (response.data.message === 'QR Code generated') {
        onLoginSuccess(response.data.user_id, response.data.qr_code)
      }
    } catch {
      setError('Invalid credentials or server error')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      const decodedToken = jwtDecode(token)
      const userRole = decodedToken.role_id

      if (userRole === 1) {
        navigate('/admin')
      } else if (userRole === 2) {
        navigate('/professor')
      }
    }
  }, [navigate])

  return (
    <dic className="h-screen bg-gray-800 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-lg w-full mx-auto"
      >
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            id="floating_email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
          <label
            htmlFor="floating_email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600"
          >
            Email Address
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            id="floating_password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          />
          <label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600"
          >
            Password
          </label>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </dic>
  )
}

LoginForm.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
}

export default LoginForm
