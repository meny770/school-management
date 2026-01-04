/**
 * User Roles in the system
 */
export enum UserRole {
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  COUNSELOR = 'COUNSELOR',
}

/**
 * Attendance Status
 */
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
}

/**
 * Comment Template Categories
 */
export enum CommentCategory {
  BEHAVIOR = 'BEHAVIOR',
  ACADEMIC = 'ACADEMIC',
  GENERAL = 'GENERAL',
}

/**
 * Educational Event Types
 */
export enum EventType {
  DAILY_NOTE = 'DAILY_NOTE',
  BEHAVIOR = 'BEHAVIOR',
  OTHER = 'OTHER',
}

/**
 * Event Severity Levels
 */
export enum EventSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

/**
 * Report Card Status
 */
export enum ReportCardStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

