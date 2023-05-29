<template>
  <button class="btn btn-border"
          @click="slidePrevMonth">
    <div
      class="btn btn-prev"
    >
    </div>
  </button>
  <template
    v-for="Months in visibleMonthsEdit"
    :key="Months"
  >
    <div class="month-border" style="padding-top: 11px;"
      :class="Months.month === currentMonth ? 'month-border--current' : ''">
      {{ this.$store.state.monthNames[Months.month - 1] }} {{ Months.year }}
    </div>
  </template>
  <button class="btn btn-border"
          @click="slideNextMonth">
    <div
      class="btn btn-next"
    >
    </div>
  </button>
</template>

<script>

import axios from 'axios';

export default {
  name: 'MonthSelect',
  components: {},
  props: {
    employer: {},
    countMonth: Number,
    visibleMonthsUpdate: {},
  },
  emits: ['updateMonthSelect'],
  data() {
    return {
      countMountWorkDays: {},
      currentMonth: new Date().getMonth() + 1,
      visibleMonthsEdit: [{
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      }],
    };
  },
  methods: {
    async getWorkDay(month, year) {
      const response = await axios.get(`${this.$store.state.apiUrl}/workday`, {
        params: {
          token: this.$store.state.token,
          month,
          year,
        },
      });
      this.countMountWorkDays[month] = response.data.workingDays;
    },
    getWorkingDateInMonth(dateArray) {
      this.countMountWorkDays = {};
      dateArray.forEach((dateItem) => {
        this.getWorkDay(dateItem.month, dateItem.year);
      });
    },
    addPrevMonth() {
      const firstElem = this.visibleMonthsEdit.at(0);
      let prevMonth = {};
      if (firstElem.month === 1) {
        prevMonth = {
          month: 12,
          year: firstElem.year - 1,
        };
      } else {
        prevMonth = {
          month: firstElem.month - 1,
          year: firstElem.year,
        };
      }
      this.visibleMonthsEdit.unshift(prevMonth);
      this.updateMonthSelect();
    },
    addNextMonth() {
      const lastElem = this.visibleMonthsEdit.at(-1);
      let nextMonth = {};
      if (lastElem.month === 12) {
        nextMonth = {
          month: 1,
          year: lastElem.year + 1,
        };
      } else {
        nextMonth = {
          month: lastElem.month + 1,
          year: lastElem.year,
        };
      }
      this.visibleMonthsEdit.push(nextMonth);
      this.updateMonthSelect();
    },
    updateMonthSelect() {
      this.getWorkingDateInMonth(this.visibleMonthsEdit);
      this.$emit('updateMonthSelect', this.visibleMonthsEdit, this.countMountWorkDays);
    },
    slidePrevMonth() {
      if (this.visibleMonthsEdit.length > 1) {
        this.visibleMonthsEdit.pop();
        this.addPrevMonth();
      } else {
        this.addPrevMonth();
        this.visibleMonthsEdit.pop();
      }
    },
    slideNextMonth() {
      if (this.visibleMonthsEdit.length > 1) {
        this.visibleMonthsEdit.shift();
        this.addNextMonth();
      } else {
        this.addNextMonth();
        this.visibleMonthsEdit.shift();
      }
    },
    widthUpdated() {
      if (window.innerWidth > 1199 && this.visibleMonthsEdit.length < 2) {
        if (this.countMonth === 1) {
          this.updateMonthSelect();
        } else if (this.countMonth === 2) {
          this.addPrevMonth();
        }
      }
      if (window.innerWidth < 1200) {
        if (this.visibleMonthsEdit.length > 1) {
          this.visibleMonthsEdit.shift();
        }
        this.updateMonthSelect();
      }
    },
  },
  mounted() {
    this.widthUpdated();
    window.addEventListener('resize', this.widthUpdated);
  },
  watch: {
    employer() {
      this.visibleMonthsEdit = [];
      this.visibleMonthsUpdate.forEach((monthObj) => {
        this.visibleMonthsEdit.push(monthObj);
      });
      if (this.countMonth === 2 && this.visibleMonthsEdit.length < this.countMonth) {
        this.addPrevMonth();
      }
      this.updateMonthSelect();
    },
    countMonth(newValue) {
      if (newValue === 1) {
        this.visibleMonthsEdit = [{
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        }];
        this.updateMonthSelect();
      } else {
        this.addPrevMonth();
      }
    },
  },
};
</script>

<style scoped>

.btn-border {
  height: 40px;
  width: 40px;
  border-radius: 8px;
  padding: 2px;
  background: rgba(0, 0, 0, 0.02);
}

.month-border {
  border-radius: 8px;
  padding: 2px;
  background: rgba(0, 0, 0, 0.02);
  width: calc(50% - 60px);
  text-align: center;
  height: 40px;
}

.btn-prev {
  background-image: url('~@/assets/left.svg');
  background-size: 13px;
  height: 13px;
  width: 13px;
  padding: 0px;
}

.btn-next {
  background-image: url('~@/assets/right.svg');
  background-size: 13px;
  height: 13px;
  width: 13px;
  padding: 0px;
}

.month-border--current {
  color: #C31419;
}
</style>
