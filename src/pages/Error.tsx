import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';

import { USER_TOKEN_KEY } from '@/constants';

const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>잘못된 주소입니다!</h1>
        <p>
          {error.status} {error.statusText}
        </p>
        {error.data?.message && (
          <p>
            <i>{error.data.message}</i>
          </p>
        )}
        <button
          onClick={() => {
            localStorage.removeItem(USER_TOKEN_KEY);
            navigate('/login');
          }}
        >
          메인페이지로 가기
        </button>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>예상치 못한 에러가 발생했습니다!</h1>
        <p>
          <i>{error.message}</i>
        </p>
      </div>
    );
  } else {
    return (
      <div>
        <h1>404 ERROR</h1>
        <button onClick={() => navigate('/')}>메인페이지로 가기</button>
      </div>
    );
  }
};

export default ErrorPage;
