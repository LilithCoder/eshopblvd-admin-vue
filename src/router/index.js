import Vue from 'vue'
import Router from 'vue-router'
import root from '@/views/root'
import home from '@/views/home'
import pms from '@/views/pms'
import notFound from '@/views/notFound'

Vue.use(Router)

export const routes = [
  {
    path: '',
    name: 'root',
    redirect: 'home',
    component: root,
    children: [
      {
        path: 'home',
        name: 'home',
        component: home,
        meta: {}
      },
      {
        path: 'pms',
        name: 'pms',
        redirect: 'pms/product_list',
        component: pms,
        meta: {},
        children: [{
          path: 'product_list',
          name: 'product_list',
          component: () => import('@/views/pms')
        }]
      }
    ]
  },
  {
    path: '/login',
    name: 'home',
    component: home
  },
  {
    path: '/not_found',
    name: 'not_found',
    component: notFound
  }
]

export default new Router({
  routes
})
