<template>
  <div>
    <Header :touser="touser" />
    <Aside :touser="touser"/>
    <div class="main">
      
      <!-- <img class="mb-4" :src="gameImage" alt="" width="72" height="72"> -->
      <!-- <img width="85px" height="85px" :src="`https://vuesupergames.herokuapp.com/games/getimage?gamename=${gameName}`" /> -->
      <img width="85px" height="85px" :src="`https://brief-malleable-microraptor.glitch.me/games/getimage?gamename=${gameName}`" />

      <button ref="installButton" v-if="!downloadYet" style="margin-left: 25px;" @click="install()" type="button" class="installBtn btn btn-primary">Установить</button>
      <button disabled v-else-if="downloadYet" style="margin-left: 25px;" type="button" class="installBtn btn btn-primary">Установлено</button>

      <h1 class="gameName">{{ gameName }}</h1>
      <p>Описание: {{ gameDesc }}</p>
      <p>{{ gameFree.includes("true") ? "Бесплатная" : "Цена: " + gameCost }}</p>
      <p>Рейтинг: {{ ratio }}</p>
      <div v-for="(star, starIndex) in 5">
        <span @mouseover="fillStar(starIndex)" @mouseout="resetStar(starIndex)" @click="evaluate($route.query.gameid, star, gameName)" style="color:grey; float:left; cursor: pointer;" class="material-icons customstar">
          star_rate
        </span>  
      </div>
      <br style="clear: both;" />
      <p>Количество скачиваний: {{ gameCountDownloads }}</p>
      <p>Опубликована: {{ gameDateOfCreated }} разработчиком: {{ gameBy }}</p>
    <input class="gameBy" type="hidden" value="gameBy">
    
    <input type="hidden" class="gamenickname" value="gameName">
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
  name: 'Game',
  data(){
    return {
      downloadYet: false,
      token: '',
      gameImage: "",
      touser: "",
      gameCountDownloads: 0,
      gameDateOfCreated: "",
      gameBy: "",
      gameCountLikes: 0,
      gameCost: 0,
      gameFree: "",
      gameDesc: "",
      gameName: "",
      gameGenre: "",
      ratio: 0.0,
      downloaded: []
    }
  },
  methods:{
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

          this.$router.push({ name: "Home", query: { auth: "true", touser: this.touser, searchText: "none" } })

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
    },
    async install(){
      jwt.verify(this.token, 'vuesupergamessecret', async (err, decoded) => {
        if(err){
          this.$router.push({ name: "UsersLogin" })
        }
        
        this.$refs.installButton.setAttribute('disabled', true);

        // window.location = `https://vuesupergames.herokuapp.com/games/downloads?gameid=${this.$route.query.gameid}&gamename=${this.gameName}&gameCost=${this.gameCost}&gameFree=${this.gameFree}&gameDesc=${this.gameDesc}&gameCountLikes=${this.gameCountLikes}&gameBy=${this.gameBy}&gameDateOfCreated=${this.gameDateOfCreated}&gameCountDownloads=${this.gameCountDownloads}&gameImage=${this.gameImage}&gameGenre=${this.gameGenre}&touser=${this.touser}`
        window.location = `https://brief-malleable-microraptor.glitch.me/games/downloads?gameid=${this.$route.query.gameid}&gamename=${this.gameName}&gameCost=${this.gameCost}&gameFree=${this.gameFree}&gameDesc=${this.gameDesc}&gameCountLikes=${this.gameCountLikes}&gameBy=${this.gameBy}&gameDateOfCreated=${this.gameDateOfCreated}&gameCountDownloads=${this.gameCountDownloads}&gameImage=${this.gameImage}&gameGenre=${this.gameGenre}&touser=${this.touser}`

        // await fetch(`http://localhost:4000/games/downloads?gameid=${this.$route.query.gameid}&gamename=${this.gameName}&gameCost=${this.gameCost}&gameFree=${this.gameFree}&gameDesc=${this.gameDesc}&gameCountLikes=${this.gameCountLikes}&gameBy=${this.gameBy}&gameDateOfCreated=${this.gameDateOfCreated}&gameCountDownloads=${this.gameCountDownloads}&gameImage=${this.gameImage}&gameGenre=${this.gameGenre}&touser=${this.touser}`, {
        //   mode: 'cors',
        //   method: 'GET'
        // }).then(response => response.body).then(rb  => {
        //         const reader = rb.getReader()
        //         return new ReadableStream({
        //         start(controller) {
        //             function push() {
        //             reader.read().then( ({done, value}) => {
        //                 if (done) {
        //                 console.log('done', done);
        //                 controller.close();
        //                 return;
        //                 }
        //                 controller.enqueue(value);
        //                 console.log(done, value);
        //                 push();
        //             })
        //             }
        //             push();
        //         }
        //         });
        //     }).then(stream => {
        //         return new Response(stream, { headers: { "Content-Type": "text/plain" } }).text();
        //     })
        //     .then(result => {
        //       window.location = `http://localhost:4000/games/downloads?gameid=${this.$route.query.gameid}&gamename=${this.gameName}&gameCost=${this.gameCost}&gameFree=${this.gameFree}&gameDesc=${this.gameDesc}&gameCountLikes=${this.gameCountLikes}&gameBy=${this.gameBy}&gameDateOfCreated=${this.gameDateOfCreated}&gameCountDownloads=${this.gameCountDownloads}&gameImage=${this.gameImage}&gameGenre=${this.gameGenre}&touser=${this.touser}`
        //     });
      })
    }
  },
  mounted(){
    this.token = window.localStorage.getItem("vuesupergamessecret")
    
    jwt.verify(this.token, 'vuesupergamessecret', (err, decoded) => {
      if(err){
        this.$router.push({ name: "UsersLogin" })
      }
      fetch(`https://vuesupergames.herokuapp.com/game?gameid=${this.$route.query.gameid}&touser=${this.$route.query.touser}`, {
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
        this.gameDateOfCreated = JSON.parse(result).gameDateOfCreated
        this.gameImage = JSON.parse(result).gameImage
        this.gameCountDownloads = JSON.parse(result).gameCountDownloads
        this.gameCountLikes = JSON.parse(result).gameCountLikes
        this.touser = JSON.parse(result).touser
        this.gameFree = JSON.parse(result).gameFree
        this.gameCost = JSON.parse(result).gameCost
        this.gameBy = JSON.parse(result).gameBy
        this.gameDesc = JSON.parse(result).gameDesc
        this.gameName = JSON.parse(result).gameName
        this.gameGenre = JSON.parse(result).gameGenre
        console.log(JSON.parse(result))

        this.ratio = this.gameCountLikes > 0 && this.gameCountDownloads > 0  ? (this.gameCountLikes / this.gameCountDownloads).toString().substr(0, 3) : 0
        this.downloaded = JSON.parse(result).downloaded
        // this.downloadYet = this.downloaded.includes(decoded.useremail)
        this.downloadYet = this.downloaded.findIndex((download) => download.name.includes(decoded.useremail)) >= 0
        
        console.log("decoded.developeremail: ", decoded.useremail)
        console.log("downloadYet: ", this.downloadYet)
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
  .main {
    background-color: rgb(205, 209, 206);
    width: 80%;
    min-height: 750px;
    float: left;
  }
</style>