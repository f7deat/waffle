export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    layout: false,
    component: './account/login'
  },
  {
    icon: 'HomeOutlined',
    name: 'dashboard',
    path: '/home',
    component: './home',
  },
  {
    icon: 'FormOutlined',
    name: 'article',
    path: '/article',
    routes: [
      {
        path: '/article',
        redirect: '/article/list',
      },
      {
        name: 'list',
        path: '/article/list',
        component: './article',
        hideInMenu: true
      },
      {
        name: 'center',
        path: '/article/:id',
        component: './article/center',
        hideInMenu: true
      }
    ]
  },
  {
    icon: 'ShoppingCartOutlined',
    name: 'shop',
    path: '/shop',
    routes: [
      {
        name: 'product',
        path: '/shop/product',
        component: './shop/product'
      },
      {
        name: 'order',
        path: '/shop/order',
        component: './order'
      },
      {
        name: 'newOrder',
        path: '/shop/order/new',
        component: './order/new',
        hideInMenu: true
      },
      {
        name: 'order',
        path: '/shop/order/center/:id',
        component: './order/center',
        hideInMenu: true
      },
      {
        name: 'productCenter',
        path: '/shop/product/center/:id',
        component: './shop/product/center',
        hideInMenu: true
      }
    ],
  },
  {
    name: 'place',
    icon: 'EnvironmentOutlined',
    path: '/place',
    routes: [
      {
        name: 'overview',
        path: '/place/overview',
        component: './place'
      },
      {
        name: 'center',
        path: '/place/center/:id',
        component: './place/detail',
        hideInMenu: true
      }
    ]
  },
  {
    icon: 'SolutionOutlined',
    name: 'career',
    path: '/career',
    routes: [
      {
        path: '/career',
        redirect: '/career/job',
      },
      {
        name: 'job',
        path: '/career/job',
        component: './career/job'
      },
      {
        name: 'application',
        path: '/career/application',
        component: './career'
      },
      {
        name: 'jobCenter',
        path: '/career/job/center/:id',
        component: './career/job/center',
        hideInMenu: true
      }
    ]
  },
  {
    icon: 'TeamOutlined',
    name: 'users',
    path: '/users',
    routes: [
      {
        name: 'notification',
        path: '/users/notification',
        component: './users/notification/index',
        hideInMenu: true,
      },
      {
        name: 'member',
        path: '/users/member',
        component: './users/list',
      },
      {
        name: 'profile',
        path: '/users/profile/:id',
        component: './users/profile',
        hideInMenu: true,
      },
      {
        name: 'userCenter',
        path: '/users/center/:id',
        component: './users/center',
        hideInMenu: true,
      },
      {
        name: 'contact',
        path: '/users/contact',
        component: './users/contact'
      },
      {
        name: 'role',
        path: '/users/roles',
        component: './users/roles'
      },
      {
        name: 'roleCenter',
        path: '/users/roles/:id',
        component: './users/roles/center',
        hideInMenu: true
      }
    ],
  },
  {
    icon: 'CommentOutlined',
    name: 'comments',
    path: '/comments',
    component: './comments'
  },
  {
    icon: 'FolderOutlined',
    name: 'fileManager',
    path: '/files',
    routes: [
      {
        path: '/files',
        redirect: '/files/list',
      },
      {
        name: 'Files',
        path: '/files/list',
        component: './files',
      },
      {
        name: 'album',
        path: '/files/album',
        component: './files/album',
      },
      {
        name: 'fileCenter',
        path: '/files/center/:id',
        component: './files/center',
        hideInMenu: true,
      },
    ],
  },
  {
    icon: 'SettingOutlined',
    name: 'setting',
    path: '/setting',
    routes: [
      {
        name: 'general',
        path: '/setting/general',
        component: './settings',
      },
      {
        name: 'account',
        path: '/setting/account',
        component: './settings/account'
      },
      {
        name: 'component',
        path: '/setting/component',
        component: './settings/components',
      },
      {
        name: 'componentCenter',
        path: '/setting/component/center/:id',
        component: './settings/components/center',
        hideInMenu: true,
      },
      {
        name: 'style',
        path: '/setting/css',
        component: './settings/css',
      },
      {
        name: 'localization',
        path: '/setting/localization',
        component: './localization',
      },
      {
        name: 'menu',
        path: '/setting/menu',
        component: './settings/menu',
      },
      {
        name: 'country',
        path: '/setting/country',
        component: './settings/country'
      },
      {
        name: 'category',
        path: '/setting/category',
        component: './settings/category'
      },
      {
        name: 'province',
        path: '/setting/country/:id',
        component: './settings/country/province',
        hideInMenu: true
      },
      {
        name: 'district',
        path: '/setting/country/province/:id',
        component: './settings/country/province/district',
        hideInMenu: true
      },
      {
        name: 'street',
        path: '/setting/country/province/district/:id',
        component: './settings/country/province/district/street',
        hideInMenu: true
      },
      {
        name: 'tag',
        path: '/setting/tag',
        component: './tag',
      }
    ],
  },
  {
    name: 'tool',
    path: '/tool',
    icon: 'ToolOutlined',
    routes: [
      {
        name: 'shortLink',
        path: '/tool/short-link',
        component: './tool/short-link',
      }
    ]
  },
  {
    icon: 'InfoCircleOutlined',
    name: 'help',
    path: '/help',
    routes: [
      {
        name: 'upgrade',
        path: 'upgrade',
        component: './settings/upgrade',
      },
      {
        name: 'backup',
        path: 'backup',
        component: './backup',
      },
      {
        name: 'logs',
        path: 'logs',
        component: './logs',
      },
    ],
  },
  {
    path: '*',
    layout: false,
    component: './404',
  }
]