/* ------------------------------------------------------------------ */
/*  Auth & Roles                                                       */
/* ------------------------------------------------------------------ */

export type Role = "SUPER_ADMIN" | "ADMIN" | "LECTURER" | "STUDENT";

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  LECTURER: "LECTURER",
  STUDENT: "STUDENT",
} as const;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  image?: string | null;
};

/* ------------------------------------------------------------------ */
/*  Users                                                              */
/* ------------------------------------------------------------------ */

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  image?: string;
  imageCldPubId?: string;
  bio?: string;
  departmentId?: number;
  createdAt: string;
  updatedAt: string;
};

export type SignUpPayload = {
  email: string;
  name: string;
  password: string;
  role: Role;
  image?: string;
  imageCldPubId?: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};

/* ------------------------------------------------------------------ */
/*  Academic structure                                                 */
/* ------------------------------------------------------------------ */

export type Faculty = {
  id: number;
  name: string;
  code: string;
  description: string;
  dean?: string;
  createdAt?: string;
};

export type Department = {
  id: number;
  name: string;
  code: string;
  description: string;
  facultyId?: number;
};

export type Subject = {
  id: number;
  name: string;
  code: string;
  description: string;
  departmentId: number;
  credits?: number;
  createdAt?: string;
};

export type Course = {
  id: number;
  name: string;
  code: string;
  description: string;
  subjectId: number;
  lecturerId: string;
  coverUrl?: string;
  coverCldPubId?: string;
  joinCode?: string;
  createdAt: string;
};

export type ClassStatus = "active" | "inactive" | "archived";

export type Schedule = {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  startTime: string;
  endTime: string;
  room?: string;
};

export type ClassDetails = {
  id: number;
  name: string;
  description: string;
  status: ClassStatus;
  capacity: number;
  courseId: number;
  lecturerId: string;
  bannerUrl?: string;
  bannerCldPubId?: string;
  schedules: Schedule[];
  joinCode: string;
  createdAt: string;
};

/* ------------------------------------------------------------------ */
/*  Enrollments                                                        */
/* ------------------------------------------------------------------ */

export type EnrollmentStatus = "active" | "pending" | "dropped" | "completed";

export type Enrollment = {
  id: number;
  studentId: string;
  classId: number;
  status: EnrollmentStatus;
  grade?: string;
  joinedAt: string;
};

/* ------------------------------------------------------------------ */
/*  Assignments & submissions                                          */
/* ------------------------------------------------------------------ */

export type Assignment = {
  id: number;
  title: string;
  description: string;
  classId: number;
  dueDate: string;
  points: number;
  attachments?: CloudinaryAsset[];
  createdAt: string;
};

export type SubmissionStatus = "pending" | "submitted" | "graded" | "late";

export type Submission = {
  id: number;
  assignmentId: number;
  studentId: string;
  content?: string;
  attachments?: CloudinaryAsset[];
  status: SubmissionStatus;
  submittedAt: string;
  grade?: Grade;
};

export type Grade = {
  id: number;
  submissionId: number;
  studentId: string;
  score: number;
  maxScore: number;
  feedback?: string;
  gradedAt: string;
};

/* ------------------------------------------------------------------ */
/*  Announcements                                                      */
/* ------------------------------------------------------------------ */

export type Announcement = {
  id: number;
  classId: number;
  authorId: string;
  title?: string;
  body: string;
  createdAt: string;
};

/* ------------------------------------------------------------------ */
/*  Media (Cloudinary)                                                 */
/* ------------------------------------------------------------------ */

export type CloudinaryAsset = {
  url: string;
  publicId: string;
  type: "image" | "video" | "raw";
  name?: string;
  size?: number;
};

export type UploadWidgetValue = {
  url: string;
  publicId: string;
};

export type UploadWidgetProps = {
  value?: UploadWidgetValue | null;
  onChange?: (value: UploadWidgetValue | null) => void;
  disabled?: boolean;
};

/* ------------------------------------------------------------------ */
/*  API responses                                                      */
/* ------------------------------------------------------------------ */

export type ListResponse<T = unknown> = {
  data?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateResponse<T = unknown> = { data?: T };
export type GetOneResponse<T = unknown> = { data?: T };

/* ------------------------------------------------------------------ */
/*  Cloudinary widget globals                                          */
/* ------------------------------------------------------------------ */

declare global {
  interface CloudinaryUploadWidgetResults {
    event: string;
    info: {
      secure_url: string;
      public_id: string;
      delete_token?: string;
      resource_type: string;
      original_filename: string;
      format?: string;
      bytes?: number;
    };
  }

  interface CloudinaryWidget {
    open: () => void;
  }

  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (
          error: unknown,
          result: CloudinaryUploadWidgetResults
        ) => void
      ) => CloudinaryWidget;
    };
  }
}