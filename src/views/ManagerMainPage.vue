<template>
  <div
    id="wrapper"
    :class="{ toggled: !sidebarOpen }"
  >
    <menu-sidebar
      :projectsSidebar="projectsSidebar"
      :projectsList="projectsList"
      :currentProject="currentProject"
      :pageKey="pageKey"
      :competences="competences"
      @choseProject="choseProject"
      @addProject="addProject"
      @pageMain="pageMain"
      @deleteProject="deleteProject"
      @resourceUpdate="resourceUpdate"
    ></menu-sidebar>

    <div>
      <div class="row header-top">
        <div class="col"
        >
          <button
            style="margin: 22px 18px;"
            href="#menu-toggle"
            class="menu-btn btn"
            id="menu-toggle"
            @click="sidebarOpen = !sidebarOpen"
          >
          </button>
        </div>
        <div style="margin: 18px;" class="col-md-auto intaro-logo">
        </div>
        <div class="col"
          style="direction: rtl;margin: auto;color: #969696;display:flex;align-items:center;">
          <button
            style="color: #969696;"
            class="btn btn--logout"
            @click="logout"
          >
            Выйти
          </button>
          <button
            v-if="!(currentManagerName !== null && currentManagerName.length > 0)"
            class="btn user-btn"
            data-bs-toggle="modal"
            href="#ManagerInfo"
            role="button"
          >
          </button>
          <button v-if="currentManagerName !== null"
            class="user-name"
            data-bs-toggle="modal"
            href="#ManagerInfo"
            role="button">
            {{ currentManagerName }}
          </button>
          <a
              class="btn btn--icon btn-setting"
              href="#SettingManager"
              :data-bs-target="'#SettingManager'"
              data-bs-toggle="modal"
              data-bs-dismiss="modal"
          >
          </a>
        </div>
      </div>
      <div class="container-fluid">
        <div v-if="currentManagerName === null">
          <div class="alert">
            Предупреждение: Пожалуйста, заполните своё ФИО в <a
            class="info-btn"
            data-bs-toggle="modal"
            href="#ManagerInfo"
          >профиле
          </a> !
          </div>
        </div>
        <div v-if="pageKey === 1">
          <div
            class="col-lg-12"
          >
            <template
              v-if="currentProject"
            >
              <div class="px-4 mt-4" style="display: flex;">
                <div class="project-name" style="margin-right: auto;">
                  {{ currentProjectName }}
                </div>
                <template v-if="countProjectsEmployers === 0">
                  <div class="px-2" style="display: flex;
                    justify-content: flex-end;">
                    <button class="button-add button-add--icon"
                            @click="createCommand()"
                    >
                      Добавить команду
                    </button>
                  </div>
                </template>
                <button class="button-add button-add--icon"
                        data-bs-toggle="modal"
                        href="#EmployerAdd"
                >
                  Добавить сотрудника
                </button>
              </div>
              <manager-main-table
                :commandValueCreate="commandValueCreate"
                :projectsEmployers="projectsEmployers"
                :currentProjectName="currentProjectName"
                :currentProject="currentProject"
                :employersList="employersList"
                :competences="competences"
                :projectsList="projectsList"
                :addLead="addLead"
                :managersList="managersList"
                :settings="settingProject"
                :countMonth="countMonth"
                :currentManagerName="currentManagerName"
                :countProjectsEmployers="countProjectsEmployers"
                @getEmployers="getEmployers"
                @projectsEmployersUpdate="projectsEmployersUpdate"
                @projectsEmployersDelete="projectsEmployersDelete"
              />
            </template>
          </div>
        </div>
        <div v-else-if="pageKey === 0">
          <template v-if="resourceCompetenceCheck !== null">
            <div class="container-fluid">
              <div class="px-4 mt-4" style="display: flex;
              justify-content: space-between;">
                <h3 style="line-height: inherit;margin-top: 13px;">
                  Ресурсы компании
                </h3>
              </div>
            </div>
            <resource-main-table
              :competenceCheck="resourceCompetenceCheck"
              :employersList="employersList"
              :managersList="managersList"
              :projectsList="projectsList"
              :countMonth="countMonth"
              @getEmployers="getEmployers"
            />
          </template>
        </div>
        <div v-else >
          <management-project
              :projectsList="projectsList"
              :employersList="employersList"
              :planApproved="planApproved">
          </management-project>
        </div>
      </div>
    </div>
  </div>
  <employer-add
    :competences="competences"
    :currentProject="currentProject"
    :employersList="employersList"
    :projectsEmployers="projectsEmployers"
    @addMainEmployer="projectsEmployersUpdate"
  ></employer-add>
  <setting-project
    :setting="settingProject"
    :projectId="currentProject"
    :currentProjectName="currentProjectName"
    :employersList="employersList"
    @addMainLead="addMainLead"
  ></setting-project>
  <setting-manager
    :managerSetting="managerSetting"
    :countMonth="countMonth"
    @editSettingManager="editSettingManager"
  >
  </setting-manager>
  <manager-info
    @updateManagerName="updateManagerName"
  ></manager-info>
  <project-add-popup
    :projectsList="projectsList"
    :projectsSidebar="projectsSidebar"
    @addProject="addProject">
  </project-add-popup>
