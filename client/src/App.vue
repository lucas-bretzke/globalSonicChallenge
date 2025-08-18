<template>
  <div class="app">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-links">
        <a href="#" class="nav-link active">Home</a>
        <a href="#" class="nav-link">Dispositivos</a>
        <a href="#" class="nav-link">Relatórios</a>
        <a href="#" class="nav-link">Configurações</a>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header Section -->
      <div class="header-section">
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
        <p class="main-subtitle">
          Cadastro e monitoramento de dispositivos em tempo real
        </p>
      </div>

      <!-- Form Card -->
      <div class="form-card">
        <DeviceForm @created="addDevice" />
      </div>

      <!-- Table Card -->
      <div class="table-card">
        <DeviceTable
          :devices="devices"
          @statusChanged="updateDeviceStatus"
          @deleteDevice="handleDeleteDevice"
        />
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DeviceForm from './components/DeviceForm.vue'
import DeviceTable from './components/DeviceTable.vue'
import {
  fetchDevices,
  createDevice,
  updateDeviceStatus as apiUpdateDeviceStatus,
  deleteDevice as apiDeleteDevice
} from './utils/api'
async function handleDeleteDevice(id: number) {
  try {
    await apiDeleteDevice(id)
    // Não precisa atualizar manualmente, pois o evento será recebido via socket
  } catch (e: any) {
    error.value = e?.response?.data?.erro || 'Erro ao excluir dispositivo.'
  }
}
import { useSocket } from './utils/socket'

const devices = ref<any[]>([])
const error = ref('')
const socket = useSocket()

async function loadDevices() {
  try {
    devices.value = (await fetchDevices()).data
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

async function addDevice(device: any) {
  try {
    await createDevice(device)
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
  background: #34495e;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-links {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.nav-link {
  color: #bdc3c7;
  text-decoration: none;
  padding: 1rem 1.5rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.active {
  color: #ffffff;
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.lightning-logo {
  width: 48px;
  height: 48px;
}

.main-title {
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
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
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Table Card */
.table-card {
  background: #ecf0f1;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.error {
  color: #e74c3c;
  text-align: center;
  margin-top: 1rem;
  font-size: 1.1rem;
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

  .main-title {
    font-size: 2rem;
  }

  .logo-container {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
