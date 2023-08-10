import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { PATH_ROUTE, USER_NICKNAME_KEY, USER_TOKEN_KEY } from '@/constants';
import { getUserToken } from '@/utils';

import { getNicknameByToken, postLogout } from '@/apis/authApi';
import { attempt, socket, webRtcSocketIo } from '@/apis/socketApi';

const useSocketConnect = () => {
  const navigate = useNavigate();

  const fetchUserNickName = useCallback(async () => {
    try {
      const response = await getNicknameByToken();
      if (response.data.nickname) {
        navigate(PATH_ROUTE.lobby, { state: { nickname: response.data.nickname } });
      } else {
        postLogout();
        localStorage.removeItem(USER_TOKEN_KEY);
        localStorage.removeItem(USER_NICKNAME_KEY);
        navigate(PATH_ROUTE.login);
      }
    } catch (error) {
      navigate(PATH_ROUTE.login);
    }
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      const userToken = getUserToken();
      if (!!userToken) {
        socket.io.opts.extraHeaders = {
          Authorization: userToken,
        };

        fetchUserNickName();
        socket.connect();
      }
    }
  }, []);

  useEffect(() => {
    const getNickname = async () => {
      try {
        const response = await getNicknameByToken();

        const nickname = localStorage.getItem('nickname');

        if (nickname !== response.data.nickname) {
          localStorage.setItem(USER_NICKNAME_KEY, response.data.nickname);
          navigate(PATH_ROUTE.lobby, { state: { nickname: response.data.nickname } });
        }
      } catch (error) {
        navigate(PATH_ROUTE.login);
      }
    };

    getNickname();
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      attempt.tryCount = 0;
      socket.off('connect_error');
    });
    socket.on('disconnect', () => {
      socket.on('connect_error', () => {
        attempt.tryCount += 1;
        if (attempt.tryCount > attempt.maxCount - 1) {
          localStorage.removeItem(USER_TOKEN_KEY);
          localStorage.removeItem(USER_NICKNAME_KEY);
          navigate(PATH_ROUTE.login);
        }
      });
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, [navigate]);

  useEffect(() => {
    webRtcSocketIo.on('connect', () => {
      attempt.tryCount = 0;
      webRtcSocketIo.off('connect_error');
    });
    webRtcSocketIo.on('disconnect', () => {
      webRtcSocketIo.on('connect_error', () => {
        attempt.tryCount += 1;
        if (attempt.tryCount > attempt.maxCount - 1) {
          localStorage.removeItem(USER_TOKEN_KEY);
          localStorage.removeItem(USER_NICKNAME_KEY);
          navigate(PATH_ROUTE.login);
        }
      });
    });
    return () => {
      webRtcSocketIo.off('connect');
      webRtcSocketIo.off('disconnect');
      webRtcSocketIo.off('connect_error');
    };
  }, [navigate]);
};

export default useSocketConnect;
