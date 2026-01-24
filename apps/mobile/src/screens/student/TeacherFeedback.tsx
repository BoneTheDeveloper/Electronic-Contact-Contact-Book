/**
 * Teacher Feedback Screen
 * Comments and feedback from teachers
 */

import React, { useState } from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import Svg, { Path, Circle, Line, Polygon } from "react-native-svg";
import { useStudentStore } from "../../stores";
import { colors } from "../../theme";

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
  neutral: {
    label: "Cần cải thiện",
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

export const StudentTeacherFeedbackScreen: React.FC = () => {
  const { studentData } = useStudentStore();
  const selectedChild = children.find((c) => c.id === selectedChildId) || children[0];
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
        className={"flex-shrink-0 px-4 py-2 rounded-xl " + (isActive ? "bg-[#0284C7]" : "bg-white border border-gray-200")}
      >
        <Text
          className={"text-xs font-black uppercase " + (isActive ? "text-white" : "text-gray-400")}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const FeedbackCard = ({ item }: { item: Feedback }) => {
    const config = SENTIMENT_CONFIG[item.sentiment];
    const isConcern = item.sentiment === "concern";
    return (
      <View
        className={"bg-white p-4 rounded-2xl " + (isConcern ? "border border-amber-200" : "border border-gray-100") + " shadow-sm mb-3"}
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-row items-center space-x-2">
            <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: config.badgeColor }}>
              <Text className="text-[8px] font-black uppercase" style={{ color: config.badgeText }}>
                {config.label}
              </Text>
            </View>
            <Text className="text-gray-400 text-[9px] font-medium">{item.date}</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} filled={star <= item.rating} />
            ))}
          </View>
        </View>
        <View className="flex-row items-start space-x-3">
          <View
            className="w-10 h-10 rounded-xl justify-center items-center"
            style={{
              backgroundColor:
                item.teacherAvatar === "GV"
                  ? "#DBEAFE"
                  : item.teacherAvatar === "LH"
                  ? "#D1FAE5"
                  : "#E0E7FF",
            }}
          >
            <Text
              className="font-black text-sm"
              style={{
                color:
                  item.teacherAvatar === "GV"
                    ? "#0284C7"
                    : item.teacherAvatar === "LH"
                    ? "#059669"
                    : "#4F46E5",
              }}
            >
              {item.teacherAvatar}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-gray-800 font-bold text-sm mb-0.5">
              {item.teacherName}
            </Text>
            <Text className="text-gray-400 text-[9px] font-medium mb-2">
              {item.subject}
            </Text>
            <Text className="text-gray-600 text-xs leading-snug">
              {item.message}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const ThumbsUpIcon = () => (
    <Svg width={16} height={16} viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth={3}>
      <Path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3' />
    </Svg>
  );

  const AlertIcon = () => (
    <Svg width={16} height={16} viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth={3}>
      <Circle cx='12' cy='12' r='10' />
      <Line x1='12' y1='8' x2='12' y2='12' />
      <Line x1='12' y1='16' x2='12.01' y2='16' />
    </Svg>
  );

  const BackIcon = () => (
    <Svg width={20} height={20} viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth={2.5}>
      <Path d='M19 12H5' />
      <Path d='M12 19l-7-7 7-7' />
    </Svg>
  );

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View
        className="absolute top-0 left-0 right-0 h-35 z-0"
        style={{
          backgroundColor: "#0284C7",
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      />
      <View className="relative z-10 px-6 pt-16 pb-4">
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity
            className="w-10 h-10 bg-white/20 rounded-full justify-center items-center"
            onPress={() => {}}
          >
            <BackIcon />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xl font-extrabold">Nhận xét giáo viên</Text>
            <Text className="text-blue-100 text-xs font-medium mt-0.5">
              Nhận xét và đánh giá của giáo viên
            </Text>
          </View>
        </View>
      </View>
      <ScrollView
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: 128 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row space-x-2 mb-5 overflow-x-auto">
          <FilterTab label="Tất cả" filter="all" />
          <FilterTab label="Tích cực" filter="positive" />
          <FilterTab label="Cần cải thiện" filter="concern" />
        </View>
        <View className="flex-row space-x-3 mb-6">
          <View
            className="flex-1 p-4 rounded-2xl"
            style={{
              backgroundColor: "#A855F7",
              shadowColor: "#6B21A8",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="flex-row items-center space-x-2 mb-1">
              <ThumbsUpIcon />
              <Text className="text-purple-100 text-[9px] font-black uppercase">
                Tích cực
              </Text>
            </View>
            <Text className="text-white text-3xl font-extrabold">{positiveCount}</Text>
          </View>
          <View
            className="flex-1 p-4 rounded-2xl"
            style={{
              backgroundColor: "#F59E0B",
              shadowColor: "#B45309",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="flex-row items-center space-x-2 mb-1">
              <AlertIcon />
              <Text className="text-amber-100 text-[9px] font-black uppercase">
                Cần lưu ý
              </Text>
            </View>
            <Text className="text-white text-3xl font-extrabold">{concernCount}</Text>
          </View>
        </View>
        <Text className="text-gray-800 font-extrabold text-sm mb-3">
          Nhận xét gần đây
        </Text>
        {filteredFeedback.map((item) => (
          <FeedbackCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};