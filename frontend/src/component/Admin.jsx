import React, { useEffect, useMemo, useState } from 'react'
import Form from './Form'
import Loader from './Loader'
import { API_BASE, unwrapApiResponse } from '../utils/api'

const Admin = () => {
  // Admin dashboard:
  // - Lists products and supports search-by-name
  // - Add/Edit/Delete via JSON Server (POST/PATCH/DELETE)
  // - Image is stored as a base64 data URL (FileReader)
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [productsError, setProductsError] = useState('')

  const [searchQuery, setSearchQuery] = useState('')

  const [showProductDialog, setShowProductDialog] = useState(false)
  const [productSubmitting, setProductSubmitting] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [productFormError, setProductFormError] = useState('')
  const [productFormValues, setProductFormValues] = useState({
    name: '',
    // NEW: backend uses categoryKey for routing/filtering
    categoryKey: 'electronics',
    price: '',
    // NEW: allow marking a product as featured (Featured section)
    featured: false,
    description: ''
  })
  const [imageDataUrl, setImageDataUrl] = useState('')

  const fetchProducts = async () => {
    // Loads the full products list (Admin table + client-side filtering).
    setProductsLoading(true)
    setProductsError('')
    try {
      // NEW: Fetch products from backend.
      const res = await fetch(`${API_BASE}/api/v1/products/getallproducts`, { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to load products')
      const json = await res.json()
      const data = unwrapApiResponse(json)
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setProductsError(err.message || 'Failed to load products')
    } finally {
      setProductsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const openAddProduct = () => {
    setEditingProductId(null)
    setProductFormError('')
    setProductFormValues({
      name: '',
      categoryKey: 'electronics',
      price: '',
      featured: false,
      description: ''
    })
    setImageDataUrl('')
    setShowProductDialog(true)
  }

  const openEditProduct = (product) => {
    setEditingProductId(product._id || product.id)
    setProductFormError('')
    setProductFormValues({
      name: product.name ?? '',
      // NEW: support both `categoryKey` and legacy `category` string.
      categoryKey: product.categoryKey ?? product.category ?? 'electronics',
      price: product.price ?? '',
      featured: Boolean(product.featured),
      description: product.description ?? ''
    })
    setImageDataUrl(product.image || '')
    setShowProductDialog(true)
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      // NEW: Delete in backend.
      const res = await fetch(`${API_BASE}/api/v1/products/deleteproduct/${id}`, { method: 'DELETE', credentials: 'include' })
      if (!res.ok) throw new Error('Failed to delete product')
      setProducts((prev) => prev.filter((p) => String(p._id || p.id) !== String(id)))
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to delete product')
    }
  }

  const handleImageChange = (file) => {
    if (!file) {
      setImageDataUrl('')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setImageDataUrl(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProduct = async () => {
    setProductFormError('')

    if (!productFormValues.name?.trim() || !String(productFormValues.price).trim()) {
      setProductFormError('Name and price are required')
      return
    }
    // Make description optional (allow empty string)
    const description = typeof productFormValues.description === 'string' ? productFormValues.description : '';

    const basePayload = {
      name: productFormValues.name.trim(),
      // NEW: send categoryKey to backend.
      categoryKey: productFormValues.categoryKey,
      price: Number(productFormValues.price),
      description: description.trim(), // allow empty string
      featured: Boolean(productFormValues.featured)
    }

    setProductSubmitting(true)
    try {
      if (editingProductId) {
        // NEW: Update product in backend.
        const payload = imageDataUrl ? { ...basePayload, image: imageDataUrl } : basePayload

        const res = await fetch(`${API_BASE}/api/v1/products/updateproduct/${editingProductId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include'
        })
        if (!res.ok) throw new Error('Failed to update product')
        const json = await res.json()
        const updated = unwrapApiResponse(json)
        setProducts((prev) => prev.map((p) => (String(p._id || p.id) === String(updated._id || updated.id) ? updated : p)))
      } else {
        const payload = {
          ...basePayload,
          image: imageDataUrl || '',
          reviews: []
        }

        // NEW: Create product in backend.
        const res = await fetch(`${API_BASE}/api/v1/products/addproduct`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include'
        })
        if (!res.ok) throw new Error('Failed to create product')
        const json = await res.json()
        const created = unwrapApiResponse(json)
        setProducts((prev) => [created, ...prev])
      }

      setShowProductDialog(false)
      setEditingProductId(null)
    } catch (err) {
      console.error(err)
      setProductFormError(err.message || 'Failed to save product')
    } finally {
      setProductSubmitting(false)
    }
  }

  const productFields = useMemo(
    () => [
      { name: 'name', label: 'Name', placeholder: 'Product name', type: 'text' },
      {
        // NEW: categoryKey is what the category pages filter on.
        name: 'categoryKey',
        label: 'Category',
        type: 'radio',
        radioGroupClassName: 'grid grid-cols-1 md:grid-cols-3 gap-2',
        options: [
          { label: 'Electronics', value: 'electronics' },
          { label: 'Clothing', value: 'clothing' },
          { label: 'Grocery', value: 'grocery' }
        ]
      },
      {
        // NEW: Featured flag (you asked to add this under electronics; we allow it for any category).
        name: 'featured',
        label: 'Featured',
        type: 'checkbox',
        helperText: 'When enabled, this product shows in the Featured section.',
        labelClassName: 'text-sm font-semibold text-gray-700 mb-0 cursor-pointer',
        className: 'w-5 h-5 accent-[#4169e1] rounded focus:ring-2 focus:ring-[#4169e1]'
      },
      { name: 'price', label: 'Price', placeholder: 'e.g. 999', type: 'number' },
      {
        name: 'description',
        label: 'Description',
        placeholder: 'Product description...',
        type: 'textarea',
        rows: 4
      }
    ],
    [editingProductId]
  )

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return products
    return products.filter((p) => String(p.name || '').toLowerCase().includes(query))
  }, [products, searchQuery])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Manage Products</h3>
        <button
          onClick={openAddProduct}
          className="bg-[#4169e1] hover:bg-[#315ac1] text-white text-sm px-3 py-1 rounded-full transition-colors"
        >
          + Add Product
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search product name..."
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#4169e1] bg-white"
        />
      </div>

      {productsError ? (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
          {productsError}
        </div>
      ) : null}

      {productsLoading ? (
        <Loader type="table" count={6} />
      ) : (
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-3 text-xs font-semibold text-gray-700">Name</th>
                  <th className="p-3 text-xs font-semibold text-gray-700">Category</th>
                  <th className="p-3 text-xs font-semibold text-gray-700">Price</th>
                  <th className="p-3 text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 text-xs text-gray-900 font-semibold">{p.name}</td>
                    <td className="p-3 text-xs text-gray-700">{p.category}</td>
                    <td className="p-3 text-xs text-gray-700">₹{p.price}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditProduct(p)}
                          className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No matching products</div>
          ) : null}
        </div>
      )}

      {showProductDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md md:max-w-lg p-5 md:p-6 max-h-[70vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">
                {editingProductId ? 'Edit Product' : 'Add Product'}
              </h3>
              <button
                onClick={() => {
                  setShowProductDialog(false)
                  setEditingProductId(null)
                }}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {productFormError ? (
              <div className="mb-3 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                {productFormError}
              </div>
            ) : null}

            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <Form
                fields={productFields}
                values={productFormValues}
                onChange={(name, value) => setProductFormValues((prev) => ({ ...prev, [name]: value }))}
                containerClassName="space-y-4"
                labelClassName="block text-sm font-semibold text-gray-700 mb-2"
                inputClassName="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#4169e1] bg-white"
                textareaClassName="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#4169e1] bg-white resize-none"
                radioInputClassName="w-4 h-4 cursor-pointer accent-[#4169e1]"
              />

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                  className="w-full text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Choose a file to set/replace the image.</p>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSaveProduct}
                disabled={productSubmitting}
                className="flex-1 bg-[#4169e1] hover:bg-[#315ac1] text-white font-semibold py-2 rounded-xl transition-colors disabled:opacity-50"
              >
                {productSubmitting ? 'Saving…' : editingProductId ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => {
                  setShowProductDialog(false)
                  setEditingProductId(null)
                }}
                disabled={productSubmitting}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Admin
