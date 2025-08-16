<template>
  <form class="device-form" @submit.prevent="handleSubmit">
    <div class="form-label">Nome do dispositivo</div>
    <input
      id="name"
      v-model="form.name"
      required
      class="form-input"
      placeholder="Nome do dispositivo"
    />
    <div class="form-label">Endereço MAC</div>
    <input
      id="mac"
      v-model="form.mac"
      required
      class="form-input"
      placeholder="Endereço MAC"
    />
    <div style="text-align: center; margin-top: 18px">
      <button type="submit" :disabled="loading" class="form-btn">
        Cadastrar
      </button>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DeviceForm',
  emits: ['created'],
  setup(props, { emit }) {
    const form = ref({ name: '', mac: '' })
    const loading = ref(false)
    const error = ref('')

    function handleSubmit() {
      loading.value = true
      error.value = ''
      // Simulação de cadastro
      setTimeout(() => {
        if (!form.value.name || !form.value.mac) {
          error.value = 'Preencha todos os campos.'
          loading.value = false
          return
        }
        emit('created', { ...form.value })
        form.value = { name: '', mac: '' }
        loading.value = false
      }, 500)
    }

    return { form, loading, error, handleSubmit }
  }
})
</script>

<style scoped>
.device-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-label {
  color: #2c3e50;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.form-input {
  background: #ffffff;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 1rem;
  color: #2c3e50;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.form-btn {
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 1rem;
}

.form-btn:hover {
  background: #2980b9;
}

.form-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.error {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
</style>
