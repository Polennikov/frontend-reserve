<template>
  <div>
    <div class="px-4 pt-3 pb-1 mb-4">
      <div class="px-2 pb-1 mb-4" style="
        background: #ffffff; border-radius: 5px;
        position: sticky; top: 0; outline: 1px solid #F2F2F2;">
        <div style="display: flex;justify-content: space-between;padding: 13px;">
          <div style="line-height: inherit;width: 35%;">
          </div>
          <div style="display: flex;width: 65%;justify-content: inherit;font-weight: bold;">
            <MonthSelect
              :countMonth="countMonth"
              @updateMonthSelect="updateMonthSelect"
            >
            </MonthSelect>
          </div>
        </div>
      </div>
      <template
        v-for="competence in competences"
        :key="competence"
      >
        <template
          v-if="competenceCheck(competence)"
        >
          <div class=" mb-4" style="background: #ffffff; border-radius: 5px;">
            <one-competence-table
              :employersList="employersList"
              :currentProjectName="currentProjectName"
              :chosenEmployer="chosenEmployer"
              :competence="competence"
              :currentProject="currentProject"
              :fact="fact"
              :plan="plan"
              :visibleMonths="visibleMonths"
              :projectsEmployers="projectsEmployers"
              :countMountWorkDays="countMountWorkDays"
              :settings="settings"
              :managersList="managersList"
              :projectsList="projectsList"
              :currentManagerName="currentManagerName"
              @updatePlan="updatePlan"
              @showEmployerInfo="showEmployerInfo"
              @deleteEmployer="deleteEmployer"
            >
            </one-competence-table>
          </div>
        </template>
      </template>
      <month-hours-result v-if="Object.keys(countHours).length != 0"
        :visibleMonths="visibleMonths"
        :countHours="countHours"
      ></month-hours-result>
      <div v-else-if="countProjectsEmployers === 0" class="project-empty">
        В выбранном периоде нет фактических затрат. <br>
        Добавьте команду с предыдущего периода или Добавьте сотрудника
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
      <set-reserve-popup
        :employersList="employersList"
        :currentProjectName="currentProjectName"
        :currentProject="currentProject"
        :employer="chosenEmployer"
        :month="month"
        :year="year"
        :countMountWorkDays="countMountWorkDays[month]"
        :plan="plan[month]"
        :managersList="managersList"
        :modalModifer="modalModifer"
        @updatePlan="updatePlan"
        @setReserve="setReserve"
      ></set-reserve-popup>
      <history-plan
        :year="year"
        :month="month"
        :employer="chosenEmployer"
        :currentProject="currentProject"
        :currentProjectName="currentProjectName"
        :managersList="managersList"
        :plan="plan"
      ></history-plan>
    </template>>
  </div>
</template>

<script>
import axios from 'axios';
import SetReservePopup from '@/components/reserve/SetReservePopup.vue';
import OneCompetenceTable from '@/components/reserve/OneCompetenceTable.vue';
import MonthSelect from '@/components/MonthSelect.vue';
import EmployerInfoPopup from '@/components/employer/EmployerInfoPopup.vue';
import MonthHoursResult from '@/components/MonthHoursResult.vue';
import HistoryPlan from '@/components/modals/HistoryPlan.vue';

