import {
  Controller,
  Get,
  Query,
  Post,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common'
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service'
import { RoleService } from '../../services/role.service'
import { IPaginationOptions } from '../../../../shared/services/pagination'
import { Auth } from '../../decorators/auth.decorator'
import { RoleTransformer } from '../../transformers/role.transformer'
import { assign, isNil } from 'lodash'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { QueryManyDto } from 'src/shared/dto/queryParams.dto'
import { JwtAuthGuard } from '../../guards/jwtAuth.guard'
import { CreateRoleDto, UpdateRoleDto } from '../../dto/role.dto'
import { RolePermissionService } from '../../services/rolePermission.service'
import {
  GetItemResponse,
  GetListPaginationResponse,
  GetListResponse,
  SuccessfullyOperation,
} from 'src/shared/services/apiResponse/apiResponse.interface'
import Messages from 'src/shared/message/message'
import { CommonService } from 'src/shared/services/common.service'
import { RolePermissionEntity } from '../../entities/rolePermission.entity'
import { RoleEntity } from '../../entities/role.entity'
import { SelectQueryBuilder } from 'typeorm'

@ApiTags('Roles')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/roles')
export class RoleController {
  constructor(
    private response: ApiResponseService,
    private roleService: RoleService,
    private rolePermissionService: RolePermissionService,
    private commonService: CommonService,
  ) {}

  private entity = 'roles'
  private fields = ['name', 'level']
  private relations = ['permissions']

  @Post('')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin create new role' })
  @ApiOkResponse({ description: 'New role entity' })
  async createRole(@Body() data: CreateRoleDto): Promise<any> {
    const slug = await this.roleService.generateSlug(data.name)

    const role = await this.roleService.create(assign(data, { slug: slug }))

    return this.response.item(role, new RoleTransformer())
  }

  @Get()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin list roles' })
  @ApiOkResponse({ description: 'List roles with query param' })
  async readRoles(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const { search, includes, sortBy, sortType } = query

    let queryBuilder: SelectQueryBuilder<RoleEntity> =
      await this.roleService.queryBuilder({
        entity: this.entity,
        fields: this.fields,
        keyword: search,
        sortBy,
        sortType,
      })

    let joinAndSelects = []

    if (!isNil(includes)) {
      const includesParams = Array.isArray(includes) ? includes : [includes]

      joinAndSelects = this.commonService.includesParamToJoinAndSelects({
        includesParams,
        relations: this.relations,
      })

      if (joinAndSelects.length > 0) {
        joinAndSelects.forEach((joinAndSelect) => {
          queryBuilder = queryBuilder.leftJoinAndSelect(
            `${this.entity}.${joinAndSelect}`,
            `${joinAndSelect}`,
          )
        })
      }
    }

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      }

      const roles = await this.roleService.paginate(
        queryBuilder,
        paginateOption,
      )

      return this.response.paginate(
        roles,
        new RoleTransformer(
          joinAndSelects.length > 0 ? joinAndSelects : undefined,
        ),
      )
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new RoleTransformer(
        joinAndSelects.length > 0 ? joinAndSelects : undefined,
      ),
    )
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get role by id' })
  @ApiOkResponse({ description: 'Role entity' })
  async readRole(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const role = await this.roleService.findOneOrFail(id, {
      relations: this.relations,
    })

    return this.response.item(role, new RoleTransformer(this.relations))
  }

  @Put(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update role by id' })
  @ApiOkResponse({ description: 'Update role entity' })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRoleDto,
  ): Promise<any> {
    const slug = await this.roleService.generateSlug(data.name)

    const role = await this.roleService.update(id, assign(data, { slug: slug }))

    return this.response.item(role, new RoleTransformer())
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete role by id' })
  @ApiOkResponse({ description: 'Delete role successfully' })
  async deleteRole(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.roleService.findOneOrFail(id)

    await this.roleService.destroy(id)

    const rolePermissions: RolePermissionEntity[] =
      await this.rolePermissionService.findWhere({
        where: { roleId: id },
      })

    const rolePermissionIds: number[] = rolePermissions.map(
      (rolePermission) => rolePermission.id,
    )

    await this.rolePermissionService.destroy(rolePermissionIds)

    return this.response.success({
      message: this.commonService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: ['role'],
      }),
    })
  }
}
