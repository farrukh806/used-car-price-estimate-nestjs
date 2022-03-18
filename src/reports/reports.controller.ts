import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from './../interceptors/serialize.interceptor';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/users.entity';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() reportBody: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(reportBody, user);
  }
}
