import { useState } from 'react'
import { Navigate } from 'react-router-dom'

const LogoutButton = () => {
  const [redirect, setRedirect] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('authToken') // Elimina el token del localStorage
    setRedirect(true) // Cambia el estado para redirigir al login
  }

  if (redirect) {
    return <Navigate to="/" /> // Redirige al login
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
    >
      Cerrar sesión
    </button>
  )
}

export default LogoutButton
