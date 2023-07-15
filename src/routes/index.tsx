import { lazy } from 'react';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';

import { PATH_ROUTE } from '@/constants';

const Root = lazy(() => import('@/pages/Root'));
const Lobby = lazy(() => import('@/pages/Lobby'));
const Login = lazy(() => import('@/pages/Login'));

const routes: RouteObject[] = [
  {
    path: PATH_ROUTE.root,
    element: <Root />,
    children: [
      {
        index: true,
        path: PATH_ROUTE.root,
        element: <Lobby />,
      },
      {
        path: PATH_ROUTE.lobby,
        element: <Lobby />,
      },
    ],
  },
  {
    path: PATH_ROUTE.login,
    element: <Login />,
  },
];

const router = createBrowserRouter(routes);

export default function PageRouter() {
  return <RouterProvider router={router} />;
}
