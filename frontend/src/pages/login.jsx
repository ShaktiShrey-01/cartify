import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice'
import { Button, Input } from '../index.js'
import AuthLayout from '../component/AuthLayout'
import axios from 'axios';
import { API_BASE, unwrapApiResponse } from '../utils/api';

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state) => state.auth)
  const [buttonStatus, setButtonStatus] = useState(null)
  const [formAnimation, setFormAnimation] = useState('')
  const [localLoading, setLocalLoading] = useState(false)
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm()

  const onSubmit = async (data) => {
    // Auth flow:
    // - Validates against JSON Server users/admin
    // - Auth state is managed by Redux and backend cookies
    // - Emits a custom event so Header can update immediately
    setLocalLoading(true)
    dispatch(loginStart())
    setButtonStatus(null)
    setFormAnimation('')
    try {
      if (!data.email || !data.password) {
        setLocalLoading(false)
        return;
      }
      // Always post to backend for login so cookies are set for backend domain
      const response = await axios.post(`${API_BASE}/api/v1/users/login`, data, { withCredentials: true });
      // Extract accesstoken from Set-Cookie header (not accessible via JS), so get from response if backend sends it in body (optional improvement)
      // Fallback: try to read from cookies, but if not present, login will not persist
      // Solution: Ask backend to also return accesstoken in response body for SPA auth
      // For now, try to parse from cookies (will be empty in your case)
      // If you update backend to send token in response, use that here
      // Example: const { accesstoken } = response.data;
      // For now, try to get from cookies (will be undefined)
      // localStorage.setItem('accesstoken', accesstoken);

      // TEMP: If backend does not send token in body, ask user to paste it for now
      // Remove any old token
      localStorage.removeItem('accesstoken');
      // If backend sends token in response body, store it
      if (response.data && response.data.data && response.data.data.accesstoken) {
        localStorage.setItem('accesstoken', response.data.data.accesstoken);
      }
      // Otherwise, try to get from cookies (will not work in your case)
      // Optionally, prompt user to paste token for testing

      const user = unwrapApiResponse(response.data);
      dispatch(loginSuccess(user));
      setButtonStatus('success');
      setFormAnimation('success');
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      const backendMsg = error.response?.data?.message;
      console.error('Login error:', error);
      dispatch(loginFailure(backendMsg || error.message || 'Login failed. Please try again.'));
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
            <div className="text-center mb-6">
                <h1 className="text-3xl md:text-2xl font-extrabold text-black mb-1">
                  Welcome Back
                </h1>
                <p className="text-gray-600 text-sm">
                  Sign in to continue to Cartify
                </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 border-2 border-red-500 rounded-lg shadow-md">
                <p className="text-red-700 text-sm font-semibold">❌ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  }
                })}
              />



              <Button 
                type="submit" 
                variant="primary"
                isLoading={localLoading}
                status={buttonStatus}
                disabled={localLoading}
              >
                {localLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center mt-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-600">
                    Don't have an account?
                  </span>
                </div>
              </div>
              <Link 
                to="/signup" 
                className="text-[#4169e1] font-semibold hover:underline text-base"
              >
                Sign up
              </Link>
            </div>
    </AuthLayout>
  )
}

export default Login