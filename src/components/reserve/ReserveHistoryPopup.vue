<template>
  <div
    class="modal fade"
    :id="'ReserveHistoryPopup'"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog" style="max-width: 600px">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            История изменений
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <div class="row my-2">
              <div class="col">
                <b>{{ this.$store.state.monthNames[month - 1] }} {{ year }}</b>
              </div>
            </div>
            <div class="row my-2">
              <div class="col">
                Ваша бронь для <b>{{ employer.title }}</b>
              </div>
            </div>
            <hr/>
            <div
              class="row my-2"
            >
              <div class="col-6">Дата изменения</div>
              <div class="col-3">Изменено с</div>
              <div class="col-3">Изменено на</div>
            </div>
            <template v-if="plan[month]">
              <div
                v-for="historyRow in plan[month][employer.id]"
                :key="historyRow"
              >
                <div
                  class="row my-2"
                  v-for="history in historyRow.history"
                  :key="history"
                >
                  <hr/>
                  <div class="col-6">{{ history.date }}</div>
                  <div class="col-3">{{ history.old }}</div>
                  <div class="col-3">{{ history.new }}</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReserveHistoryPopup',
  props: {
    month: {},
    year: {},
    plan: {},
    employer: {},
  },
  data() {
    return {};
  },
};
</script>

<style scoped>

.modal-title {
  font-weight: bold;
  font-size: 18px;
}
</style>
