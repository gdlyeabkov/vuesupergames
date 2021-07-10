<template>
  <div>
    <Header :touser="$route.query.touser"/>
    <Aside :touser="$route.query.touser"/>
    <div class="main">
      <img class="mb-4" src="https://www.gstatic.com/android/market_images/web/play_prism_hlock_2x.png" alt="" width="30%" height="30%">
      <h1 class="h3 mb-3 font-weight-normal">Создание новой игры</h1>
      
      <label for="inputEmail" class="sr-only">Name</label>
      <input v-model="gamename" type="text" id="inputEmail" class="gamename form-control" placeholder="Name" required="" autofocus="">
      
      <label for="inputDescription" class="sr-only">Description</label>
      <textarea v-model="gamedescription" id="inputDescription" class="gamedescription form-control" required="" placeholder="Description"></textarea>
      
      <label for="inputFree" class="sr-only">Cost</label>
      <input type="checkbox" v-model="gamefree" id="inputFree" class="gamefree form-control">
      <input v-model="gamecost" type="number" value="0" id="inputCost" class="gamecost form-control" placeholder="Cost" required="">
      
      <!-- <label for="inputPassword" class="sr-only">Image Url</label> -->
      <!-- <input v-model="gameimageurl" type="text" id="inputUrl" class="gameimageurl form-control" placeholder="imageurl" required=""> -->
      
      <label for="inputGenre" class="sr-only">Genre</label>
      <select v-model="gamegenre" style="display: block; margin:auto; min-width: 300px;"  id="inputGenre" class="gamegenre" size="3" name="hero[]">
          <option value="popular" selected>popular</option>
          <option value="arcade">arcade</option>
          <option  value="quests">quests</option>
          <option value="matchthree">matchthree</option>
      </select>
      
      <form class="registerForm" enctype="multipart/form-data"  method="POST" :action="`https://vuesupergames.herokuapp.com/games/uploads?gamename=${gamename}&gamefree=${gamefree}&gamedescription=${gamedescription}&gamecost=${gamecost}&gameimageurl=${gameimageurl}&gamegenre=${gamegenre}&touser=${touser}`">
        
        <!-- <label for="inputFile" class="sr-only">Select image:</label> -->
        <!-- <input style="max-width: 300px; margin: auto;" type="file" id="inputFile" class="gamefile form-control" name="myFiles" placeholder="file" required=""> -->
        
        <label for="inputFile" class="sr-only">Select file:</label>
        <!-- <input style="max-width: 300px; margin: auto;" type="file" id="inputFile" class="gamefile form-control" name="myFile" placeholder="file" required=""> -->
        <!-- <input style="max-width: 300px; margin: auto;" type="file" id="inputFile" class="gamefile form-control" name="myFiles" placeholder="file" required=""> -->
        <input style="max-width: 300px; margin: auto;" type="file" id="inputFile" class="gamefile form-control" multiple name="myFiles" placeholder="file" required="">

        <input type="submit" class="btn btn-lg btn-primary btn-block registerBtn" value="Upload a file" style="min-width: 125px; max-width: 170px; display: block; margin: 15px auto;">
      </form>
      
      <div class="checkbox mb-3">
      </div>
      <!-- <button @click="upload()" class="btn btn-lg btn-primary btn-block registerBtn">Добавить игру</button> -->
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
  name: 'GamesRegistry',
  data(){
    return {
      token: '',
      gamename: '',
      gamedescription: '',
      gamefree: true,
      gamecost: 0,
      gameimageurl: '',
      gamegenre: '',
      touser: '',
    }
  },
  methods:{
    upload(){
      jwt.verify(this.token, 'vuesupergamessecret', (err, decoded) => {
        if(err){
            this.$router.push({ name: "UsersLogin" })
        }
        fetch(`https://vuesupergames.herokuapp.com/games/gamecreatesuccess?gamename=${this.gamename}&gamedescription=${this.gamedescription}&touser=${this.$route.query.touser}&gamecost=${this.gamecost}&gamefree=${this.gamefree}&gameimageurl=${this.gameimageurl}&gamegenre=${this.gamegenre}`, {
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
                // this.$refs.customform.submit()
                // this.$refs.customform.target.action = `http://localhost:4000/games/uploads?gamename=${this.gamename}&gamefree=${this.gamefree}&gamedescription=${this.gamedescription}&gamecost=${this.gamecost}&gameimageurl=${this.gameimageurl}&gamegenre=${this.gamegenre}&touser=${this.touser}`
              });
            })


      // this.gamegenre = this.gamegenre.options[gamegenre.selectedIndex].text
      // document.querySelector('.registerForm').action = `http://localhost:4000/games/uploads?gamename=${this.gamename}&gamefree=${this.gamefree}&gamedescription=${this.gamedescription}&gamecost=${this.gamecost}&gameimageurl=${this.gameimageurl}&gamegenre=${this.gamegenre}&touser=${this.$route.query.touser}`
      
      // this.$router.push({ name: 'Home', query: { 'touser': this.$route.query.touser, 'searchText': 'none' } })
      
    }
  },
  mounted(){
    this.touser = this.$route.query.touser
    this.token = window.localStorage.getItem("vuesupergamessecret")
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
    min-height: 750px;
    float: left;
    background-color: rgb(205, 209, 206);
    width: 80%;
    margin:auto;
    text-align: center;
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

  .main > input, .main > textarea  {
    margin:auto;
    max-width: 300px;
  }

  .main > input[type=checkbox] {
    width: 0px;
  }

</style>