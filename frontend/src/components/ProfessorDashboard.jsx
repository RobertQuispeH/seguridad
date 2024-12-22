import LogoutButton from './LogoutButton'

const ProfessorDashboard = () => {
  return (
    <div className="bg-gray-800 text-white min-h-screen p-8">
      <LogoutButton />
      <h1 className="text-3xl font-bold mb-4">Profesor Dashboard</h1>
      <p className="text-lg">
        Bienvenido, profesor. Aquí puedes gestionar tus clases y estudiantes.
      </p>
      {/* Aquí puedes añadir más elementos específicos del panel del profesor */}
    </div>
  )
}

export default ProfessorDashboard
