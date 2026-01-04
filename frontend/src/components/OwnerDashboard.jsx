import React, { useMemo } from 'react'
import Nav from './Nav.jsx'
import { useSelector } from 'react-redux'
import { FaUtensils, FaPen, FaShoppingBag, FaCheckCircle, FaClock, FaMotorcycle, FaChartLine } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import OwnerItemCard from './OwnerItemCard.jsx';
import OwnerOrderCard from './OwnerOrderCard.jsx';
import { MdRestaurantMenu } from "react-icons/md";

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const { myOrders } = useSelector(state => state.user)
  const navigate = useNavigate()

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!myOrders || myOrders.length === 0) {
      return {
        totalToday: 0,
        delivered: 0,
        pending: 0,
        preparing: 0,
        outForDelivery: 0,
        totalRevenue: 0
      }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const ordersToday = myOrders.filter(order => {
      const orderDate = new Date(order.createdAt)
      orderDate.setHours(0, 0, 0, 0)
      return orderDate.getTime() === today.getTime()
    })

    const delivered = ordersToday.filter(order => order.shopOrders?.status === 'delivered').length
    const pending = ordersToday.filter(order => order.shopOrders?.status === 'pending').length
    const preparing = ordersToday.filter(order => order.shopOrders?.status === 'preparing').length
    const outForDelivery = ordersToday.filter(order => order.shopOrders?.status === 'out of delivery').length
    const totalRevenue = ordersToday
      .filter(order => order.shopOrders?.status === 'delivered')
      .reduce((sum, order) => sum + (order.shopOrders?.subtotal || 0), 0)

    return {
      totalToday: ordersToday.length,
      delivered,
      pending,
      preparing,
      outForDelivery,
      totalRevenue
    }
  }, [myOrders])

  const pendingOrders = useMemo(() => {
    return myOrders?.filter(order => 
      order.shopOrders?.status === 'pending' || 
      order.shopOrders?.status === 'preparing'
    ) || []
  }, [myOrders])

  const deliveredOrders = useMemo(() => {
    return myOrders?.filter(order => order.shopOrders?.status === 'delivered') || []
  }, [myOrders])

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center'>
      <Nav />
      
      {!myShopData && (
        <div className='flex justify-center items-center p-4 sm:p-6 mt-20'>
          <div className='w-full max-w-md bg-gradient-to-br from-white to-orange-50 shadow-2xl rounded-3xl p-8 border border-orange-100 hover:shadow-3xl transition-all duration-300 transform hover:scale-105'>
            <div className='flex flex-col items-center text-center'>
              <div className='w-24 h-24 bg-gradient-to-br from-[#ff4d2d] to-[#e64323] rounded-full flex items-center justify-center mb-6 shadow-lg'>
                <FaUtensils className='text-white w-12 h-12' />
              </div>
              <h2 className='text-3xl font-bold text-gray-800 mb-3'>Add Your Restaurant</h2>
              <p className='text-gray-600 mb-6 text-base leading-relaxed'>
                Join our food delivery platform and reach thousands of hungry customers every day. Start your journey today!
              </p>
              <button 
                className='bg-gradient-to-r from-[#ff4d2d] to-[#e64323] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105' 
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {myShopData && (
        <div className='w-full max-w-7xl flex flex-col items-center gap-8 px-4 sm:px-6 py-8'>
          {/* Welcome Header */}
          <div className='w-full bg-gradient-to-r from-[#ff4d2d] to-[#e64323] rounded-3xl shadow-2xl overflow-hidden'>
            <div className='p-8 text-white'>
              <div className='flex items-center justify-between flex-wrap gap-4'>
                <div className='flex items-center gap-4'>
                  <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
                    <FaUtensils className='w-8 h-8' />
                  </div>
                  <div>
                    <h1 className='text-3xl sm:text-4xl font-bold'>Welcome to {myShopData.name}</h1>
                    <p className='text-white/90 text-lg mt-1'>{myShopData.city}, {myShopData.state}</p>
                  </div>
                </div>
                <button
                  className='bg-white text-[#ff4d2d] px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2'
                  onClick={() => navigate("/create-edit-shop")}
                >
                  <FaPen size={18} />
                  Edit Shop
                </button>
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
                <span className='text-3xl font-bold'>{statistics.pending + statistics.preparing}</span>
              </div>
              <p className='text-yellow-100 text-sm font-medium'>Pending/Preparing</p>
            </div>

            <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-all duration-300'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
                  <FaChartLine className='w-6 h-6' />
                </div>
                <span className='text-2xl font-bold'>₹{statistics.totalRevenue.toFixed(2)}</span>
              </div>
              <p className='text-purple-100 text-sm font-medium'>Revenue Today</p>
            </div>
          </div>

          {/* Shop Information Card */}
          <div className='w-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-orange-100 hover:shadow-3xl transition-all duration-300'>
            <div className='relative'>
              <img 
                src={myShopData.image} 
                alt={myShopData.name} 
                className='w-full h-64 sm:h-80 object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
              <div className='absolute bottom-6 left-6 right-6 text-white'>
                <h1 className='text-3xl sm:text-4xl font-bold mb-2'>{myShopData.name}</h1>
                <p className='text-white/90 text-lg'>{myShopData.address}</p>
              </div>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center'>
                    <FaUtensils className='text-[#ff4d2d]' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Location</p>
                    <p className='font-semibold'>{myShopData.city}, {myShopData.state}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center'>
                    <MdRestaurantMenu className='text-[#ff4d2d] text-xl' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Menu Items</p>
                    <p className='font-semibold'>{myShopData.items?.length || 0} Items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Orders Section */}
          {pendingOrders.length > 0 && (
            <div className='w-full'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3'>
                  <div className='w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center'>
                    <FaClock className='text-yellow-600' />
                  </div>
                  Active Orders ({pendingOrders.length})
                </h2>
              </div>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {pendingOrders.map((order, index) => (
                  <OwnerOrderCard data={order} key={index} />
                ))}
              </div>
            </div>
          )}

          {/* Menu Items Section */}
          <div className='w-full'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3'>
                <div className='w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center'>
                  <MdRestaurantMenu className='text-[#ff4d2d] text-xl' />
                </div>
                Menu Items ({myShopData.items?.length || 0})
              </h2>
              <button
                onClick={() => navigate("/add-item")}
                className='bg-gradient-to-r from-[#ff4d2d] to-[#e64323] text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2'
              >
                <FaUtensils size={16} />
                Add Item
              </button>
            </div>

            {myShopData.items.length === 0 ? (
              <div className='flex justify-center items-center p-8'>
                <div className='w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-orange-100 text-center'>
                  <div className='w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <FaUtensils className='text-[#ff4d2d] w-10 h-10' />
                  </div>
                  <h2 className='text-2xl font-bold text-gray-800 mb-2'>Add Your Food Item</h2>
                  <p className='text-gray-600 mb-6'>
                    Share your delicious creations with our customers by adding them to the menu.
                  </p>
                  <button
                    className='bg-gradient-to-r from-[#ff4d2d] to-[#e64323] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
                    onClick={() => navigate("/add-item")}
                  >
                    Add Food
                  </button>
                </div>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {myShopData.items.map((item, index) => (
                  <OwnerItemCard data={item} key={index} />
                ))}
              </div>
            )}
          </div>

          {/* View All Orders Button */}
          <div className='w-full flex justify-center'>
            <button
              onClick={() => navigate("/my-orders")}
              className='bg-white text-[#ff4d2d] px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-2 border-[#ff4d2d] flex items-center gap-2'
            >
              <FaShoppingBag size={18} />
              View All Orders
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OwnerDashboard
