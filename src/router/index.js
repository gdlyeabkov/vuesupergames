import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import GamesList from '../views/GamesList.vue'
import GamesPublish from '../views/GamesPublish.vue'
import GamesRegistry from '../views/GamesRegistry.vue'
import UsersLogin from '../views/UsersLogin.vue'
import UsersRegistry from '../views/UsersRegistry.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/game',
    name: 'Game',
    component: Game
  },
  {
    path: '/games/list',
    name: 'GamesList',
    component: GamesList
  },
  {
    path: '/games/publish',
    name: 'GamesPublish',
    component: GamesPublish
  },
  {
    path: '/games/register',
    name: 'GamesRegistry',
    component: GamesRegistry
  },
  {
    path: '/users/login',
    name: 'UsersLogin',
    component: UsersLogin
  },
  {
    path: '/users/register',
    name: 'UsersRegistry',
    component: UsersRegistry
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
