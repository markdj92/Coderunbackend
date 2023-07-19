export interface IChat {
  username: string;
  message: string;
}

export type userInfos = { [key: number]: userInfo };

export type userInfo = {
  nickname: string;
  level: string;
  imageSource: string;
  isLock: string;
  isUser: string;
  isHost: string;
};
