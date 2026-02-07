<template>
  <div :key="componentKey" class="table-container" >
    <h2 class='wh'>Warning Alerts
        <div class="search">
          <input placeholder="search" v-model="searchText" class="search-field" />
          <div class="hourglass" @click="performSearch">
            <i class="fa-solid fa-hourglass-start"></i>
          </div>
        </div>
        <div>
          <!-- status:['null','Active','Maintenance','False Alert','Resolved','System Malfunction'], -->
          <span v-if="mode === 'all'">Warning Alerts</span>
          <span v-if="mode === 'search'">Warning Alerts</span>
  
          <span v-if="mode === 'maintenance'">Warning Maintenance Alerts</span>
          <span v-if="mode === 'active'">Warning Active Alerts</span>
          <span v-if="mode === 'false-alert'">Warning False Alerts</span>
        </div>
        
        
        <div class="dropdown">
          <button class="dropbtn" @click="toggleDropdown">⋮</button>
          <div class="dropdown-content" v-show="showDropdown">
            <a href="#" @click.prevent="viewFalseAlert()" data={null}>View False Alert</a>
            <a href="#" @click.prevent="viewActive()" data={null}>View Active</a>
            <a href="#" @click.prevent="viewMaintenance()" data={null}>View Maintenance</a>
            <a href="#" @click.prevent="markAsResolved()">Mark as Resolved</a>
    
          </div>
        </div>

    </h2>
    
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
          <TH>DFGHJ</TH>
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
          <td>{{ alert.alert_instance }}</td>
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
// import { fetchAlertsAndStatusOptions, updateAlertStatus } from '@/services/DataService';
// import Editicon from '@/assets/edit-icon.png';
// import Crossicon from '@/assets/cross-icon.png';
import { fetchAlertsAndStatusOptions, updateAlertStatus,fetchFalseAlerts, fetchMaintenance, fetchActive } from '@/services/DataService';
import Editicon from '@/assets/edit-icon.png';
import Crossicon from '@/assets/cross-icon.png';
import axios from "axios"

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

  
    methods: {
  //To change the mode 
  modechange(){
    this.searchText=''
    console.log("sgyuy")

    this.mode = 'all'
    // window.location.reload()  
  },

  

  //to view False alerts
  async viewFalseAlert() {
      try {
        const data = await fetchFalseAlerts();
        this.falsealert = data['false_alerts']
        console.log(this.falsealerts)
        this.$emit('update:falsealerts', data.false_alerts);
        alert('False alerts data fetched successfully.');
        this.mode = 'false-alert'
      } catch (error) {
        console.error('Error fetching false alerts:', error);
        alert("Failed to fetch false alerts. Error: ${error.message}");
      }
    },

    //To view Maintenance
    async viewMaintenance(){
      try{
        const data = await fetchMaintenance();
        this.maintenance = data['maintenance']
        console.log(this.maintenance)
        this.$emit('update:maintenance', data.maintenance);
        alert('Maintenance data fetched successfully.');
        this.mode = 'maintenance'
      
      }catch(error){
        console.error('Error fetching Maintenance alerts:', error);
        alert("Failed to fetch Maintenance alerts. Error: ${error.message}");
      }
     
     
      // try{
      //   const data = await fetchMaintenance();
      //   this.maintenance = data['maintenance']
      //   this.$emit('update:maintenance',data);
      //   console.log('main',data['maintenance'])
      //   // this.$emit('update:maintenance',data);
      //   alert("Maintenance data has been fetched");
      //   this.mode = 'maintainance'
      // }
    
    },


    //to view Active
    async viewActive(){
      try{
        const data = await fetchActive();
        this.active = data['active']
        this.$emit('update:active',data.active);
        alert("Active data has been fetched");
        this.mode = 'active'
      }
      catch (error) {
        console.error('Error fetching Active Data:', error);
        alert("Failed to fetch Active Data. Error: ${error.message}");
      }
    },


    
  toggleSelectAll() {
    this.alerts.forEach(alert => {
      alert.selected = this.selectAll;
    });
  },

  toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    performSearch() {
      if (this.searchText) {
        axios.post('http://192.168.0.111:5000/search', { query: this.searchText })
          .then(response => {
            this.searchResults = response.data;
            this.mode = 'search';
          })
          .catch(error => {
            console.error('There was an error!', error);
          });
      } else {
        this.searchResults = [];
      }
    },

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
}
};
</script>


<style scoped>
@import '@/assets/common-style.css';

/* Add any component-specific styles here */
th {
  color:white;
  background-color:rgb(42, 82, 169)
}
.edit-icon:hover {
  background-color:rgb(42, 82, 169)/* Adjust hover background color */
}


/* Container for dropdown and search */
.ch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px; /* Optional: Add padding to give some space on the sides */
}

/* Dropdown styles */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  background-color: #23448b;
  font-size: 16px;
  padding: 10px;
}

/* Ensure dropdown content aligns correctly */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1000; /* Ensure dropdown is above other content */
  top: 100%; /* Position dropdown directly below the button */
  left: 0; /* Align dropdown with the left edge of the button */
}

/* Dropdown item styles */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  font-size: 12px;
  display: block;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

/* Search styles */
.search {
  display: flex;
  align-items: center;
  gap: 10px; /* Space between search field and hourglass */
}

.search-field {
  height: 30px;
  border-radius: 5px;
  font-size: 14px;
  padding: 0 10px; /* Optional: Add padding inside the input field */
}

.hourglass {
  cursor: pointer; /* Make hourglass clickable */
}

.search-icon {
  font-size: 20px;
}

/* Ensure dropdown is visible on hover for testing */
.dropdown:hover .dropdown-content {
  display: block;
}

</style >