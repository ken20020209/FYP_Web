import { request } from '../request';

export function fetchRecords(params?: any) {
  return request<Api.Record[]>({ url: '/api/record', method: 'GET', params });
}
