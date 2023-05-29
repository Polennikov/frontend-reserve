<template>
  <li style="border-bottom: 1px rgba(0, 0, 0, 0.05) solid;
    display: block;padding: 0 20px 20px 20px;
    max-height: calc(100vh - 75px); overflow: auto;">
    <div class="menu-items">
      <div class="menu-item" v-for="(competence, index) in competenceArray"
         :key="index">
        <div :class="{ active: competence == competenceCheck }">
          <a class="p-2" href="#"
             :class="{ active_a: competence == competenceCheck }"
             :data-id="index" @click.prevent="competenceUpdate(competence)"
             style="flex: 1 0 1%;margin: 5px;">
            {{ competence }}
          </a>
        </div>
      </div>
    </div>
  </li>
</template>

<script>

export default {
  name: 'ResourceSidebar',
  components: [],
  emits: ['resourceUpdate'],
  props: {
    competences: {},
  },
  data() {
    return {
      competenceArray: [
        'Дизайнер',
        'Аналитик',
        'Backend (bitrix)',
        'Backend (symfony)',
        'Frontend (vue)',
        'Frontend (HTML/CSS)',
        'Android-разработчик',
        'iOS-разработчик',
        'Тестировщик',
        'DevOps',
        'Менеджер',
      ],
      competenceCheck: undefined,
    };
  },
  methods: {
    competenceUpdate(title) {
      this.competenceCheck = title;
      this.$emit('resourceUpdate', title);
    },
  },
};
</script>

<style scoped>
div {
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
}
a {
  display: block;
  text-decoration: none;
  color: #000000;
  font-weight: bold;
  border-radius: 5px;
}
.menu-items:not(:first-child) {
  padding-top: 20px;
}

.menu-item {
  width: 280px;
  height: 47px;
  border-radius: 8px;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  position: relative;
}

.menu-item div {
  display: flex;
  justify-content: space-between;
  border-radius: 5px
}

.active {
  height: 47px;
  background-repeat: no-repeat;
  color: #C31419;
  position: relative;
}

.active::before {
  content: "";
  width: 4px;
  height: 100%;
  left: -20px;
  top: 0;
  position: absolute;
  background: #C31419;
  border-radius: 0px 10px 10px 0px;
}

.active_a {
  color: inherit;
  background-repeat: no-repeat;
  transition: background-color 0.5s ease-out;
}
</style>
