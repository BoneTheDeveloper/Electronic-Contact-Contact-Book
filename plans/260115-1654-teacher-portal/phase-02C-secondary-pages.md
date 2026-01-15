---
phase: 02C
title: "Secondary Pages Update"
description: "Update Assessments, Conduct, Messages pages to match wireframe specifications with new layouts"
estimated_time: 8h
actual_time: 8h
parallel_with: [02A, 02B]
depends_on: [01]
exclusive_ownership: true
status: COMPLETED
completed_at: 2026-01-15
---

## Phase 02C: Secondary Pages Update

**Status:** ✅ COMPLETED
**Group:** GROUP C
**Execution Order:** After Phase 01 completes
**Git Commit:** 0f407f3

---

## Context Links

- [Main Plan](./plan.md)
- [Phase 01: Foundation](./phase-01-foundation.md) - PREREQUISITE
- [Wireframe Analysis](./research/wireframe-analysis.md)
- [Existing Implementation](./research/existing-implementation.md)
- [Development Rules](../../../.claude/workflows/development-rules.md)

---

## Overview

Update 3 secondary existing pages to match wireframe specifications:

1. **Assessments** - Update to wireframe with student cards, rating stars, 3 states (evaluated/pending/needs attention)
2. **Conduct** - Update to wireframe with dual rating columns (academic + conduct), rating scales, pagination
3. **Messages** - Update to 3-column layout (chat list | conversation | contact info), online indicators, message bubbles

**Parallelization:** These pages exist already - Phase 02C updates them exclusively. No overlap with 02A (new pages) or 02B (core pages).

---

## Parallelization Info

**Can Run With:** Phase 02A, Phase 02B
**Blocked By:** Phase 01
**Exclusive Ownership:** YES - Secondary page directories only

**Conflict Prevention:**
- Phase 02C updates `/teacher/assessments/`, `/teacher/conduct/`, `/teacher/messages/`
- Phase 02A creates NEW directories (schedule, class-management, etc.)
- Phase 02B updates `/teacher/dashboard/`, `/teacher/attendance/`, `/teacher/grades/`
- **Zero file overlap**

---

## Requirements

### 1. Assessments Update

**Current:** Basic assessment list
**Target:** Full wireframe regular-assessment.html

**New Features:**
- **Filter Bar:** Class, Subject, Status (All/Pending/Evaluated/Needs Attention), Search
- **Summary Stats:** 4 gradient cards (evaluated count, pending, positive, needs attention)
- **Student Cards with 3 States:**
  - **Evaluated (green border):** Comment, rating stars, date, edit button
  - **Pending (amber dashed border):** "Evaluate now" CTA
  - **Needs Attention (red border):** Warning, "Contact Parent" button
- **Rating Stars:** 1-5 interactive or display stars
- **Comment Categories:** Bài tập về nhà, Tiến bộ học tập, etc.

**Data Source:** `getRegularAssessments()` - Phase 01

### 2. Conduct Update

**Current:** Basic conduct ratings
**Target:** Full wireframe academic-conduct-rating.html

**New Features:**
- **Filter Bar:** Semester, Academic Rating filter, Conduct Rating filter, Search
- **Academic Rating Summary:** 5 cards (Giỏi xuất sắc, Giỏi, Khá, Trung bình, Cần cố gắng)
- **Conduct Rating Summary:** 4 cards with colored dots (Tốt, Khá, Trung bình, Yếu)
- **Student List:**
  - Avatar initials with color coding
  - Academic badge + average score
  - Conduct dot + rating text
  - Action buttons: "Chi tiết", "Sửa xếp loại", "Liên hệ PH"
- **Dual Rating Display:** Show both academic and conduct ratings side by side
- **Pagination:** Page navigation at bottom

**Data Source:** `getConductRatings()` - existing in mock-data.ts

### 3. Messages Update

**Current:** Basic message list
**Target:** Full wireframe chat.html

**New Features:**
- **3-Column Layout:**
  - **Left (320px):** Chat list with search & tabs
  - **Center (flex-1):** Active conversation with message bubbles
  - **Right (320px, hidden on mobile):** Contact info & shared files
