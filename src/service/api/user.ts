import { request } from '../request';

export function fetchUsers(params?: any) {
  return request<Api.User[]>({ url: '/api/user', method: 'GET', params });
}

export function fetchDeleteUser(id: number) {
  return request<null>({ url: `/api/user`, method: 'DELETE', data: { id } });
}

export function fetchUpdateUser(id: number, data: Api.AddUser) {
  return request<null>({ url: `/api/user`, method: 'PUT', data: { id, ...data } });
}

export function fetchAddUser(data: Api.AddUser) {
  return request<null>({ url: `/api/user`, method: 'POST', data: { ...data } });
}
