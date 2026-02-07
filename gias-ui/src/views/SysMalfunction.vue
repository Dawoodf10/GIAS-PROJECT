<template>
    <div :key="componentKey" class="table-container">
      <h2 class="smh">System Malfunction Alerts</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Time</th>
            <th>Value</th>
            <th>Solution</th>
            <th>Resolution</th>
            <th>Remarks</th>
            <th>GitKit</th>
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
            <td>{{ alert.status_code }}</td>
            <td>{{ alert.status_time }}</td>
            <td>{{ alert.alert_value }}</td>
            <td>{{ alert.alert_solution }}</td>
            <td>{{ alert.alert_resolution }}</td>
            <td>{{ alert.alert_remarks }}</td>
            <td>{{ alert.alert_gitk }}</td>
            <td>{{ alert.alert_instance }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
<script>
  import { fetchSystemMalfunctions } from '@/services/DataService';
  
  export default {
    name: 'SystemMalfunctionTable',
    data() {
      return {
        componentKey: 0,
        alerts: []
      };
    },
    async created() {
      await this.fetchSystemMalfunctions();
    },
    methods: {
        getStatusText(status_code) {
      // Map status code to text
      const statusTextMap = {
        5: "System Malfunction",
        // Add other status codes and their corresponding text here
      };
      return statusTextMap[status_code] || status_code;
    },

      async fetchSystemMalfunctions() {
        try {
          const { system_malfunctions } = await fetchSystemMalfunctions();
          this.alerts = system_malfunctions;
        } catch (error) {
          console.error('Error fetching system malfunctions:', error);
        }
      }
    }
  };
</script>

<style scoped>
@import '@/assets/common-style.css';

/* Add any component-specific styles here */
th {
  color:white;
  background-color: rgb(80, 145, 225)
}

</style>
