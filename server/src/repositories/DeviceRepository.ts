import { PrismaClient, Device, Status } from '@prisma/client'

const prisma = new PrismaClient()

export class DeviceRepository {
  static async create(data: { name: string; mac: string }): Promise<Device> {
    return prisma.device.create({
      data: {
        name: data.name,
        mac: data.mac,
        status: Status.ATIVO
      }
    })
  }

  static async findAll(): Promise<Device[]> {
    return prisma.device.findMany()
  }

  static async toggleStatus(id: number): Promise<Device> {
    const device = await prisma.device.findUnique({ where: { id } })
    if (!device) throw { status: 404, message: 'Device not found' }
    const newStatus =
      device.status === Status.ATIVO ? Status.INATIVO : Status.ATIVO
    return prisma.device.update({
      where: { id },
      data: { status: newStatus }
    })
  }
}
