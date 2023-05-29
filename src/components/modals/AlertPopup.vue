<template>
  <div
    class="modal fade"
    :id="'AlertPopup' + employer.id + month + year"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog" style="max-width: 500px;">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            {{headerText}}
          </div>
        </div>
        <div class="modal-body">
          <div>
            {{mainText}}
          </div>
        </div>
        <div class="modal-footer"
             style="justify-content: space-between;padding: 1rem">
          <button
            class="buttonCancel"
            data-bs-dismiss="modal"
            aria-label="Close"
            ref="closePopup"
          >
            Отменить
          </button>
          <button
            class="buttonOk"
            data-bs-dismiss="modal"
            aria-label="Close"
            ref="closePopup"
            @click="alertOk()"
          >
            Ок
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'AlertPopup',
  components: {},
  emits: ['changeAlert'],
  props: {
    employer: {},
    month: {},
    year: {},
    headerText: {},
    mainText: {},
  },
  data() {
    return {};
  },
  methods: {
    alertOk() {
      this.$emit('changeAlert', true, this.employer.id, this.month, this.year);
    },
  },
  computed: {},
  watch: {},
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}

.modal-title {
  font-weight: bold;
  font-size: 18px;
}

.buttonOk {
  width: 210px;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  border: none;
  background: #C31419;
  border-radius: 8px;
  margin: 0;
  color: #ffffff;
  padding: 14px 16px;
}

.buttonCancel {
  width: 210px;
  background: #F2F2F2;
  color: #000000;
  border-radius: 8px;
  padding: 14px 16px;
  border: none;
  margin: 0;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
}
</style>
