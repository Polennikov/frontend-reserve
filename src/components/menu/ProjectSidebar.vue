<template>
<!--<li style="border-bottom:1px rgba(0, 0, 0, 0.05)solid;display:block;padding-bottom:20px;">-->
  <li class="sidebar-nav__item sidebar-nav__item--projects" v-if="projectsSidebar.length">
    <div class="menu-items"
         v-for="project in projectsSidebar"
         :key="project.id">
      <div class="menu-item">
        <div class="menu-item__btn" :class="{ active: project.id == currentProject }">
          <a href="#"
              class="menu-item__title"
             :class="{ active_a: project.id == currentProject }"
             :data-id="project.id" @click="choseProject"
             style="flex: 1 0 1%;margin: 5px;">
            {{ project.title }}
          </a>
          <a
            v-if="project.id == currentProject"
            class="btn btn--icon btn-edit mb-1"
            data-bs-toggle="modal"
            href="#SettingProject"
            :data-bs-target="'#SettingProject' + currentProject"
          >
          </a>
          <a class="delete-item-menu p-2"
             href="#"
             @click="deleteProject"
             :data-id="project.id">
          </a>
        </div>
      </div>
    </div>
  </li>
  <li class="sidebar-nav__item">
    <div>
      <button class="button-add button-add--gray button-add--icon"
        data-bs-toggle="modal"
        href="#ProjectAddPopup"
      >
        Добавить проект
      </button>
    </div>
  </li>
</template>

<script>
export default {
  name: 'ProjectSidebar',
  emits: ['choseProject', 'deleteProject', 'addSelectedProject'],
  props: {
    projectsSidebar: Array,
    projectsList: {},
    currentProject: Number,
    pageKey: Number,
  },
  data() {
    return {
      selectedProject: 0,
    };
  },
  methods: {
    choseProject(event) {
      const id = event.target.getAttribute('data-id');
      let title = '';
      this.projectsSidebar.forEach((project) => {
        if (parseInt(project.id, 10) === parseInt(id, 10)) {
          title = project.title;
        }
      });
      this.$emit('choseProject', parseInt(id, 10), title);
    },
    deleteProject(event) {
      const id = event.target.getAttribute('data-id');
      this.$emit('deleteProject', parseInt(id, 10));
    },
    addSelectedProject() {
      let title = '';
      this.projectsList.forEach((project) => {
        if (project.id === this.selectedProject) {
          title = project.title;
        }
      });
      this.$emit('addSelectedProject', this.selectedProject, title);
      this.selectedProject = 0;
    },
  },
};
</script>

<style scoped>
.sidebar-nav li {
  line-height: 26px;
  font-size: 14px;
  font-weight: 500;
  padding: 20px;
}

.sidebar-nav__item--projects {
  max-height: calc(100vh - 88px - 69px);
  overflow: auto;
  border-bottom: 1px rgba(0, 0, 0, 0.05) solid;
}

.menu-item div .delete-item-menu {
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: block;
  background-size: contain;
  width: 24px;
  height: 24px;
  position: absolute;
  background-image: url('~@/assets/trash.svg');
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  background-repeat: no-repeat;
  background-position: center;
}
.btn-edit {
  position: absolute;
  right: 45px;
  top: 50%;
  pointer-events: none;
  opacity: 0;
  width: 24px;
  height: 24px;
  transform: translateY(-50%);
  transition: opacity 0.2s ease;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='4' stroke='%23969696' stroke-width='2'/%3E%3Crect x='11' y='5' width='2' height='4' rx='1' fill='%23969696'/%3E%3Crect x='11' y='15' width='2' height='4' rx='1' fill='%23969696'/%3E%3Crect x='17.5622' y='7.63403' width='2' height='4' rx='1' transform='rotate(60 17.5622 7.63403)' fill='%23969696'/%3E%3Crect x='8.90192' y='12.634' width='2' height='4' rx='1' transform='rotate(60 8.90192 12.634)' fill='%23969696'/%3E%3Crect x='18.5621' y='14.634' width='2' height='4' rx='1' transform='rotate(120 18.5621 14.634)' fill='%23969696'/%3E%3Crect x='9.90198' y='9.63403' width='2' height='4' rx='1' transform='rotate(120 9.90198 9.63403)' fill='%23969696'/%3E%3C/svg%3E%0A");
}
.menu-item div:hover .delete-item-menu {
  opacity: 1;
  pointer-events: all;
  transition: none;
}
.menu-item .active:hover .btn-edit {
  opacity: 1;
  pointer-events: all;
  transition: none;
}

.menu-item .active:hover .delete-item-menu {
  background-image: url('~@/assets/trash.svg');
}

button {
  display: block;
  text-decoration: none;
  color: #000000;
  font-weight: bold;
  border-radius: 5px;
  border: none;
  background-color: #ffffff;
}

.button-add {
  background-color: #FAFAFA;
  width: 100%;
  text-align: left;
}

a {
  display: block;
  text-decoration: none;
  color: #000000;
  font-weight: bold;
  border-radius: 5px;
}

.form-select {
  background-color: rgba(0, 0, 0, 0.02);;
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

.menu-item div:not(.active):hover {
  /* background: rgba(0, 0, 0, 0.02); */
  color: #C31419;
}

.menu-item__btn {
  padding: 8px;
}

.menu-item__title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: inherit;
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
.menu-item__btn:hover {
  padding-right: 30px;
}
.menu-item .active:hover .active_a {
  padding-right: 55px;
}
h3 {
  margin: auto;
  font-size: 18px;
  text-transform: uppercase;
}
</style>