- **Online Indicators:** Green dot (online), gray dot (offline)
- **Unread Badges:** Red circle with count
- **Message Bubbles:**
  - Sent: Blue gradient, right-aligned
  - Received: Gray, left-aligned
- **Typing Indicator:** Animated dots
- **Message Actions:** Phone call, video call, info
- **Timestamps:** Relative time (2p, 15p, Hôm qua, etc.)

**Data Source:** `getTeacherConversations()`, `getConversationMessages()` - existing in mock-data.ts

---

## Architecture

### Updated Directory Structure

```
apps/web/app/teacher/
├── assessments/
│   ├── page.tsx                  # UPDATE - Student cards with 3 states
│   └── [id]/
│       └── page.tsx              # UPDATE - Evaluation form
├── conduct/
│   └── page.tsx                  # UPDATE - Dual ratings + pagination
└── messages/
    ├── page.tsx                  # UPDATE - 3-column layout
    └── [id]/
        └── page.tsx              # UPDATE - Chat view with bubbles
```

### Component Reusability

**Reuse Existing:**
- Card patterns
- Table layouts
- Filter bar pattern

**New Components Needed:**
- `StudentAssessmentCard` - 3-state evaluation card (shared with Phase 02A)
- `DualRatingBadge` - Academic + conduct rating display
- `RatingStars` - 1-5 star display/input (shared with Phase 02A)
- `ChatBubble` - Message bubble with sent/received variants
- `OnlineIndicator` - Green/gray dot for online status
- `TypingIndicator` - Animated typing dots

---

## Related Code Files (EXCLUSIVE OWNERSHIP)

### Modified By Phase 02C ONLY

| File | Type | Changes |
|------|------|---------|
| `apps/web/app/teacher/assessments/page.tsx` | UPDATE | Student cards with 3 states, rating stars |
| `apps/web/app/teacher/assessments/[id]/page.tsx` | UPDATE | Evaluation form with categories |
| `apps/web/app/teacher/conduct/page.tsx` | UPDATE | Dual ratings, summaries, pagination |
| `apps/web/app/teacher/messages/page.tsx` | UPDATE | 3-column layout, chat list, conversation view |
| `apps/web/app/teacher/messages/[id]/page.tsx` | UPDATE | Chat interface with message bubbles |

**NO OTHER PHASE touches these directories.**

**Data Access (READ-ONLY):**
- `apps/web/lib/mock-data.ts` - Phase 01 extended functions

---

## File Ownership

### Exclusive to Phase 02C

**Updated Directories:**
- `/teacher/assessments/` - Only Phase 02C updates
- `/teacher/conduct/` - Only Phase 02C updates
- `/teacher/messages/` - Only Phase 02C updates

**No Overlap:**
- Phase 02A creates NEW directories (schedule, class-management, etc.)
- Phase 02B updates `/teacher/dashboard/`, `/teacher/attendance/`, `/teacher/grades/`
- **Zero file conflicts possible**

---

## Implementation Steps

### Step 1: Assessments Update (2.5h)

**File:** `apps/web/app/teacher/assessments/page.tsx`

**Reference:** Similar to Phase 02A Regular Assessment page but for existing assessments route

**Key Features:**
- Reuse StudentAssessmentCard component from Phase 02A
- Filter bar with Class, Subject, Status, Search
- Summary stats cards
- Student list with 3 card variants

**Validation:**
- [ ] 3 card states display correctly
- [ ] Rating stars show
- [ ] Filter functionality works
- [ ] Link to evaluation detail page

### Step 2: Conduct Update (3h)

**File:** `apps/web/app/teacher/conduct/page.tsx`

**New Features:**

