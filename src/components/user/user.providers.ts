import { UserService } from './services/user.service'
import { InviteUserService } from './services/inviteUser.service'
import { NotificationService } from 'src/shared/services/notification/notification.service'
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service'
import { RoleService } from '../auth/services/role.service'
import { UserRoleService } from '../auth/services/userRole.service'
import { CommonService } from 'src/shared/services/common.service'

export const userProviders = [
  UserService,
  InviteUserService,
  ApiResponseService,
  NotificationService,
  RoleService,
  UserRoleService,
  CommonService,
]
