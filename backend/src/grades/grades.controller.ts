import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { GradesService } from './grades.service';
import {
  CreateGradeDto,
  CreateCommentTemplateDto,
  GetGradesQueryDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../common/entities/user.entity';
import { UserRole } from '../common/enums';

@Controller('grades')
@UseGuards(JwtAuthGuard)
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  createGrade(
    @Body() createGradeDto: CreateGradeDto,
    @CurrentUser() user: User,
  ) {
    return this.gradesService.createGrade(createGradeDto, user.id);
  }

  @Get()
  findGrades(@Query() query: GetGradesQueryDto) {
    return this.gradesService.findGrades(query);
  }

  // Comment Templates
  @Get('comment-templates')
  findAllCommentTemplates() {
    return this.gradesService.findAllCommentTemplates();
  }

  @Post('comment-templates')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  createCommentTemplate(@Body() createCommentTemplateDto: CreateCommentTemplateDto) {
    return this.gradesService.createCommentTemplate(createCommentTemplateDto);
  }

  @Delete('comment-templates/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteCommentTemplate(@Param('id') id: string) {
    return this.gradesService.deleteCommentTemplate(id);
  }
}

