import { API_ROUTES } from "@/constants";
import type { User } from "@/types";
import { api, storage } from "@/utils";
import { getCookie, deleteCookie } from "cookies-next";

// 全局状态管理
class AuthService {
  private user: User | null = null;
  private loading: boolean = false;
  private error: string | null = null;
  private listeners: Set<() => void> = new Set();

  // 订阅状态变化
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // 通知所有监听器
  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // 获取当前状态
  getState() {
    return {
      user: this.user,
      loading: this.loading,
      error: this.error,
    };
  }

  // 设置用户状态
  private setUser(user: User | null) {
    this.user = user;
    this.notify();
  }

  // 设置加载状态
  private setLoading(loading: boolean) {
    this.loading = loading;
    this.notify();
  }

  // 设置错误状态
  private setError(error: string | null) {
    this.error = error;
    this.notify();
  }

  // 检查认证状态
  async checkAuthStatus(): Promise<void> {
    this.setLoading(true);
    this.setError(null);

    try {
      // 首先检查是否有token
      const token = this.getToken();
      if (!token) {
        this.setUser(null);
        this.setLoading(false);
        return;
      }

      // 验证token
      const response = await api.get<{ user: User }>(API_ROUTES.AUTH.ME);
      if (response.success && response.data?.user) {
        this.setUser(response.data.user);
      } else {
        // Token无效，清除
        this.clearToken();
        this.setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      this.clearToken();
      this.setUser(null);
      this.setError("认证检查失败");
    } finally {
      this.setLoading(false);
    }
  }

  // 登录
  async login(email: string, password: string): Promise<boolean> {
    this.setLoading(true);
    this.setError(null);

    try {
      const data = (await api.post<{ user: User; token: string }>(
        API_ROUTES.AUTH.LOGIN,
        { email, password },
      )) as any;
      console.log("Login response data:", data);
      
      // 检查管理员权限
      if (data?.user.role === "ADMIN") {
        this.setUser(data.user);
        this.setToken();
        return true;
      } else {
        this.setError("需要管理员权限");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      this.setError(`网络错误：${(error as Error).message}`);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  // 登出
  async logout(): Promise<void> {
    this.setLoading(true);

    try {
      // 调用登出API
      await api.post(API_ROUTES.AUTH.LOGOUT, {});
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // 无论API调用是否成功，都清除本地状态
      this.clearToken();
      this.setUser(null);
      this.setError(null);
      this.setLoading(false);
    }
  }

  // Token管理
  private getToken(): string | null {
    // 优先从cookie获取（支持SSR）
    const cookieToken = getCookie("auth_token") as string;
    if (cookieToken) return cookieToken;

    // 备用从localStorage获取
    return storage.get("auth_token");
  }

  private setToken(): void {
    storage.set("auth_token", document.cookie);
  }

  private clearToken(): void {
    deleteCookie("auth_token");
    storage.remove("auth_token");
  }

  // 初始化（在应用启动时调用）
  async initialize(): Promise<void> {
    await this.checkAuthStatus();
  }
}

// 导出单例实例
export const authService = new AuthService();

// 导出类型
export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};
