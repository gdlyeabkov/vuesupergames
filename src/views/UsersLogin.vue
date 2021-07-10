<template>
  <div>
    <Header :notvisible="true" :touser="''" />
    <Aside :touser="''" :notvisible="true"/>
    <div class="customCardGroup">
          <img src="https://www.gstatic.com/android/market_images/web/play_prism_hlock_2x.png" width="30%" height="30%" alt="">
        
          <h1 class="h3 mb-3 font-weight-normal">Войдите</h1>
          
          <label for="inputEmail" class="sr-only">Email</label>
          <input v-model="developeremail" type="email" id="inputEmail" class="developeremail form-control" placeholder="Email address" required="" autofocus="">
          <label for="inputPassword" class="sr-only">Password</label>
          <input v-model="developerpassword" type="password" id="inputPassword" class="developerpassword form-control" placeholder="Password" required="">
          <div class="checkbox mb-3">
          </div>
          <button class="btn btn-lg btn-primary btn-block loginBtn" @click="login()">Войти</button>
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
  name: 'UsersLogin',
  data(){
    return {
      developeremail:'',
      developerpassword:'',
      errors: "",
      token: ''
    }
  },
  methods:{
    login(){
      fetch(`https://vuesupergames.herokuapp.com/users/check?developeremail=${this.developeremail}&developerpassword=${this.developerpassword}`, {
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
          this.token = jwt.sign({
            useremail: this.developeremail
            }, 'vuesupergamessecret', { expiresIn: '5m' })
          localStorage.setItem('vuesupergamessecret', this.token)
          this.$router.push({ 'name': "Home", query: { "auth": "true", "touser": JSON.parse(result).developeremail, "searchText": "none", "creategame": "false" } })
        } else if(JSON.parse(result).status.includes("Error")){
          console.log(" такого пользователя не существует")
          //показывем такого пользователя не существует
          this.errors = "Такого пользователя не существует!!!"
        }
      });
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
  .customCardGroup {
    margin:auto;
    display:flex;
    justify-content: center;
    width:35%;
    flex-direction: column; 
    text-align: center;
  }

  .customCardGroup > button{
    margin:auto;
    display:flex;
    justify-content: center;
    width:35%;
    flex-direction: column; 
    text-align: center;
    box-sizing: border-box;
    padding: 5px 55px;
  }

  .customCardGroup img {
    display: block;
    margin:auto;
  }
  .customErros {
    color: red;
    font-weight: bolder;
  }
</style>