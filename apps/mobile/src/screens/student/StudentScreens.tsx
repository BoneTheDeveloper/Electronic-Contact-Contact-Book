/**
 * Student Screens
 * Contains all student-specific screens similar to parent screens
 * Each screen is a simple component that can be expanded later
 */

import React from 'react';
import { View, ScrollView, FlatList, Dimensions, Pressable, Text } from 'react-native';
import { useStudentStore } from '../../stores';
import { colors } from '../../theme';

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
    <View key={index} className="flex-row items-start gap-3">
      <View className="w-24">
        <Text className="text-xs text-gray-500 font-medium">{period.time}</Text>
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-base font-semibold text-gray-900">{period.subject}</Text>
        <Text className="text-xs text-gray-500">{period.teacher}</Text>
        <View className="self-start bg-sky-100 px-2 py-0.5 rounded-full h-6 items-center justify-center">
          <Text className="text-[10px] text-sky-600 font-semibold">{period.room}</Text>
        </View>
      </View>
    </View>
  );

  const renderDay = ({ item }: { item: ScheduleDay }) => (
    <View className="mb-4 rounded-2xl bg-white shadow-sm px-4 py-4">
      <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-gray-200">
        <Text className="text-lg font-bold text-gray-900">{item.dayName}</Text>
        <Text className="text-xs text-gray-500">{item.date}</Text>
      </View>
      <View className="gap-3">
        {item.periods.map((period, index) => renderPeriod(period, index))}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-sky-600 pt-16 px-6 pb-6 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white">Thời khóa biểu</Text>
        {studentData && (
          <Text className="text-sm text-white/80 mt-1">
            Lớp {studentData.grade}{studentData.section}
          </Text>
        )}
      </View>
      <FlatList
        data={MOCK_SCHEDULE}
        renderItem={renderDay}
        keyExtractor={(item) => item.date}
        contentContainerClassName="p-4 pb-24"
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
    const bgColor = item.average >= 8 ? 'bg-green-100' : item.average >= 6.5 ? 'bg-amber-100' : 'bg-red-100';
    const textColor = item.average >= 8 ? 'text-green-800' : item.average >= 6.5 ? 'text-amber-800' : 'text-red-800';

    return (
      <View className="mb-4 rounded-2xl bg-white shadow-sm px-4 py-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-base font-bold text-gray-900">{item.subject}</Text>
          <View className={`px-3 py-1 rounded-full ${bgColor}`}>
            <Text className={`text-base font-bold ${textColor}`}>{item.average.toFixed(1)}</Text>
          </View>
        </View>
        <View className="h-px bg-gray-200 mb-3" />
        {item.grades.map((grade, index) => (
          <View key={index} className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-gray-500">{grade.type}</Text>
            <Text className="text-sm font-semibold text-gray-900">{grade.score}/{grade.maxScore}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-sky-600 pt-16 px-6 pb-6 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white">Bảng điểm môn học</Text>
      </View>
      <FlatList
        data={MOCK_GRADES}
        renderItem={renderGradeItem}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4 pb-24"
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
    case 'present': return { label: 'Có mặt', bgClass: 'bg-green-100', textClass: 'text-green-800' };
    case 'absent': return { label: 'Vắng mặt', bgClass: 'bg-red-100', textClass: 'text-red-800' };
    case 'late': return { label: 'Đi muộn', bgClass: 'bg-amber-100', textClass: 'text-amber-800' };
    case 'excused': return { label: 'Có phép', bgClass: 'bg-sky-100', textClass: 'text-sky-800' };
    default: return { label: status, bgClass: 'bg-gray-100', textClass: 'text-gray-700' };
  }
};

export const StudentAttendanceScreen: React.FC = () => {
  const renderAttendanceItem = ({ item }: { item: AttendanceRecord }) => {
    const config = getStatusConfig(item.status);

    return (
      <View className="mb-3 rounded-xl bg-white shadow-sm px-4 py-3">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-sm font-semibold text-gray-900">{item.date}</Text>
            {item.reason && <Text className="text-xs text-gray-500 mt-0.5">{item.reason}</Text>}
          </View>
          <View className={`h-7 px-2 rounded-full items-center justify-center ${config.bgClass}`}>
            <Text className={`text-[11px] font-bold uppercase ${config.textClass}`}>{config.label}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-sky-600 pt-16 px-6 pb-6 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white">Lịch sử điểm danh</Text>
      </View>
      <FlatList
        data={MOCK_ATTENDANCE}
        renderItem={renderAttendanceItem}
        keyExtractor={(item) => item.date}
        contentContainerClassName="p-4 pb-24"
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
      case 'positive': return 'bg-green-100';
      case 'neutral': return 'bg-amber-100';
      case 'concern': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  const renderFeedbackItem = ({ item }: { item: FeedbackItem }) => {
    const initial = item.teacher.split(' ').slice(-1)[0][0];

    return (
      <View className="mb-4 rounded-2xl bg-white shadow-sm px-4 py-4">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 rounded-full bg-sky-100 items-center justify-center">
              <Text className="text-sky-600 font-semibold">{initial}</Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-sm font-bold text-gray-900">{item.teacher}</Text>
              <Text className="text-xs text-gray-500">{item.subject}</Text>
            </View>
          </View>
          <Text className="text-[11px] text-gray-400">{item.date}</Text>
        </View>
        <View className={`p-3 rounded-xl ${getFeedbackColor(item.type)}`}>
          <Text className="text-sm text-gray-700 leading-snug">{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-sky-600 pt-16 px-6 pb-6 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white">Nhận xét giáo viên</Text>
      </View>
      <FlatList
        data={MOCK_FEEDBACK}
        renderItem={renderFeedbackItem}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4 pb-24"
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
      case 'approved': return { label: 'Đã duyệt', bgClass: 'bg-green-100', textClass: 'text-green-800' };
      case 'rejected': return { label: 'Từ chối', bgClass: 'bg-red-100', textClass: 'text-red-800' };
      case 'pending': return { label: 'Chờ duyệt', bgClass: 'bg-amber-100', textClass: 'text-amber-800' };
    }
  };

  const renderLeaveRequest = ({ item }: { item: LeaveRequest }) => {
    const config = getStatusConfig(item.status);

    return (
      <View className="mb-3 rounded-xl bg-white shadow-sm px-4 py-3">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-sm font-semibold text-gray-900">{item.date}</Text>
            <Text className="text-xs text-gray-500 mt-0.5">{item.reason}</Text>
          </View>
          <View className={`h-7 px-2 rounded-full items-center justify-center ${config.bgClass}`}>
            <Text className={`text-[11px] font-bold uppercase ${config.textClass}`}>{config.label}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-sky-600 pt-16 px-6 pb-6 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white">Đơn xin nghỉ phép</Text>
      </View>
      <FlatList
        data={MOCK_LEAVE_REQUESTS}
        renderItem={renderLeaveRequest}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4 pb-24"
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <Pressable className="mt-4 bg-sky-600 rounded-xl py-3 items-center">
            <Text className="text-white font-semibold text-base">+ Tạo đơn mới</Text>
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
    case 'school': return { label: 'Nhà trường', bgClass: 'bg-blue-100' };
    case 'class': return { label: 'Lớp học', bgClass: 'bg-sky-100' };
    case 'activity': return { label: 'Hoạt động', bgClass: 'bg-purple-100' };
  }
};

export const StudentNewsScreen: React.FC = () => {
  const renderNewsItem = ({ item }: { item: NewsItem }) => {
    const config = getCategoryConfig(item.category);

    return (
      <View className="mb-4 rounded-2xl bg-white shadow-sm px-4 py-4">
        <View className="flex-row justify-between items-center mb-3">
          <View className={`h-6 px-2 rounded-full items-center justify-center ${config.bgClass}`}>
            <Text className="text-[10px] font-bold uppercase text-sky-600">{config.label}</Text>
          </View>
          <Text className="text-[11px] text-gray-400">{item.date}</Text>
        </View>
        <Text className="text-base font-bold text-gray-900 mb-2">{item.title}</Text>
        <Text className="text-sm text-gray-500 leading-snug" numberOfLines={2}>{item.content}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-sky-600 pt-16 px-6 pb-6 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white">Tin tức & sự kiện</Text>
      </View>
      <FlatList
        data={MOCK_NEWS}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4 pb-24"
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
      case '#0284C7': return 'bg-sky-600/20';
      case '#059669': return 'bg-emerald-600/20';
      case '#F59E0B': return 'bg-amber-500/20';
      case '#8B5CF6': return 'bg-violet-500/20';
      default: return 'bg-gray-200';
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-sky-600 pt-16 px-6 pb-6 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white">Kết quả tổng hợp</Text>
      </View>
      <ScrollView contentContainerClassName="p-4 pb-24" showsVerticalScrollIndicator={false}>
        <View className="mb-4 rounded-2xl bg-white shadow-sm px-4 py-4">
          <View className="flex-row flex-wrap justify-between">
            {summaryData.map((item, index) => (
              <View key={index} className="w-[47%] items-center mb-4">
                <View className={`w-14 h-14 rounded-full justify-center items-center mb-2 ${getColorClass(item.color)}`}>
                  <Text className="text-2xl">{item.icon}</Text>
                </View>
                <Text className="text-xl font-extrabold text-gray-900 mb-1">{item.value}</Text>
                <Text className="text-xs text-gray-500 text-center">{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="rounded-2xl bg-white shadow-sm px-4 py-4">
          <Text className="text-base font-bold text-gray-900 mb-4">Chi tiết học tập</Text>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm text-gray-500">Tổng số bài kiểm tra:</Text>
            <Text className="text-sm font-semibold text-gray-900">24</Text>
          </View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm text-gray-500">Số bài đạt:</Text>
            <Text className="text-sm font-semibold text-emerald-600">22</Text>
          </View>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm text-gray-500">Số bài cần cải thiện:</Text>
            <Text className="text-sm font-semibold text-amber-500">2</Text>
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
    case 'paid': return { label: 'Đã thanh toán', bgClass: 'bg-green-100', textClass: 'text-green-800' };
    case 'pending': return { label: 'Chờ thanh toán', bgClass: 'bg-amber-100', textClass: 'text-amber-800' };
    case 'overdue': return { label: 'Quá hạn', bgClass: 'bg-red-100', textClass: 'text-red-800' };
  }
};

export const StudentPaymentScreen: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const renderPaymentItem = ({ item }: { item: PaymentItem }) => {
    const config = getPaymentStatusConfig(item.status);

    return (
      <View className="mb-4 rounded-2xl bg-white shadow-sm px-4 py-4">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900 mb-1">{item.title}</Text>
            <Text className="text-xs text-gray-500">Hạn: {item.dueDate}</Text>
          </View>
          <View className={`h-7 px-2 rounded-full items-center justify-center ${config.bgClass}`}>
            <Text className={`text-[10px] font-bold uppercase ${config.textClass}`}>{config.label}</Text>
          </View>
        </View>
        <Text className="text-lg font-extrabold text-sky-600 mt-2">{formatCurrency(item.amount)}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-sky-600 pt-16 px-6 pb-6 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white">Học phí</Text>
      </View>
      <FlatList
        data={MOCK_PAYMENTS}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4 pb-24"
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
    <View className="mb-3 rounded-xl bg-white shadow-sm px-4 py-3">
      <View className="flex-row items-center">
        <Text className="text-3xl mr-3">{getMaterialIcon(item.type)}</Text>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-gray-900 mb-1.5">{item.title}</Text>
          <View className="flex-row items-center justify-between">
            <View className="bg-sky-100 h-6 px-2 rounded-full items-center justify-center">
              <Text className="text-[10px] text-sky-600 font-semibold">{item.subject}</Text>
            </View>
            <Text className="text-[11px] text-gray-400">{item.date}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-sky-600 pt-16 px-6 pb-6 rounded-b-3xl">
        <Text className="text-2xl font-bold text-white">Tài liệu học tập</Text>
      </View>
      <FlatList
        data={MOCK_MATERIALS}
        renderItem={renderMaterialItem}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4 pb-24"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
