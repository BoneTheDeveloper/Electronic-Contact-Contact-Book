# User Management - Upload/Import Function Design

## Overview
The user management module provides bulk import functionality for students, teachers, and parents via Excel file upload. This allows administrators to quickly add multiple users at once.

## Components

### 1. ImportExcelModal Component
**Location:** `apps/web/components/admin/users/modals/ImportExcelModal.tsx`

#### Features
- **Drag & Drop File Upload**
  - Accepts `.xlsx` and `.xls` file formats
  - Visual feedback during drag operations
  - File size display

- **Template Download**
  - Generates CSV templates for each user type
  - Pre-defined columns based on import type

- **Import Progress**
  - Real-time progress bar (0-100%)
  - Status updates during processing
  - Success confirmation with auto-close

- **Error Handling**
  - File type validation
  - User-friendly error messages

#### Import Types

| Type | Vietnamese Label | Template Columns |
|------|------------------|------------------|
| `students` | Học sinh | Họ và tên, Ngày sinh, Giới tính, Khối, Lớp, Ngày nhập học |
| `teachers` | Giáo viên | Họ và tên, Số điện thoại, Email, Chuyên môn |
| `parents` | Phụ huynh | Họ và tên, Số điện thoại, Email |

## User Interface Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Management Page                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │  Add User      │  │  Import Excel  │  │  Filter        │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │         Import Excel Modal            │
        │  ┌─────────────────────────────────┐  │
        │  │     Drag & Drop Area            │  │
        │  │   ┌─────────────────────────┐   │  │
        │  │   │    [Upload Icon]         │   │  │
        │  │   │   Kéo thả file vào đây   │   │  │
        │  │   │   hoặc nhấn để chọn     │   │  │
        │   │   └─────────────────────────┘   │  │
        │  │         [Chọn file]              │  │
        │  └─────────────────────────────────┘  │
        │  ┌─────────────────────────────────┐  │
        │  │  [📄] Tải mẫu file Excel        │  │
        │  │       Template với định dạng    │  │
        │  │       [Tải xuống]               │  │
        │  └─────────────────────────────────┘  │
        └───────────────────────────────────────┘
                            │
                        File Selected
                            ▼
        ┌───────────────────────────────────────┐
        │         Processing File               │
        │  ┌─────────────────────────────────┐  │
        │  │  📄 filename.xlsx (45.2 KB)     │  │
        │  │  ████████████░░░░░ 65%          │  │
        │  └─────────────────────────────────┘  │
        │           [Nhập dữ liệu]              │
        └───────────────────────────────────────┘
                            │
                        Complete
                            ▼
        ┌───────────────────────────────────────┐
        │              Success                  │
        │         ✓ Nhập dữ liệu thành công!   │
        │    Danh sách học sinh đã được cập    │
        │    nhật.                             │
        │              [Đóng]                   │
        └───────────────────────────────────────┘
```

## Code Structure

### Props Interface
```typescript
interface ImportExcelModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  importType?: 'students' | 'teachers' | 'parents'
}
```

### State Management
```typescript
const [file, setFile] = useState<File | null>(null)      // Selected file
const [dragActive, setDragActive] = useState(false)        // Drag state
const [uploading, setUploading] = useState(false)          // Upload state
const [progress, setProgress] = useState(0)                // Progress 0-100
const [importSuccess, setImportSuccess] = useState(false)  // Success state
```

### Key Functions

#### `handleFile(file: File)`
Validates and sets the selected file.
- Checks MIME type and extension
- Accepts: `.xlsx`, `.xls`

#### `handleDownloadTemplate()`
Generates and downloads a CSV template based on `importType`.
- Students: 6 columns
- Teachers: 4 columns
- Parents: 3 columns

#### `handleImport()`
Processes the uploaded file.
- Shows progress animation (mock: 3 seconds)
- Calls `onSuccess` callback on completion
- Auto-closes modal after 2 seconds

## Template Format

### Students Template
```csv
Họ và tên,Ngày sinh,Giới tính,Khối,Lớp,Ngày nhập học
Nguyễn Văn A,2010-05-15,Nam,10,10A1,2024-09-01
Trần Thị B,2010-08-20,Nữ,10,10A2,2024-09-01
```

### Teachers Template
```csv
Họ và tên,Số điện thoại,Email,Chuyên môn
Nguyễn Văn C,0912345678,teacher@school.edu,Toán
Trần Thị D,0923456789,teacher2@school.edu,Văn
```

### Parents Template
```csv
Họ và tên,Số điện thoại,Email
Nguyễn Văn E,0934567890,parent@school.edu
Trần Thị F,0945678901,parent2@school.edu
```

## Integration Points

### UsersManagement Component
```typescript
const [showImportModal, setShowImportModal] = useState(false)

<ImportExcelModal
  isOpen={showImportModal}
  onClose={() => setShowImportModal(false)}
  onSuccess={handleRefresh}
  importType="students"
/>
```

### API Endpoint (Future)
```
POST /api/users/import
- Body: FormData with Excel file
- Response: { success: boolean, imported: number, errors: ValidationError[] }
```

## Database Operations

### Current State (Mock)
- Progress simulation with `setTimeout`
- No actual file parsing
- No database insertion

### Future Implementation
1. **File Parsing**
   - Use `xlsx` library to parse Excel files
   - Validate data structure

2. **Bulk Insert**
   - Use Supabase batch insert
   - Transaction support for rollback on errors

3. **Error Reporting**
   - Collect validation errors per row
   - Return detailed error report

## Code Format Reference

Generated codes follow role-specific patterns:

| Role | Code Format | Example | DB Function |
|------|-------------|---------|-------------|
| Admin | AD + 3 digits | AD001, AD002 | `generate_admin_code()` |
| Teacher | TC + 3 digits | TC001, TC002 | `generate_teacher_code()` |
| Parent | PH + year + 5 digits | PH202600001 | `generate_parent_code()` |
| Student | ST + year + 4 digits | ST2024001 | `generate_student_code()` |

## Future Enhancements

1. **Async Processing**
   - Background job for large files
   - Email notification on completion

2. **Validation**
   - Real-time validation during import
   - Duplicate detection (email, phone)

3. **Error Recovery**
   - Partial import with error summary
   - Retry failed rows

4. **Export**
   - Export current users to Excel
   - Filter before export

## Files Referenced

- `apps/web/components/admin/users/modals/ImportExcelModal.tsx` - Upload modal
- `apps/web/components/admin/users/UsersManagement.tsx` - Main user management
- `apps/web/lib/supabase/queries.ts` - Database queries
- `packages/shared-types/src/index.ts` - User type definitions
