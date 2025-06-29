<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import Modal from '~/components/Modal.vue'
import { useBranchStore } from '~/stores/branch'
import { useAlertStore } from '~/stores/components/alert'
import { roomService } from '~/services/room'
import type { Branch, CreateBranchRequest, UpdateBranchRequest } from '~/types/branch'
import type { RoomType, CreateRoomRequest } from '~/types/room'

const props = defineProps<{ 
  show: boolean; 
  mode?: 'add' | 'edit';
  branchId?: string;
}>()

const emit = defineEmits(['close', 'submit'])

// Initialize store
const branchStore = useBranchStore()
const alertStore = useAlertStore()
const isSubmitting = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const isLoadingRoomTypes = ref(false)

// Room types state
const roomTypes = ref<RoomType[]>([])

// Branch form data
const form = reactive({
  id: '',
  name: '',
  photo: null as File | null,
  tel: '',
  address: '',
  subdistrict: '',
  district: '',
  province: '',
  zipcode: '',
  linkMap: '',
  status: '',
  dateJoined: ''
})

// Rooms form data
const rooms = ref<Array<{
  id?: string;
  name: string;
  roomNumber: string;
  roomTypeId: string;
  tempId: string; // For tracking before API creation
}>>([])

// Watch for changes in props.show
watch(() => props.show, (newVal) => {
  if (newVal && props.mode === 'edit' && props.branchId) {
    // Load branch data when modal is shown in edit mode
    loadBranchData(props.branchId)
  } else if (newVal && props.mode === 'add') {
    // Reset form for add mode
    resetForm()
  }
  
  if (newVal) {
    // Load room types when modal is shown
    fetchRoomTypes()
  }
})

// Initial load if needed
onMounted(() => {
  if (props.show && props.mode === 'edit' && props.branchId) {
    loadBranchData(props.branchId)
  }
  
  if (props.show) {
    fetchRoomTypes()
  }
})

// Fetch room types from API
const fetchRoomTypes = async () => {
  isLoadingRoomTypes.value = true
  
  try {
    const response = await roomService.getRoomTypes()
    
    if (response.status === 'success') {
      roomTypes.value = response.data.roomTypes.filter(type => type.isActive)
    }
  } catch (error: any) {
    console.error('Error fetching room types:', error)
    alertStore.error('ไม่สามารถโหลดประเภทห้องได้', 'เกิดข้อผิดพลาด')
  } finally {
    isLoadingRoomTypes.value = false
  }
}

// Load branch data for editing
const loadBranchData = async (id: string) => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const data = await branchStore.fetchBranchById(id)
    if (data) {
      // Populate form with branch data
      form.id = data.id
      form.name = data.name
      form.tel = data.tel || ''
      form.address = data.address || ''
      form.subdistrict = data.subdistrict || ''
      form.district = data.district || ''
      form.province = data.province || ''
      form.zipcode = data.zipcode || ''
      form.linkMap = data.linkMap || ''
      form.status = data.status || ''
      
      // Convert createdAt to dateJoined format if needed
      if (data.createdAt) {
        const date = new Date(data.createdAt)
        form.dateJoined = date.toISOString().split('T')[0] // Format as YYYY-MM-DD
      }

      // Load existing rooms for this branch
      await loadBranchRooms(id)
    } else {
      errorMessage.value = 'ไม่พบข้อมูลสาขา'
      alertStore.error('ไม่พบข้อมูลสาขา', 'เกิดข้อผิดพลาด')
    }
  } catch (error: any) {
    console.error('Error loading branch data:', error)
    errorMessage.value = error.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลสาขา'
    alertStore.error(error.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลสาขา', 'เกิดข้อผิดพลาด')
  } finally {
    isLoading.value = false
  }
}

// Load rooms for existing branch
const loadBranchRooms = async (branchId: string) => {
  try {
    const response = await roomService.getRooms({ branchId })
    
    if (response.status === 'success') {
      rooms.value = response.data.rooms.map(room => ({
        id: room.id,
        name: room.name,
        roomNumber: room.roomNumber,
        roomTypeId: room.roomType.id,
        tempId: `existing-${room.id}`
      }))
    }
  } catch (error: any) {
    console.error('Error loading branch rooms:', error)
  }
}

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target?.files?.[0]) {
    form.photo = target.files[0]
  }
}

