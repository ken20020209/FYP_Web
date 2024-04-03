import { request } from '../request';

export function fetchRecords(params?: any) {
  return request<Api.Record[]>({ url: '/api/record', method: 'GET', params });
}

export function fetchUpdateRecord(id: number, name: string) {
  return request<Api.Record>({ url: '/api/record', method: 'PUT', data: { id, name } });
}

export function fetchDeleteRecord(id: number) {
  return request<Api.Record>({ url: '/api/record', method: 'DELETE', data: { id } });
}

export function fetchCreateRecord(name: string, robot_id: number, record: FormData) {
  record.set('name', name);
  record.set('robot_id', String(robot_id));
  return request<Api.Record>({
    url: '/api/record',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'POST',
    data: record
  });
}
