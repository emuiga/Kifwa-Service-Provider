// User and Authentication Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  organization: Organization;
  role: UserRole;
  permissions: Permission[];
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  logo?: string;
  isActive: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
  organizationId: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  requiresOtp: boolean;
}

export interface OtpRequest {
  email: string;
  otp: string;
  token: string;
}

export interface OtpResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Dashboard Types
export interface DashboardMetrics {
  totalInsured: number;
  totalPremium: number;
  totalSumInsured: number;
  uninsuredIdf: number;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
  month?: string;
  year?: string;
}

export interface PremiumTrend {
  yearly: ChartData[];
  monthly: ChartData[];
}

// Menu Types
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  permission?: string;
  badge?: string;
}

export interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  user: User;
}

// Component Props Types
export interface TopbarProps {
  user: User;
  onMenuToggle: () => void;
  onLogout: () => void;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface ChartProps {
  data: ChartData[];
  type: 'bar' | 'line' | 'area';
  height?: number;
  color?: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  organizationId: string;
}

export interface OtpFormData {
  otp: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

// Utility Types
export interface DateRange {
  from: Date;
  to: Date;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  border: string;
  muted: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Search Types
export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
}


