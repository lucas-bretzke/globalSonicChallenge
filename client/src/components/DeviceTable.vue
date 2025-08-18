<template>
  <table class="device-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nome</th>
        <th>MAC</th>
        <th>Status</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="!Array.isArray(devices) || devices.length === 0">
        <td colspan="5" style="text-align: center">
          Nenhum dispositivo conectado
        </td>
      </tr>
      <template v-else>
        <tr v-for="device in devices" :key="device.id">
          <td>{{ device.id }}</td>
          <td>{{ device.name }}</td>
          <td>{{ device.mac }}</td>
          <td>
            <span
              :class="[
                'status',
                device.status === 'ATIVO' ? 'ativo' : 'inativo'
              ]"
            >
              {{ device.status }}
            </span>
          </td>
          <td>
            <button
              class="action-btn"
              :disabled="loadingId === device.id"
              @click="toggleStatus(device)"
            >
              Alternar Status
            </button>
            <button
              class="action-btn delete-btn"
              style="margin-left: 0.5rem; background: #e74c3c"
              @click="handleDelete(device)"
            >
              Excluir
            </button>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ devices: any[] }>()
const emit = defineEmits(['statusChanged', 'deleteDevice'])
const loadingId = ref<number | null>(null)
const deletingId = ref<number | null>(null)

function toggleStatus(device: any) {
  loadingId.value = device.id
  const newStatus = device.status === 'ATIVO' ? 'INATIVO' : 'ATIVO'
  emit('statusChanged', { id: device.id, status: newStatus })
  loadingId.value = null
}

function handleDelete(device: any) {
  if (confirm('Tem certeza que deseja excluir este dispositivo?')) {
    deletingId.value = device.id
    emit('deleteDevice', device.id)
    deletingId.value = null
  }
}
</script>

<style scoped>
.device-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
}

.device-table th {
  background: #ecf0f1;
  color: #2c3e50;
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #bdc3c7;
}

.device-table td {
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
  color: #2c3e50;
}

.device-table tr:last-child td {
  border-bottom: none;
}

.device-table tr:hover {
  background: #f8f9fa;
}

.status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status.ativo {
  background: #d4edda;
  color: #155724;
}

.status.inativo {
  background: #fff3cd;
  color: #856404;
}

.action-btn {
  background: #0EC8CE;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #08a3a8;
}

.action-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .device-table {
    font-size: 0.875rem;
  }

  .device-table th,
  .device-table td {
    padding: 0.75rem 0.5rem;
  }

  .action-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
