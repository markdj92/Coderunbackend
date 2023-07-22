export type userInfos = { [key: number]: userInfo };

export type userInfo =
  | {
      nickname: string;
      ready_status: string;
      level: string;
    }
  | 'EMPTY'
  | 'LOCK';

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
  user_info: userInfo[];
}
