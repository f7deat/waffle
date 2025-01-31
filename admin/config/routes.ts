export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/accounts',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/accounts/login',
        component: './accounts/login'
      }
    ],
  },
  {
    icon: 'HomeOutlined',
    name: 'dashboard',
    path: '/home',
    component: './Home',
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
        name: 'affiliateLink',
        path: '/works/affiliate-link/:id',
        component: './works/affiliate-link',
        hideInMenu: true,
      },
      {
        name: 'articleLister',
        path: '/works/article-lister/:id',
        component: './works/article-lister',
        hideInMenu: true,
      },
      {
        name: 'articlePicker',
        path: '/works/article-picker/:id',
        component: './works/article-picker',
        hideInMenu: true,
      },
      {
        name: 'articleSpotlight',
        path: '/works/article-spotlight/:id',
        component: './works/article-spotlight',
        hideInMenu: true,
      },
      {
        name: 'block',
        path: '/works/block/:id',
        component: './works/block',
        hideInMenu: true,
      },
      {
        name: 'facebookAlbum',
        path: '/works/facebook-album/:id',
        component: './works/facebook/album',
        hideInMenu: true,
      },
      {
        name: 'contactForm',
        path: '/works/contact-form/:id',
        component: './works/contact-form',
      },
      {
        name: 'row',
        path: '/works/row/:id',
        component: './works/row',
        hideInMenu: true,
      },
      {
        name: 'image',
        path: '/works/image/:id',
        component: './works/image',
        hideInMenu: true,
      },
      {
        name: 'navbar',
        path: '/works/navbar/:id',
        component: './works/navbar',
        hideInMenu: true,
      },
      {
        name: 'swiper',
        path: '/works/swiper/:id',
        component: './works/swiper',
        hideInMenu: true,
      },
      {
        name: 'blockEditor',
        path: '/works/blockeditor/:id',
        component: './works/block-editor',
        hideInMenu: true,
      },
      {
        name: 'card',
        path: '/works/card/:id',
        component: './works/card',
        hideInMenu: true,
      },
      {
        name: 'exchangeRate',
        path: '/works/exchange-rate/:id',
        component: './works/exchange-rate',
        hideInMenu: true,
      },
      {
        name: 'googleMap',
        path: '/works/googlemap/:id',
        component: './works/google-map',
        hideInMenu: true,
      },
      {
        name: 'masonry',
        path: '/works/masonry/:id',
        component: './works/masonry',
        hideInMenu: true,
      },
      {
        name: 'lookbook',
        path: '/works/lookbook/:id',
        component: './works/lookbook',
        hideInMenu: true,
      },
      {
        name: 'tag',
        path: '/works/tag/:id',
        component: './works/tag',
        hideInMenu: true,
      },
      {
        name: 'link',
        path: '/works/link/:id',
        component: './works/link',
        hideInMenu: true,
      },
      {
        name: 'productLister',
        path: '/works/product-lister/:id',
        component: './works/product-lister',
        hideInMenu: true,
      },
      {
        name: 'productPicker',
        path: '/works/product-picker/:id',
        component: './works/product-picker',
        hideInMenu: true,
      },
      {
        name: 'productSpotlight',
        path: '/works/product-spotlight/:id',
        component: './works/product-spotlight',
        hideInMenu: true,
      },
      {
        name: 'shopeeProduct',
        path: '/works/shopee-product/:id',
        component: './works/shopee-product',
        hideInMenu: true,
      },
      {
        name: 'trend',
        path: '/works/trend/:id',
        component: './works/trend',
        hideInMenu: true,
      },
      {
        name: 'videoPlayer',
        path: '/works/video-player/:id',
        component: './works/video-player',
        hideInMenu: true,
      },
      {
        name: 'videoPlaylist',
        path: '/works/video-playlist/:id',
        component: './works/video-playlist',
        hideInMenu: true,
      },
      {
        name: 'wordPressLister',
        path: '/works/wordpress-lister/:id',
        component: './works/wordpress-lister',
        hideInMenu: true,
      }
    ],
  },
  {
    name: 'catalog',
    path: '/catalog',
    icon: 'SlackOutlined',
    component: './catalog'
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
    name: 'ecommerce',
    path: '/e-commerce',
    routes: [
      {
        name: 'order',
        path: '/e-commerce/order',
        component: './order'
      },
      {
        name: 'newOrder',
        path: '/e-commerce/order/new',
        component: './order/new',
        hideInMenu: true
      },
      {
        name: 'order',
        path: '/e-commerce/order/center/:id',
        component: './order/center',
        hideInMenu: true
      }
    ],
  },
  {
    icon: 'SolutionOutlined',
    name: 'career',
    path: '/career',
    component: './career'
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
        name: 'role',
        path: '/users/roles',
        component: './users/roles'
      },
      {
        name: 'roleCenter',
        path: '/users/roles/:id',
        component: './users/roles/center',
        hideInMenu: true
      },
      {
        name: 'contact',
        path: '/users/contact',
        component: './users/contact'
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
        path: '/files/list',
        component: './files',
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
    name: 'settings',
    path: '/settings',
    routes: [
      {
        name: 'general',
        path: '/settings/general',
        component: './settings',
      },
      {
        name: 'center',
        path: '/settings/general/center/:id',
        component: './settings/center',
        hideInMenu: true
      },
      {
        name: 'component',
        path: '/settings/component',
        component: './settings/components',
      },
      {
        name: 'componentCenter',
        path: '/settings/component/center/:id',
        component: './settings/components/center',
        hideInMenu: true,
      },
      {
        name: 'style',
        path: '/settings/css',
        component: './settings/css',
      },
      {
        name: 'localization',
        path: '/settings/localization',
        component: './localization',
      },
      {
        name: 'menu',
        path: '/settings/menu',
        component: './settings/menu',
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