</template>

<script>
import axios from 'axios';
import ManagerMainTable from '@/components/reserve/ManagerMainTable.vue';
import ResourceMainTable from '@/components/resource/ResourceMainTable.vue';
import MenuSidebar from '@/components/menu/MenuSidebar.vue';
import EmployerAdd from '@/components/modals/EmployerAdd.vue';
import ProjectAddPopup from '@/components/modals/ProjectAdd.vue';
import ManagerInfo from '@/components/modals/ManagerInfo.vue';
import SettingProject from '@/components/modals/SettingProject.vue';
import SettingManager from '@/components/modals/SettingManager.vue';
import ManagementProject from '@/components/ManagementProject.vue';

export default {
  name: 'ManagerMainPage',
  components: {
    MenuSidebar,
    ManagerMainTable,
    ResourceMainTable,
    EmployerAdd,
    ManagerInfo,
    ProjectAddPopup,
    SettingProject,
    SettingManager,
    ManagementProject,
  },
  data() {
    return {
      currentProject: 0,
      currentProjectName: '',
      currentManagerName: null,
      sidebarOpen: true,
      projectsSidebar: [],
      projectsList: {},
      employersList: {},
      managersList: {},
      competences: [],
      pageKey: 1,
      addLead: 0,
      resourceCompetenceCheck: null,
      projectsEmployers: {},
      settingProject: '',
      commandValueCreate: 0,
      managerSetting: {},
      countMonth: null,
      planApproved: {},
    };
  },
  methods: {
    async getManagers() {
      try {
        const response = await axios.get(`${this.$store.state.apiUrl}/manager`, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        });
        this.managersList = response.data.managers;
      } catch (e) {
        console.log(e);
      }
    },
    async getPlanApproved() {
      try {
        const response = await axios.get(`${this.$store.state.apiUrl}/plan/approved`, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
          params: {
            competence: localStorage.getItem('competence'),
          },
        });
        this.planApproved = response.data;
      } catch (e) {
        console.log(e);
      }
    },
    async getSettingManager(id) {
      try {
        const response = await axios.get(`${this.$store.state.apiUrl}/manager/setting/${id}`, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        });
        if (response.data.success !== false) {
          this.managerSetting = response.data.setting;
          if (this.managerSetting !== null) {
            this.countMonth = response.data.setting.countMonth !== null
              ? response.data.setting.countMonth : 2;
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    // eslint-disable-next-line max-len
    async editSettingManager(id, countMonthCurrent, projectsSidebarCurrent) {
      try {
        const postParams = {
          token: this.$store.state.token,
          countMonth: countMonthCurrent,
          projectsSidebar: projectsSidebarCurrent !== null
            ? JSON.stringify(projectsSidebarCurrent) : null,
        };
        const response = await axios.post(`${this.$store.state.apiUrl}/manager/setting/${id}`, postParams, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        });
        if (response.data.success !== false) {
          this.managerSetting = response.data.setting;
          if (this.managerSetting !== null) {
            this.countMonth = response.data.setting.countMonth !== null
              ? response.data.setting.countMonth : 2;
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getProjects() {
      try {
        const response = await axios.get(`${this.$store.state.apiUrl}/project`, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        });
        if (response.data.projects.length > 0) {
          this.projectsList = response.data.projects;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getProjectsApproved() {
      try {
        const response = await axios.get(`${this.$store.state.apiUrl}/project/approved`, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        });
        if (response.data.projects.length > 0) {
          this.projectsList = response.data.projects;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getEmployers() {
      try {
        const response = await axios.get(`${this.$store.state.apiUrl}/employer`, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        });
        if (response.data.employers.length > 0) {
          console.log(response.data.employers);
          this.employersList = response.data.employers;
          this.employersList.forEach((employer) => {
            if (employer.competence && !this.competences.includes(employer.competence)) {
              this.competences.push(employer.competence);
            }
          });
          this.competences.push('');
        }
      } catch (e) {
        console.log(e);
      }
    },
    async getSettingProject(id) {
      const response = await axios.get(`${this.$store.state.apiUrl}/project/setting/${id}`, {
        params: {
          token: this.$store.state.token,
        },
      });
      this.settingProject = response.data.setting;
    },
    addMainLead(value) {
      this.addLead = value;
      this.getSettingProject(value.id);
    },
    projectsEmployersUpdate(employer, commandCreate) {
      if (commandCreate) {
        this.projectsEmployers[employer.id] = employer;
        const parsedList = JSON.stringify(this.projectsEmployers);
        localStorage.setItem('employersAdd', parsedList);
      } else {
        if (employer !== null) {
          this.projectsEmployers[employer.id] = employer;
        }
        if (localStorage.getItem('employersAdd')) {
          const obj = Object.entries(JSON.parse(localStorage.getItem('employersAdd')));
          obj.forEach((Obj) => {
            const tmp = Obj[1];
            if (tmp !== null) {
              this.projectsEmployers[Obj[1].id] = tmp;
            }
          });
        }
      }
    },
    projectsEmployersDelete(value) {
      if (value === null) {
        this.projectsEmployers = {};
      } else {
        this.projectsEmployers[value.id] = null;
        const parsedList = JSON.stringify(this.projectsEmployers);
        localStorage.setItem('employersAdd', parsedList);
      }
    },
    choseProject(projectId, projectName) {
      localStorage.setItem('currentProject', projectId);
      localStorage.setItem('currentProjectName', projectName);
      localStorage.removeItem('employersAdd');
      if (this.currentProject !== projectId) {
        this.projectsEmployersDelete(null);
      }
      this.currentProject = projectId;
      this.currentProjectName = projectName;
    },
    pageMain(pageKey) {
      this.pageKey = pageKey;
    },
    addProject(projectId) {
      this.projectsList.forEach((project, i) => {
        if (project.id === projectId) {
          this.projectsSidebar.push(project);
          this.projectsList.splice(i, 1);
          this.currentProject = Number(projectId);
          this.currentProjectName = project.title;
        }
      });
      this.editSettingManager(
        this.$store.state.userId,
        null,
        this.projectsSidebar,
      );
    },
    deleteProject(projectId) {
      this.projectsSidebar.forEach((project, i) => {
        if (project.id === projectId) {
          this.projectsList.unshift(project);
          this.projectsSidebar.splice(i, 1);
          this.getProjects();
        }
        if (projectId === this.currentProject) {
          this.currentProject = 0;
          localStorage.removeItem('currentProject');
          localStorage.removeItem('currentProjectName');
        }
      });
      this.editSettingManager(
        this.$store.state.userId,
        null,
        this.projectsSidebar,
      );
    },
    logout() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login');
        });
    },
    updateManagerName(newManagerName) {
      this.currentManagerName = newManagerName;
    },
    resourceUpdate(competenceCheck) {
      this.resourceCompetenceCheck = competenceCheck;
    },
    createCommand() {
      this.commandValueCreate += 1;
    },
  },

  mounted() {
    // eslint-disable-next-line max-len
    this.currentManagerName = this.$store.state.userName === null ? null : this.$store.state.userName;
    this.getEmployers();
    this.getProjects();
    this.getManagers();
    this.getPlanApproved();
    this.getSettingManager(this.$store.state.userId);
  },
  beforeUpdate() {
    if (localStorage.getItem('currentProject')) {
      this.currentProject = Number(localStorage.getItem('currentProject'));
    }
    if (localStorage.getItem('currentProjectName')) {
      this.currentProjectName = localStorage.getItem('currentProjectName');
    }
  },
  computed: {
    countProjectsEmployers() {
      let count = 0;
      const objArr = Object.entries(this.projectsEmployers);
      objArr.forEach((value) => {
        if (value[1] !== null) {
          count += 1;
        }
      });
      return count;
    },
  },
  watch: {
    managerSetting() {
      if (this.managerSetting !== null) {
        if (this.managerSetting.projectsSidebar) {
          this.projectsSidebar = JSON.parse(this.managerSetting.projectsSidebar);
        }
      }
    },
    currentProject(newValue) {
      if (newValue) {
        this.getSettingProject(newValue);
      }
    },
    pageKey() {
      this.competenceCheck = null;
    },
  },
};
</script>

<style>
.alert {
  padding: 10px;
  color: #d43539;
  margin: 20px;
  border: #d43539 solid;
}

#wrapper {
  padding-left: 0;
  -webkit-transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -o-transition: all 0.5s ease;
  transition: all 0.5s ease;
}

#wrapper.toggled {
  padding-left: 320px;
}

#wrapper.toggled #sidebar-wrapper {
  width: 320px;
}

.toggled .menu-btn {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

@media (min-width: 768px) {
  #wrapper {
    padding-left: 320px;
  }

  #wrapper.toggled {
    padding-left: 0;
  }

  #wrapper.toggled #sidebar-wrapper {
    width: 0;
  }
}

