import { request } from '../request';

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
export function fetchLogin(username: string, password: string) {
  return request<Api.Auth.LoginToken>({
    url: '/api/auth/login',
    method: 'post',
    data: {
      username,
      password
    }
  });
}
export function fetchRegister(username: string, password: string, email: string) {
  return request<null>({
    url: '/api/auth/register',
    method: 'post',
    data: {
      username,
      password,
      email
    }
  });
}

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/api/auth/user' });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/refreshToken',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/auth/error', params: { code, msg } });
}
