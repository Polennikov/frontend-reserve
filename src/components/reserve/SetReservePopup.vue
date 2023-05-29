<template>
  <div
      class="modal fade"
      :id="'SetReservePopup'"
      tabindex="-1"
      aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content modal-content--reserve" v-if="modalIsVisible === 'reserve'">
        <div class="modal-header">
          <button class="modal-back" @click="showHistoryPopup" v-if="checkHistoryPopup"></button>
          <h5 class="modal-title">
            {{ employer.title }}
          </h5>
          <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref="closePopup"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div>
              <template v-if="absent.length > 0">
                <div style="color: #C31419; margin-bottom: 20px;">
                  <template
                      v-for="absentItem in absent"
                      :key="absentItem"
                  >Отсутствие с {{ absentItem.dateFrom }} по {{ absentItem.dateTo }}
                  </template>
                </div>
              </template>
              <div class="modal-month">
                {{ this.$store.state.monthNames[month - 1] }} {{ year }}
              </div>
              <label for="percent-input" class="modal-project">
                Запланированный процент работ по проекту <b>{{ currentProjectName }}</b>
              </label>
              <label for="percent-input" class="modal-person">
                Сотрудник свободен на {{
                  // eslint-disable-next-line max-len
                  (freePercent + currentPercentManager - this.valueConvertHour(valueToReserveModel)).toFixed(2)}}%
                ({{
                  // eslint-disable-next-line max-len
                  (freeHours + this.$store.state.percentOnHours(currentPercentManager, countMountWorkDays, hoursWork()) -
                  // eslint-disable-next-line max-len
                  this.$store.state.percentOnHours(this.valueConvertHour(valueToReserveModel), countMountWorkDays, hoursWork())).toFixed(2)
                }}ч).
              </label>
              <template v-if="checkValue !== ''">
                <div>
                  <div style="display: flex;">
                    <div class="choose-value">
                      <div class="choose-value__item">
                        <input type="radio" value="0" name="choose-value"
                               :id="'input-hours' +  + month + year" checked
                               class="visually-hidden" v-model="checkValue">
                        <label :for="'input-hours' +  + month + year">часы</label>
                      </div>
                      <div class="choose-value__item">
                        <input type="radio" value="1" name="choose-value"
                               :id="'input-percent' +  + month + year"
                               class="visually-hidden" v-model="checkValue">
                        <label :for="'input-percent' +  + month + year">проценты</label>
                      </div>
                    </div>
                    <input
                        type="text"
                        class="form-control form-value"
                        :class="{ 'is-invalid': inputError, 'is-valid': sendSuccess }"
                        id="percent-input"
                        :placeholder="inputPlaceholder"
                        v-model="valueToReserveModel"
                        @input="validateValue"
                    >
                    <button
                        type="button"
                        class="btn btn-save"
                        @click="setReserve"
                    >
                      Сохранить
                    </button>
                  </div>
                  <template v-if="checkValue === '0'">
                    <div class="form-subtitle">
                      Значение в процентах: {{
                        this.$store.state.hoursOnPercent(
                            valueToReserveModel,
                            countMountWorkDays,
                            hoursWork()).toFixed(2)
                      }}%
                    </div>
                  </template>
                  <template v-else>
                    <div class="form-subtitle">
                      Значение в часах: {{
                        this.$store.state.percentOnHours(
                            valueToReserveModel,
                            countMountWorkDays,
                            hoursWork()).toFixed(2)
                      }}ч
                    </div>
                  </template>
                </div>
                <div
                    class="invalid-feedback"
                    v-if="inputError"
                >{{ inputError }}
                </div>
                <div
                    class="valid-feedback"
                    v-if="sendSuccess"
                >{{ sendSuccess }}
                </div>
              </template>
            </div>
          </form>
        </div>
      </div>
      <div class="modal-content modal-content--history" v-else-if="modalIsVisible === 'history'">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ employer.title }}
          </h5>
          <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref="closePopup"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="planExist()"
            class="mt-3">
            <div
              class="mb-3" style="display: flex;"
            >
              <b style="margin-top: 10px;">
                Бронь для проекта "{{ currentProjectName }}"
                за {{ this.$store.state.monthNames[month - 1] }} {{ year }}
              </b>
              <template v-if="
                !plan[employer['id']][managerId]"
              >
                <div class="nav-btns">
                  <a
                      class="btn btn--icon btn-add mb-1 button-add--icon"
                      @click="showReservePopup(employer.id, month,
                                  year)"
                  >
                  </a>
                </div>
              </template>
            </div>
            <div
              class="mb-1"
            >
              <i>Менеджер</i>
            </div>
            <div
              class="accordion accordion-flush"
              :id="'accordion-' + year + '-'
              + month + '-' + currentProject"
            >
              <div
                v-for="(managerObj, index) in managersList"
                :key="index"
              >
                <div v-if="plan">
                  <div v-if="plan[employer.id]">
                    <div v-if="plan[employer.id][index]">
                      <div class="modal-history-wrap" v-if="plan[employer.id][index].percent > 0 ||
                        plan[employer.id][index].percent === 0">
                        <div class="accordion-wrap">
                          <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            :data-bs-target="'#flush-collapse-' + year + '-' + month
                                + '-' + currentProject + '-' + index"
                            aria-expanded="false"
                            :aria-controls="'flush-collapse-' + year + '-' + month
                                + '-' + currentProject + '-' + index"
                          >
                            <div v-if="plan">
                              <div v-if="plan[employer.id]">
                                <div v-if="plan[employer.id][index]">
                                  {{ managerObj.managerName }} -
                                  {{ plan[employer.id][index].percent.toFixed(2) }}%
                                </div>
                              </div>
                            </div>
                          </button>
                          <div
                            :id="'flush-collapse-' + year + '-' + month
                              + '-' + currentProject + '-' + index"
                            class="accordion-collapse collapse"
                            :aria-labelledby="'flush-' + year + '-' + month
                              + '-' + currentProject + '-' + index"
                            :data-bs-parent="'#accordion-' + year + '-'
                              + month + '-' + currentProject"
                          >
                            <div class="accordion-body">
                              <div v-if="plan">
                                <div v-if="plan[employer.id]">
                                  <div v-if="plan[employer.id][index]">
                                    <template
                                      v-if="plan[employer.id][index].history"
                                    >
                                      <div
                                        class="row accordion-row"
                                      >
                                        <div class="col-4 accordion-title">Дата изменения</div>
                                        <div class="col-4 accordion-title"
                                          style="text-align: center">Изменено с</div>
                                        <div class="col-4 accordion-title"
                                          style="text-align: right">Изменено на</div>
                                      </div>
                                      <div
                                        class="row accordion-row"
                                        v-for="historyRow in plan[employer.id]
                                        [index].history"
                                        :key="historyRow.date"
                                      >
                                        <div class="col-4 accordion-content">
                                          {{ historyRow.date }}
                                        </div>
                                        <div class="col-4 accordion-content"
                                          style="text-align: center">
                                          {{ historyRow.old.toFixed(2) }}
                                        </div>
                                        <div class="col-4 accordion-content"
                                          style="text-align: right">
                                          {{ historyRow.new.toFixed(2) }}
                                        </div>
                                      </div>
                                    </template>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <template
                          v-if="
                            new Date().getMonth() + 1 <= month &&
                            new Date().getFullYear() <= year
                          "
                        >
                          <template
                            v-if="
                              plan[employer['id']] &&
                              plan[employer['id']][managerId] &&
                              index == managerId
                            "
                          >
                            <div class="nav-btns">
                              <a
                                class="btn btn--icon btn-edit mb-1"
                                @click="showReservePopup(employer.id, month,
                                  year)"
                              >
                              </a>
                              <a
                                class="btn btn--icon btn-delete mb-1"
                                data-bs-toggle="modal"
                                href="#AlertPopup"
                                :data-bs-target="
                                  '#AlertPopup' + employer.id + month
                                  + year
                                "
                              >
                              </a>
                            </div>
                          </template>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SetReservePopup',
  props: {
    month: {},
    year: {},
    employer: {},
    plan: {},
    countMountWorkDays: {},
    currentProjectName: {},
    currentProject: {},
    employersList: {},
    managersList: {},
    modalModifer: {},
  },
  emits: ['setReserve', 'updatePlan'],
  data() {
    return {
      valueToReserveModel: '',
      inputError: '',
      sendSuccess: '',
      freePercent: 0,
      freeHours: 0,
      currentPercentManager: 0,
      checkValue: '0',
      managerId: this.$store.state.userId,
      absent: {},
      settings: {},
      modalIsVisible: '',
      idB24: '',
    };
  },
  methods: {
    planExist() {
      let value = false;
      if (this.plan !== undefined && this.plan[this.employer.id] !== undefined) {
        value = true;
      } else {
        value = false;
        this.modalIsVisible = 'reserve';
      }
      return value;
    },
    async getReserveFree(currentMonth, currentYear) {
      this.getSettingEmployer(this.employer.id);
      const response = await axios.get(`${this.$store.state.apiUrl}/info/reserve`, {
        params: {
          token: this.$store.state.token,
          month: currentMonth,
          year: currentYear,
          idB24: this.idB24,
          employer: this.employer.id,
          manager: this.managerId,
          project: this.currentProject,
          settingHours: this.hoursWork(),
        },
      });
      this.absent = response.data.calendar;
      this.freePercent = response.data.freePercent;
      this.freeHours = response.data.freeHours;
      this.currentPercentManager = response.data.managerReservePercent;
      this.modalIsVisible = this.modalModifer;
      if (this.currentPercentManager !== 0) {
        this.valueToReserveModel = this.valueConvertPercentInHour(this.currentPercentManager);
      }
    },
    setFirstValueToReserveModel() {
      if (this.plan) {
        if (this.plan[this.employer.id]) {
          if (this.plan[this.employer.id][this.managerId]) {
            if (this.checkValue === '0') {
              this.valueToReserveModel = this.plan[this.employer.id][this.managerId].percent === 0
                ? '' : this.$store.state.percentOnHours(this.plan[this.employer.id][this.managerId].percent,
                  this.countMountWorkDays, this.hoursWork()).toFixed(2);
            } else {
              this.valueToReserveModel = this.plan[this.employer.id][this.managerId].percent === 0
                ? '' : this.plan[this.employer.id][this.managerId].percent.toFixed(2);
            }
          }
        }
      }
    },
    valueConvertHoursInPercent($value) {
      if (this.checkValue === '1') {
        return this.$store.state.hoursOnPercent($value,
          this.countMountWorkDays, this.hoursWork()).toFixed(2);
      }
      return $value;
    },
    valueConvertPercent($value) {
      if (this.checkValue === '1') {
        return this.$store.state.percentOnHours($value,
          this.countMountWorkDays, this.hoursWork()).toFixed(2);
      }
      return $value;
    },
    valueConvertPercentInHour($value) {
      if (this.checkValue === '0') {
        return this.$store.state.percentOnHours($value,
          this.countMountWorkDays, this.hoursWork()).toFixed(2);
      }
      return $value;
    },
    valueConvertHour($value) {
      if (this.checkValue === '0') {
        return this.$store.state.hoursOnPercent($value,
          this.countMountWorkDays, this.hoursWork()).toFixed(2);
      }
      return $value;
    },
    setReserve() {
      if (this.checkIdenticalValue()) {
        if (this.validateValue()) {
          if (this.checkValue === '0') {
            this.valueToReserveModel = this.$store.state.hoursOnPercent(this.valueToReserveModel,
              this.countMountWorkDays,
              this.hoursWork());
          }
          this.$emit('setReserve', Number(this.valueToReserveModel), this.employer.id, this.year, this.month);
          this.sendSuccess = 'Сохранено';
          this.valueToReserveModel = this.$store.state.percentOnHours(this.valueToReserveModel,
            this.countMountWorkDays,
            this.hoursWork());
          this.$emit('updatePlan');
        }
      } else {
        this.inputError = 'Укажите другое значение!';
        this.sendSuccess = '';
      }
    },
    checkIdenticalValue() {
      let value = true;
      if (this.plan) {
        if (this.plan[this.employer.id]) {
          if (this.plan[this.employer.id][this.managerId]) {
            let val = 0;
            if (this.checkValue === '0') {
              // eslint-disable-next-line max-len
              val = this.$store.state.percentOnHours(this.plan[this.employer.id][this.managerId].percent,
                this.countMountWorkDays,
                this.hoursWork()).toFixed(2);
            } else {
              // eslint-disable-next-line max-len
              val = (this.plan[this.employer.id][this.managerId].percent).toFixed(2);
            }
            if (parseFloat(this.valueToReserveModel) === parseFloat(val)) {
              value = false;
            }
          }
        }
      }
      if (parseFloat(this.valueToReserveModel) === 0) {
        value = false;
      }
      return value;
    },
    validateValue() {
      let valid = false;
      if (this.checkValue === '1') {
        if (this.valueToReserveModel === ''
            || Number.isNaN(Number(this.valueToReserveModel))
            || Number(this.valueToReserveModel) < 0
            || Number(this.valueToReserveModel) > 100) {
          this.inputError = 'Введите число от 0 до 100';
          this.sendSuccess = '';
        } else if (this.valueToReserveModel !== '') {
          if (this.valueToReserveModel
              // eslint-disable-next-line max-len
              > parseFloat(this.freePercent) + parseFloat(this.currentPercentManager)) {
            this.inputError = 'Укажите корректный процент!';
            this.sendSuccess = '';
          } else {
            this.inputError = '';
            valid = true;
          }
        } else {
          valid = true;
        }
      } else if (this.checkValue === '0') {
        if (this.valueToReserveModel === ''
            || Number.isNaN(Number(this.valueToReserveModel))
            || this.valueToReserveModel
            // eslint-disable-next-line max-len
            > parseFloat(this.freeHours) + this.$store.state.percentOnHours(this.currentPercentManager, this.countMountWorkDays, this.hoursWork())
        ) {
          this.inputError = 'Укажите корректное время!';
          this.sendSuccess = '';
        } else {
          this.inputError = '';
          this.sendSuccess = '';
          valid = true;
        }
      }
      return valid;
    },
    updatePage() {
      this.inputError = '';
      this.sendSuccess = '';
      this.valueToReserveModel = '';
      if (this.month && this.year) {
        this.getSettingEmployer(this.employer.id);
        this.getReserveFree(this.month, this.year);
        this.setFirstValueToReserveModel();
      }
    },
    hoursWork() {
      if (this.settings.hoursWork) {
        return this.settings.hoursWork;
      }
      return 8;
    },
    showHistoryPopup() {
      this.modalIsVisible = 'history';
    },
    showReservePopup() {
      this.modalIsVisible = 'reserve';
    },
    getSettingEmployer(id) {
      this.employersList.forEach((item) => {
        if (item.id === id && item.settings) {
          this.settings = item.settings;
        }
        if (item.id === id && item.idB24) {
          this.idB24 = item.idB24;
        }
      });
    },
  },
  mounted() {
  },
  computed: {
    inputPlaceholder() {
      return (this.checkValue === '0') ? 'Значение в часах' : 'Значение в процентах';
    },
    checkHistoryPopup() {
      return (this.plan !== undefined) ? this.plan[this.employer.id] : null;
    },
  },
  watch: {
    modalModifer(newValue) {
      this.modalIsVisible = newValue;
    },
    employer() {
      if (this.employer.id) {
        this.modalIsVisible = '';
        this.updatePage();
      }
    },
    checkValue() {
      this.setFirstValueToReserveModel();
    },
    plan: {
      handler() {
        if (this.employer.id) {
          this.updatePage();
        }
      },
      deep: true,
    },
    employersList() {
      this.getSettingEmployer(this.employer.id);
    },
  },
};
</script>

