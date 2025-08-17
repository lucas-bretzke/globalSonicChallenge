import { Router } from 'express'
import { DeviceController } from '../controllers/DeviceController'

const router = Router()

// Função para tratar handlers async e passar erros para o Express
function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

router.post('/', asyncHandler(DeviceController.createDevice))
router.get('/', asyncHandler(DeviceController.getDevices))
router.patch('/:id/status', asyncHandler(DeviceController.toggleStatus))

export default router
