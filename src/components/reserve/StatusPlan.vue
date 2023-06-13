<template>
  <div style="display: flex;">
    Статус:
    <select class="form-control form-value" v-model="selected">
      <option value="" selected disabled>Новый</option>
      <option v-for="country in options" :value="country"
              :key="country.code">{{ country.value }}</option>
    </select>
  </div>
  <template v-if="roleUser === 'leader'">
    <template
    v-if="currentPlan['approvedPlan']">
      <template v-for="plan in currentPlan['approvedPlan']" :key="plan.id">
        <div class=" mb-2" style="background: #ffffff; border-radius: 5px; padding: 7px;">
        {{plan.competence}}
        <template v-if="competenceValue === plan.competence">
          <input type="checkbox" v-model="plan.value" @click="setApprovedPlan(!plan.value)">
        </template>
        <template v-else>
          <input type="checkbox" disabled v-model="plan.value">
        </template>
          </div>
      </template>
    </template>
    <template v-else>
      <div class=" mb-2" style="background: #ffffff; border-radius: 5px; padding: 7px;">
      Нет подтверждений
      </div>
    </template>
  </template>
  <template
  v-if="roleUser === 'manager'">
    <template
        v-if="currentPlan['approvedPlan']">
      <template v-for="plan in currentPlan['approvedPlan']" :key="plan.id">
        {{ plan.value }}
        <template v-if="plan.value === true">
          <div class=" mb-2" style="background: #ffffff; border-radius: 5px; padding: 7px;">
            {{plan.competence}}: Подтвержден
          </div>
        </template>
        <template
        v-else>
          <div class=" mb-2" style="background: #ffffff; border-radius: 5px; padding: 7px;">
          {{plan.competence}}: Не подтвержден
          </div>
        </template>
      </template>
    </template>
  </template>
  <button
      type="button"
      class="btn btn-save"
      @click="setStatusPlan"
  >
    Сохранить
  </button>
</template>
<script>

import axios from 'axios';

export default {
  name: 'StatusPlan',
  components: {
  },
  emits: [],
  props: {
    visibleMonths: {},
    currentProject: {},
    currentProjectName: {},
    currentPlan: {},
    currentCompetence: {},
  },
  data() {
    return {
      selected: {},
      approvedPlan: {},
      options: [
        { value: 'Новый', code: 'new' },
        { value: 'Заполнен', code: 'created' },
        { value: 'Ожидает подтверждения', code: 'time' },
        { value: 'Утвержден', code: 'confirmed' },
      ],
      roleUser: localStorage.getItem('roleUser'),
      competenceValue: localStorage.getItem('competence'),
    };
  },
  methods: {
    async setStatusPlan() {
      try {
        const postParams = {
          year: this.visibleMonths[0].year,
          month: this.visibleMonths[0].month,
          status: this.selected.code,
          project: this.currentProject,
          projectName: this.currentProjectName,
          currentCompetence: this.currentCompetence,
        };
        await axios.post(`${this.$store.state.apiUrl}/plan`,
          postParams,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          });
      } catch (e) {
        console.log(e);
      }
    },
    async setApprovedPlan(valueCheck) {
      console.log(valueCheck);
      try {
        const postParams = {
          year: this.visibleMonths[0].year,
          month: this.visibleMonths[0].month,
          project: this.currentProject,
          competence: this.competenceValue,
          value: !valueCheck,
        };
        await axios.post(`${this.$store.state.apiUrl}/plan/confirmed`,
          postParams,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          });
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
  },
  watch: {
    currentPlan(newValue) {
      this.options.forEach((item) => {
        if (item.code === newValue.status) {
          this.selected = item;
        }
      });
      this.approvedPlan = this.selected.approvedPlan;
    },
  },
};
</script>

<style scoped>
    .form-value {
      margin: 0 20px;
      border: 2px solid #F2F2F2;
      border-radius: 8px;
      width: auto;
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
</style>
