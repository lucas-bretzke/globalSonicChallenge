import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function useSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_BASE_URL)
  }
  return socket
}
