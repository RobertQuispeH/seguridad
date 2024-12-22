import { useState } from 'react'
import { verifyOtp } from '../services/api'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

const OtpForm = ({ userId, qrCode, setUserId }) => {
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await verifyOtp(userId, otpCode)
      if (response.data.message === 'OTP verified') {
        const token = response.data.token
        localStorage.setItem('authToken', token)
        const userRole = response.data.user.role_id
        setUserId(null)
        if (userRole === 1) {
          navigate('/admin')
        } else if (userRole === 2) {
          navigate('/professor')
        }
      }
    } catch {
      setError('Invalid or expired OTP')
    }
  }

  return (
    <div className="h-screen bg-gray-800 flex items-center justify-center">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-lg w-full mx-auto">
        <p className="text-lg mb-4">Scan the QR Code:</p>
        <img
          src={`data:image/png;base64,${qrCode}`}
          alt="QR Code"
          className="w-48 h-48 mb-4 mx-auto"
        />
        <form onSubmit={handleOtpSubmit}>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              id="otp_code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label
              htmlFor="otp_code"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600"
            >
              Enter OTP
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Verify OTP
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  )
}

OtpForm.propTypes = {
  userId: PropTypes.number.isRequired,
  qrCode: PropTypes.string.isRequired,
}

export default OtpForm