```tsx
export default async function ConductPage() {
  const ratings = await getConductRatings('10A1', 1)

  // Calculate summary statistics
  const academicSummary = {
    excellentPlus: ratings.filter(r => r.academicRating === 'excellent-plus').length,
    excellent: ratings.filter(r => r.academicRating === 'excellent').length,
    good: ratings.filter(r => r.academicRating === 'good').length,
    average: ratings.filter(r => r.academicRating === 'average').length,
    needsImprovement: ratings.filter(r => r.academicRating === 'needs-improvement').length,
  }

  const conductSummary = {
    good: ratings.filter(r => r.conductRating === 'good').length,
    fair: ratings.filter(r => r.conductRating === 'fair').length,
    average: ratings.filter(r => r.conductRating === 'average').length,
    poor: ratings.filter(r => r.conductRating === 'poor').length,
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold">Học tập & Hạnh kiểm</h1>
        <p className="text-gray-500">Xếp loại học tập và hạnh kiểm học sinh</p>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select>
              <Option>Học kỳ 1</Option>
              <Option>Học kỳ 2</Option>
            </Select>
            <Select>
              <Option>Tất cả</Option>
              <Option>Giỏi xuất sắc</Option>
              <Option>Giỏi</Option>
            </Select>
            <Select>
              <Option>Tất cả</Option>
              <Option>Tốt</Option>
              <Option>Khá</Option>
            </Select>
            <Input placeholder="Tìm kiếm học sinh..." />
          </div>
        </CardContent>
      </Card>

      {/* Academic Rating Summary */}
      <div>
        <h3 className="text-lg font-bold mb-4">Xếp loại học tập</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border-l-4 border-green-500">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">{academicSummary.excellentPlus}</div>
              <div className="text-sm text-gray-500">Giỏi xuất sắc (≥9.0)</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-blue-500">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{academicSummary.excellent}</div>
              <div className="text-sm text-gray-500">Giỏi (8.0-8.9)</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-yellow-500">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-yellow-600">{academicSummary.good}</div>
              <div className="text-sm text-gray-500">Khá (6.5-7.9)</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-orange-500">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600">{academicSummary.average}</div>
              <div className="text-sm text-gray-500">Trung bình (5.0-6.4)</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-red-500">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-red-600">{academicSummary.needsImprovement}</div>
              <div className="text-sm text-gray-500">Cần cố gắng (&lt;5.0)</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Conduct Rating Summary */}
      <div>
        <h3 className="text-lg font-bold mb-4">Xếp loại hạnh kiểm</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4 p-4">
            <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
            <div>
              <div className="text-2xl font-bold">{conductSummary.good}</div>
              <div className="text-sm text-gray-500">Tốt</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-4">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <div>
              <div className="text-2xl font-bold">{conductSummary.fair}</div>
              <div className="text-sm text-gray-500">Khá</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-4">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <div>
              <div className="text-2xl font-bold">{conductSummary.average}</div>
              <div className="text-sm text-gray-500">Trung bình</div>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-4">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <div>
              <div className="text-2xl font-bold">{conductSummary.poor}</div>
              <div className="text-sm text-gray-500">Yếu</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Student List with Dual Ratings */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách học sinh</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>MSSV</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Học tập</TableHead>
                <TableHead>Hạnh kiểm</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ratings.map((rating) => (
                <TableRow key={rating.studentId}>
                  <TableCell>
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center font-bold text-sky-600">
                      {rating.studentName.split(' ').map(n => n[0]).join('')}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">{rating.mssv}</TableCell>
                  <TableCell className="font-bold">{rating.studentName}</TableCell>
                  <TableCell>
                    <DualRatingBadge type="academic" rating={rating.academicRating} score={rating.academicScore} />
                  </TableCell>
                  <TableCell>
                    <DualRatingBadge type="conduct" rating={rating.conductRating} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Chi tiết</Button>
                      <Button size="sm" variant="outline">Sửa</Button>
                      <Button size="sm" variant="outline">Liên hệ PH</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <Button size="sm" variant="outline" disabled>Trước</Button>
        <Button size="sm" className="bg-sky-600">1</Button>
        <Button size="sm" variant="outline">2</Button>
        <Button size="sm" variant="outline">3</Button>
        <Button size="sm" variant="outline">...</Button>
        <Button size="sm" variant="outline">7</Button>
        <Button size="sm" variant="outline">Sau</Button>
      </div>
    </div>
  )
}

// Dual Rating Badge Component
function DualRatingBadge({ type, rating, score }: { type: 'academic' | 'conduct', rating: string, score?: number }) {
  const getColor = () => {
    if (type === 'academic') {
      if (rating === 'excellent-plus') return 'bg-green-100 text-green-700'
      if (rating === 'excellent') return 'bg-blue-100 text-blue-700'
      if (rating === 'good') return 'bg-yellow-100 text-yellow-700'
      if (rating === 'average') return 'bg-orange-100 text-orange-700'
      return 'bg-red-100 text-red-700'
    } else {
      if (rating === 'good') return 'bg-emerald-100 text-emerald-700'
      if (rating === 'fair') return 'bg-blue-100 text-blue-700'
      if (rating === 'average') return 'bg-yellow-100 text-yellow-700'
      return 'bg-red-100 text-red-700'
    }
  }

  const getLabel = () => {
    if (type === 'academic') {
      if (rating === 'excellent-plus') return 'Giỏi xuất sắc'
      if (rating === 'excellent') return 'Giỏi'
      if (rating === 'good') return 'Khá'
      if (rating === 'average') return 'Trung bình'
      return 'Cần cố gắng'
    } else {
      if (rating === 'good') return 'Tốt'
      if (rating === 'fair') return 'Khá'
      if (rating === 'average') return 'Trung bình'
      return 'Yếu'
    }
  }

  return (
    <div className="flex items-center gap-2">
      {type === 'conduct' && (
        <div className={`w-3 h-3 rounded-full ${getColor().split(' ')[0]}`}></div>
      )}
      <div>
        <Badge className={getColor()}>{getLabel()}</Badge>
        {score && (
          <div className="text-xs text-gray-500 mt-1">ĐTB: {score}</div>
        )}
      </div>
    </div>
  )
}
```

