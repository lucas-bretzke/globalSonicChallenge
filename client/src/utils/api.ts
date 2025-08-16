import axios from 'axios'

const API_URL = '/api/devices'

export async function fetchDevices() {
  const { data } = await axios.get(API_URL)
  return data
}

export async function createDevice(device: { name: string; mac: string }) {
  const { data } = await axios.post(API_URL, device)
  return data
}

export async function updateDeviceStatus(id: number, status: string) {
  const { data } = await axios.patch(`${API_URL}/${id}/status`, { status })
  return data
}
