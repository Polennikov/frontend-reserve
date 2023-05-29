<template>
  <div
      class="modal fade"
      :id="'SettingManager'"
      tabindex="-1"
      aria-hidden="true"
  >
    <div class="modal-dialog" style="max-width: 340px;">
      <div class="modal-content">
        <div class="modal-header" style="border-bottom: 1px rgba(0, 0, 0, 0.05) solid;">
          <div class="modal-title">
            Настройки
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
            padding: 23px 0px; margin: 0px; align-items: center">
            <div class="col-12">
              Кол-во отображаемых месяцев:
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="month-wrap">
                <div class="radio-wrap">
                  <input type="radio" v-model="countMonthValue" value="1" checked
                  class="visually-hidden" id="label-first" name="month-value">
                  <label for="label-first" class="label-first">1</label>
                </div>
                <div class="radio-wrap">
                  <input type="radio" v-model="countMonthValue" value="2" checked
                  class="visually-hidden" id="label-second" name="month-value">
                  <label for="label-second" class="label-second">2</label>
                </div>
              </div>
            </div>
            <div class="col-6">
              <button
                class="buttonOk"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="setSetting()"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'SettingManager',
  components: {},
  emits: ['editSettingManager'],
  props: {
    managerSetting: {},
    countMonth: {},
  },
  data() {
    return {
      countMonthValue: 2,
      manager: this.$store.state.userId,
      response: {},
    };
  },
  methods: {
    setSetting() {
      this.$emit('editSettingManager', this.manager, this.countMonthValue, null);
    },
  },
  computed: {},
  watch: {
    countMonth() {
      this.countMonthValue = this.countMonth;
    },
    countMonthValue(newValue) {
      if (newValue > 2) {
        this.countMonthValue = 2;
      }
      if (newValue < 1) {
        this.countMonthValue = 1;
      }
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
  border-radius: 8px;
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
  padding: 0px 20px 20px;
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
  width: 100%;
  color: #ffffff;
  background-color: #C31419;
  border-radius: 5px;
  padding: 14px 16px;
  border: none;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  border-radius: 8px;
}

.month-wrap {
  display: flex;
  align-items: center;
  height: 100%;
}

.radio-wrap {
  width: 100%;
  height: 100%;
}

.radio-wrap label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 2px solid #F2F2F2;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.radio-wrap input:checked + label {
  border-color: #C31419;
  z-index: 5;
}

.label-first {
  border-radius: 8px 0 0 8px;
}
.label-second {
  border-radius: 0 8px 8px 0;
  margin-left: -2px;
}
/* .buttonCancel {
  width: 210px;
  color: #000000;
  background-color: #969696;
  border-radius: 5px;
  border: none;
} */
</style>
