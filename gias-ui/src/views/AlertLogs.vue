<template>
    <div :key="componentKey" class="table-container">
      <h2 class='ah'>Alert Logs</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Text</th>
            <th>Time</th>
            <th>Value</th>
            <th>Last Alert</th>
            <th>Status</th>
            <th>Status Update Time</th>
            <th>GitKit</th>
            <th>Solution</th>
            <th>Resolution</th>
            <th>Remarks</th>
            <th>Instance</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(alert, index) in alerts"
            :key="alert.alert_id"
            :class="{'odd-row': index % 2 !== 0, 'even-row': index % 2 === 0 }"
          >
            <td>{{ alert.alert_id }}</td>
            <td>{{ alert.alert_type }}</td>
            <td>{{ alert.alert_text }}</td>
            <td>{{ alert.alert_time }}</td>
            <td>{{ alert.alert_value }}</td>
            <td>{{ alert.last_alert }}</td>
            <td>{{ alert.alert_status }}</td>
            <td>{{ alert.update_date }}</td>
            <td>{{ alert.alert_gitkit }}</td>
            <td>{{ alert.alert_solution }}</td>
            <td>{{ alert.alert_resolution }}</td>
            <td>{{ alert.alert_remarks }}</td>
            <td>{{ alert.alert_instance }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="13" class="end-of-page">
              <!-- Empty cell for blue line -->
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </template>
  
  <script>
  import { fetchAlerts } from '@/services/DataService';
  
  export default {
    name: 'AlertLogs',
    data() {
      return {
        componentKey: 0,
        alerts: [],  // Data array to hold the alerts
      };
    },
    created() {
      this.fetchAlertsData();
    },
    methods: {
      async fetchAlertsData() {
        try {
          const response = await fetchAlerts();
          this.alerts = response.alerts;
        } catch (error) {
          console.error('Error fetching alerts:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  @import '@/assets/common-style.css';
  
  /* Add any component-specific styles here */
  th {
    color: white;
    background-color: rgb(62, 131, 205);
  }
  
  .end-of-page {
    background-color: blue; /* Example for the blue line */
  }
  
  .odd-row {
    background-color: #f9f9f9;
  }
  
  .even-row {
    background-color: #fff;
  }
  </style>
  