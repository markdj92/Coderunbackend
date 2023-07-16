import { useNavigate } from 'react-router-dom';

export const useMovePage = (path: string[] | string) => {
  const navigate = useNavigate();

  if (typeof path === 'string') {
    return navigate(path);
  }

  return path.map((p) => () => navigate(p));
};
