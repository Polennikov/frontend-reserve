<template>
  <template
    v-for="structObj in struct"
    :key="structObj"
  >
    <template
      v-for="employer in competenceResource"
      :key="employer"
    >
      <template v-if="structObj === employer.id">
        <hr/>
        <div class="row" style="padding-left: 13px;padding-right: 13px;">
          <div class="col" style="flex: 0 0 auto;width: 35%;">
            <a
              class="link-employer"
              data-bs-toggle="modal"
              href="#EmployerInfoPopup"
              role="button"
              @click="showEmployerInfo(employer)"
            >
              {{ employer.title }}
            </a>
          </div>
          <div class="col">
            <div style="text-align: center;">
              <div v-if="fact">
                <div v-if="fact[visibleMonths[0].month]">
                  <div v-if="fact[visibleMonths[0].month][employer['id']]"
                       :class="{ colorRed:
                          this.$store.state.hoursOnPercent(fact[visibleMonths[0].month]
                          [employer['id']],
                        countMountWorkDays[visibleMonths[0].month], 8).toFixed(2) > 30 }">
                    {{
                      this.$store.state.hoursOnPercent(fact[visibleMonths[0].month][employer['id']],
                        countMountWorkDays[visibleMonths[0].month], 8).toFixed(2)
                    }}%
                    ({{ fact[visibleMonths[0].month][employer['id']].toFixed(2) }}ч)
                  </div>
                  <div v-else>
                    0ч
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col" style="text-align: center;">
            <div v-if="plan">
              <div v-if="plan[visibleMonths[0].month]">
                <div v-if="plan[visibleMonths[0].month][employer['id']]">
                  {{ plan[visibleMonths[0].month][employer['id']].toFixed(2) }}%
                  ({{
                    (this.$store.state.percentOnHours(plan[visibleMonths[0].month][employer['id']],
                      countMountWorkDays[visibleMonths[0].month], 8).toFixed(2))
                  }}ч)
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </template>
</template>
<script>

export default {
  name: 'EmployerResourceTable',
  components: {},
  emits: ['showEmployerInfo'],
  props: {
    competenceResource: {},
    countMountWorkDays: {},
    visibleMonths: {},
    fact: {},
    plan: {},
    struct: {},
  },
  methods: {
    showEmployerInfo(employer) {
      this.$emit('showEmployerInfo', employer);
    },
  },
};
</script>

<style scoped>
select {
  float: left;
}

.colorRed {
  font-weight: 600;
  color: red;
}

a {
  text-decoration: none;
  color: black;
}

a:hover {
  color: #c21418;
}
</style>
