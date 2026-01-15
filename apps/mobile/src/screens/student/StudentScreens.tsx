/**
 * Student Screens
 * Contains all student-specific screens similar to parent screens
 * Each screen is a simple component that can be expanded later
 */

import React from 'react';
import { View, ScrollView, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, Button, Avatar, Divider } from 'react-native-paper';
import { useStudentStore } from '../../stores';
import { colors } from '../../theme';
import Svg, { Path, Rect, Line, Circle, Polyline } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ==================== SCHEDULE SCREEN ====================

interface ScheduleDay {
  date: string;
  dayName: string;
  periods: Period[];
}

interface Period {
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

const MOCK_SCHEDULE: ScheduleDay[] = [
  {
    date: '2026-01-13',
    dayName: 'Thứ Hai',
    periods: [
      { time: '07:00 - 07:45', subject: 'Toán', teacher: 'Thầy Nguyễn Văn A', room: 'Phòng 101' },
      { time: '07:50 - 08:35', subject: 'Văn', teacher: 'Cô Trần Thị B', room: 'Phòng 101' },
      { time: '08:40 - 09:25', subject: 'Anh', teacher: 'Cô Lê Thị C', room: 'Phòng Lab 1' },
      { time: '09:40 - 10:25', subject: 'Lý', teacher: 'Thầy Phạm Văn D', room: 'Phòng Lab 2' },
      { time: '10:30 - 11:15', subject: 'Hóa', teacher: 'Cô Hoàng Thị E', room: 'Phòng Lab 2' },
    ],
  },
  {
    date: '2026-01-14',
    dayName: 'Thứ Ba',
    periods: [
      { time: '07:00 - 07:45', subject: 'Sinh', teacher: 'Cô Ngô Thị F', room: 'Phòng Lab 3' },
      { time: '07:50 - 08:35', subject: 'Sử', teacher: 'Thầy Đỗ Văn G', room: 'Phòng 102' },
      { time: '08:40 - 09:25', subject: 'Địa', teacher: 'Cô Vũ Thị H', room: 'Phòng 102' },
      { time: '09:40 - 10:25', subject: 'GDCD', teacher: 'Thầy Lê Văn I', room: 'Phòng 103' },
      { time: '10:30 - 11:15', subject: 'TD', teacher: 'Cô Nguyễn Thị K', room: 'Sân trường' },
    ],
  },
];

export const StudentScheduleScreen: React.FC = () => {
  const { studentData } = useStudentStore();

  const renderPeriod = (period: Period, index: number) => (
    <View key={index} style={styles.periodRow}>
      <View style={styles.periodTime}>
        <Text style={styles.periodTimeText}>{period.time}</Text>
      </View>
      <View style={styles.periodInfo}>
        <Text style={styles.periodSubject}>{period.subject}</Text>
        <Text style={styles.periodTeacher}>{period.teacher}</Text>
        <Chip mode="flat" compact style={styles.roomChip} textStyle={styles.roomChipText}>
          {period.room}
        </Chip>
      </View>
    </View>
  );

  const renderDay = ({ item }: { item: ScheduleDay }) => (
    <Card style={styles.dayCard}>
      <Card.Content>
        <View style={styles.dayHeader}>
          <Text style={styles.dayName}>{item.dayName}</Text>
          <Text style={styles.dayDate}>{item.date}</Text>
        </View>
        <View style={styles.periodsContainer}>
          {item.periods.map((period, index) => renderPeriod(period, index))}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thời khóa biểu</Text>
        {studentData && (
          <Text style={styles.headerSubtitle}>
            Lớp {studentData.grade}{studentData.section}
          </Text>
        )}
      </View>
      <FlatList
        data={MOCK_SCHEDULE}
        renderItem={renderDay}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// ==================== GRADES SCREEN ====================

interface GradeItem {
  id: string;
  subject: string;
  grades: { score: number; maxScore: number; type: string }[];
  average: number;
}

const MOCK_GRADES: GradeItem[] = [
  {
    id: '1',
    subject: 'Toán học',
    grades: [
      { score: 8.5, maxScore: 10, type: 'Giữa kỳ' },
      { score: 9, maxScore: 10, type: 'Điểm thành phần' },
      { score: 7.5, maxScore: 10, type: 'Bài tập' },
    ],
    average: 8.33,
  },
  {
    id: '2',
    subject: 'Ngữ văn',
    grades: [
      { score: 7, maxScore: 10, type: 'Giữa kỳ' },
      { score: 8, maxScore: 10, type: 'Điểm thành phần' },
      { score: 7.5, maxScore: 10, type: 'Bài tập' },
    ],
    average: 7.5,
  },
];

export const StudentGradesScreen: React.FC = () => {
  const renderGradeItem = ({ item }: { item: GradeItem }) => (
    <Card style={styles.gradeCard}>
      <Card.Content>
        <View style={styles.gradeHeader}>
          <Text style={styles.gradeSubject}>{item.subject}</Text>
          <View style={[styles.averageBadge, { backgroundColor: item.average >= 8 ? '#D1FAE5' : item.average >= 6.5 ? '#FEF3C7' : '#FEE2E2' }]}>
            <Text style={[styles.averageText, { color: item.average >= 8 ? '#065F46' : item.average >= 6.5 ? '#92400E' : '#991B1B' }]}>
              {item.average.toFixed(1)}
            </Text>
          </View>
        </View>
        <Divider style={styles.divider} />
        {item.grades.map((grade, index) => (
          <View key={index} style={styles.gradeRow}>
            <Text style={styles.gradeType}>{grade.type}</Text>
            <Text style={styles.gradeScore}>{grade.score}/{grade.maxScore}</Text>
          </View>
        ))}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bảng điểm môn học</Text>
      </View>
      <FlatList
        data={MOCK_GRADES}
        renderItem={renderGradeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// ==================== ATTENDANCE SCREEN ====================

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  reason?: string;
}

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { date: '2026-01-13', status: 'present' },
  { date: '2026-01-12', status: 'present' },
  { date: '2026-01-11', status: 'late', reason: 'Đi muộn 5 phút' },
  { date: '2026-01-10', status: 'present' },
  { date: '2026-01-09', status: 'absent', reason: 'Nghỉ ốm' },
  { date: '2026-01-08', status: 'present' },
  { date: '2026-01-07', status: 'excused', reason: 'Có phép' },
];

const getStatusConfig = (status: AttendanceRecord['status']) => {
  switch (status) {
    case 'present': return { label: 'Có mặt', color: '#D1FAE5', textColor: '#065F46' };
    case 'absent': return { label: 'Vắng mặt', color: '#FEE2E2', textColor: '#991B1B' };
    case 'late': return { label: 'Đi muộn', color: '#FEF3C7', textColor: '#92400E' };
    case 'excused': return { label: 'Có phép', color: '#E0F2FE', textColor: '#075985' };
    default: return { label: status, color: '#F3F4F6', textColor: '#6B7280' };
  }
};

export const StudentAttendanceScreen: React.FC = () => {
  const renderAttendanceItem = ({ item }: { item: AttendanceRecord }) => {
    const config = getStatusConfig(item.status);

    return (
      <Card style={styles.attendanceCard}>
        <Card.Content style={styles.attendanceContent}>
          <View>
            <Text style={styles.attendanceDate}>{item.date}</Text>
            {item.reason && <Text style={styles.attendanceReason}>{item.reason}</Text>}
          </View>
          <Chip mode="flat" style={[styles.attendanceChip, { backgroundColor: config.color }]}>
            <Text style={[styles.attendanceChipText, { color: config.textColor }]}>{config.label}</Text>
          </Chip>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch sử điểm danh</Text>
      </View>
      <FlatList
        data={MOCK_ATTENDANCE}
        renderItem={renderAttendanceItem}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// ==================== TEACHER FEEDBACK SCREEN ====================

interface FeedbackItem {
  id: string;
  teacher: string;
  subject: string;
  content: string;
  date: string;
  type: 'positive' | 'neutral' | 'concern';
}

const MOCK_FEEDBACK: FeedbackItem[] = [
  {
    id: '1',
    teacher: 'Cô Trần Thị B',
    subject: 'Ngữ văn',
    content: 'Hoàng B làm bài rất tốt, cần phát huy thêm khả năng viết văn.',
    date: '2026-01-10',
    type: 'positive',
  },
  {
    id: '2',
    teacher: 'Thầy Nguyễn Văn A',
    subject: 'Toán học',
    content: 'Cần chú ý hơn phần giải bài tập về nhà.',
    date: '2026-01-08',
    type: 'neutral',
  },
];

export const StudentTeacherFeedbackScreen: React.FC = () => {
  const getFeedbackColor = (type: FeedbackItem['type']) => {
    switch (type) {
      case 'positive': return '#D1FAE5';
      case 'neutral': return '#FEF3C7';
      case 'concern': return '#FEE2E2';
      default: return '#F3F4F6';
    }
  };

  const renderFeedbackItem = ({ item }: { item: FeedbackItem }) => (
    <Card style={styles.feedbackCard}>
      <Card.Content>
        <View style={styles.feedbackHeader}>
          <View style={styles.feedbackTeacher}>
            <Avatar.Text size={40} label={item.teacher.split(' ').slice(-1)[0][0]} style={{ backgroundColor: '#E0F2FE' }} labelStyle={{ color: colors.primary }} />
            <View style={styles.feedbackTeacherInfo}>
              <Text style={styles.feedbackTeacherName}>{item.teacher}</Text>
              <Text style={styles.feedbackSubject}>{item.subject}</Text>
            </View>
          </View>
          <Text style={styles.feedbackDate}>{item.date}</Text>
        </View>
        <View style={[styles.feedbackContent, { backgroundColor: getFeedbackColor(item.type) }]}>
          <Text style={styles.feedbackContentText}>{item.content}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nhận xét giáo viên</Text>
      </View>
      <FlatList
        data={MOCK_FEEDBACK}
        renderItem={renderFeedbackItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// ==================== LEAVE REQUEST SCREEN ====================

interface LeaveRequest {
  id: string;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: '1',
    date: '2026-01-20',
    reason: 'Đi khám sức khỏe định kỳ',
    status: 'approved',
  },
  {
    id: '2',
    date: '2026-01-25',
    reason: 'Gia đình có việc',
    status: 'pending',
  },
];

export const StudentLeaveRequestScreen: React.FC = () => {
  const getStatusConfig = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved': return { label: 'Đã duyệt', color: '#D1FAE5', textColor: '#065F46' };
      case 'rejected': return { label: 'Từ chối', color: '#FEE2E2', textColor: '#991B1B' };
      case 'pending': return { label: 'Chờ duyệt', color: '#FEF3C7', textColor: '#92400E' };
    }
  };

  const renderLeaveRequest = ({ item }: { item: LeaveRequest }) => {
    const config = getStatusConfig(item.status);

    return (
      <Card style={styles.leaveCard}>
        <Card.Content>
          <View style={styles.leaveHeader}>
            <View>
              <Text style={styles.leaveDate}>{item.date}</Text>
              <Text style={styles.leaveReason}>{item.reason}</Text>
            </View>
            <Chip mode="flat" style={[styles.leaveChip, { backgroundColor: config.color }]}>
              <Text style={[styles.leaveChipText, { color: config.textColor }]}>{config.label}</Text>
            </Chip>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn xin nghỉ phép</Text>
      </View>
      <FlatList
        data={MOCK_LEAVE_REQUESTS}
        renderItem={renderLeaveRequest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <Button mode="contained" style={styles.newRequestButton} buttonColor={colors.primary}>
            + Tạo đơn mới
          </Button>
        }
      />
    </View>
  );
};

// ==================== NEWS SCREEN ====================

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'school' | 'class' | 'activity';
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Thông báo về việc nghỉ lễ Tết Nguyên Đán 2026',
    content: 'Nhà trường thông báo về lịch nghỉ Tết Nguyên Đán từ ngày 08/02/2026 đến 14/02/2026...',
    date: '2026-01-13',
    category: 'school',
  },
  {
    id: '2',
    title: 'Lịch thi cuối kỳ',
    content: 'Lịch thi cuối kỳ học kỳ I sẽ diễn ra từ ngày 25/01/2026...',
    date: '2026-01-10',
    category: 'class',
  },
];

const getCategoryConfig = (category: NewsItem['category']) => {
  switch (category) {
    case 'school': return { label: 'Nhà trường', color: '#DBEAFE' };
    case 'class': return { label: 'Lớp học', color: '#E0F2FE' };
    case 'activity': return { label: 'Hoạt động', color: '#F3E8FF' };
  }
};

export const StudentNewsScreen: React.FC = () => {
  const renderNewsItem = ({ item }: { item: NewsItem }) => {
    const config = getCategoryConfig(item.category);

    return (
      <Card style={styles.newsCard}>
        <Card.Content>
          <View style={styles.newsMeta}>
            <Chip mode="flat" style={[styles.newsCategoryChip, { backgroundColor: config.color }]}>
              <Text style={styles.newsCategoryText}>{config.label}</Text>
            </Chip>
            <Text style={styles.newsDate}>{item.date}</Text>
          </View>
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsContent} numberOfLines={2}>{item.content}</Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tin tức & sự kiện</Text>
      </View>
      <FlatList
        data={MOCK_NEWS}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// ==================== SUMMARY SCREEN ====================

interface SummaryItem {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

export const StudentSummaryScreen: React.FC = () => {
  const { grades, attendancePercentage } = useStudentStore();

  const summaryData: SummaryItem[] = [
    { label: 'Điểm trung bình', value: '8.2', icon: '📚', color: '#0284C7' },
    { label: 'Điểm danh', value: `${attendancePercentage}%`, icon: '✓', color: '#059669' },
    { label: 'Số ngày nghỉ', value: '2', icon: '📅', color: '#F59E0B' },
    { label: 'Xếp loại', value: 'Giỏi', icon: '⭐', color: '#8B5CF6' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kết quả tổng hợp</Text>
      </View>
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryGrid}>
              {summaryData.map((item, index) => (
                <View key={index} style={styles.summaryItem}>
                  <View style={[styles.summaryIcon, { backgroundColor: `${item.color}20` }]}>
                    <Text style={styles.summaryIconText}>{item.icon}</Text>
                  </View>
                  <Text style={styles.summaryValue}>{item.value}</Text>
                  <Text style={styles.summaryLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.detailedSummaryCard}>
          <Card.Content>
            <Text style={styles.detailSectionTitle}>Chi tiết học tập</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tổng số bài kiểm tra:</Text>
              <Text style={styles.detailValue}>24</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Số bài đạt:</Text>
              <Text style={[styles.detailValue, { color: '#059669' }]}>22</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Số bài cần cải thiện:</Text>
              <Text style={[styles.detailValue, { color: '#F59E0B' }]}>2</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

// ==================== PAYMENT SCREEN ====================

interface PaymentItem {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

const MOCK_PAYMENTS: PaymentItem[] = [
  { id: '1', title: 'Học phí tháng 1', amount: 1500000, dueDate: '2026-01-05', status: 'paid' },
  { id: '2', title: 'Học phí tháng 2', amount: 1500000, dueDate: '2026-02-05', status: 'pending' },
];

const getPaymentStatusConfig = (status: PaymentItem['status']) => {
  switch (status) {
    case 'paid': return { label: 'Đã thanh toán', color: '#D1FAE5', textColor: '#065F46' };
    case 'pending': return { label: 'Chờ thanh toán', color: '#FEF3C7', textColor: '#92400E' };
    case 'overdue': return { label: 'Quá hạn', color: '#FEE2E2', textColor: '#991B1B' };
  }
};

export const StudentPaymentScreen: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const renderPaymentItem = ({ item }: { item: PaymentItem }) => {
    const config = getPaymentStatusConfig(item.status);

    return (
      <Card style={styles.paymentCard}>
        <Card.Content>
          <View style={styles.paymentHeader}>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>{item.title}</Text>
              <Text style={styles.paymentDueDate}>Hạn: {item.dueDate}</Text>
            </View>
            <Chip mode="flat" style={[styles.paymentChip, { backgroundColor: config.color }]}>
              <Text style={[styles.paymentChipText, { color: config.textColor }]}>{config.label}</Text>
            </Chip>
          </View>
          <Text style={styles.paymentAmount}>{formatCurrency(item.amount)}</Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Học phí</Text>
      </View>
      <FlatList
        data={MOCK_PAYMENTS}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// ==================== STUDY MATERIALS SCREEN ====================

interface MaterialItem {
  id: string;
  title: string;
  subject: string;
  type: 'document' | 'video' | 'link';
  date: string;
}

const MOCK_MATERIALS: MaterialItem[] = [
  { id: '1', title: 'Giáo trình Toán học chương trình mới', subject: 'Toán', type: 'document', date: '2026-01-10' },
  { id: '2', title: 'Video bài giảng Văn học', subject: 'Văn', type: 'video', date: '2026-01-08' },
  { id: '3', title: 'Bài tập tiếng Anh bổ trợ', subject: 'Anh', type: 'link', date: '2026-01-05' },
];

const getMaterialIcon = (type: MaterialItem['type']) => {
  switch (type) {
    case 'document': return '📄';
    case 'video': return '🎥';
    case 'link': return '🔗';
  }
};

export const StudentStudyMaterialsScreen: React.FC = () => {
  const renderMaterialItem = ({ item }: { item: MaterialItem }) => (
    <Card style={styles.materialCard}>
      <Card.Content style={styles.materialContent}>
        <Text style={styles.materialIcon}>{getMaterialIcon(item.type)}</Text>
        <View style={styles.materialInfo}>
          <Text style={styles.materialTitle}>{item.title}</Text>
          <View style={styles.materialMeta}>
            <Chip mode="flat" compact style={styles.materialSubjectChip}>
              <Text style={styles.materialSubjectText}>{item.subject}</Text>
            </Chip>
            <Text style={styles.materialDate}>{item.date}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tài liệu học tập</Text>
      </View>
      <FlatList
        data={MOCK_MATERIALS}
        renderItem={renderMaterialItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// ==================== STYLES ====================

const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  dayCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dayName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  dayDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  periodsContainer: {
    gap: 12,
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  periodTime: {
    width: 100,
  },
  periodTimeText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  periodInfo: {
    flex: 1,
    gap: 4,
  },
  periodSubject: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  periodTeacher: {
    fontSize: 12,
    color: '#6B7280',
  },
  roomChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    height: 24,
  },
  roomChipText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  },
  gradeCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  gradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gradeSubject: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  averageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  averageText: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    marginBottom: 12,
  },
  gradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gradeType: {
    fontSize: 13,
    color: '#6B7280',
  },
  gradeScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  attendanceCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  attendanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendanceDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  attendanceReason: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  attendanceChip: {
    height: 28,
  },
  attendanceChipText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  feedbackCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  feedbackTeacher: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  feedbackTeacherInfo: {
    marginLeft: 12,
    flex: 1,
  },
  feedbackTeacherName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  feedbackSubject: {
    fontSize: 12,
    color: '#6B7280',
  },
  feedbackDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  feedbackContent: {
    padding: 12,
    borderRadius: 12,
  },
  feedbackContentText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  leaveCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leaveDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  leaveReason: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  leaveChip: {
    height: 28,
  },
  leaveChipText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  newRequestButton: {
    marginTop: 16,
    borderRadius: 12,
  },
  newsCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  newsCategoryChip: {
    height: 24,
  },
  newsCategoryText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#0284C7',
  },
  newsDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  newsContent: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  summaryCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: (width - 32 - 24) / 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryIconText: {
    fontSize: 24,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  detailedSummaryCard: {
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  paymentCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  paymentDueDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  paymentChip: {
    height: 26,
  },
  paymentChipText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 8,
  },
  materialCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  materialContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  materialIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  materialMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  materialSubjectChip: {
    backgroundColor: '#E0F2FE',
    height: 22,
  },
  materialSubjectText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  },
  materialDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});

const styles = baseStyles;
