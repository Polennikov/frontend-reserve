<template>
  <div
    class="modal fade"
    id="EmployerAdd"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog" style="max-width: 700px;">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            Выбор сотрудника
          </div>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            ref="closePopup"
          ></button>
        </div>
        <div class="modal-body pt-0 pb-0" style="height: 500px;padding: 0;">
          <div style="display: flex; height: 100%;">
            <div style="flex: 0 0 auto;width: 40%;  padding: 20px;border-right: 1px solid #dee2e6;
              overflow: auto">
              <div style="color: rgb(127, 131, 136); padding-left: 18px;
                paddin-bottom: 10px;">Компетенция</div>
              <template
                v-for="competence in competenceArray"
                :key="competence"
              ><a href="#"
                  @click="SelectedCompetence(competence)"
              >
                <div class="items"
                     :class="{ active: competence== CompetenceAdd }">
                  {{ CompetenceName(competence) }}
                </div>
              </a>
              </template>
            </div>
            <div style="flex: 0 0 auto;width: 60%;
            padding: 10px; height: 480px">
              <div style="color: rgb(127, 131, 136); padding-left: 18px;">Сотрудник</div>
              <template v-if="CompetenceAdd !== null">
                <div class="list-group" style="height: 100%;overflow: auto;">
                  <template
                    v-for="employer in employersList"
                    :key="employer.id"
                  >
                    <div
                      v-if="employer.competence === CompetenceAdd"
                    >
                      <template
                        v-if="projectsEmployer(employer.id)"
                      >
                        <a @click="EmployerAdd(employer)"
                           href="#">
                          <div class="items mt-2" :class="{ active: employer == addEmployer }">
                            {{ employer.title }}
                          </div>
                        </a>
                      </template>
                    </div>
                  </template>
                </div>
              </template>
              <template v-else>
                <div style="text-align: center;margin-top: 50%;color: rgb(127, 131, 136);">
                  Выберите компетенцию
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="modal-footer" style="border-bottom: 1px solid #dee2e6;">
          <button
            :class="{ disabled: addEmployer == null }"
            class="buttonEmployer"
            @click="EmployerAddClick"
          >
            Добавить сотрудника
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EmployerAdd',
  components: {},
  props: {
    competences: {},
    currentProject: {},
    employersList: {},
    projectsEmployers: {},
  },
  emits: ['addMainEmployer'],
  data() {
    return {
      CompetenceAdd: null,
      addEmployer: null,
      competenceArray: [
        'Дизайнер',
        'Аналитик',
        'Backend (bitrix)',
        'Backend (symfony)',
        'Frontend (vue)',
        'Frontend (HTML/CSS)',
        'Android-разработчик',
        'iOS-разработчик',
        'Тестировщик',
        'DevOps',
        'Менеджер',
      ],
    };
  },
  methods: {
    CompetenceName(value) {
      if (value === '') {
        return 'Компетенция не указана';
      }
      return value;
    },
    SelectedCompetence(value) {
      this.CompetenceAdd = value;
      this.addEmployer = null;
    },
    EmployerAddClick() {
      this.$emit('addMainEmployer', this.addEmployer, true);
      this.addEmployer = null;
    },
    EmployerAdd(value) {
      this.addEmployer = value;
    },
    projectsEmployer(id) {
      let tmp = true;
      const abjArr = Object.entries(this.projectsEmployers);
      abjArr.forEach(([abjArrs]) => {
        if (this.projectsEmployers[abjArrs]) {
          if (this.projectsEmployers[abjArrs].id === id) {
            tmp = false;
          }
        }
      });
      return tmp;
    },
  },
  computed: {},
  watch: {},
};
</script>

<style scoped>
.items:hover {
  background: #f6f7f9;
}

.items {
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 14px 16px;
  margin-top: 10px;
}

.active {
  border-color: #C31419;
}

a {
  text-decoration: none;
  color: black;
}

.modal-title {
  font-weight: bold;
  font-size: 18px;
}

.modal-footer {
  padding: 20px;
}

.buttonEmployer {
  width: 399px;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  background: #C31419;
  border-radius: 8px;
  padding: 14px 16px;
  border: none;
  color: #fff;
  margin: 0;
}
.disabled {
  background-color: #f6f7f9;
}
</style>
