import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from '../component/Form';
import { clearCart } from '../redux/cartSlice';
import { API_BASE, unwrapApiResponse } from '../utils/api';

const Ordersummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const { isAuthenticated, isHydrating, user } = useSelector((state) => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    buildingName: '',
    colony: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const productFromState = location?.state?.product || null;
  const itemsForSummary = useMemo(() => {
    if (productFromState) return [{ ...productFromState, quantity: 1 }];
    if (Array.isArray(cartItems) && cartItems.length > 0) return cartItems;
    return [];
  }, [productFromState, cartItems]);
  const totals = useMemo(() => {
    const subtotal = itemsForSummary.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [itemsForSummary]);
  const fetchUserAddresses = async () => {
    setAddressesLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/addresses`, { credentials: 'include' });
      if (!response.ok) {
        setAddresses([]);
        return;
      }
      const json = await response.json();
      const addressesList = unwrapApiResponse(json);
      setAddresses(Array.isArray(addressesList) ? addressesList : []);
    } catch (err) {
      setAddresses([]);
    } finally {
      setAddressesLoading(false);
    }
  };
  useEffect(() => {
    if (!isHydrating && !isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isAuthenticated) {
      fetchUserAddresses();
    }
  }, [isAuthenticated, isHydrating, navigate]);
  const openAddAddress = () => {
    setEditingIndex(null);
    setFormData({ buildingName: '', colony: '', city: '', state: '', pincode: '' });
    setShowAddressDialog(true);
  };
  const openEditAddress = (index) => {
    const address = addresses[index];
    setEditingIndex(index);
    setFormData({
      buildingName: address?.buildingname || '',
      colony: address?.colony || '',
      city: address?.city || '',
      state: address?.state || '',
      pincode: address?.pincode || ''
    });
    setShowAddressDialog(true);
  };
  const closeAddressDialog = () => {
    setShowAddressDialog(false);
    setEditingIndex(null);
    setFormData({ buildingName: '', colony: '', city: '', state: '', pincode: '' });
  };
  const handleSaveAddress = async () => {
    const userId = user?.id ?? user?._id;
    if (!userId) return;
    if (!formData.buildingName || !formData.colony || !formData.city || !formData.state || !formData.pincode) {
      alert('Please fill all fields');
      return;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      alert('Pincode must be exactly 6 digits');
      return;
    }
    try {
      const payload = {
        buildingname: String(formData.buildingName).trim(),
        colony: String(formData.colony).trim(),
        city: String(formData.city).trim(),
        state: String(formData.state).trim(),
        pincode: String(formData.pincode).trim(),
      };
      if (editingIndex !== null && editingIndex !== undefined) {
        const response = await fetch(`${API_BASE}/api/v1/addresses/${editingIndex}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          alert('Failed to update address. Please try again.');
          return;
        }
        await fetchUserAddresses();
        closeAddressDialog();
        alert('✓ Address updated successfully!');
        return;
      }
      const response = await fetch(`${API_BASE}/api/v1/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        alert('Failed to add address. Please try again.');
        return;
      }
      await fetchUserAddresses();
      closeAddressDialog();
      alert('✓ Address added successfully!');
    } catch (err) {
      alert('Error saving address: ' + err.message);
    }
  };
  const handleDeleteAddress = async (index) => {
    const userId = user?.id ?? user?._id;
    if (!userId) return;
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const response = await fetch(`${API_BASE}/api/v1/addresses/${index}`, { method: 'DELETE', credentials: 'include' });
      if (!response.ok) {
        alert('Failed to delete address. Please try again.');
        return;
      }
      await fetchUserAddresses();
      alert('✓ Address deleted successfully!');
    } catch (err) {
      alert('Error deleting address: ' + err.message);
    }
  };
  const handlePlaceOrder = async () => {
    if (itemsForSummary.length === 0) {
      alert('No items to place an order.');
      return;
    }
    if (addresses.length === 0) {
      setShowAddressDialog(true);
      return;
    }
    setPlacingOrder(true);
    try {
      const orderName =
        productFromState?.name ||
        (itemsForSummary.length === 1 ? itemsForSummary[0]?.name : `Cart Order (${itemsForSummary.length} items)`);
      const response = await fetch(`${import.meta.env?.VITE_API_BASE || ''}/api/v1/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: orderName,
          total: Math.round(totals.total),
          items: itemsForSummary.map((it) => ({
            id: it.id,
            name: it.name,
            price: it.price,
            quantity: it.quantity || 1,
            image: it.image || null
          }))
        })
      });
      if (!response.ok) {
        alert('Failed to place order. Please try again.');
        return;
      }
      if (!productFromState) {
        dispatch(clearCart());
      }
      setShowSuccessDialog(true);
      window.setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (err) {
      alert('Error placing order: ' + err.message);
    } finally {
      setPlacingOrder(false);
    }
  };
  return (
    <div className="flex-1 w-full">
      <section className="pt-8 pb-12 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Order Summary</h1>
                <p className="text-sm text-gray-500 mt-1">Review items, address, and place your order.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Items</h2>
                  {itemsForSummary.length > 0 ? (
                    <div className="space-y-3">
                      {itemsForSummary.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 items-center bg-white rounded-lg border border-gray-200 p-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                          </div>
                          <p className="font-bold text-gray-900">₹{item.price}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No items selected.</p>
                  )}
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
                    <button
                      onClick={openAddAddress}
                      className="bg-[#4169e1] hover:bg-[#315ac1] text-white text-sm px-6 py-2 rounded-full transition-colors font-semibold shadow-sm w-full sm:w-auto"
                      style={{height: '44px', minWidth: '140px', width: '100%', maxWidth: '220px'}}>
                      + Add Address
                    </button>
                  </div>
                  {addressesLoading ? (
                    <div className="space-y-3 animate-pulse">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-1/5" />
                        </div>
                      ))}
                    </div>
                  ) : addresses.length > 0 ? (
                    <div className="space-y-3">
                      {addresses.map((addr, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
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
                              onClick={() => openEditAddress(index)}
                              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(index)}
                              className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-dashed border-gray-300 rounded-lg p-4">
                      <p className="text-gray-700 font-semibold">No address found</p>
                      <p className="text-sm text-gray-500 mt-1">Add an address to place your order.</p>
                      <button
                        onClick={openAddAddress}
                        className="mt-3 bg-[#4169e1] hover:bg-[#315ac1] text-white text-sm px-4 py-2 rounded-lg transition-colors"
                      >
                        Add Address
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 sticky top-24">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Summary</h2>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18%)</span>
                      <span>₹{totals.tax.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-300 pt-4 mt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#4169e1]">₹{totals.total.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className="mt-5 w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {placingOrder ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showAddressDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 mt-20">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingIndex !== null ? 'Edit Address' : 'Add New Address'}
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
                onClick={handleSaveAddress}
                className="flex-1 bg-[#4169e1] hover:bg-[#315ac1] text-white font-medium py-2 rounded-lg transition-colors"
              >
                {editingIndex !== null ? 'Update' : 'Add'}
              </button>
              <button
                onClick={closeAddressDialog}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {showSuccessDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <p className="text-2xl font-extrabold text-gray-900">Whoo! 🎉</p>
            <p className="mt-2 text-gray-700 font-semibold">Order placed</p>
            <p className="mt-1 text-sm text-gray-500">Redirecting you to home...</p>
            <button
              onClick={() => navigate('/')}
              className="mt-5 w-full bg-black text-white font-bold py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Ordersummary;
