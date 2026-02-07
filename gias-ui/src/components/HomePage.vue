<template>
  <div class="home-page">
    <!-- Alerts section -->
    <div class="announcements-bar">
      <HorizontalAnnouncements />
    </div>
    <div class="alerts-container">
      <!-- Existing alert sections -->
      <div class="alert critical" @click="showTable('critical')">
        <div class="alert-content">
          <img :src="criticalLogo" alt="Critical Logo" class="alert-logo" />
          <h4>Critical Alerts ({{ criticalAlertCount }})</h4>
        </div>
      </div>
      <div class="alert warning" @click="showTable('warnings')">
        <div class="alert-content">
          <img :src="warningLogo" alt="Warning Logo" class="alert-logo" />
          <h4>Warnings ({{ warningAlertCount }})</h4>
        </div>
      </div>
      <div class="alert login" @click="showTable('logins')">
        <div class="alert-content">
          <img :src="loginLogo" alt="Login Logo" class="alert-logo" />
          <h4>Root Logins ({{ rootLoginCount }})</h4>
        </div>
      </div>
      <div class="alert malfunction" @click="showTable('malfunction')">
        <div class="alert-content">
          <img :src="malfunctionLogo" alt="Malfunction Logo" class="alert-logo" />
          <h5>System Malfunction ({{ alertCounts.systemMalfunctionCount }})</h5>
        </div>
      </div>
      <div class="alert logs" @click="showTable('alertLogs')">
        <div class="alert-content">
          <img :src="logsLogo" alt="Logs Logo" class="alert-logo" />
          <h4>Alert Logs ({{ alertCounts.alertLogsCount }})</h4>
        </div>
      </div>
      <div class="alert source" @click="showTable('alertSource')">
        <div class="alert-content">
          <img :src="sourceLogo" alt="Source Logo" class="alert-logo" />
          <h4>Alert Source ({{ alertSourceCount }})</h4>
        </div>
      </div>
    </div>

    <!-- Table display -->
    <div class="table-display">
      <CriticalTable
        v-if="currentTable === 'critical'"
        :alerts="filteredAlerts"
        @update:maintenance = "handleMaintenance"
        :statusOptions="statusOptions"
      />
      <WarningTable
        v-if="currentTable === 'warnings'"
        :alerts="filteredAlerts"
        :statusOptions="statusOptions"
      />
      <RootLoginsTable
        v-if="currentTable === 'logins'"
        :alerts="filteredAlerts"
        :statusOptions="statusOptions"
      />
      <SystemMalfunctionTable
        v-if="currentTable === 'malfunction'"
        :alerts="filteredAlerts"
        :statusOptions="statusOptions"
      />
      <AlertLogs v-if="currentTable === 'alertLogs'" />
      <AlertSource
        v-if="currentTable === 'alertSource'"
        :alertSources="alertSources"
      />
    </div>
  </div>
</template>

<script>
import { fetchAlertsAndStatusOptions, fetchSystemMalfunctions, fetchAlerts, getAlertSources } from '@/services/DataService';
import CriticalTable from '@/views/CriticalAlerts.vue';
import WarningTable from '@/views/WarningPage.vue';
import RootLoginsTable from '@/views/RootLogins.vue';
import SystemMalfunctionTable from '@/views/SysMalfunction.vue';
import AlertLogs from '@/views/AlertLogs.vue';
import AlertSource from '@/views/Sources.vue';
import HorizontalAnnouncements from '@/views/Announcements.vue';
import criticalLogo from '@/assets/critical-logo.png';
import warningLogo from '@/assets/alert-logo.png';
import loginLogo from '@/assets/login-logo.png';
import logsLogo from '@/assets/logs-logo.png';
import sourceLogo from '@/assets/source-logo.png';
import malfunctionLogo from '@/assets/malfunction-logo.png';

