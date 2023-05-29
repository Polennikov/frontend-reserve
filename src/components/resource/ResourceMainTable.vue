<template>
  <div class="main-table px-4 pt-3 pb-2 mb-4">
    <div class="row px-2 pb-1 mb-2" style="background: #ffffff; border-radius: 5px;">
      <div class="col">
        <template v-if="competenceCheck !== null">
          <div style="display: flex;justify-content: space-between;padding: 13px;">
            <div style="line-height: inherit;width: 35%;">
            </div>
            <div style="display: flex;width: 65%;justify-content: inherit;font-weight: bold;">
              <MonthSelect
                :countMonth="1"
                @updateMonthSelect="updateMonthSelect"
              >
              </MonthSelect>
            </div>
          </div>
          <div class="row" style="    color: rgb(127, 131, 136); padding: 13px;">
            <div class="col" style="flex: 0 0 auto;width: 35%;">
              Сотрудник
            </div>
            <template
              v-for="monthObj in visibleMonths"
              :key="monthObj"
            >
              <div class="col" style="text-align: center;">
                Инкубатор
              </div>
              <div class="col" style="text-align: center;">
                Резерв на проектах
              </div>
            </template>
          </div>
          <employer-resource-table
            :competenceResource="competenceResource"
            :countMountWorkDays="countMountWorkDays"
            :visibleMonths="visibleMonths"
            :fact="fact"
            :plan="plan"
            :struct="maxFact"
            @showEmployerInfo="showEmployerInfo"
          ></employer-resource-table>
          <employer-resource-table
            :competenceResource="competenceResource"
            :countMountWorkDays="countMountWorkDays"
            :visibleMonths="visibleMonths"
            :fact="fact"
            :plan="plan"
            :struct="minPlan"
            @showEmployerInfo="showEmployerInfo"
          ></employer-resource-table>
          <employer-resource-table
            :competenceResource="competenceResource"
            :countMountWorkDays="countMountWorkDays"
            :visibleMonths="visibleMonths"
            :fact="fact"
            :plan="plan"
            :struct="fullPlan"
            @showEmployerInfo="showEmployerInfo"
          ></employer-resource-table>
          <employer-resource-table
            :competenceResource="competenceResource"
            :countMountWorkDays="countMountWorkDays"
            :visibleMonths="visibleMonths"
            :fact="fact"
            :plan="plan"
            :struct="goodWork"
            @showEmployerInfo="showEmployerInfo"
          ></employer-resource-table>
        </template>
      </div>
    </div>
  </div>
  <template
    v-if="chosenEmployer"
  >
    <employer-info-popup
      :visibleMonthsUpdate="visibleMonths"
      :employer="chosenEmployer"
      :projectsList="projectsList"
      :managersList="managersList"
      :employersList="employersList"
      :countMonth="countMonth"
      @getEmployers="getEmployers"
    ></employer-info-popup>
  </template>
</template>
<script>

import axios from 'axios';
import EmployerResourceTable from '@/components/resource/EmployerResourceTable.vue';
import MonthSelect from '@/components/MonthSelect.vue';
import EmployerInfoPopup from '@/components/employer/EmployerInfoPopup.vue';

export default {
  name: 'ResourceMainTable',
  components: {
    EmployerResourceTable,
    MonthSelect,
    EmployerInfoPopup,
  },
  emits: ['getEmployers'],
  props: {
    employersList: Object,
    projectsList: {},
    managersList: {},
    competenceCheck: {},
    countMonth: {},
  },
  data() {
    return {
      chosenEmployer: {},
      countMountWorkDays: {},
      visibleMonths: [],
      competenceResource: {},
      fact: {},
      plan: {},
      arrayTmp: {},
      maxFact: {},
      minPlan: {},
      goodWork: {},
      fullPlan: {},
      tmp: 0,
    };
  },
  methods: {
    showEmployerInfo(employer) {
      this.chosenEmployer = employer;
    },
    updateMonthSelect(newVisibleMonths, newCountMountWorkDays) {
      this.visibleMonths = newVisibleMonths;
      this.countMountWorkDays = newCountMountWorkDays;
      this.maxFact = {};
      this.minPlan = {};
      this.fullPlan = {};
      this.goodWork = {};
      this.queryReserveEmployer(this.competenceCheck);
    },
    getEmployers() {
      this.$emit('getEmployers');
    },
    async queryReserveMonth(monthNum, yearNum) {
      const response = await axios.get(`${this.$store.state.apiUrl}/resource`, {
        params: {
          token: this.$store.state.token,
          competence: this.competenceCheck,
          month: monthNum,
          year: yearNum,
        },
      });
      this.fact[monthNum] = response.data.reserveArray.freeTime;
      this.plan[monthNum] = response.data.reserveArray.planPercent;
      this.reserveFactTable(this.fact, this.plan, this.visibleMonths[0].month);
    },
    async queryReserveEmployer(competence) {
      if (competence) {
        const response = await axios.get(`${this.$store.state.apiUrl}/employer/competence`, {
          params: {
            token: this.$store.state.token,
            competence,
          },
        });
        this.competenceResource = response.data.employers;
        this.maxFact = {};
        this.minPlan = {};
        this.fullPlan = {};
        this.goodWork = {};
        if (this.visibleMonths.length > 1) {
          this.visibleMonths.shift();
        }
        this.queryReserveMonth(this.visibleMonths[0].month, this.visibleMonths[0].year);
      }
    },
    sortReserveFact(arrays, month, data) {
      const array = Object.entries(arrays);
      const array1 = Object.entries(arrays);
      this.arrayTmp = {};
      array.forEach((item) => {
        let tmp = 0;
        array1.forEach((item1) => {
          // eslint-disable-next-line max-len
          if ((data[month][item[1]] < data[month][item1[1]]) && (item[1] !== item1[1])) {
            tmp += 1;
          }
        });
        while (this.arrayTmp[tmp]) {
          tmp += 1;
        }
        this.arrayTmp[tmp] = Number(item[1]);
      });
      return this.arrayTmp;
    },
    reserveFactTable(fact, plan, month) {
      this.competenceResource.forEach((compObj, index) => {
        if (!compObj.dateEnd && compObj.intaroHours !== '0') {
          if (fact[month][compObj.id]) {
            if (this.$store.state.hoursOnPercent(fact[month][compObj.id],
              this.countMountWorkDays[month],
              8) >= 30) {
              this.maxFact[index] = compObj.id;
            }
          }
          if (!this.maxFact[index]) {
            if (fact[month][compObj.id] !== 0) {
              this.minPlan[index] = compObj.id;
            }
          }
          if (!this.maxFact[index] && !this.minPlan[index]) {
            if (plan[month][compObj.id] < 90 && fact[month][compObj.id] === 0) {
              this.fullPlan[index] = compObj.id;
            }
          }
          if (!this.maxFact[index] && !this.minPlan[index] && !this.fullPlan[index]) {
            if (plan[month][compObj.id] >= 90 && fact[month][compObj.id] === 0) {
              this.goodWork[index] = compObj.id;
            }
          }
        }
      });
      this.maxFact = this.sortReserveFact(this.maxFact, month, fact);
      this.minPlan = this.sortReserveFact(this.minPlan, month, fact);
    },
  },
  mounted() {},
  watch: {
    competenceCheck() {
      if (this.competenceCheck !== null) {
        this.queryReserveEmployer(this.competenceCheck);
      }
    },
  },
};
</script>

<style scoped>
.main-table {
  background: #ffffff;
  border-radius: 0.25rem;
}
</style>
