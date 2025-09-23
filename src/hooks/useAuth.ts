import { useState, useEffect } from 'react';
import { authService, AuthState } from '@/services/auth';

// 使用认证状态的Hook
export function useAuth() {
  const [state, setState] = useState<AuthState>(authService.getState());

  useEffect(() => {
    // 订阅状态变化
    const unsubscribe = authService.subscribe(() => {
      setState(authService.getState());
    });

    return unsubscribe;
  }, []);

  return {
    // 状态
    user: state.user,
    loading: state.loading,
    error: state.error,
    
    // 方法
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    checkAuthStatus: authService.checkAuthStatus.bind(authService)
  };
}

// 仅获取用户状态的Hook（无需完整的认证功能）
export function useUser() {
  const [user, setUser] = useState(authService.getState().user);

  useEffect(() => {
    const unsubscribe = authService.subscribe(() => {
      setUser(authService.getState().user);
    });

    return unsubscribe;
  }, []);

  return user;
}

// 仅获取加载状态的Hook
export function useAuthLoading() {
  const [loading, setLoading] = useState(authService.getState().loading);

  useEffect(() => {
    const unsubscribe = authService.subscribe(() => {
      setLoading(authService.getState().loading);
    });

    return unsubscribe;
  }, []);

  return loading;
}