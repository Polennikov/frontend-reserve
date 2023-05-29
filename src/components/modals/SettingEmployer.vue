<template>
  <div
    class="modal fade"
    :id="'SettingEmployer' + employer.id"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog" style="max-width: 600px;">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            Настройки сотрудника: {{ employer.title}}
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
            <div class="col-8">
              Количество рабочих часов в день
            </div>
            <div class="col-4">
              <input type="number" v-model="hoursWork" style="width: 100%;">
            </div>
          </div>
        </div>
        <div class="modal-footer"
             style="border-bottom: 1px solid #dee2e6;justify-content: center;">
          <button
            class="btn btn--primary"
            data-bs-target="#EmployerInfoPopup"
            data-bs-toggle="modal"
            data-bs-dismiss="modal"
            @click="setSetting()"
          >
            Применить
          </button>
          <button
            class="btn btn--secondary"
            data-bs-target="#EmployerInfoPopup"
            data-bs-toggle="modal"
            data-bs-dismiss="modal"
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
  name: 'SettingEmployer',
  emits: ['getEmployers'],
  props: {
    employer: {},
    settings: {},
  },
  data() {
    return {
      hoursWork: 8,
    };
  },
  methods: {
    async setSetting() {
      const postParams = {
        hoursWork: this.hoursWork,
      };
      const response = await axios.post(`${this.$store.state.apiUrl}/employer/setting/${this.employer.id}?token=${this.$store.state.token}`, postParams);
      this.response = response.data.setting;
      this.$emit('getEmployers', this.employer.id);
    },
  },
  watch: {
    settings() {
      if (this.settings) {
        if (this.settings.hoursWork) {
          this.hoursWork = this.settings.hoursWork;
        } else {
          this.hoursWork = 8;
        }
      }
    },
  },
};
</script>

<style>

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

.modal__company-btn-wrap p {
  margin-bottom: 0;
}

.modal__company-btn-wrap--active .modal__company-btn {
  color: #000000;
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

</style>
