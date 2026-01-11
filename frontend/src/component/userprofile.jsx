import React, { useEffect, useState } from 'react'
import Form from './Form'
import { API_BASE, unwrapApiResponse } from '../utils/api';

const UserProfile = () => {
  const [addresses, setAddresses] = useState([])
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [showAddressDialog, setShowAddressDialog] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [formData, setFormData] = useState({
    buildingName: '',
    colony: '',
    city: '',
    state: '',
    pincode: ''
  })

  // Fetch addresses from backend
  const fetchUserAddresses = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/addresses`, {
        credentials: 'include',
      });
      if (!response.ok) {
        console.error('Failed to fetch addresses:', response.status);
        return;
      }
      const json = await response.json();
      setAddresses(unwrapApiResponse(json) || []);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  const fetchUserOrders = async () => {
    setOrdersLoading(true)

    try {
      const response = await fetch(`${API_BASE}/api/v1/orders/mine`, { credentials: 'include' })
      if (!response.ok) {
        console.error('Failed to fetch orders:', response.status)
        setOrders([])
        return
      }
      const json = await response.json()
      const ordersList = unwrapApiResponse(json)
      setOrders(Array.isArray(ordersList) ? ordersList : [])
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    fetchUserAddresses();
    fetchUserOrders();
  }, []);

  const getOrderName = (order) => {
    return order?.name || order?.orderName || order?.title || (order?.id ? `Order ${order.id}` : 'Order')
  }

  const getOrderStatus = (order) => {
    const raw = String(order?.status || '').trim()
    const normalized = raw.toLowerCase()
    if (!raw || normalized === 'pending') return 'Ordered'
    // Keep any other backend statuses as-is (e.g., Shipped, Delivered)
    return raw
  }

  const formatDate = (dateValue) => {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const getDeliveryDate = (order) => {
    const base = order?.createdAt ? new Date(order.createdAt) : new Date()
    if (Number.isNaN(base.getTime())) {
      const fallback = new Date()
      fallback.setDate(fallback.getDate() + 4)
      return fallback
    }
    base.setDate(base.getDate() + 4)
    return base
  }

  const getStatusPillClassName = (status) => {
    const normalized = String(status || '').toLowerCase()
    if (normalized === 'delivered' || normalized === 'completed') return 'bg-green-100 text-green-700'
    if (normalized === 'cancelled' || normalized === 'canceled' || normalized === 'failed') return 'bg-red-100 text-red-700'
    if (normalized === 'shipped' || normalized === 'out for delivery') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-700'
  }

  const canCancel = (status) => {
    const s = String(status || '').toLowerCase()
    return !(s === 'delivered' || s === 'completed' || s === 'cancelled' || s === 'canceled')
  }

  const handleCancelOrder = async (order) => {
    if (!order?.id) return
    if (!window.confirm('Cancel this order?')) return
    try {
      const res = await fetch(`${API_BASE}/api/v1/orders/${order.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!res.ok) {
        alert('Failed to cancel order. Please try again.')
        return
      }
      // Refresh list
      await fetchUserOrders()
    } catch (err) {
      console.error('Error cancelling order:', err)
      alert('Error cancelling order: ' + err.message)
    }
  }

  const handleAddAddress = async () => {
    if (!formData.buildingName || !formData.colony || !formData.city || !formData.state || !formData.pincode) {
      alert('Please fill all fields');
      return;
    }

    try {
      // Edit address
      if (editingAddressId !== null && editingAddressId !== undefined) {
        const response = await fetch(`${API_BASE}/api/v1/addresses/${editingAddressId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            buildingname: formData.buildingName,
            colony: formData.colony,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          }),
        });
        if (!response.ok) {
          console.error('Failed to update address:', response.status);
          alert('Failed to update address. Please try again.');
          return;
        }
        await fetchUserAddresses();
        setFormData({ buildingName: '', colony: '', city: '', state: '', pincode: '' });
        setShowAddressDialog(false);
        setEditingAddressId(null);
        alert('✓ Address updated successfully!');
        return;
      }
      // Add address
      const response = await fetch(`${API_BASE}/api/v1/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          buildingname: formData.buildingName,
          colony: formData.colony,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        }),
      });
      if (!response.ok) {
        console.error('Failed to add address:', response.status);
        alert('Failed to add address. Please try again.');
        return;
      }
      await fetchUserAddresses();
      setFormData({ buildingName: '', colony: '', city: '', state: '', pincode: '' });
      setShowAddressDialog(false);
      alert('✓ Address added successfully!');
    } catch (err) {
      console.error('Error saving address:', err);
      alert('Error saving address: ' + err.message);
    }
  };

  const handleDeleteAddress = async (index) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const response = await fetch(`${API_BASE}/api/v1/addresses/${index}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        console.error('Failed to delete address:', response.status);
        alert('Failed to delete address. Please try again.');
        return;
      }
      await fetchUserAddresses();
      alert('✓ Address deleted successfully!');
    } catch (err) {
      console.error('Error deleting address:', err);
      alert('Error deleting address: ' + err.message);
    }
  };

  const handleEditAddress = (address, index) => {
    setFormData({
      buildingName: address.buildingname,
      colony: address.colony,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setEditingAddressId(index);
    setShowAddressDialog(true);
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">My Addresses</h3>
          <button
            onClick={() => {
              setShowAddressDialog(true)
              setEditingAddressId(null)
              setFormData({ buildingName: '', colony: '', city: '', state: '', pincode: '' })
            }}
            className="bg-[#4169e1] hover:bg-[#315ac1] text-white text-sm px-3 py-1 rounded-full transition-colors"
          >
            + Add Address
          </button>
        </div>

        {addresses.length > 0 ? (
          <div className="space-y-3">
            {addresses.map((addr, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Building:</span> {addr.buildingname}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Colony:</span> {addr.colony}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">City:</span> {addr.city}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">State:</span> {addr.state}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Pincode:</span> {addr.pincode}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEditAddress(addr, idx)}
                    className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(idx)}
                    className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No addresses added yet</p>
        )}
      </div>

      <div className="w-full mt-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">My Orders</h3>

        {ordersLoading ? (
          <p className="text-gray-500 text-center py-4">Loading orders...</p>
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {orders.map((order) => {
              const status = getOrderStatus(order)
              const createdAtLabel = order?.createdAt ? formatDate(order.createdAt) : ''
              const deliveryLabel = formatDate(getDeliveryDate(order))
              const totalLabel = order?.total !== undefined && order?.total !== null && String(order.total).trim() !== ''
                ? `₹${order.total}`
                : ''

              return (
                <div
                  key={order?.id || `${getOrderName(order)}-${status}`}
                  className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{getOrderName(order)}</p>
                      {order?.id ? (
                        <p className="text-xs text-gray-500 mt-1">Order ID: {order.id}</p>
                      ) : null}
                    </div>
                    <span
                      className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${getStatusPillClassName(status)}`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* Product names (if present) */}
                  {Array.isArray(order?.items) && order.items.length > 0 ? (
                    <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                      <p className="text-[11px] text-gray-500">Products</p>
                      <ul className="mt-1 list-disc list-inside text-xs text-gray-700 space-y-0.5 max-h-24 overflow-auto">
                        {order.items.slice(0, 4).map((it) => (
                          <li key={`${order.id}-${it.id}-${it.name}`}>{it.name} {it.quantity ? `× ${it.quantity}` : ''}</li>
                        ))}
                        {order.items.length > 4 ? (
                          <li className="text-gray-500">+{order.items.length - 4} more</li>
                        ) : null}
                      </ul>
                    </div>
                  ) : null}

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                      <p className="text-[11px] text-gray-500">Delivery Date</p>
                      <p className="text-sm font-semibold text-gray-900">{deliveryLabel || '—'}</p>
                    </div>
                    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                      <p className="text-[11px] text-gray-500">Order Total</p>
                      <p className="text-sm font-semibold text-[#4169e1]">{totalLabel || '—'}</p>
                    </div>
                  </div>

                  {createdAtLabel ? (
                    <p className="mt-3 text-xs text-gray-500">Placed on {createdAtLabel}</p>
                  ) : null}

                  {canCancel(status) ? (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleCancelOrder(order)}
                        className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                      >
                        Cancel Order
                      </button>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No orders yet</p>
        )}
      </div>

      {showAddressDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingAddressId ? 'Edit Address' : 'Add New Address'}
            </h3>

            <Form
              containerClassName="space-y-4"
              inputClassName="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#4169e1]"
              fields={[
                { name: 'buildingName', type: 'text', placeholder: 'Building Name' },
                { name: 'colony', type: 'text', placeholder: 'Colony/Society' },
                { name: 'city', type: 'text', placeholder: 'City' },
                { name: 'state', type: 'text', placeholder: 'State' },
                { name: 'pincode', type: 'text', placeholder: 'Pincode' }
              ]}
              values={formData}
              onChange={(name, value) => setFormData({ ...formData, [name]: value })}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddAddress}
                className="flex-1 bg-[#4169e1] hover:bg-[#315ac1] text-white font-medium py-2 rounded-lg transition-colors"
              >
                {editingAddressId ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => {
                  setShowAddressDialog(false)
                  setEditingAddressId(null)
                  setFormData({ buildingName: '', colony: '', city: '', state: '', pincode: '' })
                }}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default UserProfile
