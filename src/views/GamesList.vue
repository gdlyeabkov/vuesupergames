<template>
  <div>
    <Header :touser="$route.query.touser" />
    <Aside :touser="$route.query.touser" />
    <div class="main">
      <h1 style="text-align: center;">Мои установленные приложения: </h1>
          <div v-if="myGames.length >= 1">
              <div v-for="game in myGames">
                  <div class="card flexCard">
                      
                      <h5 class="card-header">
                          <div v-if="game.imageurl.includes('empty')">
                            <img width="85px" height="85px" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
                          </div>
                          <div v-if="!(game.imageurl.includes('empty'))">

                              <!-- <img width="85px" height="85px" :src="game.imageurl" /> -->
                              <img width="85px" height="85px" :src="`https://vuesupergames.herokuapp.com/games/getimage?gamename=${game.name}`" />
                          </div>
                      </h5>
                      <div class="card-body">
                          <router-link tag="h6"  style="cursor: pointer; color: blue; text-decoration: underline;" :to="{ name: 'Game', query: { gameid: game._id, touser: game.sender } }">{{ game.name.substring(0, 50) }}</router-link>
                          <p>{{ game.description.substring(0, 50) }}</p>
                          <div v-for="(star, starIndex) in 5">
                            <span @mouseover="fillStar(starIndex)" @mouseout="resetStar(starIndex)" @click="evaluate(game._id, star, game.name)" style="color:grey; float:left; cursor: pointer;" class="material-icons customstar">
                              star_rate
                            </span>  
                          </div>
                          <div v-if="game.free.includes('false')">
                              <p class="card-title">{{ game.cost }}$</p>
                          </div>
                          
                          <br style="clear:both;"/>

                          <router-link tag="p" :to="{ name: 'Home', query: { auth: 'true', touser: game.sender, searchText: 'none' } }">{{ game.sender }}</router-link>
                      </div> 
                  </div>
              </div>
          </div>
          <div v-else>
              <p style="text-align: center;">Нет установленных игр</p>    
          </div>
    </div>
  </div>
</template>

<script>
import Aside from '@/components/Aside.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

import * as jwt from 'jsonwebtoken'

export default {
  name: 'GamesList',
  data(){
    return {
      token: '',
      myGames: []
    }
  },
  mounted(){
    this.token = window.localStorage.getItem("vuesupergamessecret")
    jwt.verify(this.token, 'vuesupergamessecret', (err, decoded) => {
      if(err){
        this.$router.push({ name: "UsersLogin" })
      }
      fetch(`https://vuesupergames.herokuapp.com/games/list?auth=true&touser=${this.$route.query.touser}`, {
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
        this.myGames = JSON.parse(result).myGames
        this.touser = JSON.parse(result).touser
        console.log(JSON.parse(result))
      });
    })
  },
  methods: {
        fillStar(starIndex){
      console.log("starIndex: ", starIndex)
      for(let i = 0; i <= starIndex; i++){
        document.querySelectorAll(".customstar")[i].style.cssText += "color: black;"
      }
    },
    resetStar(starIndex){
      console.log("starIndex: ", starIndex)
      for(let i = 0; i <= starIndex; i++){
        document.querySelectorAll(".customstar")[i].style.cssText += "color: grey; display: inline;"
      }
    },
    evaluate(id, likes, name) {
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
    }
  },
  components:{
      Aside,
      Header,
      Footer
  }
}
</script>
<style scoped>
.flexCard {
  display: flex;
  flex-direction: row;
  float:left;
  width:calc(100% / 3);
  height: 250px;
  /* overflow: hidden; */
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
</style>
