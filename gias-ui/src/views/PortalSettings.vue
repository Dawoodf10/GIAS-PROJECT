<template>
  <div class="portal-settings">
    <h1>Portal Settings</h1>
    
    <!-- Auto Alert Status Section -->
    <div class="status-container">
      <div class="auto-alert-status">
        <h2>AUTO ALERT STATUS</h2>
        <button @click="toggleAutoAlert" :class="{'enabled': autoAlertStatus, 'disabled': !autoAlertStatus}">
          {{ autoAlertStatus ? 'Disable' : 'Enable' }} Auto Alert
        </button>
      </div>
    </div>

    <div class="forms-container">
      <div class="form-section">
        <h2>Title Management</h2>
        <form @submit.prevent="handleTitleSubmit">
          <div>
            <label for="title">Title:</label>
            <input type="text" id="title" v-model="title" />
          </div>
          <div class="title-management-buttons">
            <button type="submit">Save New Title</button>
            <button type="button" @click="handleTitleUpdate">Update Title</button>
            <button type="button" @click="deleteTitle">Delete Title</button>
          </div>
        </form>
      </div>
      <div class="form-section">
        <h2>Left Icon Management</h2>
        <div v-if="leftIconSrc">
          <img :src="leftIconSrc" alt="Left Icon" class="icon-preview" />
        </div>
        <form @submit.prevent="handleLeftIconUpload">
          <div style="margin-top: 20px; margin-bottom: 10px;" class="label-and-input-wrapper">
            <label for="leftIcon">Upload Left Icon:</label>
            <input type="file" @change="handleLeftFileChange" />
          </div>
          <div class="icon-management-buttons">
            <button type="submit">Upload Left Icon</button>
            <button type="button" @click="deleteLeftIcon">Delete Left Icon</button>
          </div>
        </form>
      </div>
      <div class="form-section">
        <h2>Right Icon Management</h2>
        <div v-if="rightIconSrc">
          <img :src="rightIconSrc" alt="Right Icon" class="icon-preview" />
        </div>
        <form @submit.prevent="handleRightIconUpload">
          <div style="margin-top: 20px; margin-bottom: 10px;" class="label-and-input-wrapper">
            <label for="rightIcon">Upload Right Icon:</label>
            <input type="file" @change="handleRightFileChange" />
          </div>
          <div class="icon-management-buttons">
            <button type="submit">Upload Right Icon</button>
            <button type="button" @click="deleteRightIcon">Delete Right Icon</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fetchHeader,
  addTitle,
  updateTitle,
  deleteTitle,
  uploadLeftIcon,
  deleteLeftIcon,
  uploadRightIcon,
  deleteRightIcon
} from '@/services/DataService';

