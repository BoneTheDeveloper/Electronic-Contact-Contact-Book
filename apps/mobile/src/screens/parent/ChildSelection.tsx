/**
 * Child Selection Screen
 * Allows parents to switch between their children
 * Based on wireframe: childselection.html
 */

import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Pressable } from "react-native";
import { useParentStore } from "../../stores";
import { ScreenHeader, Icon } from "../../components/ui";
import type { ParentHomeStackNavigationProp } from "../../navigation/types";

interface ChildSelectionScreenProps {
  navigation?: ParentHomeStackNavigationProp;
}

export const ChildSelectionScreen: React.FC<ChildSelectionScreenProps> = ({ navigation }) => {
  const { children, selectedChildId, setSelectedChildId, isLoading, error } = useParentStore();
  const [tempSelectedId, setTempSelectedId] = useState(selectedChildId);

  // Loading state
  if (isLoading && children.length === 0) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader
          title="Chọn con em"
          onBack={() => navigation?.goBack()}
        />
        <View className="flex-1 justify-center items-center p-8 bg-gray-50">
          <ActivityIndicator size="large" color="#0284C7" />
          <Text className="mt-4 text-sm text-gray-500 text-center">Đang tải danh sách...</Text>
        </View>
      </View>
    );
  }

  // Empty state
  if (!isLoading && children.length === 0) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader
          title="Chọn con em"
          onBack={() => navigation?.goBack()}
        />
        <View className="flex-1 justify-center items-center p-8 bg-gray-50">
          <Icon name="user" size={64} color="#9CA3AF" />
          <Text className="mt-4 text-base font-bold text-gray-800">Không tìm thấy học sinh</Text>
          {error && <Text className="text-sm text-red-500 text-center mt-2 mb-4">{error}</Text>}
          <Text className="text-sm text-gray-500 text-center">
            Vui lòng liên hệ văn phòng trường để được hỗ trợ.
          </Text>
        </View>
      </View>
    );
  }

  const getInitials = (name: string) => {
    const parts = name.split(" ").filter(p => p.length > 0);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase() ?? "U";
    const first = parts[0]?.charAt(0) ?? "";
    const last = parts[parts.length - 1]?.charAt(0) ?? "";
    return `${first}${last}`.toUpperCase();
  };

  const handleSelectChild = (childId: string) => {
    setTempSelectedId(childId);
  };

  const handleConfirm = () => {
    if (tempSelectedId) {
      setSelectedChildId(tempSelectedId);
      navigation?.goBack();
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader
        title="Chọn con em"
        onBack={() => navigation?.goBack()}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Text className="text-sm font-medium text-gray-500 text-center mt-8 mb-8 px-4">
          Vui lòng chọn tài khoản học sinh bạn muốn theo dõi thông tin.
        </Text>

        <View className="px-6 pb-6 gap-4">
          {children.map((child) => {
            const isSelected = tempSelectedId === child.id;
            return (
              <Pressable
                key={child.id}
                onPress={() => handleSelectChild(child.id)}
              >
                <View className={`
                  flex-row items-center p-5 rounded-[24px]
                  ${isSelected ? "bg-sky-50 border-2 border-sky-600" : "bg-gray-50 border-2 border-transparent"}
                `}>
                  <View className={`
                    w-16 h-16 rounded-2xl justify-center items-center
                    ${isSelected ? "bg-sky-600 shadow-lg shadow-sky-200" : "bg-gray-200"}
                  `}>
                    <Text className={`
                      text-xl font-extrabold
                      ${isSelected ? "text-white" : "text-gray-500"}
                    `}>
                      {getInitials(child.name)}
                    </Text>
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-base font-bold text-gray-800">{child.name}</Text>
                    <Text className={`
                      text-xs font-extrabold uppercase tracking-widest mt-0.5
                      ${isSelected ? "text-sky-600" : "text-gray-400"}
                    `}>
                      {child.grade}
                      {child.section && ` ${child.section}`}
                    </Text>
                    <Text className="text-[10px] font-bold tracking-tight text-gray-400 mt-1">
                      Mã HS: {child.studentCode}
                    </Text>
                  </View>
                  {isSelected && (
                    <View className="w-6 h-6 items-center justify-center">
                      <Icon name="check" size={24} color="#0284C7" />
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View className="p-8 bg-white border-t border-gray-100">
        <Pressable onPress={handleConfirm}>
          <View className="bg-sky-600 rounded-2xl py-5 items-center shadow-xl shadow-sky-100">
            <Text className="text-lg font-extrabold text-white uppercase tracking-widest">
              Xác nhận
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

