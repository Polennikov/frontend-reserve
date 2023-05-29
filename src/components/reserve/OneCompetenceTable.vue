<template>
  <div>
    <div style="display: flex; justify-content: space-between; padding: 13px">
      <div style="font-weight: bold; font-size: 18px; width: 35%">
        {{ CompetenceName(competence) }}
      </div>
    </div>
    <div
      class="row"
      style="
        height: 64px;
        border-top: 1px rgba(0, 0, 0, 0.05) solid;
        color: rgb(127, 131, 136);
        padding: 23px 0px;
        margin: 0px;
      "
    >
      <div class="col" style="flex: 0 0 auto; width: 35%">Сотрудник</div>
      <template v-for="monthObj in visibleMonths" :key="monthObj">
        <div class="col" style="text-align: center">Факт</div>
        <div class="col" style="text-align: center">Бронь</div>
        <div
          style="
            width: 1px;
            border-right: 1px rgba(0, 0, 0, 0.05) solid;
            margin-bottom: -15px;
            margin-top: -23px;
          "
        ></div>
      </template>
    </div>
    <div v-for="employerName in projectsEmployersFiltered" :key="employerName">
      <div v-if="employerName !== null">
        <div v-if="employerName['competence'] == competence"
           :class="{ 'disable-employer': employerName.dateEnd }">
          <div
            class="row"
            style="
              align-items: center;
              min-height: 64px;
              border-bottom: 1px rgba(0, 0, 0, 0.05) solid;
              border-top: 1px rgba(0, 0, 0, 0.05) solid;
              margin: 0px;
              font-size: 18px;
            "
          >
            <div class="col" style="display: flex; flex: 0 0 auto; width: 35%; align-items: center">
              <a
                :class="{ 'disable-employer': employerName.dateEnd }"
                class="link-employer"
                data-bs-toggle="modal"
                href="#EmployerInfoPopup"
                role="button"
                @click="showEmployerInfo(employerName)"
              >
                {{ employerName["title"] }}
              </a>
              <template v-if="settings">
                <span v-if="settings.lidId === employerName['id']" class="icon-lead"></span>
              </template>
              <a
                v-if="checkEmployerDelete(employerName)"
                class="btn btn-delete mb-1"
                @click="deleteEmployer(employerName)"
              >
              </a>
              <!-- <div v-if="checkOvertime(employer)">
                hello
              </div> -->
            </div>
            <template v-for="monthObj in visibleMonths" :key="monthObj">
              <div class="col">
                <div style="text-align: center; white-space: nowrap">
                  <div v-if="fact[monthObj.month]">
                    <div v-if="fact[monthObj.month][employerName['id']]" class="fact-percent">
                      <div class="fact-percent__percent">
                        {{
                          this.$store.state
                            .hoursOnPercent(
                              fact[monthObj.month][employerName["id"]].toFixed(2),
                              countMountWorkDays[monthObj.month],
                              8
                            )
                            .toFixed(2)
                        }}%
                      </div>
                      <div class="fact-percent__hour">
                        ({{ fact[monthObj.month][employerName["id"]].toFixed(2) }}ч)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col" style="text-align: center">
                <div v-if="plan[monthObj.month]">
                  <template v-if="plan[monthObj.month][employerName['id']] != undefined">
                    <div v-if="allPercentMonth(monthObj.month, employerName['id']) !== 0">
                      <template v-if="!currentManagerName">
                        <a
                            class="info-btn"
                            data-bs-toggle="modal"
                            href="#ManagerInfo"
                        >
                          <div class="plan-percent__percent">
                            {{ allPercentMonth(monthObj.month, employerName["id"]).toFixed(2) }}%
                          </div>
                          <div class="plan-percent__hour">
                            ({{
                              /* eslint-disable */
                              this.$store.state
                              .percentOnHours(
                                  allPercentMonth(monthObj.month, employerName["id"]),
                                  countMountWorkDays[monthObj.month],
                                  8
                              )
                              .toFixed(2)
                            }}ч)
                          </div>
                        </a>
                      </template>
                      <template v-else>
                        <a
                            class="plan-percent"
                            href="#SetReservePopup"
                            :data-bs-target="'#SetReservePopup'"
                            data-bs-toggle="modal"
                            data-bs-dismiss="modal"
                            @click="showEmployerInfo(employerName, monthObj.month, monthObj.year,
                        'history')"
                        >
                          <div class="plan-percent__percent">
                            {{ allPercentMonth(monthObj.month, employerName["id"]).toFixed(2) }}%
                          </div>
                          <div class="plan-percent__hour">
                            ({{
                              /* eslint-disable */
                              this.$store.state
                              .percentOnHours(
                                  allPercentMonth(monthObj.month, employerName["id"]),
                                  countMountWorkDays[monthObj.month],
                                  8
                              )
                              .toFixed(2)
                            }}ч)
                          </div>
                        </a>
                      </template>
                    </div>
                    <div v-else-if="checkEmployerExist(employerName, monthObj.month, monthObj.year)">
                      <template v-if="!currentManagerName">
                        <a
                            class="btn btn-add"
                            data-bs-toggle="modal"
                            href="#ManagerInfo"
                        ></a>
                      </template>
                      <template v-else>
                        <a
                            class="btn btn-add"
                            data-bs-toggle="modal"
                            href="#SetReservePopup"
                            :data-bs-target="'#SetReservePopup'"
                            @click="showEmployerInfo(employerName, monthObj.month, monthObj.year,
                        'reserve')"
                        >
                        </a>
                      </template>
                    </div>
                  </template>
                  <template v-else-if="checkEmployerExist(employerName, monthObj.month, monthObj.year)">
                    <template v-if="!currentManagerName">
                      <a
                          class="btn btn-add"
                          data-bs-toggle="modal"
                          href="#ManagerInfo"
                      ></a>
                    </template>
                    <template v-else>
                      <a
                          class="btn btn-add"
                          data-bs-toggle="modal"
                          href="#SetReservePopup"
                          :data-bs-target="'#SetReservePopup'"
                          @click="showEmployerInfo(employerName, monthObj.month, monthObj.year, 'reserve')"
                      >
                      </a>
                    </template>
                  </template>
                </div>
              </div>
              <div
                style="
                  width: 1px;
                  border-right: 1px rgba(0, 0, 0, 0.05) solid;
                  margin-bottom: -23px;
                  margin-top: -23px;
                "
              ></div>
              <alert-popup
                :employer="employerName"
                :month="monthObj.month"
                :year="monthObj.year"
                :headerText="'Предупреждение!'"
                :mainText="'Вы действительно хотите удалить данную бронь?'"
                @changeAlert="changeAlert"
              >
              </alert-popup>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AlertPopup from '@/components/modals/AlertPopup.vue';

