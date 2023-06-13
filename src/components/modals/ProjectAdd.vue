<template>
  <div
    class="modal"
    id="ProjectAddPopup"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header modal-header--bordered">
          <div class="modal-title">Добавить проект</div>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close">
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-search">
            <input type="text" v-model="search" class="modal-search__input"
                   placeholder="Найти проект">
            <div
                class="valid-feedback"
                style="display: block;
                margin-bottom: 10px;
                font-weight: bold;
                font-size: 16px;
                font: inherit;"
                v-if="sendSuccess"
            >{{ sendSuccess }}
            </div>
          </div>
          <div class="modal__company-btn-wrap" v-if="currentProjectList.length > 0"
               :class="{ 'modal__company-btn-wrap--active': (search === null || search === '') }">
            <button
              v-for="project in currentProjectList"
              :key="project.id"
              :data-value="project.id"
              class="modal__company-btn"
              v-html="project.title"
              @click="addSelectedProject(project.id, project.title)"
            >
            </button>
          </div>
          <div class="modal__company-btn-wrap" v-if="currentProjectList.length === 0">
            <p>Ничего не найдено</p>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

export default {
  name: 'ProjectAddPopup',
  emits: ['addProject'],
  props: {
    projectsList: {},
    projectsSidebar: {},
  },
  data() {
    return {
      search: null,
      status: [
        'выяснение потребности',
        'коммерческое предложение',
        'согласование проекта',
        'выполнение',
      ],
      sendSuccess: '',
    };
  },
  methods: {
    addSelectedProject(id) {
      this.$emit('addProject', id);
      this.currentProjectList.filter((obj) => obj.id !== id);
      this.search = null;
      this.sendSuccess = 'Проект успешно добавлен!';
    },
    checkUseProject(project) {
      let value = true;
      const objArr = Object.entries(this.projectsSidebar);
      objArr.forEach((itemSidebar) => {
        if (itemSidebar[1].id === project.id) {
          value = false;
        }
      });
      if (!this.status.includes(project.status)) {
        value = false;
      }
      return value;
    },
  },
  computed: {
    currentProjectList() {
      const newArr = [];
      if (this.projectsList.length && this.search !== undefined) {
        if (this.search === null) {
          this.projectsList.forEach((item) => {
            if (this.checkUseProject(item)) {
              newArr.push({
                title: item.title.split(this.search).join(`<span style='color: #000000'>${this.search}</span>`),
                id: item.id,
              });
            }
          });
          return newArr;
        }
        this.projectsList.forEach((item) => {
          console.log(item);
          if (this.checkUseProject(item)) {
            if (item.title.toLowerCase().indexOf(this.search.toLowerCase()) !== -1) {
              newArr.push({
                title: item.title.split(this.search).join(`<span style='color: #000000'>${this.search}</span>`),
                id: item.id,
              });
            }
          }
        });
      }
      console.log(this.search !== undefined);
      console.log(this.projectsList.length);
      return newArr;
    },
  },
  watch: {
    sendSuccess() {
      setTimeout(() => {
        this.sendSuccess = '';
      }, 5000);
    },
  },
};
</script>

<style>
.modal__company-btn:hover {
  color: #C31419 !important;
}

.modal__company-btn:hover span {
  color: #C31419 !important;
}
</style>

<style scoped>
.modal-header {
  border: none;
  padding: 25px 20px;
  padding-right: 60px;
  position: relative;
}

.modal-header--bordered {
  border-bottom: 1px solid #F2F2F2;
}

.modal-content {
  max-width: 500px;
  margin: 0 auto;
}

.btn-close {
  position: absolute;
  top: 27px;
  right: 27px;
  width: 24px;
  height: 24px;
  margin: 0;
  padding: 0;
  background-size: 24px;
  opacity: 1;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 7L17 17' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M17 7L7 17' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E%0A");
}

.modal-body {
  padding: 0px 20px;
}

.modal-title {
  font-style: normal;
  font-size: 24px;
  line-height: 29px;
  margin-left: 10px;
  font-weight: bold;
}

.modal-search {
  margin: 20px 0;
}

.modal-search__input {
  border: 2px solid #F2F2F2;
  border-radius: 8px;
  font: inherit;
  padding: 14px 56px 14px 16px;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  width: 100%;
  background-repeat: no-repeat;
  background-position: calc(100% - 16px) center;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='11' cy='11' r='8' stroke='%23969696' stroke-width='2'/%3E%3Cpath d='M21 21L17 17' stroke='%23969696' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E%0A");
}

.modal__company-btn-wrap {
  overflow: auto;
  max-height: 400px;
  margin-bottom: 20px;
}

.modal__company-btn-wrap p {
  margin-bottom: 0;
}

.modal__company-btn {
  padding: 0;
  background-color: transparent;
  border: none;
  display: block;
  width: 100%;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: left;
  margin-bottom: 20px;
  transition: color 0.2s ease;
  color: #969696;
}

.modal__company-btn-wrap--active .modal__company-btn {
  color: #000000;
}

.row-info .project-name, .row-info-header .project-name {
  font-size: inherit;
  line-height: inherit;
  font-weight: 400;
}

.col-fact div {
  display: flex;
  align-items: center;
}
</style>
