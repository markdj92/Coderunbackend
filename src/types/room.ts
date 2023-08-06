export type UserInfos = { [key: number]: UserInfo };

export interface UserInfo {
  level: number;
  nickname: string;
  owner: boolean;
  solved: boolean;
  status: boolean;
  review: boolean;
  team: string;
}

export type BadgeStatus = 'EMPTY' | 'LOCK';

export interface RoomInformation {
  title: string;
  member_count: number;
  max_members: number;
  status: 'PUBLIC' | 'PRIVATE';
  password?: string;
  level: number;
  mode: 'STUDY' | 'COOPERATIVE';
  ready: boolean;
  create_time: string;
  socket_id: string;
  master: string;
}

export interface RoomStatus {
  title: string;
  member_count: number;
  max_members: number;
  user_info: UserInfo[];
}
