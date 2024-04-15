import { request } from '../request';

export function fetchRosips() {
  return request<{ ips: string[] }>({ url: '/api/ros/ip', method: 'GET' });
}
