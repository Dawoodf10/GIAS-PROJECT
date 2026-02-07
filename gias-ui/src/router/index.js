import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import CriticalAlerts from '@/views/CriticalAlerts.vue';
import WarningPage from '@/views/WarningPage.vue';
import RootLogins from '@/views/RootLogins.vue';
import Announcements from '@/views/AnnouncementForm.vue';
import AnalyticReport from '@/views/AnalyticReport.vue';
import StatusMaster from '@/views/StatusMaster.vue';
import Sources from '@/views/Sources.vue';
import Aboutus from '@/views/AboutUs.vue';
import PortalSettings from '@/views/PortalSettings.vue'; // Import the PortalSettings component

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/critical-alerts',
    name: 'CriticalAlerts',
    component: CriticalAlerts
  },
  {
    path: '/warning-alerts',
    name: 'WarningPage',
    component: WarningPage
  },
  {
    path: '/root-logins',
    name: 'RootLogins',
    component: RootLogins
  },
  {
    path: '/announcements',
    name: 'Announcements',
    component: Announcements
  },
  {
    path: '/analytic_report',
    name: 'AnalyticReport',
    component: AnalyticReport
  },
  {
    path: '/status_master',
    name: 'StatusMaster',
    component: StatusMaster
  },
  {
    path: '/sources',
    name: 'Sources',
    component: Sources
  },
  {
    path: '/aboutus',
    name: 'Aboutus',
    component: Aboutus
  },
  {
    path: '/portal_settings',
    name: 'PortalSettings',
    component: PortalSettings
  },
  {
    path: '/false-alerts',
    name: 'FalseAlerts',
    component: CriticalAlerts,
    props: { viewMode: 'false-alerts' } // Pass a prop to differentiate the view mode
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
