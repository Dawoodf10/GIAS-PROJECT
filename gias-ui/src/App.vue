<template>
  <div id="app" class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <!-- Leftmost Icon -->
        <div class="icon-container">
          <img v-if="leftIcon" :src="iconSrc(leftIcon.icon)" alt="Left Icon" class="icon" />
        </div>
        <!-- Title in the Center -->
        <h1 class="title">{{ title }}</h1>
        <!-- Rightmost Icon -->
        <div class="icon-container">
          <img v-if="rightIcon" :src="iconSrc(rightIcon.icon)" alt="Right Icon" class="icon" />
        </div>
      </div>
      <AppNav class="app-nav"/>
    </header>
    <!-- The current route determines what content is visible
    in the application based on the active URL path. -->
    <!-- Main content -->
    <main class="content">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-logo">
        <img :src="logo1" alt="Logo 1" />
      </div>
      <div class="footer-logo">
        <img :src="logo2" alt="Logo 2" />
      </div>
      <div class="footer-logo">
        <img :src="logo3" alt="Logo 3" />
      </div>
    </footer>
  </div>
</template>

<script>
import AppNav from '@/views/AppNav.vue';
import { fetchHeader } from '@/services/DataService.js';

export default {
  name: 'App',
  components: {
    AppNav,
  },
  data() {
    return {
      title: '',
      leftIcon: null,
      rightIcon: null,
      logo1: require('@/assets/nic-logo.png'),
      logo2: require('@/assets/di-logo.png'),
      logo3: require('@/assets/nicse-logo.png'),
      alert_sources:[]
    };
  },
  async created() {
    try {
      const data = await fetchHeader();
      this.title = data.title;
      data.icons.forEach(icon => {
        if (icon.position === 'left') {
          this.leftIcon = icon;
        } else if (icon.position === 'right') {
          this.rightIcon = icon;
        }
      });
    } catch (error) {
      console.error('Error fetching header:', error);
    }
  },
  methods: {
    iconSrc(base64Data) {
      return `data:image/png;base64,${base64Data}`; // Adjust the data URL scheme based on your image type
    }
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  display: flex;
  flex-direction: column;
  background-color: rgb(29, 29, 111);
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* Ensure header is above other content */
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Adjust spacing between items */
  padding: 10px 20px;
}

.icon-container {
  display: flex;
  align-items: center;
}

.icon {
  height: 50px;
}

.title {
  text-align: center;
  flex: 1; /* Allow title to expand and center */
}

.app-nav {
  width: 100%;
}

.content {
  flex: 1;
  padding: 20px;
  padding-top: 150px; /* Adjust to accommodate header and nav height */
  background-color: #f0f0f0;
}

.footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  background-color: rgb(29, 29, 111);
  color: white;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* Ensure footer is above other content */
}

.footer-logo img {
  height: 50px;
}
</style>
