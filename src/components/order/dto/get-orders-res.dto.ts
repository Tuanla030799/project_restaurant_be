import * as moment from 'moment'
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrderEntity } from '../entities/order.entity';

export class GetOrdersResDto {
  constructor(data: Pagination<OrderEntity>) {
    const orders = data.items.map(function (order) {
      return {
        id: order['id'],
        totalPrice: order['totalPrice'],
        amount: order['amount'],
        fullName: order['fullName'],
        phone: order['phone'],
        status: order['status'],
        time: order['time'],
        note: order['note'],
        createdAt: order['createdAt'],
        updatedAt: order['updatedAt'],
        deletedAt: order['deletedAt'],
        user: {
          id: order['user']['id'],
          email: order['user']['email'],
          firstName: order['user']['firstName'],
          lastName: order['user']['lastName'],
          phone: order['user']['phone'],
          address: order['user']['address'],
          avatar: order['user']['avatar'],
        }
      };
    });

    return {items: orders, meta: data.meta};
  }
}

