import { ReportsService } from './reports.service';
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}
  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() reportBody: CreateReportDto) {
    return this.reportsService.create(reportBody);
  }
}
