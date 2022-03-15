import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './reports.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(reportDto: CreateReportDto) {
    try {
      const report = this.repo.create(reportDto);
      return await this.repo.save(report);
    } catch (error) {
      throw new Error('something went wrong');
    }
  }
}
