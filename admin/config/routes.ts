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
      }
    ]
  },
  {
    name: 'component',
    path: '/works',
    hideInMenu: true,
    routes: [
      {
        name: 'block',
        path: '/works/:id',
        component: './works',
        hideInMenu: true,
      },
      {
        name: 'block',
        path: '/works/block/:id',
        component: './works/block',
        hideInMenu: true,
      },
      {
        name: 'blockEditor',
        path: '/works/blockeditor/:id',
        component: './works/block-editor',
        hideInMenu: true,
      }
    ],
  },
  {
    name: 'catalog',
    path: '/catalog',
    icon: 'SlackOutlined',
    routes: [
      {
        path: '/catalog',
        redirect: '/catalog/overview',
      },
      {
        path: '/catalog/overview',
        name: 'overview',
        component: './catalog',
        hideInMenu: true,
      },
      {
        path: '/catalog/place/:id',
        name: 'placeCenter',
        component: './catalog/place',
        hideInMenu: true,
      }
    ]
  },
  {
    name: 'catalogCenter',
    path: '/catalog/center/:id',
    component: './catalog/center',
    hideInMenu: true
  },
  {
    name: 'catalogList',
    path: '/catalog/list/:id',
    component: './catalog/list',
    hideInMenu: true
  },
  {
    path: '/catalog/:id',
    component: './catalog',
    hideInMenu: true
  },
  {
    name: 'tagCenter',
    path: '/catalog/tag/:id',
    component: './tag/center',
    hideInMenu: true,
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
    icon: 'SolutionOutlined',
    name: 'career',
    path: '/career',
    routes: [
      {
        name: 'application',
        path: '/career/application',
        component: './career'
      }
    ]
  },
  {
    icon: 'TeamOutlined',
    name: 'users',
    path: '/users',
    routes: [
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
    path: '/account',
    name: 'account',
    icon: 'UserOutlined',
    routes: [
      {
        path: '/account',
        redirect: '/account/profile',
      },
      {
        name: 'profile',
        path: '/account/profile',
        component: './account/profile',
        hideInMenu: true
      }
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
        name: 'center',
        path: '/setting/general/center/:id',
        component: './settings/center',
        hideInMenu: true
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