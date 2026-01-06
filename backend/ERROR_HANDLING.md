# Error Handling Implementation

This document describes the centralized error handling approach implemented in the backend.

## Overview

The application uses a three-layer error handling strategy:

1. **Utility Error Handler** (`src/utils.ts`) - Centralized error logging and processing
2. **Global Exception Filter** (`src/common/filters/http-exception.filter.ts`) - Catches all unhandled exceptions
3. **Service-Level Try-Catch** - Explicit error handling in service methods

## 1. Error Handler Utility

**Location:** `/src/utils.ts`

### Features:
- Consistent error logging across development and production
- Detailed error information in development mode
- Automatic HTTP exception throwing
- Support for external HTTP error extraction (axios)
- Optional "don't throw" mode for error recovery

### Usage:

```typescript
import { errorHandler } from '../utils';

async myMethod() {
  try {
    // Your code here
  } catch (error) {
    errorHandler(error, {
      filePath: 'my-service.ts',
      functionName: 'myMethod',
      message: 'Failed to perform operation',
      // Optional:
      errorStatusObject: NotFoundException,  // Specific exception class
      dontThrow: false,  // Set to true to return error instead of throwing
    });
  }
}
```

### Helper Function: catchAsync

Wrapper for async functions to automatically catch errors:

```typescript
import { catchAsync } from '../utils';

const myAsyncFunction = catchAsync(
  async (param1, param2) => {
    // Your async code
  },
  'my-service.ts',
  'myAsyncFunction'
);
```

## 2. Global Exception Filter

**Location:** `/src/common/filters/http-exception.filter.ts`

Automatically catches ALL exceptions in the application and formats responses consistently.

### Response Format:

```json
{
  "statusCode": 404,
  "timestamp": "2026-01-06T13:20:00.000Z",
  "path": "/api/attendance/123",
  "method": "GET",
  "message": "Attendance record with ID 123 not found",
  // Development mode only:
  "error": "Full error message",
  "stack": "Stack trace..."
}
```

### Registration:

Already registered in `main.ts`:

```typescript
app.useGlobalFilters(new AllExceptionsFilter());
```

## 3. Service-Level Error Handling

All service methods are wrapped with try-catch blocks that use the errorHandler.

### Example from AttendanceService:

```typescript
async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
  try {
    const lesson = await this.lessonRepository.findOne({
      where: { uuid: createAttendanceDto.lessonId },
    });
    
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID "${createAttendanceDto.lessonId}" not found`);
    }
    
    // ... rest of the logic
    
    return this.attendanceRepository.save(attendance);
  } catch (error) {
    errorHandler(error, {
      filePath: 'attendance.service.ts',
      functionName: 'create',
      message: 'Failed to create attendance record',
    });
  }
}
```

## Error Flow

1. **Service Method** encounters an error
2. **Try-Catch Block** catches it
3. **Error Handler** logs the error with context
4. **Error Handler** throws appropriate HTTP exception
5. **Global Exception Filter** catches the exception
6. **Global Exception Filter** formats and returns JSON response to client

## Services Updated

The following services have been updated with errorHandler:

### ✅ Completed:
- AttendanceService
  - `create()`
  - `findAll()`
  - `update()`
  
- AuthService
  - `register()`
  - `login()`

### 🔄 To Be Updated:
- GradesService (all methods)
- EventsService (all methods)
- ReportCardsService (all methods)
- DashboardService (all methods)

## Benefits

1. **Consistent Error Format**: All API errors follow the same structure
2. **Better Debugging**: Detailed error logs with file path and function name
3. **Environment-Aware**: More details in development, cleaner in production
4. **Centralized Logging**: One place to add logging services (e.g., Sentry, CloudWatch)
5. **Type Safety**: TypeScript interfaces ensure proper error handling

## Environment Variables

Error handling behavior can be controlled via environment variables:

```env
NODE_ENV=development  # Shows stack traces and detailed errors
NODE_ENV=production   # Cleaner error messages, no stack traces
```

## Best Practices

1. **Always use try-catch** in service methods
2. **Provide meaningful error messages** that help users understand what went wrong
3. **Include context** (filePath, functionName) for debugging
4. **Use appropriate HTTP exceptions** (NotFoundException, BadRequestException, etc.)
5. **Don't expose sensitive information** in error messages

## Example: Adding Error Handling to a New Service

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { errorHandler } from '../utils';
import { MyEntity } from './entities/my-entity.entity';

@Injectable()
export class MyService {
  constructor(
    @InjectRepository(MyEntity)
    private myRepository: Repository<MyEntity>,
  ) {}

  async findOne(id: string): Promise<MyEntity> {
    try {
      const entity = await this.myRepository.findOne({ where: { id } });
      
      if (!entity) {
        throw new NotFoundException(`Entity with ID ${id} not found`);
      }
      
      return entity;
    } catch (error) {
      errorHandler(error, {
        filePath: 'my.service.ts',
        functionName: 'findOne',
        message: 'Failed to find entity',
      });
    }
  }

  async create(data: any): Promise<MyEntity> {
    try {
      const entity = this.myRepository.create(data);
      return await this.myRepository.save(entity);
    } catch (error) {
      errorHandler(error, {
        filePath: 'my.service.ts',
        functionName: 'create',
        message: 'Failed to create entity',
      });
    }
  }
}
```

## Testing Error Handling

```bash
# Development mode - see detailed errors
NODE_ENV=development npm run start:dev

# Production mode - clean error messages
NODE_ENV=production npm run start:prod
```

## Future Enhancements

- [ ] Add error tracking service integration (Sentry)
- [ ] Add email notifications for critical errors
- [ ] Add error analytics dashboard
- [ ] Add retry logic for transient failures
- [ ] Add circuit breaker pattern for external services

---

**Note:** All database query errors are automatically caught and formatted thanks to the global exception filter. Service-level try-catch blocks provide additional context for debugging.

