<template>
  <div class="app">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="navbar-content">
        <div class="logo-container">
          <svg class="lightning-logo" viewBox="0 0 24 24" fill="none">
            <path
              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
              fill="#ffd43b"
              stroke="#ffd43b"
              stroke-width="1"
            />
          </svg>
          <h1 class="main-title">Global Sonic Challenge</h1>
        </div>
        <div class="nav-links">
          <a href="#" class="nav-link active">Home</a>
          <a href="#" class="nav-link">Dispositivos</a>
          <a href="#" class="nav-link">Relatórios</a>
          <a href="#" class="nav-link">Configurações</a>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header Section -->
      <div class="header-section">
        <p class="main-subtitle">
          Cadastro e monitoramento de dispositivos em tempo real
        </p>
      </div>

      <!-- Modal DeviceForm -->
      <teleport to="body">
        <div
          v-if="showForm"
          class="modal-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div class="modal-content">
            <DeviceForm @created="addDevice" :onClose="closeForm" />
            <p v-if="error" class="error">{{ error }}</p>
          </div>
        </div>
      </teleport>

      <!-- Table Card -->
      <div class="table-card">
        <div class="device-count">
          Dispositivos conectados: <strong>{{ filteredDevices.length }}</strong>
        </div>
        <div class="filters">
          <input
            v-model="searchName"
            class="filter-input"
            placeholder="Pesquisar por nome"
          />
          <input
            v-model="searchMac"
            class="filter-input"
            placeholder="Pesquisar por MAC"
          />
          <select v-model="searchStatus" class="filter-select">
            <option value="">Todos</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
          </select>

          <button class="add-device-btn" @click="openForm">
            Adicionar dispositivo
          </button>
        </div>
        <DeviceTable
          :devices="pagedDevices"
          @statusChanged="updateDeviceStatus"
          @deleteDevice="handleDeleteDevice"
        />
        <div v-if="totalPages > 1" class="pagination">
          <button :disabled="page === 1" @click="goToPage(page - 1)">
            Anterior
          </button>
          <span>Página {{ page }} de {{ totalPages }}</span>
          <button :disabled="page === totalPages" @click="goToPage(page + 1)">
            Próxima
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import DeviceForm from './../components/DeviceForm.vue'
import DeviceTable from './../components/DeviceTable.vue'
import {
  fetchDevices,
  createDevice,
  updateDeviceStatus as apiUpdateDeviceStatus,
  deleteDevice as apiDeleteDevice
} from './../services/api'
async function handleDeleteDevice(id: number) {
  try {
    await apiDeleteDevice(id)
    // Não precisa atualizar manualmente, pois o evento será recebido via socket
  } catch (e: any) {
    error.value = e?.response?.data?.erro || 'Erro ao excluir dispositivo.'
  }
}
import { useSocket } from '../services/socket'

const devices = ref<any[]>([])
const error = ref('')
const showForm = ref(false)
const socket = useSocket()
const page = ref(1)
const limit = ref(10)
const searchName = ref('')
const searchMac = ref('')
const searchStatus = ref('')

const filteredDevices = computed(() => {
  return devices.value.filter(device => {
    const nameMatch = device.name
      .toLowerCase()
      .includes(searchName.value.toLowerCase())
    const macMatch = device.mac
      .toLowerCase()
      .includes(searchMac.value.toLowerCase())
    const statusMatch = searchStatus.value
      ? device.status === searchStatus.value
      : true
    return nameMatch && macMatch && statusMatch
  })
})

const pagedDevices = computed(() => {
  const start = (page.value - 1) * limit.value
  return filteredDevices.value.slice(start, start + limit.value)
})
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredDevices.value.length / limit.value))
})

function goToPage(p: number) {
  if (p < 1 || p > totalPages.value) return
  page.value = p
}

watch([searchName, searchMac, searchStatus], () => {
  page.value = 1
})

async function loadDevices() {
  try {
    devices.value = (await fetchDevices()).data
    if (page.value > totalPages.value) page.value = totalPages.value
  } catch (e: any) {
    error.value = 'Erro ao buscar dispositivos.'
  }
}

