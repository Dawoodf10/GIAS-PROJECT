<template>
  <div class="horizontal-scroll-container">
    <div class="marquee">
      <img :src="a_logo" alt="Announcement Icon" class="announcement-icon" />
      <div class="announcement-wrapper">
        <div class="announcement" v-for="(announcement, index) in announcements" :key="index">
          {{ announcement.announcement_text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchAnnouncements } from '@/services/DataService';
import a_logo from '@/assets/announcement.jpg';

export default {
  name: 'HorizontalAnnouncements',
  data() {
    return {
      announcements: [],
      a_logo: a_logo
    };
  },
  async created() {
    await this.loadAnnouncements();
  },
  methods: {
    async loadAnnouncements() {
      try {
        const data = await fetchAnnouncements();
        this.announcements = data.announcements;
      } catch (error) {
        console.error('Error loading announcements:', error);
      }
    }
  }
};
</script>

<style scoped>
.horizontal-scroll-container {
  overflow: hidden;
  background-color: #fff;
  width: 100%;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.marquee {
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  position: relative;
}

.announcement-icon {
  height: 40px; 
  margin-left: 10px; 
  position: relative; 
  z-index: 10; 
}

.announcement-wrapper {
  display: flex;
  align-items: center;
  animation: marquee 20s linear infinite; 
  margin-left: 40px; 
}

.announcement {
  display: inline-block;
  padding: 5px 10px;
  background-color: rgb(38, 67, 129);
  color: #fff;
  margin-right: 20px; 
}

@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
</style>
