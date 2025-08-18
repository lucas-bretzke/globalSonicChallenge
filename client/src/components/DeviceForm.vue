<template>
  <form class="device-form" @submit.prevent="handleSubmit">
    <button
      v-if="onClose"
      class="close-btn"
      type="button"
      @click="onClose"
      aria-label="Fechar"
    >
      <span aria-hidden="true">&times;</span>
    </button>
    <p v-if="errorMessage || error" class="error" style="margin-bottom: 1rem">
      {{ errorMessage || error }}
    </p>
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
    <div style="text-align: center">
      <button type="submit" :disabled="loading" class="form-btn">
        Cadastrar
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DeviceForm',
  emits: ['created'],
  props: {
    onClose: {
      type: Function,
      required: false
    },
    errorMessage: {
      type: String,
      required: false
    }
  },
  setup(props, { emit }) {
    const form = ref({ name: '', mac: '' })
    const loading = ref(false)
    const error = ref('')

    function handleSubmit() {
      loading.value = true
      error.value = ''
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

    return {
      form,
      loading,
      error,
      handleSubmit,
      errorMessage: props.errorMessage,
      onClose: props.onClose
    }
  }
})
</script>

<style scoped>
.device-form {
  display: flex;
  flex-direction: column;
  width: 450px;
  padding: 2rem 1.5rem;
  background: #f9f9fb;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(44, 62, 80, 0.08);
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

.form-label {
  color: #2c3e50;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 5px;
}

.form-input {
  background: #fff;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 1rem;
  color: #2c3e50;
  width: 100%;
  box-sizing: border-box;
  padding: 0.7rem 1rem;
  margin-bottom: 1.5rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px #3498db33;
}

.form-btn {
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.9rem 1.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.07);
}

.form-btn:hover {
  background: #2980b9;
  box-shadow: 0 4px 16px rgba(44, 62, 80, 0.1);
}

.form-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  box-shadow: none;
}

.error {
  color: #e74c3c;
  font-size: 0.95rem;
  margin-top: 0.5rem;
  text-align: center;
  animation: shake 0.3s;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  50% {
    transform: translateX(4px);
  }
  75% {
    transform: translateX(-4px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
