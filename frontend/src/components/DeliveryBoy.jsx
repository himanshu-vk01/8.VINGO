import React from 'react'
import Nav from './NaV.JSX'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { useEffect, useState, useMemo } from 'react'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import { ClipLoader } from 'react-spinners'
import { FaMotorcycle, FaCheckCircle, FaClock, FaMapMarkerAlt, FaShoppingBag, FaChartLine, FaCamera } from 'react-icons/fa'
import { MdDeliveryDining } from 'react-icons/md'

function DeliveryBoy() {
  const {userData, socket} = useSelector(state=>state.user)
  const [currentOrder, setCurrentOrder] = useState()
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [availableAssignments, setAvailableAssignments] = useState(null)
  const [otp, setOtp] = useState("")
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [deliveryPhoto, setDeliveryPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [statistics, setStatistics] = useState({
    totalToday: 0,
    delivered: 0,
    inProgress: 0,
    totalEarnings: 0
  })

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/delivery-boy-statistics`, {withCredentials: true})
      if(result.data) {
        setStatistics(result.data)
      }
    } catch (error) {
      // Don't log auth errors that might cause logout
      if(error?.response?.status !== 401 && error?.response?.status !== 403) {
        console.log("Statistics fetch error:", error)
      }
    }
  }

  useEffect(() => {
    if(userData?.role === "deliveryBoy") {
      fetchStatistics()
    }
  }, [userData])

  useEffect(() => {
    if(!socket || userData.role !== "deliveryBoy") return
let watchId
if(navigator.geolocation){
      watchId = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        setDeliveryBoyLocation({lat: latitude, lon: longitude})
        socket.emit('updateLocation', {
      latitude,
      longitude,
          userId: userData._id
    })
      }, (error) => {
    console.log(error)
      }, {
        enableHighAccuracy: true
      })
}

    return () => {
      if(watchId) navigator.geolocation.clearWatch(watchId)
}
  }, [socket, userData])

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, {withCredentials: true})
      if(result.data) {
      setAvailableAssignments(result.data)
      }
    } catch (error) {
      // Don't log auth errors that might cause logout
      if(error?.response?.status !== 401 && error?.response?.status !== 403) {
        console.log("Assignments fetch error:", error)
      }
    }
  }

  const getCurrentOrder = async () => {
     try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-order`, {withCredentials: true})
      if(result.data && result.data._id) {
    setCurrentOrder(result.data)
      } else {
        setCurrentOrder(null)
      }
    } catch (error) {
      // If it's a 400 (no current order), that's expected, not an error
      if(error?.response?.status === 400) {
        setCurrentOrder(null)
      } else if(error?.response?.status !== 401 && error?.response?.status !== 403) {
        console.log("Current order fetch error:", error)
        setCurrentOrder(null)
      } else {
        setCurrentOrder(null)
      }
    }
  }

  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, {withCredentials: true})
    console.log(result.data)
    await getCurrentOrder()
      await getAssignments()
      await fetchStatistics()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    socket?.on('newAssignment', (data) => {
      setAvailableAssignments(prev => ([...prev, data]))
    })
    return () => {
      socket?.off('newAssignment')
    }
  }, [socket])
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setDeliveryPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const sendOtp = async () => {
    if (!deliveryPhoto) {
      setMessage("Please upload a delivery photo first")
      return
    }
    setLoading(true)
    setMessage("")
    try {
      const result = await axios.post(`${serverUrl}/api/order/send-delivery-otp`, {
        orderId: currentOrder._id,
        shopOrderId: currentOrder.shopOrder._id
      }, {withCredentials: true})
      setLoading(false)
       setShowOtpBox(true)
    console.log(result.data)
    } catch (error) {
      console.log(error)
      setMessage(error?.response?.data?.message || "Failed to send OTP")
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setMessage("")
    if (!otp) {
      setMessage("Please enter OTP")
      return
    }
    try {
      const formData = new FormData()
      formData.append('orderId', currentOrder._id)
      formData.append('shopOrderId', currentOrder.shopOrder._id)
      formData.append('otp', otp)
      if (deliveryPhoto) {
        formData.append('deliveryPhoto', deliveryPhoto)
      }

      const result = await axios.post(`${serverUrl}/api/order/verify-delivery-otp`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    console.log(result.data)
      const successMessage = result.data.message || "Order Delivered Successfully!"
      setMessage(successMessage)
      
      if(successMessage.includes('Successfully') || successMessage.includes('Delivered')) {
        // Immediately clear the order
        setCurrentOrder(null)
        setShowOtpBox(false)
        setOtp("")
        setDeliveryPhoto(null)
        setPhotoPreview(null)
        
        // Refresh data sequentially with error handling to prevent logout
        try {
          await getCurrentOrder()
        } catch (err) {
          console.log("Error refreshing current order:", err)
        }
        
        try {
          await getAssignments()
        } catch (err) {
          console.log("Error refreshing assignments:", err)
        }
        
        try {
          await fetchStatistics()
        } catch (err) {
          console.log("Error refreshing statistics:", err)
        }
        
        // Show success message for 3 seconds then clear
        setTimeout(() => {
          setMessage("")
        }, 3000)
      }
    } catch (error) {
      console.log(error)
      setMessage(error?.response?.data?.message || "Failed to verify OTP")
    }
  }

  useEffect(() => {
    if(userData?.role === "deliveryBoy") {
getAssignments()
getCurrentOrder()
      fetchStatistics()
    }
  }, [userData])

  return (
    <div className='w-screen min-h-screen flex flex-col gap-6 items-center bg-[#fff9f6] overflow-y-auto pb-8'>
      <Nav/>
      
      <div className='w-full max-w-7xl flex flex-col gap-6 items-center px-4 sm:px-6 pt-6'>
        {/* Welcome Header */}
        <div className='w-full bg-gradient-to-r from-[#ff4d2d] to-[#e64323] rounded-3xl shadow-2xl overflow-hidden'>
          <div className='p-6 sm:p-8 text-white'>
            <div className='flex items-center justify-between flex-wrap gap-4'>
              <div className='flex items-center gap-4'>
                <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
                  <FaMotorcycle className='w-8 h-8' />
                </div>
                <div>
                  <h1 className='text-2xl sm:text-3xl font-bold'>Welcome, {userData.fullName}</h1>
                  <p className='text-white/90 text-sm sm:text-base mt-1 flex items-center gap-2'>
                    <FaMapMarkerAlt size={14} />
                    <span>Lat: {deliveryBoyLocation?.lat?.toFixed(6) || 'Loading...'}, Lon: {deliveryBoyLocation?.lon?.toFixed(6) || 'Loading...'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-all duration-300'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
                <FaShoppingBag className='w-6 h-6' />
              </div>
              <span className='text-3xl font-bold'>{statistics.totalToday}</span>
            </div>
            <p className='text-blue-100 text-sm font-medium'>Total Orders Today</p>
          </div>

          <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-all duration-300'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
                <FaCheckCircle className='w-6 h-6' />
              </div>
              <span className='text-3xl font-bold'>{statistics.delivered}</span>
            </div>
            <p className='text-green-100 text-sm font-medium'>Delivered</p>
          </div>

          <div className='bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-all duration-300'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
                <FaClock className='w-6 h-6' />
              </div>
              <span className='text-3xl font-bold'>{statistics.inProgress}</span>
            </div>
            <p className='text-yellow-100 text-sm font-medium'>In Progress</p>
          </div>

          <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-all duration-300'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
                <FaChartLine className='w-6 h-6' />
              </div>
              <span className='text-2xl font-bold'>₹{statistics.totalEarnings}</span>
            </div>
            <p className='text-purple-100 text-sm font-medium'>Earnings Today</p>
          </div>
        </div>

        {/* Current Order Section */}
        {currentOrder && (
          <div className='w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100'>
            <div className='bg-gradient-to-r from-[#ff4d2d] to-[#e64323] p-6 text-white'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
                  <MdDeliveryDining className='w-6 h-6' />
                </div>
                <h2 className='text-2xl font-bold'>Current Delivery</h2>
              </div>
    </div>

            <div className='p-6 space-y-6'>
              <div className='bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border border-orange-100'>
                <div className='flex items-start justify-between mb-4'>
   <div>
                    <h3 className='text-xl font-bold text-gray-800 mb-2'>{currentOrder?.shopOrder.shop.name}</h3>
                    <p className='text-gray-600 flex items-center gap-2'>
                      <FaMapMarkerAlt className='text-[#ff4d2d]' />
                      <span>{currentOrder.deliveryAddress.text}</span>
                    </p>
                  </div>
   </div>

                <div className='mt-4 pt-4 border-t border-orange-100'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-gray-600'>{currentOrder.shopOrder.shopOrderItems.length} items</span>
                    <span className='font-bold text-lg text-[#ff4d2d]'>₹{currentOrder.shopOrder.subtotal}</span>
  </div>
</div>
</div>

 <DeliveryBoyTracking data={{ 
                deliveryBoyLocation: deliveryBoyLocation || {
                  lat: userData.location?.coordinates?.[1] || 0,
                  lon: userData.location?.coordinates?.[0] || 0
      },
      customerLocation: {
        lat: currentOrder.deliveryAddress.latitude,
        lon: currentOrder.deliveryAddress.longitude
                }
              }} />

              {!showOtpBox ? (
                <div className='space-y-4'>
                  {/* Photo Upload Section */}
                  <div className='bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200'>
                    <label className='block text-sm font-semibold mb-4 text-gray-700 flex items-center gap-2'>
                      <FaCamera className='text-[#ff4d2d]' />
                      Upload Delivery Photo (Required)
                    </label>
                    <div className='space-y-4'>
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment"
                        onChange={handlePhotoChange}
                        className='hidden'
                        id='delivery-photo-input'
                      />
                      <label 
                        htmlFor='delivery-photo-input'
                        className='flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors'
                      >
                        {photoPreview ? (
                          <img 
                            src={photoPreview} 
                            alt="Delivery photo preview" 
                            className='w-full h-full object-cover rounded-xl'
                          />
                        ) : (
                          <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                            <FaCamera className='w-12 h-12 text-gray-400 mb-3' />
                            <p className='mb-2 text-sm text-gray-500'>
                              <span className='font-semibold text-[#ff4d2d]'>Click to upload</span> or drag and drop
                            </p>
                            <p className='text-xs text-gray-500'>PNG, JPG or JPEG (MAX. 5MB)</p>
                          </div>
                        )}
                      </label>
                      {deliveryPhoto && (
                        <button
                          onClick={() => {
                            setDeliveryPhoto(null)
                            setPhotoPreview(null)
                            document.getElementById('delivery-photo-input').value = ''
                          }}
                          className='w-full text-sm text-red-600 hover:text-red-700 font-medium'
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>

                  <button 
                    className='w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed' 
                    onClick={sendOtp} 
                    disabled={loading || !deliveryPhoto}
                  >
                    {loading ? (
                      <ClipLoader size={20} color='white'/>
                    ) : (
                      <>
                        <FaCheckCircle size={20} />
                        Mark As Delivered
                      </>
                    )}
                  </button>
                  {!deliveryPhoto && (
                    <p className='text-center text-sm text-red-600'>Please upload a delivery photo first</p>
                  )}
                </div>
              ) : (
                <div className='bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200'>
                  <p className='text-sm font-semibold mb-4 text-gray-700'>
                    Enter OTP sent to <span className='text-[#ff4d2d] font-bold'>{currentOrder.user.fullName}</span>
                  </p>
                  <input 
                    type="text" 
                    className='w-full border-2 border-gray-300 px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] focus:border-transparent text-lg' 
                    placeholder='Enter OTP' 
                    onChange={(e) => setOtp(e.target.value)} 
                    value={otp}
                  />
                  {message && (
                    <div className={`mb-4 p-4 rounded-xl text-center font-semibold ${
                      message.includes('Successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {message}
                    </div>
                  )}
                  <button 
                    className="w-full bg-gradient-to-r from-[#ff4d2d] to-[#e64323] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-200 transform hover:scale-105" 
                    onClick={verifyOtp}
                  >
                    Submit OTP
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Available Orders Section */}
        {!currentOrder && (
          <div className='w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100'>
            <div className='bg-gradient-to-r from-[#ff4d2d] to-[#e64323] p-6 text-white'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
                    <FaShoppingBag className='w-6 h-6' />
                  </div>
                  <h2 className='text-2xl font-bold'>Available Orders</h2>
                </div>
                <span className='bg-white/20 px-4 py-1 rounded-full text-sm font-semibold'>
                  {availableAssignments?.length || 0} Available
                </span>
              </div>
            </div>

            <div className='p-6'>
              {availableAssignments?.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {availableAssignments.map((assignment, index) => (
                    <div 
                      key={index} 
                      className='bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105'
                    >
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex-1'>
                          <h3 className='text-xl font-bold text-gray-800 mb-2'>{assignment?.shopName}</h3>
                          <p className='text-gray-600 text-sm flex items-start gap-2 mb-2'>
                            <FaMapMarkerAlt className='text-[#ff4d2d] mt-1 flex-shrink-0' />
                            <span>{assignment?.deliveryAddress.text}</span>
                          </p>
                          <div className='flex items-center gap-4 text-sm text-gray-500 mt-3'>
                            <span className='flex items-center gap-1'>
                              <FaShoppingBag size={14} />
                              {assignment.items.length} items
                            </span>
                            <span className='font-bold text-[#ff4d2d]'>₹{assignment.subtotal}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        className='w-full bg-gradient-to-r from-[#ff4d2d] to-[#e64323] text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105' 
                        onClick={() => acceptOrder(assignment.assignmentId)}
                      >
                        Accept Order
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-12'>
                  <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <FaShoppingBag className='text-gray-400 w-10 h-10' />
                  </div>
                  <p className='text-gray-500 text-lg font-medium'>No Available Orders</p>
                  <p className='text-gray-400 text-sm mt-2'>New orders will appear here when available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeliveryBoy
