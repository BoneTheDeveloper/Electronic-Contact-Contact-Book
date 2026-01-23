/**
 * Student Screens
 * Contains all student-specific screens similar to parent screens
 * Each screen is a simple component that can be expanded later
 */

import React from 'react';
import { View, ScrollView, FlatList, Dimensions, Pressable, Text, StyleSheet } from 'react-native';
import { useStudentStore } from '../../stores';
import { colors } from '../../theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Common styles
  flex1: { flex: 1 },
  bgSlate50: { backgroundColor: '#f8fafc' },
  bgSky600: { backgroundColor: '#0284c7' },
  bgWhite: { backgroundColor: '#ffffff' },
  shadowSm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },

  // Text styles
  textWhite: { color: '#ffffff' },
  textWhite80: { color: 'rgba(255, 255, 255, 0.8)' },
  textGray900: { color: '#111827' },
  textGray700: { color: '#374151' },
  textGray500: { color: '#6b7280' },
  textGray400: { color: '#9ca3af' },
  textGray600: { color: '#4b5563' },
  textEmerald600: { color: '#059669' },
  textAmber500: { color: '#f59e0b' },
  textSky600: { color: '#0284c7' },
  textBase: { fontSize: 16 },
  textSm: { fontSize: 14 },
  textXs: { fontSize: 12 },
  text10px: { fontSize: 10 },
  text11px: { fontSize: 11 },
  textLg: { fontSize: 18 },
  text2xl: { fontSize: 24 },
  text3xl: { fontSize: 28 },
  textExtrabold: { fontWeight: '800' },
  fontBold: { fontWeight: '700' },
  fontSemibold: { fontWeight: '600' },
  fontMedium: { fontWeight: '500' },

  // Flexbox and layout
  flexRow: { flexDirection: 'row' },
  flex1Row: { flex: 1, flexDirection: 'row' },
  flexWrap: { flexWrap: 'wrap' },
  itemsStart: { alignItems: 'flex-start' },
  itemsCenter: { alignItems: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyCenter: { justifyContent: 'center' },
  gap1: { gap: 4 },
  gap3: { gap: 12 },
  gap4: { gap: 16 },
  mb2: { marginBottom: 8 },
  mb3: { marginBottom: 12 },
  mb4: { marginBottom: 16 },
  mb6: { marginBottom: 24 },
  mt1: { marginTop: 4 },
  mt05: { marginTop: 2 },
  mt2: { marginTop: 8 },
  mt4: { marginTop: 16 },
  ml3: { marginLeft: 12 },
  mr3: { marginRight: 12 },
  px2: { paddingLeft: 8, paddingRight: 8 },
  px3: { paddingLeft: 12, paddingRight: 12 },
  px4: { paddingLeft: 16, paddingRight: 16 },
  py1: { paddingTop: 4, paddingBottom: 4 },
  py3: { paddingTop: 12, paddingBottom: 12 },
  py4: { paddingTop: 16, paddingBottom: 16 },
  pb6: { paddingBottom: 24 },
  pt16: { paddingTop: 64 },
  w24: { width: 96 },
  h6: { height: 24 },
  h7: { height: 28 },
  w10: { width: 40 },
  h10: { height: 40 },
  w14: { width: 56 },
  h14: { height: 56 },
  rounded2xl: { borderRadius: 12 },
  rounded3xl: { borderRadius: 16 },
  roundedFull: { borderRadius: 9999 },
  roundedXl: { borderRadius: 8 },
  selfStart: { alignSelf: 'flex-start' },
  leadingSnug: { lineHeight: 20 },
  mb1: { marginBottom: 4 },

  // Special styles
  bgSky100: { backgroundColor: '#e0f2fe' },
  bgGreen100: { backgroundColor: '#d1fae5' },
  bgRed100: { backgroundColor: '#fee2e2' },
  bgAmber100: { backgroundColor: '#fef3c7' },
  bgEmerald60020: { backgroundColor: 'rgba(5, 150, 105, 0.2)' },
  bgSky60020: { backgroundColor: 'rgba(2, 132, 199, 0.2)' },
  bgEmerald600: { backgroundColor: '#059669' },
  bgAmber50020: { backgroundColor: 'rgba(245, 158, 11, 0.2)' },
  bgViolet50020: { backgroundColor: 'rgba(139, 92, 246, 0.2)' },
  bgAmber500: { backgroundColor: '#f59e0b' },
  bgViolet500: { backgroundColor: '#8b5cf6' },

  // Other specific styles
  contentContainerP4: { padding: 16 },
  contentContainerP4Pb24: { padding: 16, paddingBottom: 96 },
  w47Percent: { width: '47%' },
  itemsCenterFlex1: { alignItems: 'center', flex: 1 },
  textCenter: { textAlign: 'center' },
});

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
    <View key={index} style={styles.flexRow}>
      <View style={styles.w24}>
        <Text style={[styles.textXs, styles.textGray500, styles.fontMedium]}>{period.time}</Text>
      </View>
      <View style={[{ flex: 1 }, styles.gap1]}>
        <Text style={[styles.textBase, styles.fontSemibold, styles.textGray900]}>{period.subject}</Text>
        <Text style={[styles.textXs, styles.textGray500]}>{period.teacher}</Text>
        <View style={[styles.selfStart, styles.bgSky100, styles.px2, { height: 24, alignItems: 'center', justifyContent: 'center' }, styles.roundedFull]}>
          <Text style={[styles.text10px, styles.textSky600, styles.fontSemibold]}>{period.room}</Text>
        </View>
      </View>
    </View>
  );

  const renderDay = ({ item }: { item: ScheduleDay }) => (
    <View style={[styles.mb4, styles.rounded2xl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py4]}>
      <View style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter, styles.mb4, { paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }]}>
        <Text style={[styles.textLg, styles.fontBold, styles.textGray900]}>{item.dayName}</Text>
        <Text style={[styles.textXs, styles.textGray500]}>{item.date}</Text>
      </View>
      <View style={styles.gap3}>
        {item.periods.map((period, index) => renderPeriod(period, index))}
      </View>
    </View>
  );

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <View style={[styles.bgSky600, styles.pt16, { paddingLeft: 24, paddingRight: 24, paddingBottom: 24 }, styles.rounded3xl]}>
        <Text style={[styles.text2xl, styles.fontBold, styles.textWhite]}>Thời khóa biểu</Text>
        {studentData && (
          <Text style={[styles.textSm, styles.textWhite80, styles.mt1]}>
            Lớp {studentData.grade}{studentData.section}
          </Text>
        )}
      </View>
      <FlatList
        data={MOCK_SCHEDULE}
        renderItem={renderDay}
        keyExtractor={(item: ScheduleDay) => item.date}
        contentContainerStyle={[styles.contentContainerP4Pb24]}
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
  const renderGradeItem = ({ item }: { item: GradeItem }) => {
    const bgColor = item.average >= 8 ? styles.bgGreen100 : item.average >= 6.5 ? styles.bgAmber100 : styles.bgRed100;
    const textColor = item.average >= 8 ? styles.textGray600 : item.average >= 6.5 ? styles.textGray600 : styles.textGray600;

    return (
      <View style={[styles.mb4, styles.rounded2xl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py4]}>
        <View style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter, styles.mb3]}>
          <Text style={[styles.textBase, styles.fontBold, styles.textGray900]}>{item.subject}</Text>
          <View style={[styles.px3, styles.py1, styles.roundedFull, bgColor]}>
            <Text style={[styles.textBase, styles.fontBold, textColor]}>{item.average.toFixed(1)}</Text>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: '#e5e7eb', marginBottom: 12 }} />
        {item.grades.map((grade, index) => (
          <View key={index} style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter, styles.mb2]}>
            <Text style={[styles.textSm, styles.textGray500]}>{grade.type}</Text>
            <Text style={[styles.textSm, styles.fontSemibold, styles.textGray900]}>{grade.score}/{grade.maxScore}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <View style={[styles.bgSky600, styles.pt16, { paddingLeft: 24, paddingRight: 24, paddingBottom: 24 }, styles.rounded3xl]}>
        <Text style={[styles.text2xl, styles.fontBold, styles.textWhite]}>Bảng điểm môn học</Text>
      </View>
      <FlatList
        data={MOCK_GRADES}
        renderItem={renderGradeItem}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={[styles.contentContainerP4Pb24]}
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
    case 'present': return { label: 'Có mặt', bgClass: styles.bgGreen100, textClass: styles.textGray600 };
    case 'absent': return { label: 'Vắng mặt', bgClass: styles.bgRed100, textClass: styles.textGray600 };
    case 'late': return { label: 'Đi muộn', bgClass: styles.bgAmber100, textClass: styles.textGray600 };
    case 'excused': return { label: 'Có phép', bgClass: styles.bgSky100, textClass: styles.textSky600 };
    default: return { label: status, bgClass: styles.bgGreen100, textClass: styles.textGray600 };
  }
};

export const StudentAttendanceScreen: React.FC = () => {
  const renderAttendanceItem = ({ item }: { item: AttendanceRecord }) => {
    const config = getStatusConfig(item.status);

    return (
      <View style={[styles.mb3, styles.roundedXl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py3]}>
        <View style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter]}>
          <View>
            <Text style={[styles.textSm, styles.fontSemibold, styles.textGray900]}>{item.date}</Text>
            {item.reason && <Text style={[styles.textXs, styles.textGray500, styles.mt05]}>{item.reason}</Text>}
          </View>
          <View style={[styles.h7, styles.px2, styles.roundedFull, styles.itemsCenter, styles.justifyCenter, config.bgClass]}>
            <Text style={[styles.text11px, styles.fontBold, { textTransform: 'uppercase' }, config.textClass]}>{config.label}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <View style={[styles.bgSky600, styles.pt16, { paddingLeft: 24, paddingRight: 24, paddingBottom: 24 }, styles.rounded3xl]}>
        <Text style={[styles.text2xl, styles.fontBold, styles.textWhite]}>Lịch sử điểm danh</Text>
      </View>
      <FlatList
        data={MOCK_ATTENDANCE}
        renderItem={renderAttendanceItem}
        keyExtractor={(item: any) => item.date}
        contentContainerStyle={[styles.contentContainerP4Pb24]}
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
      case 'positive': return styles.bgGreen100;
      case 'neutral': return styles.bgAmber100;
      case 'concern': return styles.bgRed100;
      default: return styles.bgGreen100;
    }
  };

  const renderFeedbackItem = ({ item }: { item: FeedbackItem }) => {
    const parts = item.teacher.split(' ').filter(p => p.length > 0);
    const initial = parts.length > 0 ? (parts[parts.length - 1] || '').charAt(0) : '?';

    return (
      <View style={[styles.mb4, styles.rounded2xl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py4]}>
        <View style={[styles.flexRow, styles.justifyBetween, styles.itemsStart, styles.mb3]}>
          <View style={[styles.flexRow, styles.itemsCenter, { flex: 1 }]}>
            <View style={[styles.w10, styles.h10, styles.roundedFull, styles.bgSky100, styles.itemsCenter, styles.justifyCenter]}>
              <Text style={[styles.textSky600, styles.fontSemibold]}>{initial}</Text>
            </View>
            <View style={[styles.ml3, { flex: 1 }]}>
              <Text style={[styles.textSm, styles.fontBold, styles.textGray900]}>{item.teacher}</Text>
              <Text style={[styles.textXs, styles.textGray500]}>{item.subject}</Text>
            </View>
          </View>
          <Text style={[styles.text11px, styles.textGray400]}>{item.date}</Text>
        </View>
        <View style={[styles.px3, styles.py3, styles.roundedXl, getFeedbackColor(item.type)]}>
          <Text style={[styles.textSm, styles.textGray700, styles.leadingSnug]}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <View style={[styles.bgSky600, styles.pt16, { paddingLeft: 24, paddingRight: 24, paddingBottom: 24 }, styles.rounded3xl]}>
        <Text style={[styles.text2xl, styles.fontBold, styles.textWhite]}>Nhận xét giáo viên</Text>
      </View>
      <FlatList
        data={MOCK_FEEDBACK}
        renderItem={renderFeedbackItem}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={[styles.contentContainerP4Pb24]}
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
      case 'approved': return { label: 'Đã duyệt', bgClass: styles.bgGreen100, textClass: styles.textGray600 };
      case 'rejected': return { label: 'Từ chối', bgClass: styles.bgRed100, textClass: styles.textGray600 };
      case 'pending': return { label: 'Chờ duyệt', bgClass: styles.bgAmber100, textClass: styles.textGray600 };
    }
  };

  const renderLeaveRequest = ({ item }: { item: LeaveRequest }) => {
    const config = getStatusConfig(item.status);

    return (
      <View style={[styles.mb3, styles.roundedXl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py3]}>
        <View style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter]}>
          <View>
            <Text style={[styles.textSm, styles.fontSemibold, styles.textGray900]}>{item.date}</Text>
            <Text style={[styles.textXs, styles.textGray500, styles.mt05]}>{item.reason}</Text>
          </View>
          <View style={[styles.h7, styles.px2, styles.roundedFull, styles.itemsCenter, styles.justifyCenter, config.bgClass]}>
            <Text style={[styles.text11px, styles.fontBold, { textTransform: 'uppercase' }, config.textClass]}>{config.label}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <View style={[styles.bgSky600, styles.pt16, { paddingLeft: 24, paddingRight: 24, paddingBottom: 24 }, styles.rounded3xl]}>
        <Text style={[styles.text2xl, styles.fontBold, styles.textWhite]}>Đơn xin nghỉ phép</Text>
      </View>
      <FlatList
        data={MOCK_LEAVE_REQUESTS}
        renderItem={renderLeaveRequest}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={[styles.contentContainerP4Pb24]}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <Pressable style={[styles.mt4, styles.bgSky600, styles.roundedXl, styles.py3, styles.itemsCenter]}>
            <Text style={[styles.textWhite, styles.fontSemibold, styles.textBase]}>+ Tạo đơn mới</Text>
          </Pressable>
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
    case 'school': return { label: 'Nhà trường', bgClass: styles.bgSky100 };
    case 'class': return { label: 'Lớp học', bgClass: styles.bgSky100 };
    case 'activity': return { label: 'Hoạt động', bgClass: styles.bgSky100 };
  }
};

export const StudentNewsScreen: React.FC = () => {
  const renderNewsItem = ({ item }: { item: NewsItem }) => {
    const config = getCategoryConfig(item.category);

    return (
      <View style={[styles.mb4, styles.rounded2xl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py4]}>
        <View style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter, styles.mb3]}>
          <View style={[styles.h6, styles.px2, styles.roundedFull, styles.itemsCenter, styles.justifyCenter, config.bgClass]}>
            <Text style={[styles.text10px, styles.fontBold, { textTransform: 'uppercase' }, styles.textSky600]}>{config.label}</Text>
          </View>
          <Text style={[styles.text11px, styles.textGray400]}>{item.date}</Text>
        </View>
        <Text style={[styles.textBase, styles.fontBold, styles.textGray900, styles.mb2]}>{item.title}</Text>
        <Text style={[styles.textSm, styles.textGray500, styles.leadingSnug]} numberOfLines={2}>{item.content}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <View style={[styles.bgSky600, styles.pt16, { paddingLeft: 24, paddingRight: 24, paddingBottom: 24 }, styles.rounded3xl]}>
        <Text style={[styles.text2xl, styles.fontBold, styles.textWhite]}>Tin tức & sự kiện</Text>
      </View>
      <FlatList
        data={MOCK_NEWS}
        renderItem={renderNewsItem}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={[styles.contentContainerP4Pb24]}
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

  const getColorClass = (color: string) => {
    switch (color) {
      case '#0284C7': return styles.bgSky60020;
      case '#059669': return styles.bgEmerald60020;
      case '#F59E0B': return styles.bgAmber50020;
      case '#8B5CF6': return styles.bgViolet50020;
      default: return { backgroundColor: '#e5e7eb' };
    }
  };

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <View style={[styles.bgSky600, styles.pt16, { paddingLeft: 24, paddingRight: 24, paddingBottom: 24 }, styles.rounded3xl]}>
        <Text style={[styles.text2xl, styles.fontBold, styles.textWhite]}>Kết quả tổng hợp</Text>
      </View>
      <ScrollView contentContainerStyle={[styles.contentContainerP4Pb24]} showsVerticalScrollIndicator={false}>
        <View style={[styles.mb4, styles.rounded2xl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py4]}>
          <View style={[styles.flexWrap, styles.justifyBetween]}>
            {summaryData.map((item, index) => (
              <View key={index} style={[styles.w47Percent, styles.itemsCenterFlex1, styles.mb4]}>
                <View style={[styles.w14, styles.h14, styles.roundedFull, styles.justifyCenter, styles.itemsCenter, styles.mb2, getColorClass(item.color)]}>
                  <Text style={styles.text2xl}>{item.icon}</Text>
                </View>
                <Text style={[styles.textExtrabold, styles.textGray900, styles.mb1]}>{item.value}</Text>
                <Text style={[styles.textXs, styles.textGray500, styles.textCenter]}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.rounded2xl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py4]}>
          <Text style={[styles.textBase, styles.fontBold, styles.textGray900, styles.mb4]}>Chi tiết học tập</Text>
          <View style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter, styles.mb3]}>
            <Text style={[styles.textSm, styles.textGray500]}>Tổng số bài kiểm tra:</Text>
            <Text style={[styles.textSm, styles.fontSemibold, styles.textGray900]}>24</Text>
          </View>
          <View style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter, styles.mb3]}>
            <Text style={[styles.textSm, styles.textGray500]}>Số bài đạt:</Text>
            <Text style={[styles.textSm, styles.fontSemibold, styles.textEmerald600]}>22</Text>
          </View>
          <View style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter, styles.mb3]}>
            <Text style={[styles.textSm, styles.textGray500]}>Số bài cần cải thiện:</Text>
            <Text style={[styles.textSm, styles.fontSemibold, styles.textAmber500]}>2</Text>
          </View>
        </View>
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
    case 'paid': return { label: 'Đã thanh toán', bgClass: styles.bgGreen100, textClass: styles.textGray600 };
    case 'pending': return { label: 'Chờ thanh toán', bgClass: styles.bgAmber100, textClass: styles.textGray600 };
    case 'overdue': return { label: 'Quá hạn', bgClass: styles.bgRed100, textClass: styles.textGray600 };
  }
};

