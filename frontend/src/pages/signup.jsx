import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice'
import { Button, Input } from '../index.js'
import AuthLayout from '../component/AuthLayout'
import axios from 'axios';
import { API_BASE, unwrapApiResponse } from '../utils/api';
const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state) => state.auth)
  const [buttonStatus, setButtonStatus] = useState(null)
  const [formAnimation, setFormAnimation] = useState('')
  const [localLoading, setLocalLoading] = useState(false)
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    // Signup flow:
    // - Checks duplicates in JSON Server
    // - Creates a new user in `/users`
    // - Auth state is managed by Redux and backend cookies
    setLocalLoading(true)
    dispatch(loginStart())
    setButtonStatus(null)
    setFormAnimation('')
    try {
      const response = await axios.post(`${API_BASE}/api/v1/users/signup`, data, { withCredentials: true });
      const user = unwrapApiResponse(response.data);
      dispatch(loginSuccess(user));
      setButtonStatus('success');
      setFormAnimation('success');
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      console.error('Signup error:', error);
      dispatch(loginFailure(error.response?.data?.message || error.message || 'Signup failed. Please try again.'));
      setButtonStatus('error');
      setFormAnimation('error');
      setTimeout(() => {
        setButtonStatus(null);
        setFormAnimation('');
      }, 3000);
    } finally {
      setLocalLoading(false)
    }
  }

  return (
    <AuthLayout formAnimation={formAnimation}>
            {/* Header */}
            <div className="text-center mb-3 md:mb-2">
              <h1 className="text-3xl md:text-2xl font-extrabold text-black mb-1">
                Create Account
              </h1>
              <p className="text-gray-600 text-sm">
                Sign up to start shopping with Cartify
              </p>
            </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 md:mb-3 p-4 bg-red-100 border-2 border-red-500 rounded-lg shadow-md">
              <p className="text-red-700 text-sm font-semibold">❌ {error}</p>
              <p className="text-red-600 text-xs mt-1">Please check your information and try again.</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 md:space-y-2">
            {/* Username Input */}
            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              error={errors.username?.message}
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters'
                },
                maxLength: {
                  value: 20,
                  message: 'Username must not exceed 20 characters'
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers, and underscores'
                }
              })}
            />

            {/* Email Input */}
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain uppercase, lowercase, and number'
                }
              })}
            />

            {/* Confirm Password Input */}
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => 
                  value === password || 'Passwords do not match'
              })}
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="primary"
              isLoading={localLoading}
              status={buttonStatus}
              disabled={localLoading}
            >
              {localLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-4 md:mt-3">
            <div className="relative mb-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-600">
                  Already have an account?
                </span>
              </div>
            </div>
            <Link 
              to="/login" 
              className="text-[#4169e1] font-semibold hover:underline text-base"
            >
              Sign in
            </Link>
          </div>
    </AuthLayout>
  )
}

export default Signup