.intaro-logo {
  margin: 5px;
  width: 70px;
  background-image: url('~@/assets/intaro_logo.png');
  background-size: contain;
  background-repeat: no-repeat;
}
.user-name {
  padding: 0;
  max-width: none;
  width: auto;
  margin-right: 20px;
  margin-left: 30px;
  color: #000000;
  border: none;
  background-color: transparent;
}
.menu-btn {
  background-image: url('~@/assets/text-left.svg');
  background-repeat: no-repeat;
  width: 24px;
  height: 24px;
  background-position: center;
  transition: transform 0.2s ease;
}

.user-btn {
  background-image: url('~@/assets/icon-user.svg');
  background-size: cover;
  background-repeat: no-repeat;
  width: 25px;
  height: 25px;
  opacity: 0.85;
  padding: 0;
  margin-left: 10px;
}

.header-top {
  width: 100%;
  margin-left: 0;
  margin-right: 0;
  height: 69px;
  border-left: 1px rgba(0, 0, 0, 0.05) solid;
  border-bottom: 1px rgba(0, 0, 0, 0.05) solid;
  background-color: #ffffff;
}

.project-name {
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 39px;
}

.btn-edit {
  background-size: contain;
  background-repeat: no-repeat;
  width: 22px;
  height: 22px;
  opacity: 0.85;
  background-image: url('~@/assets/edit.svg');
  padding: 0;
}

