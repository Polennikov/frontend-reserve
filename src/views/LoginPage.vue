<template>
  <div
      class="container login-wrapper"
  >
    <div
        id="loginformContent"
        class="my-4"
    >
      <h1>Авторизация</h1>
      <form>
        <input
            v-model="login"
            type="text"
            name="login"
            placeholder="Логин"
        >
        <input
            v-model="password"
            type="password"
            name="password"
            placeholder="Пароль"
        >
        <button
            class="btn login-btn my-3 p-2"
            @click="loginRequest"
            :disabled="loading"
        >
          <div
              v-if="loading"
              class="spinner-border text-light"
              role="status"
          >
            <span class="visually-hidden"></span>
          </div>
          <template
              v-else
          >
            Войти
          </template>
        </button>
      </form>
      <div
          v-if="status === 'auth_failed'"
          class="loginformFooter"
      >
        Неверный логин и/или пароль.
      </div>
      <div
          v-else-if="status === 'internal_error'"
          class="loginformFooter"
      >
        Ошибка сервиса evo.<br>
        Попробуйте авторизоваться позже.
      </div>
      <div
          v-else-if="status === 'error'"
          class="loginformFooter"
      >
        Внутренняя ошибка сервера.<br>
        Попробуйте авторизоваться позже.
      </div>
      <div
          v-else-if="status === 'empty_field'"
          class="loginformFooter"
      >
        Поля логин и пароль обязательны для заполнения.
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      login: '',
      password: '',
      status: '',
      loading: false,
    };
  },
  methods: {
    async loginRequest(event) {
      event.preventDefault();
      try {
        const postParams = {
          login: this.login,
          password: this.password,
        };
        if (!this.login || !this.password) {
          this.status = 'empty_field';
          return;
        }
        this.loading = true;
        const response = await axios.post(
          `${this.$store.state.apiUrl}/login`,
          postParams,
        );
        if (response.data.success === true && response.data.token && response.data.userId
            && response.data.login) {
          this.status = '';
          const { token } = response.data;
          const { login } = response.data;
          const { userId } = response.data;
          const { userName } = response.data;
          this.$store.dispatch('login', {
            token, login, userId, userName,
          })
            .then(() => {
              this.$router.push('/');
            });
        } else if (response.data.success) {
          this.status = response.data.success;
        } else {
          this.status = 'error';
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.status = 'error';
        console.log(e);
      }
    },
  },
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 100%;
}

h1 {
  color: #c21418;
  font-size: 30px;
  padding: 18px;
}

#loginformContent {
  max-width: 500px;
  position: relative;
  padding: 0px;
  text-align: center;
  background: #ffffff;
  border-radius: 0.25rem;
  box-shadow: 0px 4px 20px -4px rgba(0, 0, 0, .1);
  box-shadow: 0px -4px 20px -4px rgba(0, 0, 0, .1);
  box-shadow: 4px 0px 20px -4px rgba(0, 0, 0, .1);
  box-shadow: -4px 0px 20px -4px rgba(0, 0, 0, .1);
}

.loginformFooter {
  color: red;
  background-color: #f6f7f9;
  border-top: 1px solid #dce8f1;
  padding: 25px;
  text-align: center;
}

#loginformContent input {
  background-color: #f6f7f9;
  color: #0d0d0d;
  padding: 10px 24px;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 6px;
  width: 85%;
  border: 2px solid #f6f6f6;
  border-radius: 0.25rem;
}

#loginformContent input:focus {
  background-color: #fff;
  outline: none;
  border-bottom: 2px solid #c21418;
}

#loginformContent input:placeholder {
  color: #cccccc;
}

.login-btn {
  min-width: 35%;
  text-transform: uppercase;
  background: #c21418;
  border-color: #d43539;
  color: #ffffff;
}

.login-btn:hover {
  background: #d43539;
  border-color: #d43539;
  color: #ffffff;
}

.spinner-border {
  width: 22px;
  height: 22px;
  vertical-align: middle;
}
</style>
