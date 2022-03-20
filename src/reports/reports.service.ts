import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './reports.entity';
import { User } from '../users/users.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(reportDto: CreateReportDto, user: User) {
    try {
      const report = this.repo.create(reportDto);
      report.user = user;
      return await this.repo.save(report);
    } catch (error) {
      throw new Error('something went wrong');
    }
  }

  async changeApproval(reportId: string, approved: boolean) {
    const report = await this.repo.findOne(reportId);
    if (!report) {
      throw new NotFoundException('report not found');
    }
    report.approved = approved;
    return await this.repo.save(report);
  }
}
