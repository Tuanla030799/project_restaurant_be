import { MAIL } from '../../../shared/services/notification/channels/email/constants'
import {
  Mailable,
  IMailable,
} from '../../../shared/services/notification/channels/email/mailable'
import { Notification } from '../../../shared/services/notification/notification'

export class UserLoginNotification extends Notification {
  via(): string[] {
    return [MAIL]
  }

  toMail(): IMailable | Promise<IMailable> {
    return new Mailable()
      .to('example@gmail.com')
      .from('example@gmail.com', 'EMAIL')
      .greeting('Hello')
      .subject('The first email from Nest Framework')
      .line('This is a line of text')
      .action('And a button', '#')
      .line('Then a line of text')
  }
}