// Add new room to the list
const addRoom = () => {
  const tempId = `temp-${Date.now()}-${Math.random()}`
  rooms.value.push({
    name: '',
    roomNumber: '',
    roomTypeId: '',
    tempId
  })
}

// Remove room from the list
const removeRoom = (tempId: string) => {
  rooms.value = rooms.value.filter(room => room.tempId !== tempId)
}

// Get room type name by ID
const getRoomTypeName = (roomTypeId: string) => {
  const roomType = roomTypes.value.find(type => type.id === roomTypeId)
  return roomType?.name || 'ไม่ระบุ'
}

// Validate rooms
const validateRooms = () => {
  for (const room of rooms.value) {
    if (!room.name.trim()) {
      errorMessage.value = 'กรุณากรอกชื่อห้องให้ครบถ้วน'
      return false
    }
    if (!room.roomNumber.trim()) {
      errorMessage.value = 'กรุณากรอกหมายเลขห้องให้ครบถ้วน'
      return false
    }
    if (!room.roomTypeId) {
      errorMessage.value = 'กรุณาเลือกประเภทห้องให้ครบถ้วน'
      return false
    }
  }

  // Check for duplicate room numbers
  const roomNumbers = rooms.value.map(room => room.roomNumber.trim())
  const duplicates = roomNumbers.filter((num, index) => roomNumbers.indexOf(num) !== index)
  if (duplicates.length > 0) {
    errorMessage.value = `หมายเลขห้อง "${duplicates[0]}" ซ้ำกัน`
    return false
  }

  return true
}

// Create rooms after branch creation
const createRooms = async (branchId: string) => {
  const roomPromises = rooms.value
    .filter(room => !room.id) // Only create new rooms
    .map(room => {
      const roomData: CreateRoomRequest = {
        name: room.name.trim(),
        roomNumber: room.roomNumber.trim(),
        roomTypeId: room.roomTypeId,
        branchId
      }
      return roomService.createRoom(roomData)
    })

  if (roomPromises.length > 0) {
    await Promise.all(roomPromises)
  }
}

