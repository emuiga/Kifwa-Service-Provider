'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
// import { OtpFormData } from '@/types';

const OtpPage: React.FC = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear error when user starts typing
    if (error) setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const pastedOtp = text.replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        pastedOtp.split('').forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        
        // Focus last filled input or first empty
        const lastFilledIndex = newOtp.findIndex((digit, i) => !digit && i > 0);
        const focusIndex = lastFilledIndex === -1 ? 5 : lastFilledIndex - 1;
        inputRefs.current[focusIndex]?.focus();
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success/failure
      if (otpString === '123456') {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setError('Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Login */}
        <div className="flex justify-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>
        </div>

        {/* OTP Card */}
        <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-extrabold gradient-text mb-2">
              Verify OTP
            </h1>
            <p className="text-gray-600">
              We've sent a 6-digit code to your email. Please enter it below.
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* OTP Input Fields */}
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`
                    w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg
                    bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400
                    ${error ? 'border-red-500' : 'hover:border-blue-400'}
                    ${digit ? 'border-blue-400' : ''}
                  `}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center justify-center text-red-600 text-sm">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center justify-center text-green-600 text-sm">
                <CheckCircle size={16} className="mr-2" />
                OTP verified successfully!
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={!isOtpComplete || isLoading}
              className="w-full gradient-button text-white font-medium py-3 px-4 rounded-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Verifying...
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Tip:</strong> You can paste the entire OTP code using Ctrl+V (or Cmd+V on Mac)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-600">
            © 2024 Kifwa. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