export default {
  name: 'HomePage',
  components: {
    CriticalTable,
    WarningTable,
    RootLoginsTable,
    SystemMalfunctionTable,
    AlertLogs,
    AlertSource,
    HorizontalAnnouncements
  },
  data() {
    return {
      currentTable: 'critical',//for default display
      alerts: [],
      maintenance:[],
      active:[],
      falsealerts:[],

      statusOptions: [],
      alertCounts: {
        criticalCount: 0,
        warningCount: 0,
        rootLoginCount: 0,
        systemMalfunctionCount: 0,
        alertLogsCount: 0,  // Initially set to 0
        alertSourceCount: 0
      },
      criticalLogo,
      warningLogo,
      loginLogo,
      logsLogo,
      sourceLogo,
      malfunctionLogo,
    };
  },
  computed: {
    criticalAlertCount() {
      return this.alerts.filter(alert => alert.alert_type === 'Critical').length;
    },
    warningAlertCount() {
      return this.alerts.filter(alert => alert.alert_type === 'Warning').length;
    },
    rootLoginCount() {
      return this.alerts.filter(alert => alert.alert_type === 'Root Logins').length;
    },
    alertLogsCount() {
      return this.alertCounts.alertLogsCount;
    },
    systemMalfunctionCount() {
      return this.alerts.filter(alert => alert.alert_type === '5').length;
    },
    alertSourceCount() {
      return this.alertCounts.alertSourceCount;
    },
    filteredAlerts() {
      return this.alerts.filter(alert => {
        if (this.currentTable === 'critical') {
          return alert.alert_type === 'Critical';
        } else if (this.currentTable === 'warnings') {
          return alert.alert_type === 'Warning';
        } else if (this.currentTable === 'logins') {
          return alert.alert_type === 'Root Logins';
        } else if (this.currentTable === 'malfunction') {
          return alert.status_code === 5;
        }
        return false;
      });
    },
  },
  created() {
    this.loadAlertsAndStatusOptions();
    this.loadSystemMalfunctionCount();
    this.loadAlertLogsCount();
    this.loadAlertSourceCount();
  },
  methods: {
    handleMaintenance(data){
      this.maintenance = data

    },
    async loadAlertsAndStatusOptions() {
      try {
        const data = await fetchAlertsAndStatusOptions();
        this.alerts = data.alerts;
        this.statusOptions = data.status_options;
        this.alerts.forEach(alert => {
          alert.selected_status = alert.alert_status;
        });

        // Update counts after fetching alerts
        this.updateAlertCounts();
      } catch (error) {
        console.error('Error loading alerts and status options:', error);
      }
    },
    async loadSystemMalfunctionCount() {
      try {
        const data = await fetchSystemMalfunctions();
        this.alertCounts.systemMalfunctionCount = data.system_malfunctions.length;
      } catch (error) {
        console.error('Error loading system malfunctions:', error);
      }
    },
    async loadAlertLogsCount() {
      try {
        const data = await fetchAlerts();
        this.alertCounts.alertLogsCount = data.alerts.length;
      } catch (error) {
        console.error('Error loading alert logs:', error);
      }
    },
    async loadAlertSourceCount() {
      try {
        const data = await getAlertSources();
        this.alertCounts.alertSourceCount = data.length;
      } catch (error) {
        console.error('Error loading alert sources:', error);
      }
    },
    updateAlertCounts() {
      this.alertCounts.criticalCount = this.criticalAlertCount;
      this.alertCounts.warningCount = this.warningAlertCount;
      this.alertCounts.rootLoginCount = this.rootLoginCount;
    },
    showTable(table) {
      this.currentTable = table;
    },
  },
};
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding: 2px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
}

.announcements-bar {
  width: 100%;
}

.alerts-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 1200px;
  margin-top: 2px;
}

.alert {
  flex: 1;
  padding-bottom: 1px;
  margin: 2px;
  padding: 2px;
  border-radius: 5px;
  text-align: center;
  border: 1px solid #ccc;
  cursor: pointer;
  width: 100%;
}

.alert-content {
  padding-bottom: 1px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
}

.alert-logo {
  height: 30px;
  margin-right: 5px;
}

.critical {
  background-color: rgb(35, 68, 139);
}

.warning {
  background-color: rgb(42, 82, 169);
}

.login {
  background-color: rgb(62, 131, 205);
}

.malfunction {
  background-color: rgb(80, 145, 225);
}

.logs {
  background-color: rgb(100, 170, 240);
}

.source {
  background-color: rgb(120, 190, 255);
}

.table-display {
  width: 100%;
  max-width: 1200px;
  margin-top: 2px;
}
</style>