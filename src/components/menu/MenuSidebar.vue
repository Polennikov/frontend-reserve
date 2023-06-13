<template>
  <div id="sidebar-wrapper">
    <ul class="sidebar-nav">
      <li>
        <div class="menu-button-project">
          <button class="menu-button-project__item" @click="pageMain(1)"
                  :class="{ activeMenu: pageKey === 1 }">
            <div>Проекты</div>
          </button>
          <button class="menu-button-project__item" @click="pageMain(0)"
                  :class="{ activeMenu: pageKey === 0 }">
            <div>Ресурсы</div>
          </button>
          <button class="menu-button-project__item" @click="pageMain(2)"
                  :class="{ activeMenu: pageKey === 2 }">
            <div>Управление</div>
          </button>
        </div>
      </li>
      <template v-if="pageKey === 1">
        <project-sidebar
          :projectsSidebar="projectsSidebar"
          :currentProject="currentProject"
          :projectsList="projectsList"
          @choseProject="choseProject"
          @deleteProject="deleteProject"
          @addSelectedProject="addSelectedProject"
        >
        </project-sidebar>
      </template>
      <template v-else-if="pageKey === 2">
        <project-sidebar
            :projectsSidebar="projectsSidebar"
            :currentProject="currentProject"
            :projectsList="projectsList"
            @choseProject="choseProject"
            @deleteProject="deleteProject"
            @addSelectedProject="addSelectedProject"
        >
        </project-sidebar>
      </template>
      <template v-else>
        <resource-sidebar
          :competences="competences"
          @resourceUpdate="resourceUpdate"
        >
        </resource-sidebar>
      </template>
    </ul>
  </div>
</template>

<script>

import ProjectSidebar from '@/components/menu/ProjectSidebar.vue';
import ResourceSidebar from '@/components/menu/ResourceSidebar.vue';

export default {
  name: 'MenuSidebar',
  components: {
    ProjectSidebar,
    ResourceSidebar,
  },
  emits: ['pageMain', 'changeProject', 'deleteProject', 'addProject', 'resourceUpdate', 'choseProject'],
  props: {
    competences: {},
    projectsSidebar: {},
    projectsList: {},
    currentProject: Number,
    pageKey: Number,
  },
  methods: {
    choseProject(id, title) {
      this.$emit('choseProject', id, title);
    },
    deleteProject(id) {
      this.$emit('deleteProject', id);
    },
    pageMain(index) {
      this.$emit('pageMain', index);
    },
    addSelectedProject(selectedProject, title) {
      this.$emit('addProject', selectedProject, title);
    },
    resourceUpdate(competenceCheck) {
      this.$emit('resourceUpdate', competenceCheck);
    },
  },
};
</script>

<style scoped>
#sidebar-wrapper {
  position: fixed;
  left: 250px;
  width: 0;
  height: 100%;
  overflow-y: auto;
  margin-left: -250px;
  background: #ffffff;
  -webkit-transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -o-transition: all 0.5s ease;
  transition: all 0.5s ease;
}

.sidebar-nav {
  height: 69px;
  border-bottom: 1px rgba(0, 0, 0, 0.05) solid;
  position: absolute;
  top: 0;
  width: 320px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: #000000;
}

.sidebar-nav li {
  line-height: 26px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
}

.menu-button-project {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  display: flex;
  width: 100%;
  border-radius: 5px;
  justify-content: space-between;
  padding: 20px 36px;
}

.menu-button-project__item {
  color: #969696;
  font-weight: bold;
  border: none;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
  background-color: transparent;
}

.menu-button-project__item.activeMenu {
  color: #000000;
  position: relative;
}
.menu-button-project__item.activeMenu::before {
  content: "";
  position: absolute;
  width: 120%;
  height: 3px;
  background: #C31419;
  border-radius: 10px;
  bottom: -20px;
  left: -10%;
}

a {
  display: block;
  text-decoration: none;
  color: #000000;
  font-weight: bold;
  border-radius: 5px;
}

.btn-edit {
  width: auto;
}

.menu-button-project button:hover, .menu-button-project a:hover {
  transition: 0.5s ease-out;
  background: rgba(0, 0, 0, 0.02);
  color: black;
}

@media (min-width: 768px) {
  #sidebar-wrapper {
    width: 320px;
  }
}

h3 {
  margin: auto;
  font-size: 18px;
  text-transform: uppercase;
}
</style>
