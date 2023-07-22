import { lazy } from 'react';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';

import { PATH_ROUTE } from '@/constants';

import { rootLoader, authLoader } from './loaders';

const Root = lazy(() => import('@/pages/Root'));
const Lobby = lazy(() => import('@/pages/Lobby'));
const Login = lazy(() => import('@/pages/Login'));
const Error = lazy(() => import('@/pages/Error'));

const Room = lazy(() => import('@/pages/Room'));

const routes: RouteObject[] = [
  {
    path: PATH_ROUTE.root,
    element: <Root />,
    errorElement: <Error />,
    loader: rootLoader,
    children: [
      {
        index: true,
        path: PATH_ROUTE.root,
        element: <Lobby />,
        errorElement: <Error />,
      },
      {
        index: true,
        path: PATH_ROUTE.lobby,
        element: <Lobby />,
        errorElement: <Error />,
      },
      {
        path: PATH_ROUTE.room + '/:roomName',
        element: <Room />,
        errorElement: <Error />,
      },
    ],
  },
  {
    path: PATH_ROUTE.login,
    element: <Login />,
    errorElement: <Error />,
    loader: authLoader,
  },
  {
    path: PATH_ROUTE.error,
    element: <Error />,
    errorElement: <Error />,
  },
];

const router = createBrowserRouter(routes);

export default function PageRouter() {
  return <RouterProvider router={router} />;
}