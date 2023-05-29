<template>
  <div class="container-fluid" style="background: #ffffff; border-radius: 5px;font-weight: 600;
    font-size: 24px; line-height: 29px;">
    <div class="row px-4 mt-4" style="display: flex;
        color: #c21418;padding: 13px;">
      <div class="col-4 month-result__caption">
        Итого часов, факт:
      </div>
      <template
        v-for="monthObj in visibleMonths"
        :key="monthObj"
      >{{countHoursResult}}
        <div v-if="countHoursResult[monthObj.month]"
            class="col month-result__item"
            style="text-align: center; padding: 0 12px;">
          <div class="">
            {{ countHoursResult[monthObj.month].toFixed(2) }}ч
          </div>
        </div>
        <div class="col"></div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MonthHoursResult',
  props: {
    visibleMonths: {},
    countHours: {},
  },
  data() {
    return {
      countHoursResult: {},
    };
  },
  watch: {
    countHours(newValue) {
      this.countHoursResult = newValue;
    },
  },
};
</script>

<style scoped>
.container-fluid{
  background: #ffffff; border-radius: 5px;
  font-weight: bold;
  bottom: 0;
  position: sticky;
  height: auto;
}
.month-result__caption {
  margin-right: 15px;
}

@media (max-width: 1800px) {
  .month-result__caption {
    margin-right: 10px;
  }
}
@media (max-width: 1500px) {
  .month-result__caption {
    margin-right: 0;
  }
  .month-result__item {
    margin-right: 10px;
  }
}
</style>
