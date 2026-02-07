<template>
  <div class="status-form">
    <h2>Status Master</h2>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    <div v-if="statuses.length > 0">
      <table class="status-table">
        <thead>
          <tr>
            <th>Status Code</th>
            <th>Status Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(status, index) in statuses" :key="index">
            <td>{{ status.code }}</td>
            <td>{{ status.name }}</td>
            <td>
              <button @click="editStatus(status)"><i class="fa fa-edit"></i></button>
              <button @click="confirmDelete(status.code)">
                <i class="fa fa-trash"></i> 
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button @click="addNew">Add New</button>

    <!-- Modal for editing/adding -->
    <div class="modal" v-if="showForm">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ isEditing ? 'Edit Status' : 'Add New Status' }}</p>
          <button class="delete" aria-label="close" @click="cancel"></button>
        </header>
        <section class="modal-card-body">
          <form @submit.prevent="saveStatus">
            <div class="form-group">
              <label for="code">Status Code</label>
              <input type="text" id="code" v-model="status.code" required />
            </div>
            <div class="form-group">
              <label for="name">Status Name</label>
              <input type="text" id="name" v-model="status.name" required />
            </div>
            <div class="field is-grouped">
              <div class="control">
                <button type="submit" class="button is-primary">{{ isEditing ? 'Update' : 'Save' }}</button>
              </div>
              <div class="control">
                <button type="button" class="button" @click="cancel">Cancel</button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>

    <!-- Modal for confirming delete -->
    <div class="modal" v-if="showConfirmDelete">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Confirm Delete</p>
          <button class="delete" aria-label="close" @click="cancelDelete"></button>
        </header>
        <section class="modal-card-body">
          <p>Are you sure you want to delete this status?</p>
          <div class="field is-grouped">
            <div class="control">
              <button class="button is-danger" @click="deleteStatus">Yes</button>
            </div>
            <div class="control">
              <button class="button" @click="cancelDelete">No</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { get_statuses, saveStatus, updateStatus, deleteStatus } from '@/services/DataService';

export default {
  name: 'StatusMaster',
  data() {
    return {
      statuses: [], // Array to hold existing status data
      status: {
        code: '',
        name: '',
        old_code: ''
      },
      isEditing: false, // Flag to track whether we are editing an existing status
      successMessage: '',
      showForm: false, // Flag to show/hide the form
      showConfirmDelete: false, // Flag to show/hide the confirmation dialog
      statusToDelete: null
    };
  },
  async created() {
    // Fetch existing statuses when component is created
    await this.fetchStatuses();
  },
  methods: {
    async fetchStatuses() {
      try {
        // Fetch statuses from backend
        this.statuses = await get_statuses();
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    },
    async saveStatus() {
      try {
        if (this.isEditing) {
          // Update existing status
          await updateStatus(this.status); 
        } else {
          // Add new status
          await saveStatus(this.status);
        }
        
        this.clearForm();
        await this.fetchStatuses(); // Refresh the status list
        this.successMessage = 'Status saved successfully';

        // Hide the success message after a few seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
        
      } catch (error) {
        console.error('Error saving/updating status:', error);
      }
    },
    editStatus(status) {
      // Set form fields to edit mode
      this.status = { ...status, old_code: status.code };
      this.isEditing = true;
      this.showForm = true;
    },
    addNew() {
      // Show form to add new status
      this.clearForm();
      this.showForm = true;
    },
    cancel() {
      // Clear form and hide it
      this.clearForm();
    },
    confirmDelete(code) {
      // Show confirmation dialog
      this.statusToDelete = code;
      this.showConfirmDelete = true;
    },
    cancelDelete() {
      // Hide confirmation dialog
      this.showConfirmDelete = false;
      this.statusToDelete = null;
    },
    async deleteStatus() {
      try {
        // Delete the status
        await deleteStatus(this.statusToDelete);
        this.successMessage = 'Status deleted successfully';
        this.showConfirmDelete = false;
        this.statusToDelete = null;
        await this.fetchStatuses(); // Refresh the status list
        // Hide the success message after a few seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      } catch (error) {
        console.error('Error deleting status:', error);
      }
    },
    clearForm() {
      this.status = {
        code: '',
        name: '',
        old_code: ''
      };
      this.isEditing = false;
      this.showForm = false;
      this.successMessage = '';
    }
  }
};
</script>

<style scoped>
.status-form {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.status-table {
  border-collapse: collapse;
  margin-top: 15px;
  width:50%;
  align-items: center;
}

.status-table th, .status-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.success-message {
  margin-top: 10px;
  padding: 10px;
  color: white;
  background-color: green;
  border-radius: 3px;
  text-align: center;
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
</style>
