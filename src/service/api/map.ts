import { request } from '../request';

export function fetchMaps(params?: any) {
  return request<Api.Map[]>({ url: '/api/map', method: 'GET', params });
}

export function fetchUpdateMap(id: number, name: string) {
  return request<Api.Map>({ url: '/api/map', method: 'PUT', data: { id, name } });
}

export function fetchDeleteMap(id: number) {
  return request<Api.Map>({ url: '/api/map', method: 'DELETE', data: { id } });
}