**Validation:**
- [ ] Academic rating summary displays
- [ ] Conduct rating summary displays
- [ ] Dual rating badges show correctly
- [ ] Color coding matches wireframe
- [ ] Pagination works
- [ ] Action buttons present

### Step 3: Messages Update (2.5h)

**File:** `apps/web/app/teacher/messages/page.tsx` and `messages/[id]/page.tsx`

**New 3-Column Layout:**

```tsx
export default async function MessagesPage() {
  const conversations = await getTeacherConversations()

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Column - Chat List (320px) */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold mb-4">Tin nhắn</h2>
          <Input placeholder="Tìm kiếm..." />
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/teacher/messages/${conv.id}`}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 border-b border-gray-100"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                  {conv.parentName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${conv.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <div className="font-bold truncate">{conv.parentName}</div>
                  <div className="text-xs text-gray-400">{conv.lastMessageTime}</div>
                </div>
                <div className="text-sm text-gray-500 truncate">{conv.studentName}</div>
                <div className="text-xs text-gray-400 truncate">{conv.lastMessage}</div>
              </div>
              {conv.unreadCount > 0 && (
                <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {conv.unreadCount}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Center Column - Active Conversation (flex-1) */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Selected conversation content or empty state */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div>Chọn một cuộc hội thoại</div>
          </div>
        </div>
      </div>

      {/* Right Column - Contact Info (320px, hidden on mobile) */}
      <div className="hidden lg:block w-80 border-l border-gray-200 bg-white p-4">
        <div className="text-center text-gray-400">
          <div>Chọn một cuộc hội thoại</div>
        </div>
      </div>
    </div>
  )
}
```

**Conversation Detail Page:**

```tsx
export default async function ConversationDetailPage({ params }: { params: { id: string } }) {
  const conversation = await getConversationMessages(params.id)

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left - Chat List (same as above) */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        {/* ... chat list ... */}
      </div>

      {/* Center - Conversation */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200 flex items-center gap-4">
          <div>
            <div className="font-bold">Nguyễn Văn A</div>
            <div className="text-sm text-gray-500">Phụ huynh Nguyễn Văn B - 10A1</div>
          </div>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline">
              <Phone className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Video className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.messages.map((msg) => {
            const isSent = msg.senderType === 'teacher'
            return (
              <div key={msg.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    isSent
                      ? 'bg-gradient-to-br from-sky-600 to-sky-700 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-700 rounded-bl-sm'
                  }`}
                >
                  <div className="text-sm">{msg.content}</div>
                  <div className={`text-xs mt-1 ${isSent ? 'text-sky-200' : 'text-gray-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing Indicator */}
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              placeholder="Nhập tin nhắn..."
              className="flex-1"
            />
            <Button size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right - Contact Info */}
      <div className="hidden lg:block w-80 border-l border-gray-200 bg-white p-4">
        <h3 className="font-bold mb-4">Thông tin liên hệ</h3>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500">Phụ huynh</div>
            <div className="font-bold">Nguyễn Văn A</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Điện thoại</div>
            <div className="font-bold">0901234567</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Email</div>
            <div className="font-bold">parent@email.com</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Học sinh</div>
            <div className="font-bold">Nguyễn Văn B</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">MSSV</div>
            <div className="font-bold">HS001</div>
          </div>
        </div>

        <h3 className="font-bold mt-6 mb-4">Tài liệu chia sẻ</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <FileText className="w-4 h-4 text-red-500" />
            <div className="text-sm flex-1">Bài tập về nhà.pdf</div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <Image className="w-4 h-4 text-blue-500" />
            <div className="text-sm flex-1">Ảnh chụp bảng.jpg</div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Validation:**
- [ ] 3-column layout displays correctly
- [ ] Chat list shows with online indicators
- [ ] Message bubbles display correctly (sent/received)
- [ ] Typing indicator animates
- [ ] Contact info sidebar shows
- [ ] Responsive design works (right sidebar hidden on mobile)

---

## Conflict Prevention

### How Phase 02C Prevents Conflicts

1. **Exclusive Directory Ownership:**
   - Only Phase 02C modifies assessments, conduct, messages
   - Phase 02A creates new directories only
   - Phase 02B modifies dashboard, attendance, grades only

2. **Mock Data READ-ONLY:**
   - Phase 02C reads from mock-data.ts
   - Does not modify data structures

3. **Independent Features:**
   - Each page is self-contained
   - No shared components between phases except shared utilities
   - Navigation handled by Phase 01

---

## Risk Assessment

### Medium Risk

**Reason:** Updating existing pages, complex 3-column layout for messages

**Potential Issues:**
- **3-column layout** responsive behavior
- **Message bubble** styling inconsistencies
- **Dual rating** display complexity

### Mitigation

- Test responsive behavior thoroughly
- Use CSS grid/flexbox for reliable layout
- Copy styling from wireframe HTML
- Run `npm run typecheck` frequently

---

## Testing Checklist

### Pre-Phase 02C Completion
- [ ] Assessments show 3 card states
- [ ] Conduct displays dual ratings correctly
- [ ] Messages 3-column layout works
- [ ] Online indicators display
- [ ] Message bubbles styled correctly
- [ ] Pagination functional
- [ ] No TypeScript errors

### Integration Testing (Phase 03)
- [ ] Navigation to all 3 pages works
- [ ] Assessments link to detail page
- [ ] Messages open conversations correctly
- [ ] Responsive design works on mobile

---

## Component Library

### New Components to Create

**1. DualRatingBadge** (shared with other phases)
```tsx
interface DualRatingBadgeProps {
  type: 'academic' | 'conduct'
  rating: string
  score?: number
}
```

**2. ChatBubble**
```tsx
interface ChatBubbleProps {
  content: string
  timestamp: string
  isSent: boolean
}
```

**3. OnlineIndicator**
```tsx
interface OnlineIndicatorProps {
  online: boolean
}
```

**4. TypingIndicator**
```tsx
interface TypingIndicatorProps {}
```

---

## Handoff to Phase 03

**Git Commit:** "feat(teacher): update assessments, conduct, messages to match wireframe specifications"

**Ready for merge:**
- All 3 pages updated with new features
- Existing features preserved
- No conflicts with 02A/02B expected

---

## Unresolved Questions

1. Messages - real-time updates or polling?
2. File attachments in chat - what file types allowed?
3. Conduct ratings - who can edit? Teacher only?
4. Pagination - client-side or server-side?
