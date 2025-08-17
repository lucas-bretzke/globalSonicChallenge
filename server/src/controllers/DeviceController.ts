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
}
