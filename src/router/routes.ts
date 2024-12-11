import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/ConsoleLayout.vue'), // 布局组件
    children: [
      {
        path: '', // 根路径
        redirect: '/home', // 重定向到 /home
      },
      {
        path: 'home/:pathMatch(.*)*', // 匹配 /home 及其任意子路径
        component: () => import('pages/HomePage.vue'),
        props: (route) => {
          const pathMatch = route.params.pathMatch;
          return {
            pathParams: Array.isArray(pathMatch) ? pathMatch : pathMatch ? pathMatch.split('/') : [],
          };
        },
      },
      {
        path: 'settings',
        component: () => import('pages/SettingsPage.vue'),
      },
    ],
  },
  {
    path: '/play/:hash?/:path?',
    component: () => import('pages/PlayPage.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: {
      title: '404未找到',
    },
    name: 'ErrorNotFound',
  },
];

export default routes;
