<template>
  <div class="analytic-report">
    <h1>Analytic Report</h1>
    <div class="filter">
      <label for="alert-type">Select Alert Type:  </label>
      <select id="alert-type" v-model="selectedAlertType" @change="fetchAnalyticReport" class="select-alert-type">
        <option value="system_malfunction">System Malfunction</option>
        <option value="Critical">Critical</option>
        <option value="Warning">Warnings</option>
        <option value="Root Logins">Root Logins</option>
      </select>
    </div>
    <div v-for="report in reports" :key="report.state" class="table-container">
      <h2>{{ report.state }}: {{ report.count }}</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th v-if="selectedAlertType === 'system_malfunction'">Status Time</th>
            <th v-else>Alert Time</th>
            <th v-if="selectedAlertType !== 'system_malfunction'">Last Alert</th>
            <th>Value</th>
            <th>Solution</th>
            <th>Resolution</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="detail in report.details" :key="detail.alert_id">
            <td>{{ detail.alert_id }}</td>
            <td v-if="selectedAlertType === 'system_malfunction'">{{ detail.status_time }}</td>
            <td v-else>{{ detail.alert_time }}</td>
            <td v-if="selectedAlertType !== 'system_malfunction'">{{ detail.last_alert }}</td>
            <td>{{ detail.alert_value }}</td>
            <td>{{ detail.alert_solution }}</td>
            <td>{{ detail.alert_resolution }}</td>
            <td>{{ detail.alert_remarks }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getAnalyticReport } from '@/services/DataService';

export default {
  name: 'AnalyticReport',
  data() {
    return {
      reports: [],
      selectedAlertType: 'system_malfunction' // Default selected alert type
    };
  },
  created() {
    this.fetchAnalyticReport();
  },
  methods: {
    async fetchAnalyticReport() {
      try {
        const response = await getAnalyticReport(this.selectedAlertType);
        console.log('Response:', response);  
        this.reports = response.alerts;
      } catch (error) {
        console.error('Error fetching alert report:', error);
      }
    }
  }
};
</script>

<style scoped>
.analytic-report {
  padding: 5px;
}

.filter {
  margin-bottom: 15px;
}

.table-container {
  margin-top: 15px;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-container h2 {
  margin-bottom: 6px;
  font-size: 1.5em;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 7px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: rgb(35, 68, 139);
  color: white;
}

tr:nth-child(odd) {
  background-color: rgb(230, 246, 255);
}

tr:nth-child(even) {
  background-color: white;
}

.select-alert-type {
  width: 200px; 
  padding: 8px; 
  font-size: 16px; 
}
</style>


