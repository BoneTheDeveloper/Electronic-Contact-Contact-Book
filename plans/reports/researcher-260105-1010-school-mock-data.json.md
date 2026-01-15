# Mock Data JSON Best Practices for School Management Systems

## 1. JSON Schema Design

### Core Entity Schemas

**Users Schema**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "role", "email", "createdAt"],
  "properties": {
    "id": {"type": "string", "format": "uuid"},
    "role": {"enum": ["admin", "teacher", "student", "parent"]},
    "email": {"type": "string", "format": "email"},
    "firstName": {"type": "string"},
    "lastName": {"type": "string"},
    "phone": {"type": "string", "pattern": "^\\+?[0-9]{10,15}$"},
    "isActive": {"type": "boolean", "default": true},
    "createdAt": {"type": "string", "format": "date-time"},
    "updatedAt": {"type": "string", "format": "date-time"}
  }
}
```

**Students Schema**
```json
{
  "required": ["id", "userId", "classId", "admissionNumber"],
  "properties": {
    "id": {"type": "string", "format": "uuid"},
    "userId": {"type": "string", "format": "uuid"},
    "classId": {"type": "string", "format": "uuid"},
    "admissionNumber": {"type": "string"},
    "dateOfBirth": {"type": "string", "format": "date"},
    "gender": {"enum": ["male", "female", "other"]},
    "bloodGroup": {"type": "string"},
    "address": {
      "type": "object",
      "properties": {
        "street": {"type": "string"},
        "city": {"type": "string"},
        "state": {"type": "string"},
        "zipCode": {"type": "string"}
      }
    },
    "emergencyContact": {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "relationship": {"type": "string"},
        "phone": {"type": "string"}
      }
    }
  }
}
```

**Classes Schema**
```json
{
  "properties": {
    "id": {"type": "string", "format": "uuid"},
    "name": {"type": "string"},
    "grade": {"type": "string", "pattern": "^[1-9][0-9]*[A-Z]?$"},
    "section": {"type": "string", "maxLength": 1},
    "maxStudents": {"type": "integer", "minimum": 20, "maximum": 50},
    "academicYear": {"type": "string", "pattern": "^[0-9]{4}-[0-9]{4}$"},
    "teacherId": {"type": "string", "format": "uuid"},
    "subjects": {"type": "array", "items": {"type": "string", "format": "uuid"}}
  }
}
```

**Attendance Schema**
```json
{
  "properties": {
    "id": {"type": "string", "format": "uuid"},
    "studentId": {"type": "string", "format": "uuid"},
    "classId": {"type": "string", "format": "uuid"},
    "date": {"type": "string", "format": "date"},
    "status": {"enum": ["present", "absent", "late", "excused"]},
    "notes": {"type": "string"},
    "markedBy": {"type": "string", "format": "uuid"}
  }
}
```

**Grades Schema**
```json
{
  "properties": {
    "id": {"type": "string", "format": "uuid"},
    "studentId": {"type": "string", "format": "uuid"},
    "subjectId": {"type": "string", "format": "uuid"},
    "classId": {"type": "string", "format": "uuid"},
    "assessmentType": {"enum": ["exam", "quiz", "assignment", "project"]},
    "maxMarks": {"type": "number", "minimum": 0},
    "obtainedMarks": {"type": "number", "minimum": 0},
    "percentage": {"type": "number", "minimum": 0, "maximum": 100},
    "gradedBy": {"type": "string", "format": "uuid"},
    "gradedAt": {"type": "string", "format": "date-time"}
  }
}
```

**Fees Schema**
```json
{
  "properties": {
    "id": {"type": "string", "format": "uuid"},
    "studentId": {"type": "string", "format": "uuid"},
    "feeType": {"enum": ["tuition", "transport", "books", "other"]},
    "amount": {"type": "number", "minimum": 0},
    "dueDate": {"type": "string", "format": "date"},
    "paidDate": {"type": ["string", "null"], "format": "date"},
    "status": {"enum": ["pending", "paid", "overdue", "waived"]},
    "paymentMethod": {"type": ["string", "null"], "enum": ["cash", "bank_transfer", "card", "check"]}
  }
}
```

## 2. Relationships Between Data Entities

- One-to-Many: User → Students (one user per student)
- Many-to-One: Students → Classes (many students per class)
- Many-to-Many: Students ↔ Subjects (via enrollment records)
- One-to-Many: Classes → Attendance (one class, many attendance records)
- One-to-Many: Students → Grades (one student, many grades)
- One-to-Many: Students → Fees (one student, many fee records)

## 3. Realistic Sample Data Patterns

### Student-Teacher Relationship
```json
{
  "students": [
    {
      "id": "stu-001",
      "userId": "user-001",
      "classId": "cls-001",
      "admissionNumber": "ADM2024001",
      "firstName": "Emma",
      "lastName": "Johnson"
    }
  ],
  "teachers": [
    {
      "id": "tea-001",
      "userId": "user-002",
      "subjects": ["sub-001", "sub-002"],
      "assignedClasses": ["cls-001"]
    }
  ]
}
```

## 4. Data Volume Recommendations

### Mock Data for Prototype Apps
- **Small prototype (1 class):** 20-30 students, 2-3 teachers, 4-5 subjects
- **Medium prototype (whole school):** 200-300 students, 15-20 teachers, 20-30 subjects
- **Large prototype (multiple schools):** 1000+ students, 50+ teachers, 50+ subjects

### File Organization
- Separate files per entity: `students.json`, `teachers.json`, `classes.json`
- Include metadata in each file: `createdAt`, `version`, `entityCount`
- Use consistent ID naming: `{prefix}-{serial}` (e.g., `stu-001`, `cls-005`)

## 5. Best Practices

1. **Use UUIDs** for all entity IDs to avoid conflicts
2. **Include timestamps** for all create/update operations
3. **Validate data** with JSON Schema before loading
4. **Use embedded documents** for frequently accessed data
5. **Denormalize wisely** for performance in prototype apps
6. **Include status fields** for lifecycle management
7. **Use arrays** for many-to-many relationships
8. **Add validation** constraints at schema level

## 6. Sample File Structure

```
mock-data/
├── users.json
├── students.json
├── teachers.json
├── classes.json
├── subjects.json
├── attendance.json
├── grades.json
├── fees.json
└── notifications.json
```