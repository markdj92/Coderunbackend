import { lazy } from 'react';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';

import { PATH_ROUTE } from '@/constants';

import { rootLoader, authLoader } from './loaders';

const Root = lazy(() => import('@/pages/Root'));
const Lobby = lazy(() => import('@/pages/Lobby'));
const Login = lazy(() => import('@/pages/Login'));
const Error = lazy(() => import('@/pages/Error'));
const StudyResult = lazy(() => import('@/pages/StudyResult'));
const Room = lazy(() => import('@/pages/StudyRoom'));
const CoopRoom = lazy(() => import('@/pages/CoopRoom'));
const InGame = lazy(() => import('@/pages/InGame'));
const Review = lazy(() => import('@/pages/Review'));
const CoopInGame = lazy(() => import('@/pages/CoopInGame'));
const CoopResult = lazy(() => import('@/pages/CoopResult'));

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
      {
        path: PATH_ROUTE.cooproom + '/:roomName',
        element: <CoopRoom />,
        errorElement: <Error />,
      },
      {
        path: PATH_ROUTE.game,
        element: <InGame />,
        errorElement: <Error />,
      },
      {
        path: PATH_ROUTE.coopGame,
        element: <CoopInGame />,
        errorElement: <Error />,
      },
      {
        path: PATH_ROUTE.result,
        element: <StudyResult />,
        errorElement: <Error />,
      },
      {
        path: PATH_ROUTE.review,
        element: <Review />,
        errorElement: <Error />,
      },
      {
        path: PATH_ROUTE.coopresult,
        element: <CoopResult />,
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
