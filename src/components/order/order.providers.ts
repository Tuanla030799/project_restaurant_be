import { OrderService } from './services/order.service'
import { CommonService } from 'src/shared/services/common.service'

export const orderProviders = [OrderService, CommonService]
