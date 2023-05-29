<template>
  <div
    class="modal fade"
    :id="'SettingProject' + projectId"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog" style="max-width: 1000px;">
      <div class="modal-content">
        <div class="modal-header" style="border-bottom: 1px rgba(0, 0, 0, 0.05) solid;">
          <div class="modal-title">
            Настройки проекта: {{ currentProjectName}}
          </div>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close">
          </button>
        </div>
        <div class="modal-body">
          <div class="row" style="border-top: 1px rgba(0, 0, 0, 0.05) solid;
     color: rgb(127, 131, 136); padding: 23px 0px; margin: 0px; align-items: center">
            <div class="col-6">
              Назначить техлида
            </div>
            <div class="col-6">
              <div class="modal-search">
                <input type="text" v-model="modelSearchEmployer" class="modal-search__input"
                       placeholder="Найти сотрудника" @click="clickSearch()">
              </div>
              <template v-if="clear">
                <div class="modal__company-btn-wrap" v-if="currentProjectList.length > 0"
                style="padding-top: 20px; color: #000;">
                  <button
                    v-for="employer in currentProjectList"
                    :key="employer.id"
                    :data-value="employer.id"
                    class="modal__company-btn"
                    v-html="employer.title"
                    @click="addSelectedEmployer(employer.id)"
                  >
                  </button>
                </div>
              </template>
            </div>
          </div>
          <div style="font-size: 18px;">
          </div>
        </div>
        <div class="modal-footer pt-0"
             style="border-bottom: 1px solid #dee2e6;justify-content: center;">
          <button
            class="buttonOk"
            data-bs-dismiss="modal"
            aria-label="Close"
            ref="closePopup"
            @click="setSetting()"
          >
            Применить
          </button>
          <button
            class="buttonCancel"
            data-bs-dismiss="modal"
            aria-label="Close"
            ref="closePopup"
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import axios from 'axios';

export default {
  name: 'SettingProject',
  components: {},
  emits: ['addMainLead'],
  props: {
    projectId: {},
    employersList: {},
    currentProjectName: {},
    setting: {},
  },
  data() {
    return {
      modelSearchEmployer: {},
      searchEmployer: {},
      clear: 0,
      response: '',
    };
  },
  methods: {
    async setSetting() {
      const postParams = {
        token: this.$store.state.token,
        lidId: this.searchEmployer.id,
      };
      const response = await axios.post(`${this.$store.state.apiUrl}/project/setting/${this.projectId}?token=${this.$store.state.token}`, postParams);
      this.response = response.data.setting;
      this.$emit('addMainLead', this.searchEmployer);
    },
    addSelectedEmployer(employerId) {
      if (this.employersList.length) {
        this.employersList.forEach((item) => {
          if (item.id === employerId) {
            this.searchEmployer = item;
          }
        });
      }
    },
    clickSearch() {
      this.clear = true;
    },
  },
  computed: {
    currentProjectList() {
      const newArr = [];
      if (this.leadList.length && this.modelSearchEmployer) {
        this.leadList.forEach((item) => {
          if (item.id !== (this.searchEmployer ? this.searchEmployer.id : 0)) {
            if (item.title.toUpperCase().indexOf(this.modelSearchEmployer.toUpperCase()) !== -1) {
              newArr.push({
                title: item.title,
                id: item.id,
                grade: item.grade,
                competence: item.competence,
                idB24: item.idB24,
              });
            }
          }
        });
      }
      return newArr;
    },
    leadList() {
      return this.employersList;
    },
  },
  watch: {
    employersList() {
      if (this.setting == null) {
        this.clear = true;
      } else {
        this.clear = false;
        this.addSelectedEmployer(this.setting.lidId);
      }
    },
    setting() {
      if (this.setting == null) {
        this.searchEmployer = null;
        this.clear = true;
      } else {
        this.clear = false;
        this.addSelectedEmployer(this.setting.lidId);
      }
    },
    searchEmployer() {
      this.modelSearchEmployer = this.searchEmployer ? this.searchEmployer.title : '';
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
  max-width: 1000px;
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
  color: #000000;
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

a {
  text-decoration: none;
  color: black;
}

.modal-title {
  font-weight: bold;
  font-size: 18px;
}

.buttonOk {
  width: 210px;
  color: #ffffff;
  background-color: #C31419;
  border-radius: 5px;
  padding: 5px;
  border: none;
}

.buttonCancel {
  width: 210px;
  color: #000000;
  background-color: #969696;
  border-radius: 5px;
  padding: 5px;
  border: none;
}
</style>
