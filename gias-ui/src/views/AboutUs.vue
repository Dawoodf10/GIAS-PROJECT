<template>
  <div class="pdf-pages-viewer">
    <img :src="page1" alt="Page 1">
    <img :src="page2" alt="Page 2">
    <img :src="page3" alt="Page 3">
    <img :src="page4" alt="Page 4">
    <img :src="page5" alt="Page 5">
    <img :src="page6" alt="Page 6">
  </div>
</template>

<script>
import page1 from '@/assets/1.jpg';
import page2 from '@/assets/2.jpg';
import page3 from '@/assets/3.jpg';
import page4 from '@/assets/4.jpg';
import page5 from '@/assets/5.jpg';
import page6 from '@/assets/6.jpg';

export default {
  name: 'PdfPagesViewer',
  data() {
    return {
      page1,
      page2,
      page3,
      page4,
      page5,
      page6
    };
  }
}
</script>

<style scoped>
.pdf-pages-viewer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pdf-pages-viewer img {
  width: 80%; /* Adjust the width as needed */
  margin-bottom: 10px;
}
</style>