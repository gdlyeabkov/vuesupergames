<template>
  <div class="aside">    
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <div v-if="!notvisible">
              <router-link class="navbar-brand" :to="{ name: 'Home', query: { 'auth': 'true', 'touser': touser, 'searchText': 'none' } }">
                <img src="https://www.gstatic.com/android/market_images/web/play_prism_hlock_2x.png" width="30%" height="30%" alt="">
              </router-link>
            </div>
            <div v-else-if="notvisible">
              <img src="https://www.gstatic.com/android/market_images/web/play_prism_hlock_2x.png" width="30%" height="30%" alt="">
              <router-link style="font-size: 14px;" class="navbar-brand" :to="{ name: 'UsersLogin' }">
                Войти
              </router-link>
              <router-link style="font-size: 14px;" class="navbar-brand" :to="{ name: 'UsersRegistry' }">
                Зарегестрироваться
              </router-link>
            </div>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <input class="searchText" v-model="searchText" type="search"/>
                        &nbsp;
                        <img class="customSearch" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Search_Noun_project_15028.svg/1200px-Search_Noun_project_15028.svg.png" width="25px" height="25px"  @click="search()">
                    </li>
                </ul>
            </div>
            <div v-if="!notvisible">
              <router-link class="customProfile nav-item" :to="{ name: 'GamesList', query: { 'touser': touser } }">
                {{ touser }}
              </router-link>
              <span style="cursor: pointer; color: blue; text-decoration: underline;" @click="logout()">Выйти</span>
            </div>
            <div v-else-if="notvisible">
              Вы не авторизованы     
            </div>
        </div>
    </nav>
  </div>
</template>

<script>

import * as jwt from 'jsonwebtoken'

export default {
  name: 'Header',
  data(){
    return {
      token: '',
      searchText: '',
    }
  },
  methods: {
    logout(){
      this.token = jwt.sign({
        useremail: "asd"
        }, 'vuesupergamessecret', { expiresIn: '5m' })
      this.$router.push({ name: "UsersLogin" })
    },
    search(){
      console.log("Ищу нужные игры")
      jwt.verify(this.token, 'vuesupergamessecret', (err, decoded) => {
        if(err){
          this.$router.push({ name: "UsersLogin" })
        }
        this.$router.push({ name: "Home", query: { auth: "true", touser: decoded.useremail, "searchText": this.searchText } })
        this.$emit("refresh")
        window.location.reload()
      
      })
    }

  },
  emits: [ 'refresh' ],
  mounted(){
    this.token = window.localStorage.getItem("vuesupergamessecret")
  },
  props: { 
    touser: {
      type: String,
      default: ""
    },
    notvisible:{

    }
  }
}
</script>
<style scoped>
  .searchText{
    width: 500px;
  }
  .customSearch{
    cursor: pointer;
  }
</style>