const handleSubmit = async () => {
  if (!form.name) {
    errorMessage.value = 'กรุณากรอกชื่อสาขา'
    return
  }

  // Validate required fields
  if (!form.tel) {
    errorMessage.value = 'กรุณากรอกเบอร์โทรศัพท์'
    return
  }
  if (!form.address) {
    errorMessage.value = 'กรุณากรอกที่อยู่'
    return
  }
  if (!form.subdistrict) {
    errorMessage.value = 'กรุณากรอกแขวง/ตำบล'
    return
  }
  if (!form.district) {
    errorMessage.value = 'กรุณากรอกเขต/อำเภอ'
    return
  }
  if (!form.province) {
    errorMessage.value = 'กรุณากรอกจังหวัด'
    return
  }
  if (!form.zipcode) {
    errorMessage.value = 'กรุณากรอกรหัสไปรษณีย์'
    return
  }

  // Validate rooms if any
  if (rooms.value.length > 0 && !validateRooms()) {
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    let result: Branch | null = null
    
    if (props.mode === 'edit' && form.id) {
      // Prepare update data
      const updateData: UpdateBranchRequest = {}
      
      // Compare with current data and only send changed fields
      const currentBranch = branchStore.branches.find(b => b.id === form.id) || null
      
      if (currentBranch) {
        if (form.name !== currentBranch.name) updateData.name = form.name
        if (form.tel !== currentBranch.tel) updateData.tel = form.tel
        if (form.address !== currentBranch.address) updateData.address = form.address
        if (form.subdistrict !== currentBranch.subdistrict) updateData.subdistrict = form.subdistrict
        if (form.district !== currentBranch.district) updateData.district = form.district
        if (form.province !== currentBranch.province) updateData.province = form.province
        if (form.zipcode !== currentBranch.zipcode) updateData.zipcode = form.zipcode
        if (form.linkMap !== currentBranch.linkMap) updateData.linkMap = form.linkMap
        if (form.photo) updateData.photo = '' // Handle file upload separately if needed
      } else {
        // If we can't find current data, send all fields
        updateData.name = form.name
        updateData.tel = form.tel
        updateData.address = form.address
        updateData.subdistrict = form.subdistrict
        updateData.district = form.district
        updateData.province = form.province
        updateData.zipcode = form.zipcode
        updateData.linkMap = form.linkMap
        updateData.photo = ''
      }
      
      // Only update if there are changes
      if (Object.keys(updateData).length > 0) {
        result = await branchStore.updateBranch(form.id, updateData)
        
        if (result) {
          // Create new rooms for the branch
          if (rooms.value.length > 0) {
            await createRooms(result.id)
          }
          
          alertStore.success(`แก้ไขสาขา "${result.name}" สำเร็จ`, 'บันทึกข้อมูลสำเร็จ')
        } else {
          errorMessage.value = 'ไม่สามารถแก้ไขสาขาได้ กรุณาลองอีกครั้ง'
          alertStore.error('ไม่สามารถแก้ไขสาขาได้ กรุณาลองอีกครั้ง', 'เกิดข้อผิดพลาด')
        }
      } else {
        // No changes to branch, but might have room changes
        if (rooms.value.length > 0) {
          await createRooms(form.id)
        }
        alertStore.info('บันทึกข้อมูลสำเร็จ', 'ข้อมูล')
        result = currentBranch
      }
    } else {
      // Create new branch
      const createData: CreateBranchRequest = {
        name: form.name,
        photo: '', // Currently setting empty, will handle file upload separately if needed
        tel: form.tel,
        address: form.address,
        subdistrict: form.subdistrict,
        district: form.district,
        province: form.province,
        zipcode: form.zipcode,
        linkMap: form.linkMap || '',
        status: 'active',
        clinicId: '' // Will be set automatically in the service
      }
      
      result = await branchStore.createBranch(createData)
      
      if (result) {
        // Create rooms for the new branch
        if (rooms.value.length > 0) {
          await createRooms(result.id)
        }
        
        const roomCount = rooms.value.length
        const successMessage = roomCount > 0 
          ? `เพิ่มสาขา "${result.name}" และ ${roomCount} ห้อง สำเร็จ`
          : `เพิ่มสาขา "${result.name}" สำเร็จ`
        
        alertStore.success(successMessage, 'บันทึกข้อมูลสำเร็จ')
      } else {
        errorMessage.value = 'ไม่สามารถสร้างสาขาได้ กรุณาลองอีกครั้ง'
        alertStore.error('ไม่สามารถสร้างสาขาได้ กรุณาลองอีกครั้ง', 'เกิดข้อผิดพลาด')
      }
    }
    
    if (result) {
      emit('submit', result)
      resetForm()
      emit('close')
    }
  } catch (error: any) {
    console.error('Error saving branch:', error)
    errorMessage.value = error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูลสาขา'
    alertStore.error(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูลสาขา', 'เกิดข้อผิดพลาด')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.id = ''
  form.name = ''
  form.photo = null
  form.tel = ''
  form.address = ''
  form.subdistrict = ''
  form.district = ''
  form.province = ''
  form.zipcode = ''
  form.linkMap = ''
  form.status = ''
  form.dateJoined = ''
  rooms.value = []
  errorMessage.value = ''
}
</script>

<template>
  <Modal 
    :show="props.show" 
    :title="props.mode === 'edit' ? 'แก้ไขสาขา' : 'เพิ่มสาขา'" 
    @close="emit('close')"
    size="large"
  >
    <div class="space-y-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-6">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p class="ml-2 text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>
      
      <div v-else>
        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
          {{ errorMessage }}
        </div>

        <!-- Branch Information Section -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-lg font-medium text-gray-800 mb-4">ข้อมูลสาขา</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">อัปโหลดรูปภาพ</label>
              <input type="file" class="w-full border rounded px-3 py-2 text-sm" @change="onFileChange" />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อสาขา <span class="text-red-500">*</span></label>
              <input v-model="form.name" type="text" class="w-full border rounded px-3 py-2 text-sm"
                placeholder="ชื่อสาขา" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ <span class="text-red-500">*</span></label>
              <input v-model="form.tel" type="text" class="w-full border rounded px-3 py-2 text-sm"
                placeholder="เบอร์โทรศัพท์" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ที่อยู่ <span class="text-red-500">*</span></label>
              <input v-model="form.address" type="text" class="w-full border rounded px-3 py-2 text-sm"
                placeholder="ที่อยู่" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">แขวง/ตำบล <span class="text-red-500">*</span></label>
              <input v-model="form.subdistrict" type="text" class="w-full border rounded px-3 py-2 text-sm"
                placeholder="แขวง/ตำบล" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">เขต/อำเภอ <span class="text-red-500">*</span></label>
              <input v-model="form.district" type="text" class="w-full border rounded px-3 py-2 text-sm"
                placeholder="เขต/อำเภอ" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">จังหวัด <span class="text-red-500">*</span></label>
              <input v-model="form.province" type="text" class="w-full border rounded px-3 py-2 text-sm"
                placeholder="จังหวัด" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">รหัสไปรษณีย์ <span class="text-red-500">*</span></label>
              <input v-model="form.zipcode" type="text" class="w-full border rounded px-3 py-2 text-sm"
                placeholder="รหัสไปรษณีย์" />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">ลิงก์แผนที่</label>
              <input v-model="form.linkMap" type="text" class="w-full border rounded px-3 py-2 text-sm"
                placeholder="Google Maps URL" />
            </div>
          </div>
        </div>

        <!-- Rooms Section -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-medium text-gray-800">ห้องในสาขา</h4>
            <button
              @click="addRoom"
              :disabled="isLoadingRoomTypes"
              class="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              <Icon icon="mdi:plus" class="w-4 h-4" />
              เพิ่มห้อง
            </button>
          </div>

          <!-- Loading Room Types -->
          <div v-if="isLoadingRoomTypes" class="text-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p class="text-sm text-gray-500 mt-2">กำลังโหลดประเภทห้อง...</p>
          </div>

          <!-- No Rooms -->
          <div v-else-if="rooms.length === 0" class="text-center py-8 text-gray-500">
            <Icon icon="mdi:home-plus" class="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p class="text-sm">ยังไม่มีห้องในสาขานี้</p>
            <p class="text-xs">คลิก "เพิ่มห้อง" เพื่อเริ่มต้น</p>
          </div>

          <!-- Rooms List -->
          <div v-else class="space-y-3">
            <div
              v-for="(room, index) in rooms"
              :key="room.tempId"
              class="bg-white p-3 rounded-md border border-gray-200"
            >
              <div class="flex items-start gap-3">
                <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <!-- Room Name -->
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">ชื่อห้อง</label>
                    <input
                      v-model="room.name"
                      type="text"
                      class="w-full border rounded px-2 py-1.5 text-sm"
                      placeholder="เช่น ห้องตรวจ A"
                    />
                  </div>

                  <!-- Room Number -->
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">หมายเลขห้อง</label>
                    <input
                      v-model="room.roomNumber"
                      type="text"
                      class="w-full border rounded px-2 py-1.5 text-sm"
                      placeholder="เช่น A1, 101"
                    />
                  </div>

                  <!-- Room Type -->
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1">ประเภทห้อง</label>
                    <select
                      v-model="room.roomTypeId"
                      class="w-full border rounded px-2 py-1.5 text-sm"
                    >
                      <option value="">เลือกประเภท</option>
                      <option
                        v-for="roomType in roomTypes"
                        :key="roomType.id"
                        :value="roomType.id"
                      >
                        {{ roomType.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Remove Button -->
                <button
                  @click="removeRoom(room.tempId)"
                  class="text-red-500 hover:text-red-700 p-1"
                  title="ลบห้อง"
                >
                  <Icon icon="mdi:trash-can-outline" class="w-4 h-4" />
                </button>
              </div>

              <!-- Room Preview -->
              <div v-if="room.name || room.roomNumber || room.roomTypeId" class="mt-2 text-xs text-gray-500">
                <span class="font-medium">ตัวอย่าง:</span>
                {{ room.name || 'ไม่ระบุชื่อ' }} 
                ({{ room.roomNumber || 'ไม่ระบุหมายเลข' }}) 
                - {{ getRoomTypeName(room.roomTypeId) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2 pt-4 border-t">
          <button @click="emit('close')"
            class="px-4 py-2 border border-gray-400 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
            :disabled="isSubmitting">
            ยกเลิก
          </button>
          <button @click="handleSubmit" 
            class="px-4 py-2 rounded-lg text-sm text-white bg-blue-500 hover:bg-blue-600 flex items-center gap-1"
            :disabled="isSubmitting">
            <span v-if="isSubmitting" class="inline-block">
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span v-if="props.mode === 'edit'">{{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข' }}</span>
            <span v-else>{{ isSubmitting ? 'กำลังบันทึก...' : 'เพิ่มสาขา' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
}
input[type='file']::-webkit-file-upload-button {
  background: transparent;
  border: none;
  font-weight: 500;
}
</style>