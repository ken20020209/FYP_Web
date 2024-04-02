import { request } from '../request';

export function fetchRobots(params?: any) {
  return request<Api.Robot[]>({ url: '/api/robot', method: 'GET', params });
}

export function fetchAddRobot(data: Api.Robot) {
  return request<Api.Robot>({ url: '/api/robot', method: 'POST', data: { ...data } });
}

export function fetchUpdateRobot(data: Api.Robot) {
  return request<Api.Robot>({ url: '/api/robot', method: 'PUT', data: { ...data } });
}

export function fetchDeleteRobot(id: number) {
  return request<Api.Robot>({ url: `/api/robot`, method: 'DELETE', data: { id } });
}
