/**
 * Teacher Feedback Screen
 * Comments and feedback from teachers with proper StyleSheet styling
 */

import React, { useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, type ViewStyle } from "react-native";
import Svg, { Path, Circle, Line, Polygon } from "react-native-svg";
import { Icon } from "../../components/ui";
import type { StudentHomeStackNavigationProp } from "../../navigation/types";

interface TeacherFeedbackScreenProps {
  navigation?: StudentHomeStackNavigationProp;
}

interface Feedback {
  id: string;
  teacherName: string;
  teacherAvatar: string;
  subject: string;
  message: string;
  date: string;
  sentiment: "positive" | "neutral" | "concern";
  rating: number;
}

const MOCK_FEEDBACK: Feedback[] = [
  {
    id: "1",
    teacherName: "Nguyễn Thị Lan",
    teacherAvatar: "GV",
    subject: "Giáo viên Toán học",
    message: "Em có tiến bộ rất tốt trong giải các bài toán khó. Cần luyện thêm về dạng bài hình học không gian.",
    date: "05/01/2026",
    sentiment: "positive",
    rating: 5,
  },
  {
    id: "2",
    teacherName: "Lê Thu Hương",
    teacherAvatar: "LH",
    subject: "Giáo viên Tiếng Anh",
    message: "Nói tiếng Anh rất tự nhiên. Phát âm tốt nhưng cần mở rộng từ vựng hơn nữa.",
    date: "03/01/2026",
    sentiment: "positive",
    rating: 4,
  },
  {
    id: "3",
    teacherName: "Phạm Quốc Khánh",
    teacherAvatar: "PQK",
    subject: "Giáo viên Vật lý",
    message: "Cần chú ý hơn khi làm bài tập về nhà. Vắng 2 buổi học thực hành cần bù lại.",
    date: "28/12/2025",
    sentiment: "concern",
    rating: 2,
  },
];

type FilterType = "all" | "positive" | "concern";

const SENTIMENT_CONFIG = {
  positive: {
    label: "Tích cực",
    color: "#9333EA",
    bgColor: "#F3E8FF",
    badgeColor: "#F3E8FF",
    badgeText: "#9333EA",
  },
  concern: {
    label: "Cần lưu ý",
    color: "#D97706",
    bgColor: "#FEF3C7",
    badgeColor: "#FEF3C7",
    badgeText: "#D97706",
  },
};

const StarIcon = ({ filled }: { filled: boolean }) => {
  const fill = filled ? '#F59E0B' : '#D1D5DB';
  return (
    <Svg width={14} height={14} viewBox='0 0 24 24'>
      <Polygon
        points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'
        fill={fill}
      />
    </Svg>
  );
};

export const StudentTeacherFeedbackScreen: React.FC<TeacherFeedbackScreenProps> = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredFeedback = MOCK_FEEDBACK.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "positive") return item.sentiment === "positive";
    if (activeFilter === "concern") return item.sentiment === "concern";
    return true;
  });

  const positiveCount = MOCK_FEEDBACK.filter((f) => f.sentiment === "positive").length;
  const concernCount = MOCK_FEEDBACK.filter((f) => f.sentiment === "concern").length;

  const FilterTab = ({ label, filter }: { label: string; filter: FilterType }) => {
    const isActive = activeFilter === filter;
    return (
      <TouchableOpacity
        onPress={() => setActiveFilter(filter)}
        style={[styles.filterTab, isActive ? styles.filterTabActive : styles.filterTabInactive]}
      >
        <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const FeedbackCard = ({ item }: { item: Feedback }) => {
    const config = SENTIMENT_CONFIG[item.sentiment];
    const isConcern = item.sentiment === "concern";
    return (
      <View style={[styles.feedbackCard, isConcern && styles.feedbackCardConcern]}>
        <View style={styles.feedbackHeader}>
          <View style={styles.feedbackBadges}>
            <View style={[styles.sentimentBadge, { backgroundColor: config.badgeColor }]}>
              <Text style={[styles.sentimentBadgeText, { color: config.badgeText }]}>
                {config.label}
              </Text>
            </View>
            <Text style={styles.feedbackDate}>{item.date}</Text>
          </View>
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} filled={star <= item.rating} />
            ))}
          </View>
        </View>
        <View style={styles.feedbackContent}>
          <View style={[styles.avatar, { backgroundColor: item.teacherAvatar === "GV" ? "#DBEAFE" : item.teacherAvatar === "LH" ? "#D1FAE5" : "#E0E7FF" }]}>
            <Text style={[styles.avatarText, { color: item.teacherAvatar === "GV" ? "#0284C7" : item.teacherAvatar === "LH" ? "#059669" : "#4F46E5" }]}>
              {item.teacherAvatar}
            </Text>
          </View>
          <View style={styles.feedbackInfo}>
            <Text style={styles.teacherName}>{item.teacherName}</Text>
            <Text style={styles.teacherSubject}>{item.subject}</Text>
            <Text style={styles.feedbackMessage}>{item.message}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Background */}
      <View style={styles.headerBg} />

      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <Icon name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Nhận xét giáo viên</Text>
          <Text style={styles.headerSubtitle}>Nhận xét và đánh giá của giáo viên</Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <FilterTab label="Tất cả" filter="all" />
          <FilterTab label="Tích cực" filter="positive" />
          <FilterTab label="Cần cải thiện" filter="concern" />
        </View>

        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statPositive]}>
            <View style={styles.statHeader}>
              <Svg width={16} height={16} viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth={3}>
                <Path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3' />
              </Svg>
              <Text style={styles.statLabel}>Tích cực</Text>
            </View>
            <Text style={styles.statValue}>{positiveCount}</Text>
          </View>

          <View style={[styles.statCard, styles.statConcern]}>
            <View style={styles.statHeader}>
              <Svg width={16} height={16} viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth={3}>
                <Circle cx='12' cy='12' r='10' />
                <Line x1='12' y1='8' x2='12' y2='12' />
                <Line x1='12' y1='16' x2='12.01' y2='16' />
              </Svg>
              <Text style={styles.statLabel}>Cần lưu ý</Text>
            </View>
            <Text style={styles.statValue}>{concernCount}</Text>
          </View>
        </View>

        {/* Feedback List Header */}
        <Text style={styles.listTitle}>Nhận xét gần đây</Text>

        {/* Feedback List */}
        {filteredFeedback.map((item) => (
          <FeedbackCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: '#0284C7',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(224, 242, 254, 0.9)',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 128,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  filterTabActive: {
    backgroundColor: '#0284C7',
  } as ViewStyle,
  filterTabInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    color: '#9CA3AF',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statPositive: {
    backgroundColor: '#A855F7',
  },
  statConcern: {
    backgroundColor: '#F59E0B',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  listTitle: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  feedbackCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 12,
  },
  feedbackCardConcern: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB',
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  feedbackBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sentimentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  sentimentBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  feedbackDate: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '500',
  },
  starContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  feedbackContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
  },
  feedbackInfo: {
    flex: 1,
  },
  teacherName: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  teacherSubject: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '500',
    marginBottom: 8,
  },
  feedbackMessage: {
    color: '#6B7280',
    fontSize: 12,
    lineHeight: 18,
  },
});
