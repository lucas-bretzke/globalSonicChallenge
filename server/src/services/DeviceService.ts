import { DeviceRepository } from '../repositories/DeviceRepository'
import { Device, Status } from '@prisma/client'
import { Server as SocketIOServer } from 'socket.io'

export class DeviceService {
  static async createDevice(
    data: { name: string; mac: string },
    io: SocketIOServer
  ): Promise<Device> {
    const device = await DeviceRepository.create(data)
    io.emit('device:created', device)
    return device
  }

  static async getDevices(): Promise<Device[]> {
    return DeviceRepository.findAll()
  }

  static async toggleStatus(id: number, io: SocketIOServer): Promise<Device> {
    const device = await DeviceRepository.toggleStatus(id)
    io.emit('device:status', device)
    return device
  }
}
