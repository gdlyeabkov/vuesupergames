<template>
    <div>
      <Header :touser="touser" />
      <Aside :touser="touser" />
      <div class="main">
        <h1 style="text-align: center;">Самые популярные игры: </h1>
        <div @refresh="mounted()" v-if="allGames.length >= 1 && allGames.some((el) => {
            if(el.genre !== undefined && el.genre.includes('popular')){
                return true
            }
            return false
        })">
            <div v-for="game in allGames">
                <div v-if="game.genre.includes('popular')">
                    <div class="card customcard">
                        <h5 class="card-header">
                            <div v-if="game.imageurl.includes('empty')">
                              <img width="85px" height="85px" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
                            </div>
                            <div v-else-if="!game.imageurl.includes('empty')">
                                <!-- <img width="85px" height="85px" :src="game.imageurl" /> -->
                                <img width="85px" height="85px" :src="`https://vuesupergames.herokuapp.com/games/getimage?gamename=${game.name}`" />
                            </div>
                        </h5>
                        <div class="card-body">
                            <router-link :to="{ name: 'Game', query: { gameid: game._id, touser: touser } }">{{ game.name.substring(0, 25) }}</router-link>
                            <p>{{ game.description.substring(0, 25) }}</p>
                            <div v-for="(star, starIndex) in 5">
                                <span @mouseover="fillStar(starIndex)" @mouseout="resetStar(starIndex)" @click="evaluate(game.id, star, game.name)" style="color:grey; float:left; cursor: pointer;" class="material-icons customstar">
                                    star_rate
                                </span>  
                            </div>
                            <div v-if="game.free.includes('false')">
                                <p class="card-title">{{ game.cost }}$</p>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p style="text-align: center;">Нет опубликованных игр</p>    
        </div>
        <br style="clear:both;"/>

        <h1 style="text-align: center;">Аркады: </h1>
        <div v-if="allGames.length >= 1 && allGames.some((el) => {
            if(el.genre !== undefined && el.genre.includes('arcade')){
                return true
            }
            return false
        })">
            <div v-for="game in allGames">
                 <div v-if="game.genre.includes('arcade')">
                    <div class="card customcard">
                        <h5 class="card-header">
                            <div v-if="game.imageurl.includes('empty')">
                                <img width="85px" height="85px" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
                            </div>
                            <div v-else-if="!game.imageurl.includes('empty')">
                            
                                <!-- <img width="85px" height="85px" :src="game.imageurl" /> -->
                                <img width="85px" height="85px" :src="`https://vuesupergames.herokuapp.com/games/getimage?gamename=${game.name}`" />

                            </div>
                        </h5>
                        <div class="card-body">
                            <router-link :to="{ name: 'Game', query: { 'gameid': game._id, 'touser': touser } }">{{ game.name.substring(0, 25) }}</router-link>
                            <p>{{ game.description.substring(0, 25) }}</p>
                            <div v-for="(star, starIndex) in 5">
                                <span @mouseover="fillStar(starIndex)" @mouseout="resetStar(starIndex)" @click="evaluate(game._id, star, game.name)" style="color:grey; float:left; cursor: pointer;" class="material-icons customstar">
                                    star_rate
                                </span>  
                            </div>
                            <div v-if="game.free.includes('false')">
                                <p class="card-title">{{ game.cost }}$</p>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p style="text-align: center;">Нет опубликованных игр</p>    
        </div>
        <br style="clear:both;"/>

        <h1 style="text-align: center;">Квесты: </h1>
        <div v-if="allGames.length >= 1 && allGames.some((el) => {
            if(el.genre !== undefined && el.genre.includes('quest')){
                return true
            }
            return false
        })">
            <div v-for="game in allGames">
                 <div v-if="game.genre.includes('quest')">
                    <div class="card customcard">
                        <h5 class="card-header">
                            <div v-if="game.imageurl.includes('empty')">
                                <img width="85px" height="85px" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
                            </div>
                            <div v-else-if="!game.imageurl.includes('empty')">

                                <!-- <img width="85px" height="85px" :src="game.imageurl" /> -->
                                <img width="85px" height="85px" :src="`https://vuesupergames.herokuapp.com/games/getimage?gamename=${game.name}`" />
                            
                            </div>
                        </h5>
                        <div class="card-body">
                            <router-link :to="{ name: 'Game', query: { gameid: game._id, touser: touser } }">{{ game.name.substring(0, 25) }}</router-link>
                            <p>{{ game.description.substring(0, 25) }}</p>
                            <div v-for="(star, starIndex) in 5">
                                <span @mouseover="fillStar(starIndex)" @mouseout="resetStar(starIndex)" @click="evaluate(game.id, star, game.name)" style="color:grey; float:left; cursor: pointer;" class="material-icons customstar">
                                    star_rate
                                </span>  
                            </div>
                            <div v-if="game.free.includes('false')">
                                <p class="card-title">{{ game.cost }}$</p>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p style="text-align: center;">Нет опубликованных игр</p>    
        </div>
        <br style="clear:both;"/>

        <h1 style="text-align: center;">Match-3: </h1>
        <div v-if="allGames.length >= 1 && allGames.some((el) => {
            if(el.genre !== undefined && el.genre.includes('match')){
                return true
            }
            return false
        })">
            <div v-for="game in allGames">
                 <div v-if="game.genre.includes('match')">
                    <div class="card customcard">
                        <h5 class="card-header">
                            <div v-if="game.imageurl.includes('empty')">
                                <img width="85px" height="85px" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
                            </div>
                            <div v-else-if="!game.imageurl.includes('empty')">
                                
                                <!-- <img width="85px" height="85px" :src="game.imageurl" /> -->
                                <img width="85px" height="85px" :src="`https://vuesupergames.herokuapp.com/games/getimage?gamename=${game.name}`" />

                            </div>
                        </h5>
                        <div class="card-body">
                            <router-link :to="{ name: 'Game', query: { gameid: game._id, touser: touser } }">{{ game.name.substring(0, 25) }}</router-link>
                            <p>{{ game.description.substring(0, 25) }}</p>
                            <div v-for="(star, starIndex) in 5">
                                <span @mouseover="fillStar(starIndex)" @mouseout="resetStar(starIndex)" @click="evaluate(game.id, star, game.name)" style="color:grey; float:left; cursor: pointer;" class="material-icons customstar">
                                    star_rate
                                </span>  
                            </div>
                            <div v-if="game.free.includes('false')">
                                <p class="card-title">{{ game.cost }}$</p>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    <div v-else>
        <p style="text-align: center;">Нет опубликованных игр</p>    
    </div>        
    </div>
    <Footer/>
