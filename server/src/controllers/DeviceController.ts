import { Request, Response, NextFunction } from 'express'
import { DeviceService } from '../services/DeviceService'
import { deviceCreateSchema } from '../validators/deviceValidator'

export class DeviceController {
  static async createDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = deviceCreateSchema.safeParse(req.body)
      if (!parsed.success) {
        return res
          .status(400)
          .json({ success: false, errors: parsed.error.errors })
      }
      // Validação de duplicidade de nome e MAC
      const allDevices = await DeviceService.getDevices()
      const nomeExiste = allDevices.some(
        d =>
          d.name.trim().toLowerCase() === parsed.data.name.trim().toLowerCase()
      )
      if (nomeExiste) {
        return res
          .status(400)
          .json({
            success: false,
            erro: 'Já existe um dispositivo cadastrado com esse nome.'
          })
      }
      const macExiste = allDevices.some(
        d => d.mac.trim().toLowerCase() === parsed.data.mac.trim().toLowerCase()
      )
      if (macExiste) {
        return res
          .status(400)
          .json({
            success: false,
            erro: 'Já existe um dispositivo cadastrado com esse endereço MAC.'
          })
      }
      const io = req['io']
      if (!io)
        return res
          .status(500)
          .json({ success: false, message: 'Socket.io instance not found' })
      const device = await DeviceService.createDevice(parsed.data, io)
      // Emitir evento para todos os clientes
      io.emit('deviceCreated', device)
      res.status(201).json({ success: true, data: device })
    } catch (err) {
      next(err)
    }
  }

  static async getDevices(req: Request, res: Response, next: NextFunction) {
    try {
      const devices = await DeviceService.getDevices()
      res.json({ success: true, data: devices })
    } catch (err) {
      next(err)
    }
  }

  static async toggleStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      if (isNaN(id))
        return res.status(400).json({ success: false, message: 'Invalid ID' })
      const io = req['io']
      if (!io)
        return res
          .status(500)
          .json({ success: false, message: 'Socket.io instance not found' })
      const device = await DeviceService.toggleStatus(id, io)
      // Emitir evento para todos os clientes
      io.emit('deviceUpdated', device)
      res.json({ success: true, data: device })
    } catch (err) {
      next(err)
    }
  }
  static async deleteDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      if (isNaN(id))
        return res.status(400).json({ success: false, message: 'Invalid ID' })
      const io = req['io']
      if (!io)
        return res
          .status(500)
          .json({ success: false, message: 'Socket.io instance not found' })
      const deleted = await DeviceService.deleteDevice(id)
      if (!deleted)
        return res
          .status(404)
          .json({ success: false, message: 'Device not found' })
      io.emit('deviceDeleted', { id })
      res.json({ success: true, id })
    } catch (err) {
      next(err)
    }
  }
}