export const StudentPaymentScreen: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const renderPaymentItem = ({ item }: { item: PaymentItem }) => {
    const config = getPaymentStatusConfig(item.status);

    return (
      <View style={[styles.mb4, styles.rounded2xl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py4]}>
        <View style={[styles.flexRow, styles.justifyBetween, styles.itemsStart, styles.mb2]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textBase, styles.fontSemibold, styles.textGray900, styles.mb1]}>{item.title}</Text>
            <Text style={[styles.textXs, styles.textGray500]}>Hạn: {item.dueDate}</Text>
          </View>
          <View style={[styles.h7, styles.px2, styles.roundedFull, styles.itemsCenter, styles.justifyCenter, config.bgClass]}>
            <Text style={[styles.text10px, styles.fontBold, { textTransform: 'uppercase' }, config.textClass]}>{config.label}</Text>
          </View>
        </View>
        <Text style={[styles.textLg, styles.textExtrabold, styles.textSky600, styles.mt2]}>{formatCurrency(item.amount)}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <View style={[styles.bgSky600, styles.pt16, { paddingLeft: 24, paddingRight: 24, paddingBottom: 24 }, styles.rounded3xl]}>
        <Text style={[styles.text2xl, styles.fontBold, styles.textWhite]}>Học phí</Text>
      </View>
      <FlatList
        data={MOCK_PAYMENTS}
        renderItem={renderPaymentItem}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={[styles.contentContainerP4Pb24]}
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
    <View style={[styles.mb3, styles.roundedXl, styles.bgWhite, styles.shadowSm, styles.px4, styles.py3]}>
      <View style={[styles.flexRow, styles.itemsCenter]}>
        <Text style={[styles.text3xl, styles.mr3]}>{getMaterialIcon(item.type)}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.textSm, styles.fontSemibold, styles.textGray900, styles.mb1]}>{item.title}</Text>
          <View style={[styles.flexRow, styles.itemsCenter, styles.justifyBetween]}>
            <View style={[styles.bgSky100, styles.h6, styles.px2, styles.roundedFull, styles.itemsCenter, styles.justifyCenter]}>
              <Text style={[styles.text10px, styles.textSky600, styles.fontSemibold]}>{item.subject}</Text>
            </View>
            <Text style={[styles.text11px, styles.textGray400]}>{item.date}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.flex1, styles.bgSlate50]}>
      <View style={[styles.bgSky600, styles.pt16, { paddingLeft: 24, paddingRight: 24, paddingBottom: 24 }, styles.rounded3xl]}>
        <Text style={[styles.text2xl, styles.fontBold, styles.textWhite]}>Tài liệu học tập</Text>
      </View>
      <FlatList
        data={MOCK_MATERIALS}
        renderItem={renderMaterialItem}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={[styles.contentContainerP4Pb24]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
