import { request } from '../request';

export function fetchRobots(params?: any) {
  return request<Api.Robot[]>({ url: '/api/robot', method: 'GET', params });
}
