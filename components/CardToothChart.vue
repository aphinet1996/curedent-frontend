<template>
    <div class="dental-chart-container">
      <!-- ฟันบน -->
      <div class="relative mb-2">
        <img src="public/tooth-up.png" alt="Upper Teeth" class="w-full" />
        
        <div class="tooth-grid">
          <div v-for="toothId in upperTeeth" :key="toothId"
               class="tooth-area"
               :class="{ 'highlighted': isToothSelected(toothId) }"
               @click="toggleTooth(toothId)">
            <div v-if="isToothSelected(toothId)" class="highlight-overlay"></div>
          </div>
        </div>
      </div>
      
      <div class="teeth-numbers mb-2">
        <div class="upper-row">
          <div v-for="(toothId, index) in upperTeeth" :key="index" class="tooth-number">
            {{ toothId }}
          </div>
        </div>
        <div class="lower-row">
          <div v-for="(toothId, index) in lowerTeeth" :key="index" class="tooth-number">
            {{ toothId }}
          </div>
        </div>
      </div>
      
      <div class="relative">
        <img src="public/tooth-down.png" alt="Lower Teeth" class="w-full" />
        
        <div class="tooth-grid">
          <div v-for="toothId in lowerTeeth" :key="toothId"
               class="tooth-area"
               :class="{ 'highlighted': isToothSelected(toothId) }"
               @click="toggleTooth(toothId)">
            <div v-if="isToothSelected(toothId)" class="highlight-overlay"></div>
          </div>
        </div>
      </div>
      
      <!-- <div class="mt-6 text-center">
        <button @click="resetTeeth" 
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          รีเซ็ตการเลือกฟัน
        </button>
      </div> -->
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { useDentalStore } from '@/stores/dental';
  
  const dentalStore = useDentalStore();
  
  // กำหนดหมายเลขฟันบนและฟันล่าง (ตามภาพของคุณ)
  const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
  
  // ฟังก์ชันตรวจสอบว่าฟันถูกเลือกหรือไม่
  const isToothSelected = (id: number): boolean => {
    return dentalStore.isSelected(id);
  };
  
  // ฟังก์ชันสลับสถานะการเลือกฟัน
  const toggleTooth = (id: number) => {
    dentalStore.toggleTooth(id);
  };
  
  // ฟังก์ชันรีเซ็ตการเลือกทั้งหมด
  const resetTeeth = () => {
    dentalStore.resetSelection();
  };
  
  // คำนวณฟันที่เลือกไว้ทั้งหมด
  const selectedTeeth = computed(() => dentalStore.selectedTeeth);
  </script> 
  
  <style scoped>
  .dental-chart-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .tooth-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(16, 1fr);
  }
  
  .tooth-area {
    position: relative;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .tooth-area:hover {
    background-color: rgba(255, 255, 0, 0.2); /* เมื่อ hover จะแสดงสีเหลืองจางๆ */
  }
  
  .highlight-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 0, 0, 0.4); /* สีแดงโปร่งแสง */
    pointer-events: none; /* ให้สามารถคลิกผ่านได้ */
  }
  
  .highlighted {
    z-index: 10;
  }
  
  /* สไตล์สำหรับหมายเลขฟัน */
  .teeth-numbers {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background-color: #f5f5f5;
    padding: 4px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .upper-row, .lower-row {
    display: grid;
    grid-template-columns: repeat(16, 1fr);
  }
  
  .tooth-number {
    text-align: center;
    font-size: 0.8rem;
    padding: 2px 0;
    font-weight: bold;
    color: #333;
  }
  
  .upper-row .tooth-number {
    border-bottom: 1px solid #ddd;
  }
  </style>