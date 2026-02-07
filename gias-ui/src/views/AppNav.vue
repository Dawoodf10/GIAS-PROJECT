<template>
  <nav class="navbar">
    <ul>
      <li @click="navigate('home')" class="home-icon">
        <i class="fas fa-home"></i>
      </li>
      <li class="dropdown" ref="dropdown">
        <i class="fas fa-cog" @click="toggleDropdown"></i>
        <ul v-if="dropdownOpen" class="dropdown-content">
          <li @click="navigate('announcements')">Announcements</li>
          <li @click="navigate('analytic_report')">Analytic Report</li>
          <li @click="navigate('statusmaster')">Status Master</li>
          <li @click="navigate('sources')">Alert Sources</li>
          <li @click="navigate('portal_settings')">Portal Settings</li>
          <li @click="navigate('aboutus')">About Portal</li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'AppNav',
  data() {
    return {
      dropdownOpen: false
    };
  },
  methods: {
    navigate(section) {
      this.dropdownOpen = false; // Close dropdown when navigating
      if (section === 'home') {
        this.$router.push({ name: 'Home' });
      } else if (section === 'announcements') {
        this.$router.push({ name: 'Announcements' });
      } else if (section === 'analytic_report') {
        this.$router.push({ name: 'AnalyticReport' });
      } else if (section === 'statusmaster') {
        this.$router.push({ name: 'StatusMaster' });
      } else if (section === 'sources') {
        this.$router.push({ name: 'Sources' });
      } else if (section === 'portal_settings') {
        this.$router.push({ name: 'PortalSettings' });
      } else if (section === 'aboutus') {
        this.$router.push({ name: 'Aboutus' });
      }
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    handleClickOutside(event) {
      if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
        this.dropdownOpen = false;
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between; /* Space between for left and right alignment */
  align-items: center;
  background-color: rgb(42, 81, 165);
  color: white;
  padding: 10px;
  width: 100%;
  position: relative;
  z-index: 10;
}

.navbar ul {
  list-style-type: none;
  display: flex;
  padding: 0;
  margin: 0;
  width: 100%;
  justify-content: space-between; /* Space between for left and right alignment */
}

.navbar li {
  margin: 0 15px;
  cursor: pointer;
  position: relative;
}

.home-icon {
  margin-right: auto; /* Push to the left */
}

.dropdown {
  margin-left: auto; /* Push to the right */
}

.dropdown-content {
  flex-direction: column;
  display: block;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  right: 0;
}

.dropdown-content li {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content li:hover {
  background-color: #ddd;
}

.fas {
  font-size: 24px;
}

.navbar li .fas:hover {
  color: lightgray;
}
</style>
