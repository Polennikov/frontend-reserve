<template>
  <div
    class="modal"
    :id="'plan-' + year + '-' + month + '-' + currentProject"
    aria-hidden="true"
    tabindex="-1"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5
            class="modal-title"
          >
            {{ employer.title }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close">
          </button>
        </div>
        <div class="modal-body">
          <div
            class="mb-3 mx-3"
          >
            <b>
              Бронь для проекта "{{ currentProjectName }}"
              за {{ this.$store.state.monthNames[month - 1] }} {{ year }}
            </b>
          </div>
          <div
            class="mb-1 mx-3"
          >
            <i>Менеджер</i>
          </div>
          <div
            class="accordion accordion-flush"
            :id="'accordion-' + year + '-'
                    + month + '-' + currentProject"
          >
            <template
              v-for="(managerObj, index) in managersList"
              :key="index"
            >
              <div v-if="plan[month]">
                <div v-if="plan[month][currentProject]">
                  <div v-if="plan[month][currentProject][index]">
                    <div v-if="plan[month][currentProject][index].percent > 0">
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
                        <div v-if="plan[month]">
                          <div v-if="plan[month][currentProject]">
                            <div v-if="plan[month][currentProject][index]">
                              {{ managerObj.managerName }} -
                              {{ plan[month][currentProject][index].percent.toFixed(2) }}%
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
                          <div v-if="plan[month]">
                            <div v-if="plan[month][currentProject]">
                              <div v-if="plan[month][currentProject][index]">
                                <template
                                  v-if="plan[month][currentProject][index].history"
                                >
                                  <div
                                    class="row my-2"
                                  >
                                    <div class="col-6"><i>Дата изменения</i></div>
                                    <div class="col-3"><i>Изменено с</i></div>
                                    <div class="col-3"><i>Изменено на</i></div>
                                  </div>
                                  <div
                                    class="row my-2"
                                    v-for="historyRow in plan[month][currentProject]
                                    [index].history"
                                    :key="historyRow.date"
                                  >
                                    <div class="col-6"><i>{{ historyRow.date }}</i></div>
                                    <div class="col-3">{{ historyRow.old.toFixed(2) }}</div>
                                    <div class="col-3">{{ historyRow.new.toFixed(2) }}</div>
                                  </div>
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
            </template>
            <button
              class="btn btn-back mt-3"
              data-bs-target="#EmployerInfoPopup"
              data-bs-toggle="modal"
              data-bs-dismiss="modal"
            >
              &#8592; Назад
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'HistoryPlan',
  components: {},
  emits: [],
  props: {
    year: {},
    month: {},
    employer: {},
    currentProject: {},
    currentProjectName: {},
    managersList: {},
    plan: {},
  },
};
</script>

<style scoped>
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

.col-fact div {
  display: flex;
  align-items: center;
}

.accordion-body {
  font-size: 14px;
}

.accordion-button:not(.collapsed) {
  color: #c21418;
  background-color: #f6f7f9;
}

.btn-back {
  margin: 20px;
  float: right;
  background: #c21418;
  border-color: #d43539;
  color: #ffffff;
}

.btn-back:hover {
  background: #d43539;
  border-color: #d43539;
  color: #ffffff;
}
</style>
