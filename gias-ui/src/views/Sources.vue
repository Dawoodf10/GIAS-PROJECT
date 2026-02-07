<template>
  <div class="alert-source-form">
    <h2>Alert Source</h2>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    <div v-if="alertSources.length > 0" class="table-container">
      <table class="status-table">
        <thead>
          <tr>
            <th>Alert Source</th>
            <th>Source Details</th>
            <th>Alert Frequency</th>
            <th>Run Type</th>
            <th>Schedule Type</th>
            <th>Scheduled Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(source, index) in alertSources" :key="index">
            <td>{{ source.source }}</td>
            <td>{{ source.details }}</td>
            <td>{{ source.frequency }}</td>
            <td>{{ source.runtype }}</td>
            <td>{{ source.scheduletype }}</td>
            <td>{{ source.scheduledtime }}</td>
            <td class="action-buttons">
              <button @click="editAlertSource(source)"><i class="fa fa-edit"></i></button>
              <button @click="confirmDelete(source.source)"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button @click="addNew">Add New</button>

    <!-- Modal for editing -->
    <div class="modal" v-if="showForm">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Edit Alert Source</p>
          <button class="delete" aria-label="close" @click="cancel"></button>
        </header>
        <section class="modal-card-body">
          <form @submit.prevent="saveAlertSource">
            <div class="form-group">
              <label for="alert-source">Alert Source</label>
              <input type="text" id="alert-source" v-model="alertSource.source" required />
            </div>
            <div class="form-group">
              <label for="source-details">Source Details</label>
              <textarea id="source-details" v-model="alertSource.details" required></textarea>
            </div>
            <div class="form-group">
              <label for="alert-frequency">Alert Frequency (Enter in minutes)</label>
              <input type="text" id="alert-frequency" v-model="alertSource.frequency" required />
            </div>
            <div class="form-group">
              <label for="run-type">Run Type</label>
              <input type="text" id="run-type" v-model="alertSource.runtype" required />
            </div>
            <div class="form-group">
              <label for="schedule-type">Schedule Type</label>
              <select id="schedule-type" v-model="alertSource.scheduletype" required>
                <option value="periodic">Periodic</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            <div class="form-group">
              <label for="scheduled-time">Scheduled Time</label>
              <input type="text" id="scheduled-time" v-model="alertSource.scheduledtime" required pattern="\d{2}:\d{2}" placeholder="HH:MM"/>
            </div>
            <div class="field is-grouped">
              <div class="control">
                <button type="submit" class="button is-primary" v-if="!isEditing">Save</button>
                <button type="submit" class="button is-info" v-if="isEditing">Update</button>
              </div>
              <div class="control">
                <button type="button" class="button" @click="cancel">Cancel</button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>

    <div v-if="showConfirmDelete" class="confirm-dialog">
      <p>Are you sure you want to delete?</p>
      <button @click="deleteAlertSource">Yes</button>
      <button @click="cancelDelete">No</button>
    </div>

  </div>
</template>

<script>
import { getAlertSources, saveAlertSource, updateAlertSource, deleteAlertSource } from '@/services/DataService';

export default {
  name: 'AlertSourceForm',
  data() {
    return {
      alertSources: [],
      alertSource: {
        source: '',
        details: '',
        frequency: '',
        runtype: '',
        scheduletype: '',
        scheduledtime: ''
      },
      isEditing: false,
      successMessage: '',
      showForm: false,
      showConfirmDelete: false,
      sourceToDelete: null
    };
  },
  async created() {
    await this.fetchAlertSources();
  },
  methods: {
    async fetchAlertSources() {
      try {
        this.alertSources = await getAlertSources();
      } catch (error) {
        console.error('Error fetching alert sources:', error);
      }
    },
    async saveAlertSource() {
      try {
        if (this.isEditing) {
          await updateAlertSource(this.alertSource);
        } else {
          await saveAlertSource(this.alertSource);
        }

        this.clearForm();
        await this.fetchAlertSources();
        this.successMessage = 'Alert source saved successfully';

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      } catch (error) {
        console.error('Error saving/updating alert source:', error);
      }
    },
    editAlertSource(source) {
      this.alertSource = { ...source };
      this.isEditing = true;
      this.showForm = true;
    },
    addNew() {
      // Show form to add new status
      this.clearForm();
      this.showForm = true;
    },
    cancel() {
      this.clearForm();
    },
    confirmDelete(source) {
      this.sourceToDelete = source;
      this.showConfirmDelete = true;
    },
    cancelDelete() {
      // Hide confirmation dialog
      this.showConfirmDelete = false;
      this.statusToDelete = null;
    },
    async deleteAlertSource() {
      try {
        await deleteAlertSource(this.sourceToDelete);
        this.successMessage = 'Alert source deleted successfully';
        this.showConfirmDelete = false;
        this.sourceToDelete = null;
        await this.fetchAlertSources();
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      } catch (error) {
        console.error('Error deleting alert source:', error);
      }
    },
    clearForm() {
      this.alertSource = {
        source: '',
        details: '',
        frequency: '',
        runtype: '',
        scheduletype: '',
        scheduledtime: ''
      };
      this.successMessage = '';
      this.isEditing = false;
      this.showForm = false;
    }
  }
};
</script>

<style scoped>
.alert-source-form {
  max-width: 100%;
  margin: 10px auto;
  padding: 10px; /* Increased padding for better layout */
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 50px;
}

.form-group {
  margin-bottom: 10px; /* Adjusted margin between form groups */
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.table-container {
  overflow-x: auto; /* Allow horizontal scrolling if needed */
}

.status-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.status-table th, .status-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  vertical-align: middle;
}

.status-table th {
  background-color: rgb(35, 68, 139);
  color: white;
}

.status-table td {
  background-color: #fff;
}

.success-message {
  margin-top: 10px;
  padding: 10px;
  color: white;
  background-color: green;
  border-radius: 3px;
  text-align: center;
}

.confirm-dialog {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.confirm-dialog button {
  margin: 0 10px;
}

.action-buttons {
  display: flex; /* Use flexbox for layout */
  justify-content: center; /* Center the buttons */
}

.action-buttons button {
  margin: 0 5px; /* Add margin between buttons */
}

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-card {
  background: white;
  border-radius: 5px;
  max-width: 90%;
  width: 600px;
  max-height: 80%;
  overflow-y: auto;
  z-index: 1001;
}

.modal-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
}

.modal-card-title {
  margin: 0;
}

.modal-card-body {
  padding: 20px;
}

.modal-card-body .form-group {
  margin-bottom: 20px;
}

.modal-card-body .form-group input,
.modal-card-body .form-group textarea,
.modal-card-body .form-group select {
  width: 100%;
}

.field.is-grouped .control {
  margin-right: 10px;
}

.delete {
  background: none;
  border: none;
  font-size: 1.5rem;
}
</style>