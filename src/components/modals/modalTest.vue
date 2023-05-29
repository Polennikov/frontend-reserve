<template v-if="show">
  <div class="modal">
  <div class="modal shadow" style="display: none;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
        </div>
        <div class="modal-body">
          <p> some stuff here </p>
          {{show}}
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" type="submit"
                  @click="closeModal()">
            Search
          </button>
          <button class="btn btn-secondary" type="button"
                  @click="closeModal()">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
  <div class="modal-backdrop show"></div>
</template>

<script>
export default {
  name: 'modalTest',
  data() {
    return {
      show: false,
    };
  },
  methods: {
    closeModal() {
      this.show = true;
    },
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

.modal-header--bordered {
  border-bottom: 1px solid #F2F2F2;
}

.modal-content {
  max-width: 500px;
  margin: 0 auto;
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

.modal-search {
  margin: 20px 0;
}

.modal-search__input {
  border: 2px solid #F2F2F2;
  border-radius: 8px;
  font: inherit;
  padding: 14px 56px 14px 16px;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  width: 100%;
  background-repeat: no-repeat;
  background-position: calc(100% - 16px) center;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='11' cy='11' r='8' stroke='%23969696' stroke-width='2'/%3E%3Cpath d='M21 21L17 17' stroke='%23969696' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E%0A");
}

.modal__company-btn-wrap {
  overflow: auto;
  max-height: 400px;
  margin-bottom: 20px;
}

.modal__company-btn-wrap p {
  margin-bottom: 0;
}

.modal__company-btn {
  padding: 0;
  background-color: transparent;
  border: none;
  display: block;
  width: 100%;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: left;
  margin-bottom: 20px;
  transition: color 0.2s ease;
  color: #969696;
}

.modal__company-btn-wrap--active .modal__company-btn {
  color: #000000;
}

.row-info .project-name, .row-info-header .project-name {
  font-size: inherit;
  line-height: inherit;
  font-weight: 400;
}

.col-fact div {
  display: flex;
  align-items: center;
}
</style>
