import { useState, useEffect } from 'react'
import { getUsers } from '../services/api'
import LogoutButton from './LogoutButton'

const AdminDashboard = () => {
  const [users, setUsers] = useState([]) // Estado para almacenar los usuarios
  const [loading, setLoading] = useState(true) // Estado de carga
  const [error, setError] = useState(null) // Estado para manejar errores

  useEffect(() => {
    getUsers()
      .then((response) => {
        setUsers(response.data.users)
        setLoading(false)
      })
      .catch(() => {
        setError('Error al cargar los usuarios')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p className="text-white">Cargando usuarios...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <div className="bg-gray-800 text-white p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg mb-4">
        Bienvenido, administrador. Aquí puedes gestionar los usuarios y
        configuraciones.
      </p>
      <LogoutButton />
      <h2 className="text-2xl font-semibold mt-6 mb-4">
        Usuarios registrados:
      </h2>
      <table className="min-w-full table-auto text-sm">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre de usuario</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-700">
              <td className="px-4 py-2">{user.id}</td>
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.role_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminDashboard
