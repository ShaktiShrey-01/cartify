import React, { useMemo, useState } from 'react';
// import { getCookie } from '../utils/cookie';
import { useSelector } from 'react-redux';
import Loader from './Loader';
import Form from './Form';

const Review = (props) => {
  // Props and state declarations
  const {
    reviews = [],
    loading = false,
    onReviewAdded = () => {},
    onReviewUpdated = () => {},
    onReviewDeleted = () => {},
    productId,
    API_BASE,
  } = props;

  // User and permissions
  const effectiveUser = useSelector(state => state.auth?.user || null);
  const canReview = !!effectiveUser;

  // Dialog/modal state
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({ rating: '5', title: '', comment: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  // Dummy helpers (replace with real logic as needed)
  const openNewReview = () => {
    setFormData({ rating: '5', title: '', comment: '' });
    setEditingReviewId(null);
    setShowDialog(true);
    setFormError('');
  };
  const openEditReview = (review) => {
    setFormData({ rating: String(review.rating), title: review.title, comment: review.comment });
    setEditingReviewId(review.id);
    setShowDialog(true);
    setFormError('');
  };
  const isReviewOwner = (review) => effectiveUser && review.userId === effectiveUser._id;

  const myReview = useMemo(
    () => (effectiveUser ? reviews.find(r => r.userId === effectiveUser._id) : null),
    [reviews, effectiveUser]
  );

  const handleOpenDialog = () => {
    if (!canReview) {
      alert('Please login to add a review.');
      return;
    }
    if (myReview) {
      openEditReview(myReview);
    } else {
      openNewReview();
    }
  };

  const handleEditReview = (review) => {
    if (!isReviewOwner(review)) return;
    openEditReview(review);
  };

  const handleDeleteReview = async (review) => {
    if (!isReviewOwner(review)) return;
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`${API_BASE}/api/v1/reviews/${review.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete review');
      onReviewDeleted(review.id);
      alert('✓ Review deleted successfully!');
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review. Please try again.');
    }
  };

  const handleSubmitReview = async () => {
    if (!canReview) {
      alert('Please login to add a review.')
      return
    }

    setFormError('')
    if (!formData.title.trim() || !formData.comment.trim()) {
      setFormError('Please fill in all fields')
      return
    }

    if (formData.title.length < 5) {
      setFormError('Review title must be at least 5 characters')
      return
    }

    if (formData.comment.length < 10) {
      setFormError('Review comment must be at least 10 characters')
      return
    }

    const normalizedEditId = editingReviewId || null

    setSubmitting(true)
    try {
      const newReview = {
        productId,
        rating: parseInt(formData.rating, 10),
        title: formData.title,
        comment: formData.comment,
      }

      const url = normalizedEditId
        ? `${API_BASE}/api/v1/reviews/${normalizedEditId}`
        : `${API_BASE}/api/v1/reviews`;
      const method = normalizedEditId ? 'PUT' : 'POST';
      const authHeader = {
        'Content-Type': 'application/json'
      };
      const response = await fetch(url, {
        method,
        headers: authHeader,
        body: JSON.stringify(normalizedEditId ? { rating: newReview.rating, title: newReview.title, comment: newReview.comment } : newReview),
        credentials: 'include',
      });
      if (!response.ok) {
        let msg = 'Failed to submit review';
        try {
          const errJson = await response.json();
          msg = errJson?.message || msg;
        } catch {}
        setFormError(msg);
        throw new Error(msg);
      }
      const json = await response.json();
      const savedReview = json.data || json;
      if (normalizedEditId) onReviewUpdated(savedReview);
      else onReviewAdded(savedReview);

      setFormData({ rating: '5', title: '', comment: '' })
      setEditingReviewId(null)
      setShowDialog(false)
      setFormError('')
      alert(normalizedEditId ? '✓ Review updated successfully!' : '✓ Review added successfully!')
    } catch (err) {
      console.error('Error submitting review:', err)
      setFormError('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  // Calculate average rating and distribution
  const ratingStats = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    }

    const total = reviews.length
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    const average = (sum / total).toFixed(1)
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      distribution[review.rating]++
    })

    return { average, total, distribution }
  }, [reviews])

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <section className="w-full pt-12 pb-12 px-6 md:px-10 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Reviews Header with Add Review Button */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-2">
              Customer Reviews
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Real reviews from verified buyers
            </p>
          </div>
          <button
            onClick={handleOpenDialog}
            className="px-5 py-2 border border-[#4169e1]/60 bg-white text-[#4169e1] font-semibold rounded-xl hover:bg-[#4169e1]/10 transition-colors duration-200 w-full md:w-auto"
          >
            {myReview ? 'Edit Your Review' : 'Add Review'}
          </button>
        </div>

        {loading ? (
          <Loader type="card" count={3} />
        ) : !reviews || reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 text-lg">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rating Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 md:p-8 border border-blue-100 shadow-lg sticky top-24">
                <div className="text-center">
                  {/* Average Rating */}
                  <div className="mb-6">
                    <div className="text-5xl md:text-6xl font-extrabold text-[#4169e1] mb-2">
                      {ratingStats.average}
                    </div>
                    <div className="flex justify-center mb-2">
                      {renderStars(Math.round(ratingStats.average))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Based on {ratingStats.total} reviews
                    </p>
                  </div>

                  <div className="border-t border-blue-200 my-6"></div>

                  {/* Rating Distribution */}
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingStats.distribution[star]
                      const percentage = ratingStats.total > 0 
                        ? Math.round((count / ratingStats.total) * 100)
                        : 0

                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 w-8">
                            {star}★
                          </span>
                          <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-yellow-400 to-yellow-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 w-10 text-right">
                            {percentage}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Review Cards */}
            <div className="lg:col-span-2 space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl p-5 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Review Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-bold text-black mb-1">
                        {review.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-0.5">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-xs md:text-sm text-gray-500">
                          {review.rating}.0 out of 5
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Body */}
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                    {review.comment}
                  </p>

                  {/* Review Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
                    <div className="text-xs md:text-sm text-gray-600">
                      <span className="font-semibold text-black">{review.userName}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(review.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    {effectiveUser && isReviewOwner(review) ? (
                      <div className="flex items-center gap-2 text-xs md:text-sm">
                        <button
                          onClick={() => handleDeleteReview(review)}
                          className="px-3 py-1 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Dialog for Adding Review */}
      {showDialog && (
        <div className="fixed inset-0 top-20 md:top-0 bg-linear-to-br from-black/40 via-black/30 to-purple-900/30 flex items-center justify-center z-40 p-3 md:p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm md:max-w-2xl my-6 md:mt-24 p-4 md:p-6 max-h-[calc(100vh-140px)] md:max-h-[75vh] overflow-y-auto border border-white/20 bg-opacity-95">
            {/* Dialog Header */}
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-lg md:text-2xl font-extrabold text-black">{editingReviewId ? 'Edit Your Review' : 'Add Your Review'}</h3>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-500 hover:text-black text-lg md:text-xl transition-colors shrink-0 ml-2"
              >
                ✕
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 rounded-lg">
                <p className="text-red-700 text-xs md:text-sm font-semibold">❌ {formError}</p>
              </div>
            )}

            {/* Form */}
            <div className="space-y-3 md:space-y-4">
              <Form
                containerClassName="space-y-3 md:space-y-4"
                labelClassName="block text-xs md:text-sm font-semibold text-gray-700 mb-2"
                helperClassName="text-xs text-gray-500 mt-1"
                inputClassName="w-full px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                textareaClassName="w-full px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                radioGroupClassName="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3"
                radioInputClassName="w-4 h-4 cursor-pointer accent-blue-500"
                radioLabelClassName="ml-2 text-xs md:text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                fields={[
                  {
                    name: 'rating',
                    label: 'Rating',
                    type: 'radio',
                    options: [
                      { value: '5', label: '⭐⭐⭐⭐⭐ Excellent' },
                      { value: '4', label: '⭐⭐⭐⭐ Very Good' },
                      { value: '3', label: '⭐⭐⭐ Good' },
                      { value: '2', label: '⭐⭐ Fair' },
                      { value: '1', label: '⭐ Poor' }
                    ]
                  },
                  {
                    name: 'title',
                    label: 'Review Title',
                    type: 'text',
                    placeholder: 'Summarize your review (e.g., Great quality!)',
                    maxLength: 100,
                    showCount: true
                  },
                  {
                    name: 'comment',
                    label: 'Your Review',
                    type: 'textarea',
                    placeholder: 'Share your detailed experience with this product...',
                    maxLength: 1000,
                    rows: 4,
                    showCount: true
                  }
                ]}
                values={formData}
                onChange={(name, value) => setFormData({ ...formData, [name]: value })}
              />

              {/* Buttons */}
              <div className="flex gap-2 md:gap-3 pt-3 md:pt-4">
                <button
                  onClick={() => {
                    setShowDialog(false)
                    setEditingReviewId(null)
                  }}
                  disabled={submitting}
                  className="flex-1 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  className="flex-1 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : editingReviewId ? 'Update Review' : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Review