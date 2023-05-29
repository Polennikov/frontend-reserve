import { createStore } from 'vuex';

export default createStore({
  state: {
    apiUrl: process.env.VUE_APP_BACKEND,
    token: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') || 0,
    login: localStorage.getItem('login') || 0,
    userName: localStorage.getItem('userName') || null,
    monthNames: [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ],
    titles: {
      mainTitle: 'Резервирование инженеров',
    },
    percentOnHours(percent, countDays, workHourDay) {
      const workHoursFull = workHourDay * countDays;
      if (percent > 0) {
        return ((workHoursFull * percent) / 100);
      }
      return 0;
    },
    hoursOnPercent(hours, countDays, workHourDay) {
      const workHoursFull = workHourDay * countDays;
      if (hours > 0) {
        return ((100 * hours) / workHoursFull);
      }
      return 0;
    },
    // eslint-disable-next-line max-len
    freeTimePercent(allCurrentReserve, currentMountPercent, countAbsentDays, workHourDay, countMountWorkDays) {
      let value = 0;
      value = (100 - (allCurrentReserve >= currentMountPercent
        ? allCurrentReserve : currentMountPercent)
        - this.hoursOnPercent((workHourDay * countAbsentDays), countMountWorkDays, workHourDay));
      if (value < 0) {
        value = 0.00;
      }
      return value;
    },
  },
  mutations: {
    login_success(state, {
      token, login, userId, userName,
    }) {
      state.login = login;
      state.token = token;
      state.userId = userId;
      state.userName = userName;
    },
    logout(state) {
      state.login = '';
      state.token = '';
      state.userId = 0;
      state.userName = 0;
    },
  },
  actions: {
    login({ commit }, {
      token, login, userId, userName,
    }) {
      return new Promise((resolve) => {
        commit('login_success', {
          token, login, userId, userName,
        });
        localStorage.setItem('token', token);
        localStorage.setItem('login', login === 0 ? '' : login);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
        resolve();
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout');
        localStorage.removeItem('token');
        localStorage.removeItem('login');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        resolve();
      });
    },
  },
  modules: {},
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
});