.info-btn {
  color: #d2072c;
}

.info-btn:hover {
  color: #000000;
}

.btn--logout {
  max-width: none;
  width: auto;
  font-weight: normal;
  padding: 12px 10px;
}

.btn-setting {
  background-size: contain;
  background-repeat: no-repeat;
  width: 24px;
  height: 24px;
  padding: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='4' stroke='black' stroke-width='2'/%3E%3Crect x='11' y='5' width='2' height='4' rx='1' fill='black'/%3E%3Crect x='11' y='15' width='2' height='4' rx='1' fill='black'/%3E%3Crect x='17.5623' y='7.63403' width='2' height='4' rx='1' transform='rotate(60 17.5623 7.63403)' fill='black'/%3E%3Crect x='8.90186' y='12.634' width='2' height='4' rx='1' transform='rotate(60 8.90186 12.634)' fill='black'/%3E%3Crect x='18.5623' y='14.634' width='2' height='4' rx='1' transform='rotate(120 18.5623 14.634)' fill='black'/%3E%3Crect x='9.90186' y='9.63403' width='2' height='4' rx='1' transform='rotate(120 9.90186 9.63403)' fill='black'/%3E%3C/svg%3E%0A");
}

.button-add {
  display: block;
  border: none;
  text-decoration: none;
  color: #000000;
  border-radius: 8px;
  background: #ffffff;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  padding: 14px 16px;
}

.button-add--icon {
  padding: 14px 36px 14px 16px;
  background-size: 10px;
  background-position: calc(100% - 16px) center;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='4' width='2' height='10' rx='1' fill='%23C31419'/%3E%3Crect x='10' y='4' width='2' height='10' rx='1' transform='rotate(90 10 4)' fill='%23C31419'/%3E%3C/svg%3E%0A");
}

</style>
