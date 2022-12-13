import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { IPaginationOptions } from 'src/shared/services/pagination'
import { SeatService } from '../services/seat.service'
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service'
import { Auth } from 'src/components/auth/decorators/auth.decorator'
import { JwtAuthGuard } from 'src/components/auth/guards/jwtAuth.guard'
import {
  GetListPaginationResponse,
  GetListResponse,
} from 'src/shared/services/apiResponse/apiResponse.interface'
import { SeatEntity } from '../entities/seat.entity'
import { SelectQueryBuilder } from 'typeorm'
import { UpdateSeatDto } from '../dto/seat.dto'
import { QueryManyDto } from '../../../shared/dto/queryParams.dto'
import { SeatTransformer } from '../transformers/seat.transformer'

@ApiTags('Seats')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/admin/seats')
export class SeatController {
  constructor(
    private seatService: SeatService,
    private response: ApiResponseService,
  ) {}

  private entity = 'seats'

  @Get()
  @ApiOperation({ summary: 'Get list seats' })
  @ApiOkResponse({ description: 'List categories with param query' })
  async index(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const { search, includes, sortBy, sortType } = query

    const queryBuilder: SelectQueryBuilder<SeatEntity> =
      await this.seatService.querySeat({
        entity: this.entity,
        fields: [],
        keyword: search,
        includes,
        sortBy,
        sortType,
      })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      }

      const data = await this.seatService.paginate(queryBuilder, paginateOption)

      return this.response.paginate(data, new SeatTransformer())
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new SeatTransformer(),
    )
  }

  @Patch(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin update category by id' })
  @ApiOkResponse({ description: 'Update category entity' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateSeatDto,
  ) {
    try {
      return await this.seatService.updateSeat(id, data)
    } catch (err) {
      return err
    }
  }
}
