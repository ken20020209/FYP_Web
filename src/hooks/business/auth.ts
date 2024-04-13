import { useAuthStore } from '@/store/modules/auth';

export function useAuth() {
  const authStore = useAuthStore();

  function hasAuth(codes: string | string[]) {
    // console.log(codes);
    // console.log(authStore.userInfo.roles);
    if (!authStore.isLogin) {
      return false;
    }

    if (typeof codes === 'string') {
      // return authStore.userInfo.buttons.includes(codes);
      return authStore.userInfo.roles.includes(codes);
    }

    // return codes.some(code => authStore.userInfo.buttons.includes(code));
    return codes.some(code => authStore.userInfo.roles.includes(code));
  }

  return {
    hasAuth
  };
}