<style scoped>
.modal {
  z-index: 1000;
}
.modal-dialog {
  max-width: 610px;
}
.modal-header {
  padding: 25px 20px 20px;
}
.modal-body {
  padding: 20px;
}
.modal-title {
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
}
.modal-month {
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  margin-bottom: 20px;
}
.modal-project {
  margin-bottom: 20px;
}
.modal-person {
  margin-bottom: 30px;
}

.btn-save {
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  padding: 14px 16px;
  background: #C31419;
  border-radius: 8px;
}

.btn-save:hover {
  background: #d43539;
  color: #ffffff;
}

.invalid-feedback {
  display: block;
}

.valid-feedback {
  display: block;
}

.choose-value {
  display: flex;
  align-items: center;
}
.choose-value__item label {
  font-size: 16px;
  line-height: 19px;
  padding: 14px 16px;
  border: 2px solid #F2F2F2;
  cursor: pointer;
  position: relative;
  z-index: 1;
}
.form-value {
  margin: 0 20px;
  border: 2px solid #F2F2F2;
  border-radius: 8px;
}
.form-subtitle {
  margin-top: 10px;
  margin-left: 207px;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #969696;
}

.invalid-feedback {
  margin-left: 207px;
}

.choose-value__item:first-child label {
  border-radius: 8px 0 0 8px;
}