export default {
  name: 'PortalSettings',
  data() {
    return {
      title: '',
      leftIconFile: null,
      rightIconFile: null,
      oldTitle: '',
      leftIconSrc: '',
      rightIconSrc: '',
      leftIconName: '',
      rightIconName: '',
      autoAlertStatus: false  // New property to manage the auto alert status
    };
  },
  async created() {
    try {
      const data = await fetchHeader();
      this.title = data.title;
      data.icons.forEach(icon => {
        if (icon.position === 'left') {
          this.leftIconSrc = this.iconSrc(icon.icon);
          this.leftIconName = icon.icon_name;
        } else if (icon.position === 'right') {
          this.rightIconSrc = this.iconSrc(icon.icon);
          this.rightIconName = icon.icon_name;
        }
      });
      this.oldTitle = this.title;
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  },
  methods: {
    toggleAutoAlert() {
      this.autoAlertStatus = !this.autoAlertStatus;
      alert(`Auto Alert ${this.autoAlertStatus ? 'Enabled' : 'Disabled'}`);
    },
    handleTitleSubmit() {
      if (this.title) {
        addTitle(this.title)
          .then(response => {
            alert(response.message);
            this.oldTitle = this.title;
          })
          .catch(error => {
            alert('Error adding title:', error);
          });
      } else {
        alert('Please enter a title.');
      }
    },
    handleTitleUpdate() {
      if (this.oldTitle && this.title) {
        updateTitle(this.oldTitle, this.title)
          .then(response => {
            alert(response.message);
            this.oldTitle = this.title;
          })
          .catch(error => {
            alert('Error updating title:', error);
          });
      } else {
        alert('Please enter the old and new titles.');
      }
    },
    deleteTitle() {
      if (this.oldTitle) {
        deleteTitle(this.oldTitle)
          .then(response => {
            alert(response.message);
            this.oldTitle = '';
            this.title = '';
          })
          .catch(error => {
            alert('Error deleting title:', error);
          });
      } else {
        alert('Please enter the title to delete.');
      }
    },
    handleLeftFileChange(event) {
      this.leftIconFile = event.target.files[0];
    },
    handleRightFileChange(event) {
      this.rightIconFile = event.target.files[0];
    },
    handleLeftIconUpload() {
      if (this.leftIconFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target.result.split(',')[1];
          uploadLeftIcon(this.leftIconFile.name, base64String)
            .then(response => {
              alert(response.message);
              this.leftIconSrc = this.iconSrc(base64String);
              this.leftIconName = this.leftIconFile.name;
            })
            .catch(error => {
              alert('Error uploading left icon:', error);
            });
        };
        reader.readAsDataURL(this.leftIconFile);
      } else {
        alert('Please select a left icon file.');
      }
    },
    handleRightIconUpload() {
      if (this.rightIconFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target.result.split(',')[1];
          uploadRightIcon(this.rightIconFile.name, base64String)
            .then(response => {
              alert(response.message);
              this.rightIconSrc = this.iconSrc(base64String);
              this.rightIconName = this.rightIconFile.name;
            })
            .catch(error => {
              alert('Error uploading right icon:', error);
            });
        };
        reader.readAsDataURL(this.rightIconFile);
      } else {
        alert('Please select a right icon file.');
      }
    },
    deleteLeftIcon() {
      if (this.leftIconName) {
        deleteLeftIcon(this.leftIconName)
          .then(response => {
            alert(response.message);
            this.leftIconSrc = '';
            this.leftIconName = '';
          })
          .catch(error => {
            alert('Error deleting left icon:', error);
          });
      } else {
        alert('Please specify the left icon to delete.');
      }
    },
    deleteRightIcon() {
      if (this.rightIconName) {
        deleteRightIcon(this.rightIconName)
          .then(response => {
            alert(response.message);
            this.rightIconSrc = '';
            this.rightIconName = '';
          })
          .catch(error => {
            alert('Error deleting right icon:', error);
          });
      } else {
        alert('Please specify the right icon to delete.');
      }
    },
    iconSrc(icon) {
      return icon ? `data:image/png;base64,${icon}` : '';
    }
  }
};
</script>

<style scoped>
#title {
  width: 100%;
}

.title-management-buttons {
  margin-top: 10px;
}

#leftIcon #rightIcon {
  margin-left: 10px;
}

.icon-management-buttons {
  margin-top: 10px;
}

.label-and-input-wrapper {
  display: flex;
  align-items: center;
}

.label-and-input-wrapper label {
  margin-right: 10px; 
}

button {
  margin-right: 10px;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button.enabled {
  background-color: #4CAF50; /* Green */
  color: white;
}

button.disabled {
  background-color: #f44336; /* Red */
  color: white;
}

.portal-settings {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.forms-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 20px;
}

.form-section {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.icon-preview {
  max-width: 100px;
  max-height: 100px;
  display: block;
  margin-bottom: 10px;
}

.status-container {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.auto-alert-status {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.auto-alert-status h2 {
  margin: 0;
}

.auto-alert-status button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.auto-alert-status button.enabled {
  background-color: #f44336; /* Red */
  color: white;
}

.auto-alert-status button.disabled {
  background-color: #4CAF50; /* Green */
  color: white;
}
</style>
