import { MAIL } from '../../../shared/services/notification/channels/email/constants'
import { Notification } from '../../../shared/services/notification/notification'
import {
  IMailable,
  Mailable,
} from '../../../shared/services/notification/channels/email/mailable'
import { PasswordResetEntity } from '../entities/passwordReset.entity'

export class SendInviteUserLinkNotification extends Notification {
  public password_reset: PasswordResetEntity
  public base_url: string

  constructor(password_reset: PasswordResetEntity, base_url: string) {
    super()
    this.password_reset = password_reset
    this.base_url = base_url
  }

  via(): string[] {
    return [MAIL]
  }

  toMail(): IMailable | Promise<IMailable> {
    return new Mailable()
      .to(this.notifiable.email)
      .subject('Invite user requested for your Blog Account')
      .greeting('Hi!')
      .line(
        `An invitation has been sent to your email: <a href="mailto:${this.notifiable.email}">${this.notifiable.email}</a>`,
      )
      .line(
        'If you follow the link below you will be able to personally reset your password.',
      )
      .action(
        'Reset your password',
        this.password_reset.generatePasswordResetLink(this.base_url),
      )
      .line('The link will expire in 48 hours. Let contact for support')
      .line('Thank you for your patience.')
  }
}
