<template>
  <h3> Проекты для утверждения </h3>
  <template v-for="projects in projectsList" :key="projects.id">
    <template v-for="plan in planApproved" :key="plan.id">
      <template
          {{plan}}
      v-if="plan.project == projects.id">
        <div class=" mb-2" style="background: #ffffff; border-radius: 5px; padding: 7px;">
          Проект: {{projects.title}}   Дата: {{ this.$store.state.monthNames[plan.month - 1] }}-
          {{plan.year}}
         </div>
      </template>
    </template>
  </template>
</template>
<script>

export default {
  name: 'ManagementProject',
  components: {
  },
  emits: [],
  props: {
    projectsList: {},
    employersList: {},
    planApproved: {},
  },
  data() {
    return {
    };
  },
  methods: {
  },
  mounted() {},
};
</script>

<style scoped>
.main-table {
  background: #ffffff;
  border-radius: 0.25rem;
}
</style>
