import Vue from 'vue'
import Router from 'vue-router'
import root from '../views/root'
import home from '../views/home'
import category from '../views/product/category'
import notFound from '../views/notFound'

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
        name: 'category',
        redirect: 'pms/category',
        component: category,
        meta: {},
        children: [{
          path: 'category',
          name: 'category',
          component: () => import('../views/product/category')
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
