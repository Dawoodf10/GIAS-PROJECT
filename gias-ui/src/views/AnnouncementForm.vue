<template>
  <div class="announcements-form">
    <h2>Announcements</h2>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    <form @submit.prevent="saveAnnouncement">
      <div class="form-group">
        <label for="type">Announcement Type</label>
        <input type="text" id="type" v-model="announcement.type" required />
      </div>
      <div class="form-group">
        <label for="text">Announcement Text</label>
        <input id="text" v-model="announcement.text" required>
      </div>
      <div class="form-group">
        <label for="starttime">Start Time</label>
        <input type="datetime-local" id="starttime" v-model="announcement.start_time" required />
      </div>
      <div class="form-group">
        <label for="endtime">End Time</label>
        <input type="datetime-local" id="endtime" v-model="announcement.end_time" required />
      </div>
      <div class="active-checkbox-group">
        <label for="active">Active</label>
        <input type="checkbox" id="active" v-model="announcement.active_status" />
      </div>
      <button type="submit">Save</button>
      <button type="button" @click="cancel">Cancel</button>
    </form>
  </div>
</template>

<script>
import { saveAnnouncement, fetchAnnouncements } from '@/services/DataService';

export default {
  name: 'AnnouncementForm',
  data() {
    return {
      announcement: {
        type: '',
        text: '',
        start_time: '',
        end_time: '',
        active_status: false
      },
      successMessage: ''
    };
  },
  methods: {
    async saveAnnouncement() {
      try {
        // Post the new announcement to the backend
        await saveAnnouncement(this.announcement);
        console.log('Announcement saved:', this.announcement);

        this.successMessage = 'Successfully submitted';

        // Fetch the updated list of announcements
        const response = await fetchAnnouncements();
        console.log('Updated announcements:', response.announcements);

        // Clear form
        this.announcement = {
          type: '',
          text: '',
          start_time: '',
          end_time: '',
          active_status: false
        };

        setTimeout(() => {
          this.successMessage = '';
        }, 3000); 

      } catch (error) {
        console.error('Error saving announcement:', error);
      }
    },
    cancel() {
      // Clear form
      this.announcement = {
        type: '',
        text: '',
        start_time: '',
        end_time: '',
        active_status: false
      };
      // Navigate to home page
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.announcements-form {
  max-height: 80vh;
  max-width: 500px;
  margin-top: 10px;
  margin: 0 auto;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 50px;
}

.form-group {
  margin-bottom: 15px;
  margin-top: 2px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
}

button {
  padding: 10px 15px;
  margin-right: 10px;
}

.success-message {
  margin-top: 10px;
  padding: 10px;
  color: white;
  background-color: green;
  border-radius: 3px;
  text-align: center;
}

/* Specific styling for the Active checkbox */
.active-checkbox-group {
  display: flex;
  align-items: center; /* Vertically align items */
  padding-bottom: 10px;
}

.active-checkbox-group label {
  margin-right: 10px; /* Space between label and checkbox */
}

.active-checkbox-group input[type="checkbox"] {
  margin: 0; /* Remove default margin */
}
</style>
