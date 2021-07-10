<template>
  <div>
    <Header :notvisible="true" :touser="''"/>
    <Aside :notvisible="true" :touser="''"/>
    <div class="main">
      <img src="https://www.gstatic.com/android/market_images/web/play_prism_hlock_2x.png" width="30%" height="30%" alt="">            
      <h1 class="h3 mb-3 font-weight-normal">Зарегестрируйтесь</h1>
      
      <label for="inputEmail" class="sr-only">Email</label>
      <input v-model="developeremail" type="email" id="inputEmail" class="developeremail form-control" placeholder="Email address" required="" autofocus="">
      <label for="inputPassword" class="sr-only">Password</label>
      <input v-model="developerpassword" type="password" id="inputPassword" class="developerpassword form-control" placeholder="Password" required="">
      <label for="inputEmail" class="sr-only">Name</label>
      <input  v-model="developername" type="text" id="inputEmail" class="developername form-control" placeholder="Name" required="" autofocus="">
      <label for="inputEmail" class="sr-only">Age</label>
      <input  v-model="developerage" type="number" id="inputEmail" class="developerage form-control" placeholder="Age" required="" autofocus="">
      <label for="inputImageurl" class="sr-only">Imageurl</label>
      <input v-model="developerimageurl" type="text" id="inputEmail" class="developerimageurl form-control" placeholder="imageurl" required="" autofocus="">
      
      <div class="checkbox mb-3">
      </div>
      <button @click="register()" class="btn btn-lg btn-primary btn-block registerBtn">Зарегестрироваться</button>
      <div class="customErros">{{ errors }}</div>
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
  name: 'UsersRegistry',
  data(){
    return {
      errors: "",
      token: '',
      developeremail:'',
      developerpassword:'',
      developername:'',
      developerage:0,
      developerimageurl:'',
    }
  },
  methods:{
    register(){
      fetch(`https://vuesupergames.herokuapp.com/users/usercreatesuccess?developeremail=${this.developeremail}&developerpassword=${this.developerpassword}&developername=${this.developername}&developerage=${this.developerage}&developerimageurl=${this.developerimageurl}`, {
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
          if(JSON.parse(result).status.includes("OK")){
            this.$router.push({ 'name': "Home", query: { "auth": "true", "touser": JSON.parse(result).developeremail, "searchText": "none" } })
          } else if(JSON.parse(result).status.includes("Error")){
            //показывем такого пользователя не существует
            this.errors = "Такой пользователь уже существует!!!"
          }
        });
      }
    },
    components: {
      Aside,
      Header,
      Footer
    }
  }

        Footer</script>
<style scoped>
  .main {
      width: 50%;
      margin:auto;
      text-align: center;
  }
  .customErros {
    color: red;
    font-weight: bolder;
  }
</style>