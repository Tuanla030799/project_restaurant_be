import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiResponseService } from '../../../../shared/services/apiResponse/apiResponse.service'
import { PermissionService } from '../../services/permission.service'
import { PermissionTransformer } from '../../transformers/permission.transformer'
import { IPaginationOptions } from '../../../../shared/services/pagination'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { Auth } from '../../decorators/auth.decorator'
import { assign } from 'lodash'
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../../dto/permission.dto'

import { JwtAuthGuard } from '../../guards/jwtAuth.guard'
import { QueryManyDto } from 'src/shared/dto/queryParams.dto'
import {
  GetItemResponse,
  GetListPaginationResponse,
  GetListResponse,
  SuccessfullyOperation,
} from 'src/shared/services/apiResponse/apiResponse.interface'
import Messages from 'src/shared/message/message'
import { CommonService } from 'src/shared/services/common.service'

@ApiTags('Permissions')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/permissions')
export class PermissionController {
  constructor(
    private response: ApiResponseService,
    private permissionService: PermissionService,
    private commonService: CommonService,
  ) {}

  private entity = 'permissions'
  private fields = ['name']

  @Post('')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new permission' })
  @ApiOkResponse({ description: 'New permission entity' })
  async createPermission(@Body() data: CreatePermissionDto): Promise<any> {
    const slug = await this.permissionService.generateSlug(data.name)

    const permission = await this.permissionService.create(
      assign(data, { slug: slug }),
    )

    return this.response.item(permission, new PermissionTransformer())
  }

  @Get()
  @Auth('admin')
  @ApiOperation({
    summary: 'Admin get list permissions',
  })
  @ApiOkResponse({
    description: 'List permissions with query param',
  })
  async readPermissions(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const { search, sortBy, sortType } = query

    const queryBuilder = await this.permissionService.queryBuilder({
      entity: this.entity,
      fields: this.fields,
      keyword: search,
      sortBy,
      sortType,
    })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      }
      const permissions = await this.permissionService.paginate(
        queryBuilder,
        paginateOption,
      )

      return this.response.paginate(permissions, new PermissionTransformer())
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new PermissionTransformer(),
    )
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get permission by id' })
  @ApiOkResponse({ description: 'Permission entity' })
  async readPermission(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const permission = await this.permissionService.findOneOrFail(id)

    return this.response.item(permission, new PermissionTransformer())
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update permission by id' })
  @ApiOkResponse({ description: 'Update permission entity' })
  async updatePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePermissionDto,
  ): Promise<any> {
    await this.permissionService.findOneOrFail(id)

    const slug = await this.permissionService.generateSlug(data.name)

    const permission = await this.permissionService.update(
      id,
      assign(data, { slug: slug }),
    )

    return this.response.item(permission, new PermissionTransformer())
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete permission by id' })
  @ApiOkResponse({ description: 'Delete permission successfully' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.permissionService.findOneOrFail(id)

    await this.permissionService.destroy(id)

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: ['permission'],
      }),
    })
  }
}
