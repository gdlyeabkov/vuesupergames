<template>
  <div class="aside">
    <div v-if="!notvisible ">
      <h4 style="font-size: 18px; text-align: center;">
          <span style="cursor: pointer;" class="material-icons myapps">
              grid_view
          </span>
          <router-link :to="{ name: 'GamesList', query: { touser: touser } }">Мои приложения:</router-link>
      </h4>
      <h4 style="font-size: 18px; text-align: center;">
          <span style="cursor: pointer;" class="material-icons">
              apps
          </span>
          <router-link :to="{ name: 'GamesPublish', query: { touser: touser } }">Опубликованные приложения:</router-link>
      </h4>
    </div>
    <div v-else-if="notvisible">
      Авторизируйтесь чтобы просмотреть ваши приложения     
    </div>
  </div>
</template>

<script>
export default {
  name: 'Aside',
  props: {  
    touser: {
      type: String,
      default: ""
    },
    notvisible: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style scoped>
  .aside {
    background-color: rgb(235, 235, 235);
    width: 20%;
    min-height: 750px;
    float: left;
  }
</style>