export default {
  name: 'OneCompetenceTable',
  emits: ['showEmployerInfo', 'updatePlan', 'deleteEmployer'],
  components: {
    AlertPopup,
  },
  props: {
    competence: {},
    currentProject: {},
    chosenEmployer: {},
    fact: {},
    plan: {},
    visibleMonths: {},
    projectsEmployers: {},
    countMountWorkDays: {},
    currentProjectName: {},
    settings: {},
    employersList: {},
    managersList: {},
    projectsList: {},
    currentManagerName: {},
  },
  data() {
    return {
      vueAlertCheck: false,
      managerId: this.$store.state.userId,
      currentMonth: new Date().getMonth() + 1,
      currentYear: new Date().getFullYear(),
    };
  },
  methods: {
    async deleteEmployerReserve(employerId, monthNum, yearNum) {
      const postParams = {
        data:
          {
            manager: this.$store.state.userId,
            project: this.currentProject,
            employer: employerId,
            year: yearNum,
            month: monthNum,
            percent: null,
          },
      };
      const result = await axios.delete(`${this.$store.state.apiUrl}/reserve/delete?token=${this.$store.state.token}`, postParams);
      console.log(result);
      this.updatePlan();
      this.vueAlertCheck = false;
    },
    updatePlan() {
      this.$emit('updatePlan');
    },
    showEmployerInfo(employer, month, year, modalModifer) {
      this.$emit('showEmployerInfo', employer, month, year, modalModifer);
    },
    CompetenceName(value) {
      if (value === '') {
        return 'Компетенция не указана';
      }
      return value;
    },
    changeAlert(vueAlertCheck, employer, month, year) {
      if (vueAlertCheck === true) {
        this.deleteEmployerReserve(employer, month, year);
      }
    },
    checkEmployerExist(employerName, month, year) {
      let value = true;
      if (this.currentMonth > month && this.currentYear >= year) {
        value = false;
      }
      if (employerName.dateEnd) {
        value = false;
      }
      return value;
    },
    checkEmployerDelete(employerName) {
      let value = true;
      const planArr = Object.entries(this.plan);
      this.visibleMonths.forEach((monthObj) => {
        planArr.forEach((planObj) => {
          if (String(planObj[0]) === String(monthObj.month)) {
            if (planObj[1]) {
              if (planObj[1][employerName.id]) {
                value = false;
              }
            }
          }
        });
        const factArr = Object.entries(this.fact);
        factArr.forEach((factObj) => {
          if (String(factObj[0]) === String(monthObj.month)) {
            if (factObj[1]) {
              if (factObj[1][employerName.id]) {
                value = false;
              }
            }
          }
        });
      });
      return value;
    },
    deleteEmployer(employerName) {
      this.$emit('deleteEmployer', employerName);
    },
    checkOvertime(employer) {
      /* eslint-disable */
      for (let i = 0; i <= this.visibleMonths.length - 1; i += 1) {
        if (
          this.visibleMonths[i].month < this.currentMonth &&
          this.plan[this.visibleMonths[i].month][employer][this.managerId] != undefined
        ) {
          console.log(
            this.visibleMonths[i].month,
            this.plan[this.visibleMonths[i].month][Number(employer)][Number(this.managerId)][
              "percent"
            ],
            this.countMountWorkDays[this.visibleMonths[i].month]
          );
          if (
            this.percentOnHours(
              this.plan[this.visibleMonths[i].month][Number(employer)][Number(this.managerId)][
                "percent"
              ],
              this.countMountWorkDays[this.visibleMonths[i].month]
            ) > this.fact[this.visibleMonths[i].month][employer]
          ) {
            return true;
          }
        }
        return false;
      }
      /* eslint-enable */
      return false;
    },
    allPercentMonth(month, employerId) {
      let value = 0;
      Object.entries(this.plan[month]).forEach((planMonth) => {
        if (parseFloat(planMonth[0]) === employerId) {
          Object.entries(planMonth[1]).forEach((item) => {
            value += item[1].percent;
          });
        }
      });
      return value;
    },
  },
  mounted() {},
  computed: {
    projectsEmployersFiltered() {
      const filteredObject = {};
      Object.keys(this.projectsEmployers).forEach((key) => {
        if (filteredObject[key] === undefined) {
          filteredObject[key] = this.projectsEmployers[key];
        }
      });
      return filteredObject;
    },
  },
  watch: {},
};
</script>

<style scoped>
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
  margin-left: 8px;
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

a {
  text-decoration: none;
  color: black;
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

.plan-percent {
  font-size: 16px;
  border-bottom: 1px dashed #969696;
}

.fact-percent {
  font-size: 16px;
}

@media (min-width: 1400px) {
  .plan-percent,
  .fact-percent {
    display: inline-flex;
    justify-content: center;
    white-space: nowrap;
  }
  .plan-percent__hour,
  .fact-percent__hour {
    margin-left: 5px;
  }
}

.disable-employer {
  color: #5c636a;
}

a:hover {
  color: #c21418;
}
.nav-btns {
  display: inline-block;
}
@media (max-width: 1600px) {
  .nav-btns {
    display: block;
  }
}
</style>
