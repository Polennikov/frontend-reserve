<template>
  <div
    class="modal"
    id="ManagerInfo"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Карточка менеджера</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close">
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div>
              <div><i>
                {{ this.$store.state.monthNames[month - 1] }} {{ year }}
              </i></div>
              <div class="modal-manager-input">
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': inputError, 'is-valid': sendSuccess }"
                  id="percent-input"
                  v-model="userNameManager"
                  @input="validateName"
                  placeholder="ФИО менеджера:"
                >
                <button
                  type="button"
                  class="btn btn-save"
                  @click="updateManagerName"
                >
                  Сохранить
                </button>
              </div>
              <div
                class="invalid-feedback"
                v-if="inputError"
              >{{ inputError }}
              </div>
              <div
                class="valid-feedback"
                v-if="sendSuccess"
              >{{ sendSuccess }}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SetReservePopup',
  props: {
    month: Number,
    year: Number,
    employer: {},
    plan: {},
  },
  emits: ['updateManagerName'],
  data() {
    return {
      userNameManager: this.$store.state.userName !== 'null' ? this.$store.state.userName : '',
      status: '',
      inputError: '',
      sendSuccess: '',
    };
  },
  methods: {
    async updateUserName(managerName) {
      const postParams = {
        name: managerName,
      };
      const response = await axios.post(`${this.$store.state.apiUrl}/manager/name?token=${this.$store.state.token}`, postParams);
      this.status = response.data.status;
    },
    updateManagerName() {
      if (this.validateName()) {
        this.updateUserName(this.userNameManager);
        if (!this.status) {
          this.sendSuccess = 'Сохранено';
          localStorage.setItem('userName', this.userNameManager);
          this.$emit('updateManagerName', this.userNameManager);
        } else {
          this.inputError = 'Непредвиденная ошибка!';
          this.sendSuccess = '';
        }
      }
    },
    validateName() {
      let valid = false;
      if (!this.userNameManager) {
        this.inputError = 'Введите ФИО';
        this.sendSuccess = '';
        valid = false;
      } else {
        this.inputError = '';
        valid = true;
      }
      return valid;
    },
  },
  watch: {
  },
};
</script>

<style scoped>
.modal-header {
  padding: 25px 20px 20px;
}

.modal-title {
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
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

.modal-manager-input {
  display: flex;
  align-items: center;
  font-size: 0;
  line-height: 0;
}

.form-control {
  border: 2px solid #F2F2F2;
  border-radius: 8px;
  margin-right: 20px;
  padding: 12px 14px;
  font-size: 16px;
  line-height: 19px;
}

.btn {
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  padding: 14px 16px;
  text-align: center;
  background: #C31419;
  border-radius: 8px;
  border: none;
  color: #FFFFFF;
}

.modal-body {
  padding: 20px;
}
</style>
