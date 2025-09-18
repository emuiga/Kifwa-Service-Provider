'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from './login.module.css';
import { Loader2, Eye, EyeOff, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import KifwaLogo from "../../../public/optimized/Header navigation.png";
import PortImage from "../../../public/optimized/image 2.svg";

// Mock data for organizations
const mockOrganizations = [
  { id: '1', name: 'Kifwa Port Operations' },
  { id: '2', name: 'Mombasa Port Authority' },
  { id: '3', name: 'Kenya Ports Authority' },
  { id: '4', name: 'Port of Mombasa' },
  { id: '5', name: 'Kilindini Port' },
];

// Mock auth service
const authService = {
  getOrganizationsForLogin: async () => mockOrganizations,
  login: async (data: any) => ({
    header: { responseCode: 200 },
    body: {
      sessionId: 'mock-session-id',
      email: data.username,
      otp: '123456'
    }
  }),
  validateOTP: async (data: any) => ({
    header: { responseCode: 200 }
  }),
  getFirstAccessibleRoute: () => '/dashboard'
};

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    organization: ''
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [session, setSession] = useState<{ sessionId: string; email: string } | null>(null);
  const [organizations, setOrganizations] = useState(mockOrganizations);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredOrganizations = useMemo(() => {
    return organizations.filter(org => 
      org.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [organizations, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrganizationSelect = (orgName: string) => {
    setFormData(prev => ({ ...prev, organization: orgName }));
    setSearchTerm(orgName);
    setIsDropdownOpen(false);
  };

  const handleOrganizationSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await authService.getOrganizationsForLogin();
        setOrganizations(orgs);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!showOtpInput) {
        if (!formData.organization) {
          throw new Error('Please select an organization');
        }

        const response = await authService.login(formData);

        if (response.header.responseCode === 200) {
          const { sessionId, email } = response.body;
          const otp = (response.body as any).otp;
          setSession({ sessionId, email });
          
          // Show OTP in alert for demo purposes
          alert(`OTP Sent! Your OTP is: ${otp}`);
          
          setShowOtpInput(true);
        } else {
          throw new Error('Login failed');
        }
      } else {
        if (!session) {
          throw new Error('Session expired. Please try logging in again.');
        }

        const response = await authService.validateOTP({
          sessionId: session.sessionId,
          otp: otp,
        });

        alert('Login successful!');
        
        const firstRoute = authService.getFirstAccessibleRoute();
        router.push(firstRoute);
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.');
      
      if (showOtpInput) {
        setOtp(''); // Clear OTP on error
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.logoContainer}>
          <Image 
            src={KifwaLogo}
            alt="Kifwa Logo"
            priority
            className={styles.logo}
          />
        </div>
        
        <div className={styles.formContent}>
          <h1>Welcome Back</h1>
          <p className={styles.subtitle}>Please enter your details to sign in</p>

          {error && (
            <div className={styles.error}>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!showOtpInput ? (
              <>
                <div className={styles.inputGroup}>
                  <label htmlFor="organization">Organization</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={searchTerm}
                      onChange={handleOrganizationSearch}
                      onFocus={() => setIsDropdownOpen(true)}
                      required
                      placeholder="Search organization..."
                      className={styles.select}
                      disabled={isLoading}
                    />
                    {isDropdownOpen && filteredOrganizations.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredOrganizations.map((org) => (
                          <div
                            key={org.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleOrganizationSelect(org.name)}
                          >
                            {org.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="username">Email</label>
                  <input
                    type="email"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="password">Password</label>
                  <div className={styles.passwordInputContainer}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className={styles.passwordToggle}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.inputGroup}>
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  required
                  placeholder="Enter the 6-digit OTP"
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  disabled={isLoading}
                />
              </div>
            )}

            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>{showOtpInput ? 'Verifying...' : 'Signing in...'}</span>
                </>
              ) : (
                showOtpInput ? 'Verify OTP' : 'Sign In'
              )}
            </button>
          </form>
        </div>

        <div className={styles.partnerLogosWrapper}>
          <div className={styles.partnerLogosTitle}>Supported by</div>
          <div className={styles.partnerLogos}>
            <div key="britam" className={styles.partnerLogoItem}>
              <Image 
                src="/optimized/Britam-logo.webp"
                alt="Britam"
                width={70}
                height={28}
                className={styles.partnerLogo}
              />
            </div>
            <div key="jubilee" className={styles.partnerLogoItem}>
              <Image 
                src="/optimized/Jubilee-logo.webp"
                alt="Jubilee"
                width={70}
                height={28}
                className={styles.partnerLogo}
              />
            </div>
            <div key="kenyare" className={styles.partnerLogoItem}>
              <Image 
                src="/optimized/KenyaRE-logo.webp"
                alt="Kenya RE"
                width={70}
                height={28}
                className={styles.partnerLogo}
              />
            </div>
            <div key="oldmutual" className={styles.partnerLogoItem}>
              <Image 
                src="/optimized/OldMutual-logo.webp"
                alt="Old Mutual"
                width={70}
                height={28}
                className={styles.partnerLogo}
              />
            </div>
            <div key="cic" className={styles.partnerLogoItem}>
              <Image 
                src="/optimized/CIC-logo.webp"
                alt="CIC"
                width={70}
                height={28}
                className={styles.partnerLogo}
              />
            </div>
            <div key="dtb" className={styles.partnerLogoItem}>
              <Image 
                src="/optimized/DTB-logo.webp"
                alt="DTB"
                width={70}
                height={28}
                className={styles.partnerLogo}
              />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerContent}>
            <span>© {new Date().getFullYear()} Kifwa. All rights reserved.</span>
          </div>
        </div>
      </div>

      <div className={styles.rightSide}>
        <Image
          src={PortImage}
          alt="Port"
          className={styles.sideImage}
          priority
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}