.choose-value__item:last-child label {
  border-radius: 0 8px 8px 0;
  margin-left: -2px;
}

.choose-value__item input:checked + label {
  border-color: #C31419;
  z-index: 2;
}

.btn-close {
  opacity: 1;
  padding: 0;
  align-self: flex-start;
  width: 24px;
  height: 24px;
  background-size: contain;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 7L17 17' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M17 7L7 17' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E%0A");
}
.accordion {
  /* margin-top: -15px; */
}
.accordion-button {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  color: #000000;
  padding: 14px 16px;
  width: 100%;
  box-shadow: none;
}

.accordion-button::after {
  width: 12px;
  height: 8px;
  background-size: contain;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='black' stroke-width='2'/%3E%3C/svg%3E%0A");
}

.accordion-body {
  width: calc(100% - 130px);
  padding: 0;
  padding-top: 20px;
}
.accordion-wrap {
  width: calc(100% - 130px);
}
.accordion-title {
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #969696;
  font-style: italic;
}
.accordion-content {
  font-weight: 400;
  font-size: 13px;
  line-height: 17px;
  color: #000000;
}
.accordion-row:not(:last-child) {
  margin-bottom: 20px;
}

.btn--icon {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 15px;
  padding: 0;
}

.btn--icon + .btn--icon {
  margin-left: 10px;
}

