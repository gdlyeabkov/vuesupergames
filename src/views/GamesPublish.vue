<template>
  <div>
    <Header :touser="touser"/>
    <Aside :touser="touser"/>
    <div class="main">
      <h1 style="text-align: center;">Мои опубликованные приложения: </h1>
          <div v-if="games !== undefined && games !== [] && games.length">
            <div v-for="game, gameIndex in games">
                <div class="card flexCard">
                  <h5 class="card-header">
                          <div v-if="game.imageurl.includes('empty')">
                            <img width="85px" height="85px" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
                          </div>
                          <div v-if="!(game.imageurl.includes('empty'))">
                            
                            <!-- <img width="85px" height="85px" :src="game.imageurl" /> -->
                            <!-- <img width="85px" height="85px" :src="`https://vuesupergames.herokuapp.com/games/getimage?gamename=${game.name}`" /> -->
                            <img width="85px" height="85px" :src="`https://brief-malleable-microraptor.glitch.me/games/getimage?gamename=${game.name}`" />

                          </div>
                      </h5>
                      <div class="card-body">
                          <router-link tag="h6" style="cursor: pointer; color: blue; text-decoration: underline;" :to="{ name: 'Game', query: { 'gameid': game.id, 'touser': touser } }">
                            {{ game.name.substring(0, 50) }}
                          </router-link>
                          <p><a href="/">{{ game.sender }}</a></p>
                          <div v-if="game.free.includes('false')">
                              <p class="card-title">{{ game.cost }}$</p>
                          </div>

                          <div v-for="(star, starIndex) in 5">
                            <span @mouseover="fillStar(starIndex, gameIndex)" @mouseout="resetStar(starIndex)" @click="evaluate(game.id, star, game.name)" style="color:grey; float:left; cursor: pointer;" class="material-icons customstar">
                              star_rate
                            </span>  
                          </div>
                          <br style="clear: both" />
                          <p>{{ game.description.substring(0, 50) }}</p>
                      </div> 
                  </div>
              </div>
          </div>
          <div v-else>
              <p style="text-align: center;">Нет опубликованных игр</p>    
          </div>
          <br style="clear: both" />
          <!-- <button class="btn btn-lg btn-primary btn-block">
            <router-link tag="p" :to="{ name: 'GamesRegistry', query: { touser: $route.query.touser } }">Опубликовать игру</router-link>
          </button> -->
          <button style="display:block; margin: auto; text-align: center;" @click="$router.push({ name: 'GamesRegistry', query: { touser: $route.query.touser } })" class="btn btn-lg btn-primary btn-block">Опубликовать игру</button>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Aside from '@/components/Aside.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

import * as jwt from 'jsonwebtoken'

export default {
  name: 'GamesPublish',
  data(){
    return {
      token: '',
      games: [],
      touser: ''
    }
  },
  methods:{
    fillStar(starIndex, multiplier){
      console.log("starIndex: ", starIndex)
      console.log("multiplier: ", multiplier)
      if(multiplier <= 0){
        multiplier = 0
      }
      // else if(multiplier >= 1){
      //   multiplier + 1 * 5
      // }
      for(let i = 0 + 5 * multiplier; i <= starIndex + 5 * multiplier; i++){
        document.querySelectorAll(".customstar")[i].style.cssText += "color: black;"
      }
    },
    resetStar(starIndex){
      console.log("starIndex: ", starIndex)
      for(let i = 0; i <= document.querySelectorAll(".customstar").length - 1; i++){
        document.querySelectorAll(".customstar")[i].style.cssText += "color: grey; display: inline;"
      }
    },
    evaluate(id, likes, name) {
      console.log("оценить")
      console.log("id: ", id)
      console.log("likes: ", likes)
      console.log("name: ", name)
      console.log("touser: ", this.touser)
      jwt.verify(this.token, 'vuesupergamessecret', (err, decoded) => {
        if(err){
          this.$router.push({ name: "UsersLogin" })
        }
        fetch(`https://vuesupergames.herokuapp.com/games/likes?gameid=${id}&gamename=${name}&likes=${likes}&touser=${this.touser}`, {
        mode: 'cors',
        method: 'GET'
      }).then(response => response.body).then(rb  => {
          const reader = rb.getReader()
          return new ReadableStream({
            start(controller) {
              function push() {
                reader.read().then( ({done, value}) => {
                  if (done) {
                    console.log('done', done);
                    controller.close();
                    return;
                  }
                  controller.enqueue(value);
                  console.log(done, value);
                  push();
                })
              }
              push();
            }
          });
      }).then(stream => {
          return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
        })
        .then(result => {
          console.log(JSON.parse(result))
          // this.$router.push({ name: "GamesList", query: { touser: this.touser } })
          // window.location.reload()
        });
      })
    },
    publish(){
      jwt.verify(this.token, 'vuesupergamessecret', (err, decoded) => {
      if(err){
        this.$router.push({ name: "UsersLogin" })
      }
      fetch(`https://vuesupergames.herokuapp.com/games/register?touser=${this.touser}`, {
        mode: 'cors',
        method: 'GET'
      }).then(response => response.body).then(rb  => {
          const reader = rb.getReader()
          return new ReadableStream({
            start(controller) {
              function push() {
                reader.read().then( ({done, value}) => {
                  if (done) {
                    console.log('done', done);
                    controller.close();
                    return;
                  }
                  controller.enqueue(value);
                  console.log(done, value);
                  push();
                })
              }
              push();
            }
          });
      }).then(stream => {
          return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
        })
        .then(result => {
          
        });
      })
    }
  },
  mounted(){
    this.token = window.localStorage.getItem("vuesupergamessecret")
    jwt.verify(this.token, 'vuesupergamessecret', (err, decoded) => {
      if(err){
        this.$router.push({ name: "UsersLogin" })
      }
      fetch(`https://vuesupergames.herokuapp.com/games/publishlist?touser=${this.$route.query.touser}`, {
        mode: 'cors',
        method: 'GET'
      }).then(response => response.body).then(rb  => {
          const reader = rb.getReader()
          return new ReadableStream({
            start(controller) {
              function push() {
                reader.read().then( ({done, value}) => {
                  if (done) {
                    console.log('done', done);
                    controller.close();
                    return;
                  }
                  controller.enqueue(value);
                  console.log(done, value);
                  push();
                })
              }
              push();
            }
          });
      }).then(stream => {
          return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
        })
        .then(result => {
          this.games = JSON.parse(result).games
          this.touser = JSON.parse(result).touser
          console.log(this.games)
        });
    })
  },
  components:{
    Aside,
    Header,
    Footer
  }
}
</script>
<style scoped>
  .publish > button {
    display: block;
    margin: auto;
  }
  .flexCard {
    display: flex;
    flex-direction: row;
    float:left;
    width:calc(100% / 3);
    height: 250px;
  }

  .customcard {
    width:calc(100% / 6);
    display: block;
    float:left;
  }

  .main {
    background-color: rgb(205, 209, 206);
    width: 80%;
    min-height: 750px;
    float: left;
  }

  .card-body{
    overflow: hidden;            
    max-width:300px;
  }
</style>