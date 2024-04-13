import { request } from '../request';

/**
 * @param params:{robot_id:number,user_id:number}
 * @returns
 */
export function fetchPermissions(params?: any) {
  return request<Api.Permission[]>({ url: '/api/permission', method: 'GET', params });
}

export function editPermission(user_name: string, robot_ids: number[]) {
  return request<Api.Permission>({ url: '/api/permission', method: 'PUT', data: { user_name, robot_ids } });
}