</div>
</template>

<script>
// @ is an alias to /src
import Aside from '@/components/Aside.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

import * as jwt from 'jsonwebtoken'
import UsersLoginVue from './UsersLogin.vue'

export default {
  name: 'Home',
  data(){
    return {
        token: '',
        allGames: [],
        touser: '',
    }
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
                window.location.reload()
            });
        })
    }
  },
  mounted(){
    /*
      if(this.$route.query.auth !== 'true'){
        this.$router.push({ name: 'UsersLogin' })
      }

      fetch(`http://localhost:4000/main?auth=true&touser=${this.$route.query.touser}&searchText=none`, {
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
        this.allGames = JSON.parse(result).allGames
        this.touser = JSON.parse(result).touser
        console.log('touser:', this.touser)
        console.log('allGames:', this.allGames)
      });

      if(this.$route.query.creategame !== null && this.$route.query.creategame !== undefined && this.$route.query.creategame.includes('true')){
        fetch(`http://localhost:4000/games/gamecreatesuccess?gamename=${this.$route.query.gamename}&gamedescription=${this.$route.query.gamedescription}&gamegenre=${this.$route.query.gamegenre}&touser=${this.$route.query.touser}&gamecost=${this.$route.query.gamecost}&gameimageurl=${this.$route.query.gameimageurl}&gamefree=${this.$route.query.gamefree}`, {
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
            if(JSON.parse(result).status.includes("OK")){
                this.$router.replace({ name: 'Home', query: { 'auth': 'true', 'touser': this.touser, 'searchText': 'none', 'creategame': 'false' } } )
                //this.$router.reload({ name: 'Home', query: { 'auth': 'true', 'touser': this.touser, 'searchText': 'none' } } )
            }
        });
      } else if(this.$route.query.creategame !== null && this.$route.query.creategame !== undefined && this.$route.query.creategame.includes('false')){
        //   window.location.reload()
        // this.$route.query.creategame === null || this.$route.query.creategame === undefined
        this.$router.push({ name: "Home", query: { 'auth': 'true', 'touser': this.touser, 'searchText': 'none' } })
      }
    */

    this.token = window.localStorage.getItem("vuesupergamessecret")
    if(this.$route.query.redirectroute !== null && this.$route.query.redirectroute !== undefined){
        // логика перенаправления
      if(this.$route.query.redirectroute.includes('users/login') || this.$route.query.redirectroute.includes('users/register')){
          this.$router.push({ path: req.query.redirectroute })
      } else if(!this.$route.query.redirectroute.includes('users/login') && !this.$route.query.redirectroute.includes('users/register')){
        jwt.verify(this.token, 'vuesupergamessecret', (err, decoded) => {
            if(err){
                this.$router.push({ name: "UsersLogin" })
            }
            this.$router.push({ name: "Home", query: { auth: "true", touser: decoded.useremail, searchText: "none",  creategame: "false" } })
        })
      }
    } else {
        jwt.verify(this.token, 'vuesupergamessecret', (err, decoded) => {
            if(err){
                this.$router.push({ name: "UsersLogin" })
            }

            // fetch(`http://localhost:4000/main?auth=true&touser=${this.$route.query.touser}&searchText=none`, {
            fetch(`https://vuesupergames.herokuapp.com/main?auth=true&touser=${decoded.useremail}&searchText=${this.$route.query.searchText}`, {
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
                this.allGames = JSON.parse(result).allGames
                this.touser = JSON.parse(result).touser
                console.log('touser:', this.touser)
                console.log('allGames:', this.allGames)
            });

            if(this.$route.query.creategame !== null && this.$route.query.creategame !== undefined && this.$route.query.creategame.includes('true')){
                jwt.verify(this.token, 'vuesupergamessecret', (err, decoded) => {
                    if(err){
                        this.$router.push({ name: "UsersLogin" })
                    }
                    // fetch(`http://localhost:4000/games/gamecreatesuccess?gamename=${this.$route.query.gamename}&gamedescription=${this.$route.query.gamedescription}&gamegenre=${this.$route.query.gamegenre}&touser=${this.$route.query.touser}&gamecost=${this.$route.query.gamecost}&gameimageurl=${this.$route.query.gameimageurl}&gamefree=${this.$route.query.gamefree}`, {
                    fetch(`https://vuesupergames.herokuapp.com/games/gamecreatesuccess?gamename=${this.$route.query.gamename}&gamedescription=${this.$route.query.gamedescription}&gamegenre=${this.$route.query.gamegenre}&touser=${decoded.useremail}&gamecost=${this.$route.query.gamecost}&gameimageurl=${this.$route.query.gameimageurl}&gamefree=${this.$route.query.gamefree}`, {
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
                        if(JSON.parse(result).status.includes("OK")){
                            this.$router.replace({ name: 'Home', query: { 'auth': 'true', 'touser': this.touser, 'searchText': 'none', 'creategame': 'false' } } )
                        }
                    });
                })
            } else if(this.$route.query.creategame !== null && this.$route.query.creategame !== undefined && this.$route.query.creategame.includes('false')){
                this.$router.push({ name: "Home", query: { 'auth': 'true', 'touser': this.touser, 'searchText': 'none' } })
            }
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
    .card-body{
        overflow: hidden;
        max-height: 200px;            
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