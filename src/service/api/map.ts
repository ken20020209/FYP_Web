import { request } from '../request';

export function fetchMaps(params?: any) {
  return request<Api.Map[]>({ url: '/api/map', method: 'GET', params });
}