.btn-add {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 22px;
  height: 22px;
}

.btn-add:hover,
.btn-edit:hover {
  opacity: 1;
}

.btn-add {
  background-size: 24px;
  background-image: url("~@/assets/plus.svg");
}

.btn-edit {
  background-image: url("~@/assets/edit.svg");
}

.btn-delete {
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='14' viewBox='0 0 10 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 6C10 5.44772 9.55229 5 9 5C8.44772 5 8 5.44772 8 6H10ZM2 6C2 5.44772 1.55228 5 1 5C0.447715 5 0 5.44772 0 6H2ZM8 6V11H10V6H8ZM7 12H3V14H7V12ZM2 11V6H0V11H2ZM3 12C2.44772 12 2 11.5523 2 11H0C0 12.6569 1.34315 14 3 14V12ZM8 11C8 11.5523 7.55228 12 7 12V14C8.65685 14 10 12.6569 10 11H8Z' fill='black'/%3E%3Crect y='1' width='10' height='2' rx='1' fill='black'/%3E%3Crect x='4' y='5' width='2' height='5' rx='1' fill='black'/%3E%3Crect x='4' width='2' height='3' rx='1' fill='black'/%3E%3C/svg%3E%0A");
  background-size: 10px 14px;
  background-repeat: no-repeat;
  background-position: center;
}

.modal-back {
  width: 9px;
  height: 14px;
  margin-right: 10px;
  background-size: contain;
  border: none;
  padding: 0;
  background-color: transparent;
  background-image: url("data:image/svg+xml,%3Csvg width='9' height='14' viewBox='0 0 9 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 1L2 7L8 13' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E%0A");
}

.modal-history-wrap {
  display: flex;
  align-items: flex-start;
  margin-top: 20px;
}

.nav-btns {
  display: flex;
  margin-left: 20px;
}

.btn--icon {
  width: 48px;
  height: 48px;
}

.button-add--icon {
  padding: 14px;
  background-size: 10px;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='4' width='2' height='10' rx='1' fill='%23C31419'/%3E%3Crect x='10' y='4' width='2' height='10' rx='1' transform='rotate(90 10 4)' fill='%23C31419'/%3E%3C/svg%3E%0A");
}

</style>
