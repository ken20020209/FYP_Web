declare namespace Api {
  interface User {
    id: number;
    username: string;
    roles: string[];
    email: string;

    permissions?: Permission[];
  }
  interface AddUser {
    username: string;
    password: string;
    email: string;
    role: string;
  }
  interface Robot {
    id: number;
    name: string;
    type: string;
    detail: string;

    // relations
    permission?: Permission[];
    records?: Record[];
    maps?: Map[];
  }
  interface Permission {
    robot_id: number;
    user_id: number;

    // relations
    robot?: Robot;
    user?: User;
  }
  interface Record {
    id: number;
    robot_id: number;
    datetime: string;
    name: string;

    // relations
    robot?: Robot;
  }
  interface Map {
    id: number;
    robot_id: number;
    datetime: string;
    name: string;

    // relations
    robot?: Robot;
  }
}
