import axios from 'axios';
import React from 'react'
import { MdPhone, MdLocationOn, MdPayment } from "react-icons/md";
import { FaUser, FaShoppingBag, FaClock, FaMotorcycle, FaCheckCircle } from "react-icons/fa";
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice';
import { useState } from 'react';

function OwnerOrderCard({ data }) {
    const [availableBoys, setAvailableBoys] = useState([])
    const dispatch = useDispatch()
    
    const handleUpdateStatus = async (orderId, shopId, status) => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, {status}, {withCredentials: true})
            dispatch(updateOrderStatus({orderId, shopId, status}))
            setAvailableBoys(result.data.availableBoys || [])
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getStatusColor = (status) => {
        switch(status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-300'
            case 'preparing':
                return 'bg-blue-100 text-blue-700 border-blue-300'
            case 'out of delivery':
                return 'bg-purple-100 text-purple-700 border-purple-300'
            case 'delivered':
                return 'bg-green-100 text-green-700 border-green-300'
            default:
                return 'bg-gray-100 text-gray-700 border-gray-300'
        }
    }

    const getStatusIcon = (status) => {
        switch(status) {
            case 'pending':
                return <FaClock className="w-4 h-4" />
            case 'preparing':
                return <FaShoppingBag className="w-4 h-4" />
            case 'out of delivery':
                return <FaMotorcycle className="w-4 h-4" />
            case 'delivered':
                return <FaCheckCircle className="w-4 h-4" />
            default:
                return <FaClock className="w-4 h-4" />
        }
    }

    return (
        <div className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100'>
            {/* Header */}
            <div className='bg-gradient-to-r from-[#ff4d2d] to-[#e64323] p-4 text-white'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
                            <FaUser className='w-5 h-5' />
                        </div>
                        <div>
                            <h2 className='text-lg font-bold'>{data.user.fullName}</h2>
                            <p className='text-white/80 text-sm'>{data.user.email}</p>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(data.shopOrders?.status)}`}>
                        {getStatusIcon(data.shopOrders?.status)}
                        <span className='capitalize'>{data.shopOrders?.status || 'pending'}</span>
                    </div>
                </div>
            </div>

            <div className='p-6 space-y-4'>
                {/* Contact Info */}
                <div className='flex items-center gap-4 text-gray-600'>
                    <div className='flex items-center gap-2'>
                        <MdPhone className='text-[#ff4d2d]' />
                        <span className='text-sm'>{data.user.mobile}</span>
                    </div>
                    {data.paymentMethod === "online" && (
                        <div className='flex items-center gap-2'>
                            <MdPayment className='text-[#ff4d2d]' />
                            <span className='text-sm'>Payment: {data.payment ? 'Paid' : 'Pending'}</span>
                        </div>
                    )}
                </div>

                {/* Delivery Address */}
                <div className='bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border border-orange-100'>
                    <div className='flex items-start gap-2'>
                        <MdLocationOn className='text-[#ff4d2d] mt-1 flex-shrink-0' />
                        <div className='flex-1'>
                            <p className='text-gray-800 font-medium'>{data?.deliveryAddress?.text}</p>
                            <p className='text-xs text-gray-500 mt-1'>
                                Lat: {data?.deliveryAddress.latitude?.toFixed(6)}, Lon: {data?.deliveryAddress.longitude?.toFixed(6)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div>
                    <h3 className='text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2'>
                        <FaShoppingBag className='text-[#ff4d2d]' />
                        Order Items ({data.shopOrders?.shopOrderItems?.length || 0})
                    </h3>
                    <div className='flex space-x-3 overflow-x-auto pb-2 scrollbar-hide'>
                        {data.shopOrders?.shopOrderItems?.map((item, index) => (
                            <div key={index} className='flex-shrink-0 w-32 bg-gradient-to-br from-gray-50 to-white rounded-xl p-2 border border-gray-100 hover:shadow-md transition-shadow'>
                                <img 
                                    src={item.item?.image || item.image} 
                                    alt={item.name} 
                                    className='w-full h-20 object-cover rounded-lg mb-2' 
                                />
                                <p className='text-xs font-semibold text-gray-800 truncate'>{item.name}</p>
                                <p className='text-xs text-gray-500 mt-1'>
                                    Qty: {item.quantity} × ₹{item.price}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Update */}
                <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
                    <div className='flex-1'>
                        <p className='text-sm text-gray-600 mb-2'>Update Status:</p>
                        <select 
                            className='rounded-lg border-2 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d] border-[#ff4d2d] text-[#ff4d2d] font-semibold bg-white cursor-pointer hover:bg-orange-50 transition-colors' 
                            onChange={(e) => {
                                if(e.target.value) {
                                    handleUpdateStatus(data._id, data.shopOrders?.shop?._id, e.target.value)
                                    e.target.value = ""
                                }
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Change Status</option>
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="out of delivery">Out Of Delivery</option>
                        </select>
                    </div>
                    <div className='text-right ml-4'>
                        <p className='text-xs text-gray-500 mb-1'>Total Amount</p>
                        <p className='text-2xl font-bold text-[#ff4d2d]'>₹{data.shopOrders?.subtotal || 0}</p>
                    </div>
                </div>

                {/* Delivery Boy Info */}
                {data.shopOrders?.status === "out of delivery" && (
                    <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border border-purple-200">
                        <div className='flex items-center gap-2 mb-3'>
                            <FaMotorcycle className='text-purple-600' />
                            <h4 className='font-semibold text-gray-800'>
                                {data.shopOrders.assignedDeliveryBoy ? 'Assigned Delivery Boy' : 'Available Delivery Boys'}
                            </h4>
                        </div>
                        {availableBoys?.length > 0 ? (
                            <div className='space-y-2'>
                                {availableBoys.map((boy, index) => (
                                    <div key={index} className='bg-white rounded-lg p-3 border border-purple-100'>
                                        <p className='font-medium text-gray-800'>{boy.fullName}</p>
                                        <p className='text-sm text-gray-600'>{boy.mobile}</p>
                                    </div>
                                ))}
                            </div>
                        ) : data.shopOrders.assignedDeliveryBoy ? (
                            <div className='bg-white rounded-lg p-3 border border-purple-100'>
                                <p className='font-medium text-gray-800'>{data.shopOrders.assignedDeliveryBoy.fullName}</p>
                                <p className='text-sm text-gray-600'>{data.shopOrders.assignedDeliveryBoy.mobile}</p>
                            </div>
                        ) : (
                            <p className='text-gray-600 text-sm'>Waiting for delivery boy to accept...</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OwnerOrderCard
