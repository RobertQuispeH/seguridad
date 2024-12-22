import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import PropTypes from 'prop-types'

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem('authToken')

  if (!token) {
    return <Navigate to="/" /> // Redirige al login si no hay token
  }

  try {
    const decodedToken = jwtDecode(token)
    const userRole = decodedToken.role_id

    if (allowedRoles.includes(userRole)) {
      return children
    } else {
      return <Navigate to="/" /> // Redirige si no tiene permisos
    }
  } catch (error) {
    console.error('Invalid token:', error)
    return <Navigate to="/" />
  }
}

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.number).isRequired, // Validación de allowedRoles
  children: PropTypes.node.isRequired, // Asegúrate de validar que children son elementos válidos
}

export default ProtectedRoute
