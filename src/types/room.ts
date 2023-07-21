export interface IChat {
  username: string;
  message: string;
}

export type userInfos = { [key: number]: userInfo };

export type userInfo = {
  nickname: string;
  level: string;
  imageSource: string;
  isLock: boolean;
  isUser: boolean;
  isHost: boolean;
};

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
