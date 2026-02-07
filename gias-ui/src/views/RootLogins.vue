<template>
  <div :key="componentKey" class="table-container">
    <h2 class='rh'>Root Logins</h2>
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
          <th>Status update time</th>
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
          <td>
            {{ alert.alert_status }}
            <button @click="openEditModal(alert)" class="button is-small is-info edit-icon">
              <img :src="Editicon" alt="edit" class="edit-icon" />
            </button>
          </td>
          <td>{{ alert.update_date }}</td>
          <td>{{ alert.alert_gitkit }}</td>
          <td>{{ alert.alert_solution }}</td>
          <td>{{ alert.alert_resolution }}</td>
          <td>{{ alert.alert_remarks }}</td>
          <td>{{ alert.instance }}</td>
        </tr>
      </tbody>
    </table>
    <tfoot>
        <tr>
          <td colspan="13" class="end-of-page">
            <!-- Empty cell for blue line -->
          </td>
        </tr>
      </tfoot>    
    <!-- Modal for editing -->
    <div class="modal" ref="editModal" :class="{ 'is-active': showModal }">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-card">
        <!-- <header class="modal-card-head">
          <h2>Edit alert</h2>
          <div class="close-button" @click="closeModal">
          <img :src="Crossicon" alt="Close">
          </div>
        </header> -->
        <section class="modal-card-body">
          <form @submit.prevent="handleSubmit" class="form-grid">
            <div class="field">
              <label class="label">Alert ID:</label>
              <input class="input" type="text" v-model="selectedAlert.alert_id" readonly />
            </div>
            <div class="field">
              <label class="label">Alert Type:</label>
              <input class="input" type="text" v-model="selectedAlert.alert_type" readonly />
            </div>
            <div class="field">
              <label class="label">Alert Text:</label>
              <input class="input" type="text" v-model="selectedAlert.alert_text" readonly />
            </div>
            <div class="field">
              <label class="label">Alert Value:</label>
              <input class="input" type="text" v-model="selectedAlert.alert_value" readonly />
            </div>
            <div class="field">
              <label class="label">Alert Time:</label>
              <input class="input" type="text" v-model="selectedAlert.alert_time" readonly />
            </div>
            <div class="field">
              <label class="label">Last Alert:</label>
              <input class="input" type="text" v-model="selectedAlert.last_alert" readonly />
            </div>
            <div class="field">
              <label class="label">Current Status:</label>
              <input class="input" type="text" v-model="selectedAlert.alert_status" readonly />
            </div>
            <div class="field">
              <label class="label">New Status:</label>
              <div class="select">
                <select v-model="selectedAlert.selected_status">
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="FalseAlert">False Alert</option>
                  <option value="Resolved">Resolved</option>
                  <option value="SystemMalfunction">System Malfunction</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label class="label">Solution:<span class="required">*</span></label>
              <input class="input" v-model="selectedAlert.alert_solution">
            </div>
            <div class="field">
              <label class="label">Resolution:<span class="required">*</span></label>
              <input class="input" v-model="selectedAlert.alert_resolution">
            </div>
            <div class="field">
              <label class="label">Remarks:</label>
              <input class="input" v-model="selectedAlert.alert_remarks">
            </div>
            <div class="field">
              <label class="label">System Malfunction Start Time:</label>
              <input class="input" type="datetime-local" v-model="selectedAlert.start_time" />
            </div>
            <div class="field">
              <label class="label">System Malfunction End Time:</label>
              <input class="input" type="datetime-local" v-model="selectedAlert.end_time" />
            </div>
            <div class="field">
              <label class="label">Updated By:<span class="required">*</span></label>
              <input class="input" type="text" v-model="selectedAlert.updated_by" />
            </div>
            <div class="field">
              <label class="label">Updated Date:</label>
              <input class="input" type="datetime-local" v-model="selectedAlert.update_date" readonly />
            </div>
            <div class="field is-grouped">
              <div class="control">
                <button class="button is-primary" type="submit">Submit</button>
              </div>
              <div class="control">
                <button class="button" type="button" @click="closeModal">Cancel</button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchAlertsAndStatusOptions, updateAlertStatus } from '@/services/DataService';
import Editicon from '@/assets/edit-icon.png';
import Crossicon from '@/assets/cross-icon.png';

export default {
  name: 'CriticalAlertsTable',
  props: {
    alerts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      componentKey: 0,
      showModal: false,
      selectedAlert: {
        alert_id: '',
        alert_type: '',
        alert_text: '',
        alert_value: '',
        alert_time: '',
        last_alert: '',
        alert_status: '',
        selected_status: '',
        alert_gitkit: '',
        alert_solution: '',
        alert_resolution: '',
        alert_remarks: '',
        start_time: '',
        end_time: '',
        updated_by: '',
        update_date: ''
      },
      statusOptions: [],
      Editicon: Editicon,
      Crossicon: Crossicon
    };
  },
  methods: {
    async fetchAlertData() {
      try {
        const response = await fetchAlertsAndStatusOptions();
        this.$emit('update:alerts', response.alerts);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        throw error;
      }
    },
    openEditModal(alert) {
      this.selectedAlert = { ...alert, selected_status: alert.alert_status };
      this.updateDateTime(); 
      this.showModal = true;
    },
    updateDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      this.selectedAlert.update_date = `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    async handleSubmit() {
      await this.updateStatus();
      await this.fetchAlertData();
      window.alert('Status updated successfully');
      this.closeModal();
    },
    async updateStatus() {
      this.componentKey += 1;
      try {
        const { alert_id, selected_status, alert_solution, alert_resolution, alert_remarks, start_time, end_time, updated_by, update_date } = this.selectedAlert;
        await updateAlertStatus(alert_id, selected_status, alert_solution, alert_resolution, alert_remarks, start_time, end_time, updated_by, update_date);
        
        const alertIndex = this.alerts.findIndex(alert => alert.alert_id === alert_id);
        if (alertIndex !== -1) {
          this.$set(this.alerts, alertIndex, { ...this.selectedAlert, alert_status: selected_status });
          alert('Status updated successfully');
        }
      } catch (error) {
        console.error('Error updating status:', error);
      }
    },
    closeModal() {
      this.showModal = false;
    }
  }
};
</script>

<style scoped>
@import '@/assets/common-style.css';

/* Add any component-specific styles here */
th {
  color:white;
  background-color: rgb(62, 131, 205)
}

.edit-icon:hover{
  background-color:rgb(62, 131, 205);
}

</style>