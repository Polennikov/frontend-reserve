<template>
  <div
    class="modal"
    id="EmployerInfoPopup"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-info-popup">
      <div class="modal-content">
        <div class="modal-header" style="display: block ruby;">
          <div class="modal-title">{{ employer.title }}</div>
          <template v-if="employer.id">
            <a
              class="btn btn--icon btn-setting mb-1"
              href="#SettingEmployer"
              :data-bs-target="'#SettingEmployer' + employer.id"
              data-bs-toggle="modal"
              data-bs-dismiss="modal"
            >
            </a>
          </template>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close">
          </button>
        </div>
        <div class="modal-body">
          <div class="container-fluid">
            <div
              class="row mb-2"
              v-if="(employer.competence || employer.grade) && !employer.dateEnd"
            >
              <div
                class="col col-12"
                style="display: flex;"
                v-if="employer.competence"
              >
                <div style="display: flex">
                  <div style="color: #7f8388;">Компетенция:</div>
                  <div style="font-style: normal;
                    font-weight: bold;
                    font-size: 18px;
                    line-height: 24px;
                    margin-left: 5px;
                    ">
                    {{ employer.competence }}
                  </div>
                </div>
                <div style="display: flex">
                  <div style="margin-left: 30px; color: #7f8388;">Грейд:</div>
                  <div style="font-style: normal;
                  font-weight: bold;
                  font-size: 18px;
                  line-height: 24px;
                  margin-left: 5px;
                  ">
                    {{ employer.grade }}
                  </div>
                </div>
                <div style="display: flex; margin-left: auto;" v-if="currentMonthCheck()">
                  <div style="margin-left: 30px; color: #7f8388">Свободен на:</div>
                  <div style="font-style: normal;
                    font-weight: bold;
                    font-size: 18px;
                    color: #C31419;
                    line-height: 24px;
                    margin-left: 5px;">{{ freePercent[currentMonth] }}%
                    ({{ freeHours[currentMonth] }}ч)</div>
                </div>
              </div>
            </div>
            <div
              v-else
              style="color: #C31419;
              font-weight: 600;
              font-size: 16px;
              line-height: 19px;
              margin-left: 10px;
              display: flex;
              justify-content: flex-end;"
            >
              Уволен
            </div>
            <div class="row">
              <div class="col-6">
                <div v-if="employer.employment !== null" style="display: flex">
                  <div style="color: #7f8388;">Оформлен:</div>
                  <div style="font-style: normal;
                  font-weight: bold;
                  font-size: 18px;
                  line-height: 24px;
                  margin-left: 5px;
                  ">
                    {{ employer.employment }}
                  </div>
                </div>
              </div>
              <div class="col-6">
                <template v-if="absent.length > 0">
                  <div style="color:#969696;margin-left:auto;display: flex;
                  justify-content: flex-end;align-items: center">
                    Отпуск:
                    <button v-if="absent[1]" type="button" class="btn btn-info"
                      data-bs-toggle="tooltip"
                      :custom-class="'bs-tooltip-content'"
                      data-bs-placement="bottom" v-bind:data-bs-title="absentTooltip">
                    </button>
                    <div style="color: #000; margin-left: 5px;font-weight:600">
                      с {{ absent[0][0].dateFrom }}
                      по {{ absent[0][0].dateTo }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div style=" border-top: 1px rgba(0, 0, 0, 0.05) solid; margin: 20px -27px;"></div>
            <div style="display: flex;width: 100%;justify-content: space-between;
            font-weight: bold;">
              <MonthSelect
                :employer="employer"
                :visibleMonthsUpdate="visibleMonthsUpdate"
                :countMonth="countMonth"
                @updateMonthSelect="updateMonthSelect"
              >
              </MonthSelect>
            </div>
            <div style=" border-top: 1px rgba(0, 0, 0, 0.05) solid; margin: 20px -27px;"></div>
            <div class="row" style="margin-top: -23px;border-bottom: 1px solid rgba(0, 0, 0, 0.05);
              margin-bottom: -1px;">
              <div
                v-for="(monthObj, index) in visibleMonths"
                :key="monthObj.year + monthObj.month"
                class="col"
                style="padding: 0px;width: 50%;"
                :class="{ border_right: index == 0 }"
              >
                <div
                  class="row-info-header"
                  :class="{ border_left: index == 1  }"
                  style="border-bottom: 1px rgba(0, 0, 0, 0.05) solid;"
                >
                  <div
                    class="col-6 project-name"
                    style="padding-left: 20px;"
                  >
                    <div style="color: #7f8388;">Проект</div>
                  </div>
                  <div
                    class="col-3 project-name"
                  >
                    <div style="color: #7f8388; text-align: center">Факт</div>
                  </div>
                  <div
                    class="col-3 project-name"
                    style="text-align: center"
                  >
                    <div style="color: #7f8388;">Общая бронь</div>
                  </div>
                </div>
                <template
                  v-for="usingProjectItem in usingProject[monthObj.month]"
                  :key="usingProjectItem.id"
                >
                  <template
                    v-for="project in projectsList"
                    :key="project.id"
                  >
                    <template
                      v-if="hasActivity(monthObj.year, monthObj.month, project.id)
                    && project.id === usingProjectItem"
                  >
                    <div
                      class="row-info"
                    >
                      <div
                        class="project-name col-6"
                        style="padding-left: 20px"
                      >
                        {{ project.title }}
                        <template v-if="checkLidProject(employer['id'], project.id)">
                          <span
                            class="icon-lead"></span>
                        </template>
                      </div>
                      <div
                        class="col-3"
                      >
                          <span
                            class="col-fact"
                            style="text-align: center"
                          >
                            <div
                                v-if="fact[monthObj.month][project.id]">
                               <template v-if="isNaN(
                                   this.$store.state.hoursOnPercent(
                                   fact[monthObj.month][project.id]['hours'],
                                   countMountWorkDays[monthObj.month],
                                   hoursWork()
                                  ).toFixed(2))">
                                <div class="spinner-border text-danger" role="status"></div>
                              </template>
                            <template v-else>
                              <div class="fact-percent__percent">
                                {{
                                  this.$store.state.hoursOnPercent(
                                      fact[monthObj.month][project.id]['hours'],
                                      countMountWorkDays[monthObj.month],
                                      hoursWork()
                                  ).toFixed(2)
                                }}%
                              </div>
                            </template>
                               <div class="fact-percent__hour">
                                ({{
                                  fact[monthObj.month][project.id]['hours']
                                }}ч)
                               </div>
                            </div>
                          </span>
                      </div>
                      <div
                        class="col-3"
                        style="margin-bottom: -5px;
                        margin-top: -5px;
                        text-align: center;"
                      >
                        <template v-if="plan[monthObj.month]">
                          <template v-if="plan[monthObj.month][project.id]">
                            <template v-if="plan[monthObj.month][project.id].allPercent > 0">
                              <a
                                class="plan-percent"
                                href="#plan"
                                :data-bs-target="'#plan-' + monthObj.year + '-'
                              + monthObj.month + '-' + project.id"
                                data-bs-toggle="modal"
                                data-bs-dismiss="modal"
                              >
                                <div class="plan-percent__percent">
                                  {{
                                    plan[monthObj.month][project.id].allPercent.toFixed(2)
                                  }}%
                                </div>
                                <template v-if="isNaN(this.$store.state.percentOnHours(plan
                                  [monthObj.month][project.id].allPercent,
                                  countMountWorkDays[monthObj.month],
                                  hoursWork()).toFixed(2))">
                                  <div class="spinner-border text-danger" role="status"></div>
                                </template>
                                <template v-else>
                                  <div class="plan-percent__hour">
                                    ({{
                                      this.$store.state.percentOnHours(
                                          plan[monthObj.month][project.id].allPercent,
                                          countMountWorkDays[monthObj.month],
                                          hoursWork()
                                      ).toFixed(2)
                                    }}ч)
                                  </div>
                                </template>
                              </a>
                            </template>
                          </template>
                        </template>
                      </div>
                    </div>
                    <div style="border-top: 1px rgba(0, 0, 0, 0.05) solid;"></div>
                    </template>
                  </template>
                </template>
              </div>
            </div>
            <div class="employer-info__footer employer-info-outro row">
              <div class="employer-info-outro__item col-6"
                   :class="{ employerItem100 : (countMonth === 1) }"
                   v-for="(item, idx) in visibleMonths" :key="idx">
                <div class="row">
                  <div class="employer-info-outro__caption col-6">
                    <template v-if="idx < 1">Итого</template>
                  </div>
                  <div class="employer-info-outro__hours col-3">
                    {{
                      this.$store.state.hoursOnPercent(parseFloat(sumHours(
                          item.month, 'fact')),
                          countMountWorkDays[item.month],
                          hoursWork()).toFixed(2)}}%
                    ({{sumHours(item.month, 'fact').toFixed(2)}}ч)
                  </div>
                  <div class="employer-info-outro__hours col-3">
                    {{sumHours(item.month, 'plan').toFixed(2)}}%
                    ({{this.$store.state.percentOnHours(sumHours(item.month, 'plan').toFixed(2),
                      countMountWorkDays[item.month],
                      hoursWork()).toFixed(2)}}ч)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <template
    v-for="monthObj in visibleMonths"
    :key="monthObj.month + monthObj.year"
  >
    <template
      v-for="project in projectsList"
      :key="project.id"
    >
      <history-plan
        :year="monthObj.year"
        :month="monthObj.month"
        :employer="employer"
        :currentProject="project.id"
        :currentProjectName="project.title"
        :managersList="managersList"
        :plan="plan"
      ></history-plan>
      <setting-employer
        :employer="employer"
        :settings="settings"
        @getEmployers="getEmployers"
      ></setting-employer>
    </template>
  </template>
