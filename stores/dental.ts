import { defineStore } from 'pinia'

export const useDentalStore = defineStore('dental', {
  state: () => ({
    selectedTeeth: [] as number[]
  }),
  
  actions: {
    toggleTooth(id: number) {
      const index = this.selectedTeeth.indexOf(id);
      if (index === -1) {
        this.selectedTeeth.push(id);
      } else {
        this.selectedTeeth.splice(index, 1);
      }
    },
    
    resetSelection() {
      this.selectedTeeth = [];
    },
    
    isSelected(id: number): boolean {
      return this.selectedTeeth.includes(id);
    }
  }
})