onMounted(() => {
  loadDevices()
  // Escuta eventos do backend
  socket.on('deviceCreated', () => {
    loadDevices()
  })
  socket.on('deviceUpdated', () => {
    loadDevices()
  })
  socket.on('deviceDeleted', () => {
    loadDevices()
  })
})

onUnmounted(() => {
  socket.off('deviceCreated')
  socket.off('deviceUpdated')
  socket.off('deviceDeleted')
})

function openForm() {
  error.value = ''
  showForm.value = true
}
function closeForm() {
  showForm.value = false
  error.value = ''
}
async function addDevice(device: any) {
  const nomeExiste = devices.value.some(
    d => d.name.trim().toLowerCase() === device.name.trim().toLowerCase()
  )
  if (nomeExiste) {
    error.value = 'Já existe um dispositivo cadastrado com esse nome.'
    return
  }
  const macExiste = devices.value.some(
    d => d.mac.trim().toLowerCase() === device.mac.trim().toLowerCase()
  )
  if (macExiste) {
    error.value = 'Já existe um dispositivo cadastrado com esse endereço MAC.'
    return
  }
  try {
    await createDevice(device)
    showForm.value = false // Fecha modal ao cadastrar com sucesso
    error.value = ''
    // Não precisa atualizar manualmente, pois o evento será recebido
  } catch (e: any) {
    error.value = e?.response?.data?.erro || 'Erro ao criar dispositivo.'
  }
}

async function updateDeviceStatus({
  id,
  status
}: {
  id: number
  status: string
}) {
  try {
    await apiUpdateDeviceStatus(id, status)
    // Não precisa atualizar manualmente, pois o evento será recebido
  } catch (e: any) {
    error.value = e?.response?.data?.erro || 'Erro ao atualizar status.'
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #2c3e50;
}

/* Navigation Bar */

.navbar {
  position: fixed;
  width: 100%;
  background: #34495e;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 72px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  color: #bdc3c7;
  text-decoration: none;
  padding: .7rem 1.2rem;
  font-weight: 500;
  font-size: 1rem;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
}

.nav-link:hover,
.nav-link.active {
  color: #ffffff;
  background: #217dbb;
}

@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    align-items: stretch;
    height: auto;
    padding: 0 1rem;
  }
  .logo-container {
    justify-content: center;
    margin-bottom: 0.5rem;
  }
  .nav-links {
    justify-content: center;
    gap: 0.2rem;
  }
  .nav-link {
    padding: 0.7rem 0.7rem;
    font-size: 0.95rem;
  }
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 80px;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(44, 62, 80, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  overflow-y: auto;
}
.modal-content {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.18);
  padding: 0;
  position: relative;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.modal-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #2c3e50;
  cursor: pointer;
  z-index: 10;
  line-height: 1;
  padding: 0.1rem 0.5rem;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #e74c3c;
}

/* Header Section */
.header-section {
  /* text-align: center; */
  margin: 2rem 0;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.lightning-logo {
  width: 38px;
  height: 38px;
}

.main-title {
  color: #ffffff;
  margin: 0;
  font-size: 20px;
}

.main-subtitle {
  color: #bdc3c7;
  font-size: 1.2rem;
  margin: 0;
}

/* Form Card */
.form-card {
  background: #ecf0f1;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* Table Card */
.table-card {
  background: #ecf0f1;
  border-radius: 12px;
  padding: 1.5rem;
  width: auto;
  max-width: 1100px;
  margin-bottom: 2rem;
}

.error {
  color: #e74c3c;
  text-align: center;
  margin-top: 0;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .nav-links {
    padding: 0 1rem;
  }

  .nav-link {
    padding: 1rem 0.75rem;
    font-size: 0.9rem;
  }

 

  .logo-container {
    flex-direction: column;
    gap: 0.5rem;
  }
}
/* Paginação visual */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
.pagination button {
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.pagination button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}
/* Filtros de pesquisa */
.device-count {
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}
.filter-input {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #bdc3c7;
  font-size: 1rem;
}
.filter-select {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #bdc3c7;
  font-size: 1rem;
}

.add-device-btn {
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.6rem 1.3rem;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.06);
}
.add-device-btn:hover {
  background: #217dbb;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.1);
}
</style>