</template>

<script>

import axios from 'axios';
import MonthSelect from '@/components/MonthSelect.vue';
import SettingEmployer from '@/components/modals/SettingEmployer.vue';
import HistoryPlan from '@/components/modals/HistoryPlan.vue';

export default {
  name: 'EmployerInfoPopup',
  emits: ['getEmployers'],
  components: {
    MonthSelect,
    SettingEmployer,
    HistoryPlan,
  },
  props: {
    employer: {},
    projectsList: {},
    managersList: {},
    employersList: {},
    countMonth: {},
    visibleMonthsUpdate: null,
  },
  data() {
    return {
      visibleMonths: [],
      fact: {},
      plan: {},
      project: {},
      currentMonth: new Date().getMonth() + 1,
      currentYear: new Date().getFullYear(),
      managerId: this.$store.state.userId,
      absent: {},
      settings: 8,
      countAbsentDays: 0,
      weekSum: 0,
      usingProject: {},
      idB24: '',
      freePercent: {},
      freeHours: {},
      countMountWorkDays: {},
    };
  },
  methods: {
    async getEmployerCardInfo(employer, month, year) {
      const response = await axios.get(`${this.$store.state.apiUrl}/info/employer`, {
        params: {
          token: this.$store.state.token,
          employer,
          month,
          year,
          idB24: this.idB24,
          settingHours: this.hoursWork(),
        },
      });
      this.plan[month] = response.data.plan;
      this.fact[month] = response.data.fact;
      if (response.data.calendar.length > 0) {
        this.absent.push(response.data.calendar);
      }
      this.freePercent[month] = parseFloat(response.data.freePercent).toFixed(2);
      this.freeHours[month] = parseFloat(response.data.freeHours).toFixed(2);
      this.usingProject[month] = this.sortReserveFact(month, this.fact[month], this.plan[month]);
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
    getEmployers(id) {
      this.$emit('getEmployers');
      this.getSettingEmployer(id);
    },
    sortReserveFact(month, fact, plan) {
      const factArr = Object.entries(fact);
      const factArr1 = Object.entries(fact);
      const planArr = Object.entries(plan);
      const planArr1 = Object.entries(plan);
      const projectsListArray = Object.entries(this.projectsList);
      const arrayTmp = {};
      factArr.forEach((factItem) => {
        let tmp = 0;
        factArr1.forEach((factItem1) => {
          // eslint-disable-next-line max-len
          if ((factItem1[1].hours > factItem[1].hours) && (factItem[0] !== factItem1[0])) {
            tmp += 1;
          }
        });
        while (arrayTmp[tmp]) {
          tmp += 1;
        }
        projectsListArray.forEach((projectsListArrayItem) => {
          if (projectsListArrayItem[1].id === Number(factItem[0])) {
            arrayTmp[tmp] = projectsListArrayItem[1].id;
          }
        });
      });
      planArr.forEach((item) => {
        let tmp = 0;
        planArr1.forEach((item1) => {
          // eslint-disable-next-line max-len
          if ((item1[1].hours > item[1].hours) && (item[0] !== item1[0])) {
            tmp += 1;
          }
        });
        while (arrayTmp[tmp]) {
          tmp += 1;
        }
        let check = true;
        for (let i = 0; i < (factArr.length + planArr.length); i += 1) {
          if (arrayTmp[i] === Number(item[0])) {
            check = false;
          }
        }
        if (check) {
          projectsListArray.forEach((projectsListArrayItem) => {
            if (projectsListArrayItem[1].id === Number(item[0])) {
              arrayTmp[tmp] = projectsListArrayItem[1].id;
            }
          });
        }
      });
      return arrayTmp;
    },
    currentMonthCheck() {
      let value = false;
      this.visibleMonths.forEach((monthObj) => {
        if (monthObj.month === this.currentMonth) {
          value = true;
        }
      });
      return value;
    },
    updateMonthSelect(newVisibleMonths, newCountMountWorkDays) {
      this.visibleMonths = newVisibleMonths;
      this.countMountWorkDays = newCountMountWorkDays;
      this.queryUserMonthInfo();
    },
    hasActivity(year, month, project) {
      let hasActivity = false;
      if (this.fact[month]) {
        if (this.fact[month][project]) {
          if (this.fact[month][project].hours) {
            hasActivity = true;
          }
        }
      }
      if (this.plan[month]) {
        if (this.plan[month][project]) {
          if (this.plan[month][project].allPercent) {
            hasActivity = true;
          }
        }
      }
      return hasActivity;
    },

    queryUserMonthInfo() {
      this.absent = [];
      if (this.employer.id) {
        this.getSettingEmployer(this.employer.id);
        this.visibleMonths.forEach((monthObj) => {
          this.getEmployerCardInfo(this.employer.id, monthObj.month, monthObj.year);
        });
      }
    },
    sumHours(month, option) {
      let sumHours = 0;
      this.visibleMonths.forEach((item) => {
        if (item.month === month) {
          /* eslint-disable */
          if (option === 'fact') {
            for (let key in this.fact[month]) {
              sumHours += this.fact[month][key].hours;
            }
          } else {
            for (let key in this.plan[month]) {
              sumHours += this.plan[month][key].allPercent;
            }
          }
          /* eslint-enable */
        }
      });
      return sumHours;
    },
    hoursWork() {
      if (this.settings.hoursWork) {
        return this.settings.hoursWork;
      }
      return 8;
    },
    checkLidProject(employerId, projectId) {
      let value = false;
      this.employersList.forEach((item) => {
        if (item.id === employerId) {
          if (item.lidProjectId) {
            item.lidProjectId.forEach((itemLid) => {
              if (itemLid.projectId === projectId) {
                value = true;
              }
            });
          }
        }
      });
      return value;
    },
    initTooltip() {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      // eslint-disable-next-line
      [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
    },
  },
  updated() {
    this.initTooltip();
  },
  computed: {
    absentTooltip() {
      let sumStr = '';
      /* eslint-disable */
      for (let i = 0; i < this.absent.length; i++) {
        if (this.absent[i][0]) {
          sumStr += `с ${this.absent[i][0].dateFrom} по ${this.absent[i][0].dateTo} `;
        }
      }
      /* eslint-enable */
      return sumStr;
    },
  },
  watch: {
    employersList() {
      this.getSettingEmployer(this.employer.id);
    },
  },
};
</script>

<style>
.tooltip {
  max-width: 190px;
}
</style>
<style scoped>
.modal-info-popup {
  max-width: 1300px;
}

.modal-header {
  border: none;
  padding: 25px 20px;
  padding-right: 60px;
  position: relative;
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

.row-info, .row-info-header {
  display: flex;
  align-items: center;
  padding: 20px 0;
  font-size: 16px;
  line-height: 19px;
}

.row-info .project-name, .row-info-header .project-name {
  font-size: inherit;
  line-height: inherit;
  font-weight: 400;
}

@media (min-width: 1400px) {
  .col-fact {
    white-space: nowrap;
  }
  .plan-percent {
    white-space: nowrap;
  }
}

.col-fact div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.plan-percent {
  text-decoration: underline;
  color: #212529;
  cursor: pointer;
}

.plan-percent:hover {
  text-decoration: none;
  color: #c21418;
}

.icon-lead {
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  display: inline-block;
  margin-left: 12px;
  vertical-align: text-top;
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8.63795 1.66836C9.17407 0.506053 10.826 0.506055 11.3621 1.66836L13.0209 5.26451C13.2464 5.75355 13.7169 6.08413 14.2534 6.13064L17.8853 6.44541C19.1393 6.55409 19.7098 8.06585 18.8403 8.97598L16.0081 11.9405C15.6753 12.2889 15.5301 12.776 15.6178 13.2498L16.3911 17.4263C16.6268 18.6997 15.2467 19.6533 14.139 18.9824L10.7772 16.9461C10.2995 16.6567 9.70059 16.6567 9.2229 16.9461L5.86103 18.9824C4.75337 19.6533 3.37321 18.6997 3.60897 17.4263L4.38226 13.2498C4.46998 12.776 4.32476 12.2889 3.99192 11.9405L1.15972 8.97598C0.290215 8.06585 0.860772 6.55409 2.11479 6.44541L5.74664 6.13064C6.28319 6.08413 6.75363 5.75355 6.97921 5.26451L8.63795 1.66836Z' fill='%23969696'/%3E%3C/svg%3E%0A");
}
.border_right {
  margin-right: -1px;
  border-right: 1px solid #F2F2F2;
}
.border_left {
  border-left: 1px solid #F2F2F2;
}
.employer-info-outro {
  display: flex;
  align-items: center;
  padding: 20px 0;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: #C31419;
  position: relative;
}
.employer-info-outro::before {
  content: "";
  width: 1px;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 0;
  background-color: #F2F2F2;
}
.employer-info-outro__caption {
  min-width: 40%;
}
.employer-info-outro__item {
  /* display: flex; */
  /* align-items: center; */
  /* width: 100%; */
  /* white-space: nowrap; */
}
.employerItem100 {
  width: 100%;
}
.employer-info-outro__item:last-child {
  justify-content: flex-end;
  padding-right: 7px;
}
.employer-info-outro__hours {
  /* width: 50%; */
  text-align: center;
  display: flex;
  justify-content: center;
}
.employer-info-outro__hour {
  margin-left: 5px;
}
@media (min-width: 1400px) {
  .plan-percent,
  .fact-percent {
    display: flex;
    justify-content: center;
    white-space: nowrap;
  }
  .plan-percent__hour,
  .fact-percent__hour {
    margin-left: 5px;
  }
}

.btn-info {
  font-size: 0;
  line-height: 0;
  padding: 0;
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin: 0 5px;
  background: transparent;
  border: none;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M14 9.5c0-0.825 0.675-1.5 1.5-1.5h1c0.825 0 1.5 0.675 1.5 1.5v1c0 0.825-0.675 1.5-1.5 1.5h-1c-0.825 0-1.5-0.675-1.5-1.5v-1z'%3E%3C/path%3E%3Cpath d='M20 24h-8v-2h2v-6h-2v-2h6v8h2z'%3E%3C/path%3E%3Cpath d='M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13z'%3E%3C/path%3E%3C/svg%3E");
}

@media (max-width: 1400px) {
  .modal-info-popup {
    max-width: 1100px;
  }
  .col-fact div {
    display: block;
  }
  .employer-info-outro__hours {
    display: block;
  }
  .employer-info-outro__caption {
    min-width: 250px;
  }
  .employer-info-outro__hours {
    width: 128px;
  }
  .employer-info-outro__hour {
    margin-left: 0px;
  }
}
</style>
