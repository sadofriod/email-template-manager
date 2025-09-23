import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getCookie } from 'cookies-next';
import { User } from '@/types';

// SSR认证检查函数
export async function checkServerSideAuth(context: GetServerSidePropsContext): Promise<{
  user: User | null;
  shouldRedirect?: boolean;
  redirectDestination?: string;
}> {
  const token = getCookie('auth_token', { req: context.req, res: context.res });

  if (!token) {
    return {
      user: null,
    };
  }

  try {
    // 在服务端验证token
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data?.user) {
        return {
          user: data.data.user,
        };
      }
    }

    // Token无效
    return {
      user: null,
      shouldRedirect: true,
      redirectDestination: '/',
    };
  } catch (error) {
    console.error('SSR auth check failed:', error);
    return {
      user: null,
    };
  }
}

// 受保护页面的HOC
export function withAuth<P extends Record<string, any>>(
  getServerSideProps?: GetServerSideProps<P>
): GetServerSideProps<P & { user: User | null }> {
  return async (context): Promise<GetServerSidePropsResult<P & { user: User | null }>> => {
    const authResult = await checkServerSideAuth(context);
    
    if (authResult.shouldRedirect && authResult.redirectDestination) {
      return {
        redirect: {
          destination: authResult.redirectDestination,
          permanent: false,
        },
      };
    }

    // 如果没有用户且访问受保护页面，重定向到登录
    if (!authResult.user && context.resolvedUrl !== '/') {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    // 执行原始的getServerSideProps
    let originalProps = {} as P;
    if (getServerSideProps) {
      const result = await getServerSideProps(context);
      if ('props' in result) {
        originalProps = await result.props;
      } else if ('redirect' in result || 'notFound' in result) {
        return result as GetServerSidePropsResult<P & { user: User | null }>;
      }
    }

    return {
      props: {
        ...originalProps,
        user: authResult.user,
      },
    };
  };
}

// 仅限管理员访问的HOC
export function withAdminAuth<P extends Record<string, any>>(
  getServerSideProps?: GetServerSideProps<P>
): GetServerSideProps<P & { user: User | null }> {
  return async (context): Promise<GetServerSidePropsResult<P & { user: User | null }>> => {
    const authResult = await checkServerSideAuth(context);
    
    if (authResult.shouldRedirect && authResult.redirectDestination) {
      return {
        redirect: {
          destination: authResult.redirectDestination,
          permanent: false,
        },
      };
    }

    // 检查管理员权限
    if (!authResult.user || authResult.user.role !== 'ADMIN') {
      return {
        redirect: {
          destination: '/unauthorized',
          permanent: false,
        },
      };
    }

    // 执行原始的getServerSideProps
    let originalProps = {} as P;
    if (getServerSideProps) {
      const result = await getServerSideProps(context);
      if ('props' in result) {
        originalProps = await result.props;
      } else if ('redirect' in result || 'notFound' in result) {
        return result as GetServerSidePropsResult<P & { user: User | null }>;
      }
    }

    return {
      props: {
        ...originalProps,
        user: authResult.user,
      },
    };
  };
}