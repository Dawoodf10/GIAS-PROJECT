<template>
  <div :key="componentKey" class="table-container" >
   <div>
    <!-- <input type="text" v-model="searchText"  placeholder="Search..." /><button @click="performSearch">search</button> -->
    <!-- <ul>
      <li v-for="result in searchResults" :key="result.id">{{ result.id }}</li>
    </ul> -->
  </div >
  <h2 class="ch">
      <div class="search">
        <input placeholder="search" v-model="searchText" class="search-field" />
        <div class="hourglass" @click="performSearch">
          <i class="fa-solid fa-hourglass-start"></i>
        </div>
      </div>
      <div>
        <!-- status:['null','Active','Maintenance','False Alert','Resolved','System Malfunction'], -->
        <span v-if="mode === 'all'">Critical Alerts</span>
        <span v-if="mode === 'search'">Critical Alerts</span>

        <span v-if="mode === 'maintenance'">Critical Maintenance Alerts</span>
        <span v-if="mode === 'active'">Critical Active Alerts</span>
        <span v-if="mode === 'false-alert'">Critical False Alerts</span>
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
          <th>
            Mute
            <i
              :class="muteIconClass"
              @click="toggleMuteAll"
              style="cursor: pointer;"
            ></i>
          </th>
          <th style="text-align: center;">
            <div>Select&nbsp;All</div>
            <input 
              class="main-checkbox" 
              type="checkbox" 
              v-model="selectAll" 
              @change="toggleSelectAll"
              style="margin-left: auto; margin-right: auto;"
            />
          </th>
        </tr>
      </thead>
      <tbody v-if="mode === 'all'"> 
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
          <td>{{ alert.alert_instance }}</td>
          <td v-if="alert.alert_status === 'Active'">
            <i
              :class="alert.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"
              @click="toggleMute(alert)"
              style="cursor: pointer;"
            ></i>
          </td>
          <td v-else>
            <!-- Empty cell to maintain table structure -->
          </td>
          <td style="text-align: center;">
            <input class="individual-checkbox" type="checkbox" v-model="alert.selected" />
          </td>
        </tr>
      </tbody>
      <tbody v-if="mode === 'search'">
        <tr 
        v-for="(alert, index) in searchResults"
          :key="alert.alert_id"
          :class="{'odd-row': index % 2 !== 0, 'even-row': index % 2 === 0 }"
          >
          <td>{{ alert[0] }}</td>
          <td>{{ alert[1] }}</td>
          <td>{{ alert[2] }}</td>
          <td>{{ alert[3] }}</td>
          <td>{{ alert[10] }}</td>
          <td>{{ alert[4] }}</td>
          <td>
            {{status[alert[5]] }}
            <button @click="openEditModal(alert)" class="button is-small is-info edit-icon">
              <img :src="Editicon" alt="edit" class="edit-icon" />
            </button>
          </td>          
          <td>{{ alert[7] }}</td>
          <td>{{ alert[6] }}</td>
          <td>{{ alert[9] }}</td>
          <td>{{ alert[8] }}</td>
          <td>{{ alert[9] }}</td>
          <td>{{ alert[11] }}</td>
          <td v-if="status[alert[5] ]=== 'Active'">
            <i
              :class="alert.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"
              @click="toggleMute(alert)"
              style="cursor: pointer;"
            ></i>
          </td>


       
          
          <td v-else>
            <!-- Empty cell to maintain table structure -->
          </td>
          <td style="text-align: center;">
            <input class="individual-checkbox" type="checkbox" v-model="alert.selected" />
          </td>

        </tr>
      </tbody>
      <tbody v-if="mode === 'false-alert'">
        <tr 
        v-for="(alert, index) in falsealert"
          :key="alert.alert_id"
          :class="{'odd-row': index % 2 !== 0, 'even-row': index % 2 === 0 }"
          >
          <td>{{ alert.alert_gitkit}}</td>
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
          <td>{{ alert.alert_instance }}</td>
          <td v-if="alert.alert_status === 'Active'">
            <i
              :class="alert.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"
              @click="toggleMute(alert)"
              style="cursor: pointer;"
            ></i>
          </td>
          <td v-else>
            <!-- Empty cell to maintain table structure -->
          </td>
          <td style="text-align: center;">
            <input class="individual-checkbox" type="checkbox" v-model="alert.selected" />
          </td>
        </tr>
      </tbody>
      <tbody v-if="mode === 'maintenance'">
        <tr 
        v-for="(alert, index) in this.maintenance"
          :key="alert.alert_id"
          :class="{'odd-row': index % 2 !== 0, 'even-row': index % 2 === 0 }"
          >
          <td>{{ alert.alert_gitkit }}</td>
          <td>{{ alert.alert_id}}</td>
          <td>{{ alert.alert_instance}}</td>
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
          <td>{{ alert.alert_instance }}</td>
          <td v-if="alert.alert_status === 'Active'">
            <i
              :class="alert.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"
              @click="toggleMute(alert)"
              style="cursor: pointer;"
            ></i>
          </td>
          <td v-else>
            <!-- Empty cell to maintain table structure -->
          </td>
          <td style="text-align: center;">
            <input class="individual-checkbox" type="checkbox" v-model="alert.selected" />
          </td>

        </tr>
      </tbody>
      <tbody v-if="mode === 'active'">
        <tr 
        v-for="(alert, index) in active"
          :key="alert.alert_id"
          :class="{'odd-row': index % 2 !== 0, 'even-row': index % 2 === 0 }"
          >
          <td>{{ alert.alert_gitkit }}</td>
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
          <td>{{ alert.alert_instance }}</td>
          <td v-if="alert.alert_status === 'Active'">
            <i
              :class="alert.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"
              @click="toggleMute(alert)"
              style="cursor: pointer;"
            ></i>
          </td>
          <td v-else>
            <!-- Empty cell to maintain table structure -->
          </td>
          <td style="text-align: center;">
            <input class="individual-checkbox" type="checkbox" v-model="alert.selected" />
          </td>
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
    <!-- Modal for editing -->
    <div class="modal" ref="editModal" :class="{ 'is-active': showModal }">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-card">
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
      mode:'all',
      selectAll:false,
     searchText: '',
     
     showDropdown: false, // New data property for dropdown visibility
      searchResults: [],
      // falseAlert:[],
      maintenance:[],
     
      // active:[],
      status:['null','Active','Maintenance','False Alert','Resolved','System Malfunction'],
       
      allMuted: true, // Start with all muted by default  
      componentKey: 0,
      showModal: false,
      selectAllChecked: false,
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
      Editicon: Editicon,
      Crossicon: Crossicon
    };
  },
   computed: {
    displayedAlerts() {
      return this.searchText ? this.searchResults : this.alerts;
    },
    muteIconClass() {
      return this.allMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    },
  },
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
    
    toggleMuteAll() {
      this.allMuted = !this.allMuted;
      if (!this.allMuted) {
        // Read all alerts aloud
        this.readAllAlerts();
      } else {
        // Stop reading alerts if muted
        this.stopReading();
      }
    },
    toggleMute(alert) {
      alert.muted = !alert.muted;
      if (alert.muted) {
        // Stop reading this alert if muted
        this.stopReading();
      } else {
        // Read this alert aloud if unmuted
        this.readText(alert.alert_text);
      }
    },
    readAllAlerts() {
      this.alerts.forEach(alert => {
        if (!alert.muted && alert.alert_status === 'Active') {
          this.readText(alert.alert_text);
        }
      });
    },
    stopReading() {
      // Stop any ongoing speech synthesis
      speechSynthesis.cancel();
    },
    readText(text) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    },


    //Fetch the main data
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
      if (alert.alert_status){
        this.selectedAlert = { ...alert, selected_status: alert.alert_status };

      }
      else{
        this.selectedAlert = { ...alert, selected_status: alert[5] };
      }
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
      this.selectedAlert.update_date = `${year}-${month}-${day}T${hours}:${minutes};`
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
        const {
          alert_id,
          selected_status,
          alert_solution,
          alert_resolution,
          alert_remarks,
          start_time,
          end_time,
          updated_by,
          update_date
        } = this.selectedAlert;
        await updateAlertStatus(
          alert_id,
          selected_status,
          alert_solution,
          alert_resolution,
          alert_remarks,
          start_time,
          end_time,
          updated_by,
          update_date
        );

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
  },
  markAsResolved() {
    this.alerts.forEach(alert => {
      if (alert.selected) {
        alert.alert_status = 'Resolved'; // Set status to Resolved
      }
    });

    // Optionally update the backend or UI to reflect the changes
    // this.updateStatusOnBackend();
  },
  
  async updateStatusOnBackend() {
    try {
      for (const alert of this.alerts) {
        if (alert.selected) {
          await updateAlertStatus(
            alert.alert_id,
            'Resolved', 
            alert.alert_solution,
            alert.alert_resolution,
            alert.alert_remarks,
            alert.start_time,
            alert.end_time,
            alert.updated_by,
            alert.update_date
          );
        }
      }
      alert('Selected alerts marked as resolved.');
    } catch (error) {
      console.error('Error updating alerts:', error);
    }
  }
   
  };
</script>



<style scoped>
/* Dropdown container */
.ch {
  display: flex;
  align-items: center;
  justify-content:space-between;
  height: 60px;
}
.ch span {
 margin-right: 150px;
}
.dropdown {
  position: relative;
  display: inline-block;
  border-radius: 5px;
  align-items: start;
  margin-right: 20px; /* Add space between dropdown and title */
}

.dropbtn {
  border: none;
  border-radius: 5px;
  color:white;

  cursor: pointer;
  background-color: #23448b;

  font-size: 38px;
  padding: 10px;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}
.hourglass{
  margin-top: 2px;
  margin-left: 5px;
}
.search{
  display: flex;
  flex-direction: row;
}

.search-icon{
  font-size: 20px;
}
.search-field{
  height: 30px;
  border-radius: 5px;
  margin-left: 10px;
  font-size: 14px;
}

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

.dropdown-content {
  display: block; /* Ensure dropdown is visible by default for testing */
}
</style>