export default {
  name: 'ManagerMainTable',
  components: {
    OneCompetenceTable,
    MonthSelect,
    EmployerInfoPopup,
    MonthHoursResult,
    SetReservePopup,
    HistoryPlan,
  },
  emits: ['projectsEmployersUpdate', 'projectsEmployersDelete', 'getEmployers', 'projectsEmployersEdit'],
  props: {
    currentProjectName: {},
    currentProject: Number,
    employersList: {},
    competences: Array,
    projectsList: {},
    addEmployer: {},
    addLead: {},
    managersList: {},
    projectsEmployers: {},
    settings: {},
    commandValueCreate: {},
    countMonth: {},
    countProjectsEmployers: {},
    currentManagerName: {},
  },
  data() {
    return {
      countMountWorkDays: {},
      visibleMonths: [],
      countHours: {},
      fact: {},
      plan: {},
      chosenEmployer: {},
      massEmployer: [],
      factEmployer: {},
      month: {},
      year: {},
      date: {},
      modalModifer: '',
      managerId: this.$store.state.userId,
    };
  },
  methods: {
    async getFactPlanCompetenceProject(project, month, year) {
      const response = await axios.get(`${this.$store.state.apiUrl}/reserve`, {
        params: {
          token: this.$store.state.token,
          project,
          month,
          year,
        },
      });
      this.plan[month] = response.data.plan;
      this.fact[month] = response.data.fact;
      this.getCountHours(month, response.data.fact);
    },
    async setReserve(percentValue, employerId, yearNum, monthNum) {
      try {
        const postParams = {
          token: this.$store.state.token,
          manager: this.$store.state.userId,
          project: this.currentProject,
          employer: employerId,
          year: yearNum,
          month: monthNum,
          percent: percentValue,
        };
        await axios.post(`${this.$store.state.apiUrl}/reserve?token=${this.$store.state.token}`, postParams);
      } catch (e) {
        console.log(e);
      }
    },
    async getEmployerProject(project, month, year, commandCreate) {
      const response = await axios.get(`${this.$store.state.apiUrl}/employer/project`, {
        params: {
          token: this.$store.state.token,
          project,
          month,
          year,
        },
      });
      const abjArr = Object.entries(response.data.employers);
      if (abjArr.length === 0) {
        this.$emit('projectsEmployersUpdate', null, commandCreate);
      } else {
        abjArr.forEach((abjArrs) => {
          this.$emit('projectsEmployersUpdate', abjArrs[1], commandCreate);
        });
      }
    },
    getEmployers() {
      this.$emit('getEmployers');
    },
    updatePlan() {
      this.visibleMonths.forEach((monthObj) => {
        this.getFactPlanCompetenceProject(this.currentProject, monthObj.month,
          monthObj.year);
      });
    },
    createCommand() {
      this.date = new Date();
      this.date.setMonth(this.date.getMonth() - 1);
      this.getEmployerProject(this.currentProject, this.date.getMonth() + 1,
        this.date.getFullYear(), true);
    },
    competenceCheck(competence) {
      let value = false;
      const abjArr = Object.entries(this.projectsEmployers);
      abjArr.forEach(([abjArrs]) => {
        if (this.projectsEmployers[abjArrs]) {
          if (this.projectsEmployers[abjArrs].competence === competence) {
            value = true;
          }
        }
      });
      return value;
    },
    getCountHours(month, facts) {
      if (facts.length !== 0) {
        this.countHours[month] = 0;
        const factsArr = Object.entries(facts);
        factsArr.forEach((hours) => {
          this.countHours[month] += hours[1];
        });
      }
    },
    showEmployerInfo(employer, month, year, modalModifer) {
      this.month = month;
      this.year = year;
      this.chosenEmployer = employer;
      this.modalModifer = modalModifer;
    },
    updateMonthSelect(newVisibleMonths, newCountMountWorkDays) {
      this.visibleMonths = newVisibleMonths;
      this.countMountWorkDays = newCountMountWorkDays;
      if (this.currentProject > 0) {
        this.$emit('projectsEmployersDelete', null);
        this.visibleMonths.forEach((monthObj) => {
          this.getFactPlanCompetenceProject(this.currentProject, monthObj.month,
            monthObj.year);
          this.getEmployerProject(this.currentProject, monthObj.month,
            monthObj.year, false);
        });
      }
    },
    deleteEmployer(employer) {
      this.$emit('projectsEmployersDelete', employer);
    },
  },
  mounted() {
  },
  computed: {},
  watch: {
    commandValueCreate() {
      this.createCommand();
    },
    addLead(newValue) {
      if (!(String(newValue.id) in this.massEmployer)) {
        this.massEmployer.push(String(newValue.id));
        this.$emit('projectsEmployersEdit', newValue.id, newValue);
      } else {
        this.$emit('projectsEmployersUpdate', newValue, false);
      }
    },
    currentProject(newValue) {
      this.plan = {};
      this.fact = {};
      this.visibleMonths.forEach((monthObj) => {
        this.getFactPlanCompetenceProject(this.currentProject, monthObj.month,
          monthObj.year);
        this.getEmployerProject(newValue, monthObj.month,
          monthObj.year, false);
      });
    },
  },
};
</script>

<style>

.button-command {
  display: block;
  border: none;
  text-decoration: none;
  color: #000000;
  border-radius: 5px;
  background: #ffffff;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  padding: 14px 36px 14px 16px;
  background-size: 10px;
  background-position: calc(100% - 16px) center;
  background-repeat: no-repeat;
}
.project-empty {
  text-align: center;
  margin-top: 250px;
}
</style>
