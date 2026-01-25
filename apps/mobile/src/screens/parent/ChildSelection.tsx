/**
 * Child Selection Screen
 * Allows parents to switch between their children
 * Based on wireframe: childselection.html
 *
 * Full-screen modal without tab bar
 */

import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Pressable, StyleSheet } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useParentStore } from "../../stores";
import { ScreenHeader, Icon } from "../../components/ui";
import type { ParentNavigatorParamList } from "../../navigation/types";

interface ChildSelectionScreenProps {
  navigation?: NativeStackNavigationProp<ParentNavigatorParamList, "ChildSelection">;
}

export const ChildSelectionScreen: React.FC<ChildSelectionScreenProps> = ({ navigation }) => {
  const { children, selectedChildId, setSelectedChildId, isLoading, error } = useParentStore();
  const [tempSelectedId, setTempSelectedId] = useState(selectedChildId);

  // Update temp selection when selectedChildId changes (e.g., from outside)
  useEffect(() => {
    setTempSelectedId(selectedChildId);
  }, [selectedChildId]);

  // Loading state
  if (isLoading && children.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Chọn con em"
          onBack={() => navigation?.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0284C7" />
          <Text style={styles.loadingText}>Đang tải danh sách...</Text>
        </View>
      </View>
    );
  }

  // Empty state
  if (!isLoading && children.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Chọn con em"
          onBack={() => navigation?.goBack()}
        />
        <View style={styles.emptyContainer}>
          <Icon name="user" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>Không tìm thấy học sinh</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Text style={styles.emptyText}>
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
    <View style={styles.container}>
      <ScreenHeader
        title="Chọn con em"
        onBack={() => navigation?.goBack()}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.descriptionText}>
          Vui lòng chọn tài khoản học sinh bạn muốn theo dõi thông tin.
        </Text>

        <View style={styles.childrenList}>
          {children.map((child: { id: string; name: string; grade: string | number; section?: string; studentCode: string }) => {
            const isSelected = tempSelectedId === child.id;
            return (
              <Pressable
                key={child.id}
                onPress={() => handleSelectChild(child.id)}
              >
                <View style={[
                  styles.childCard,
                  isSelected && styles.childCardSelected
                ]}>
                  <View style={[
                    styles.avatar,
                    isSelected && styles.avatarSelected
                  ]}>
                    <Text style={[
                      styles.avatarText,
                      isSelected && styles.avatarTextSelected
                    ]}>
                      {getInitials(child.name)}
                    </Text>
                  </View>
                  <View style={styles.childInfo}>
                    <Text style={styles.childName}>{child.name}</Text>
                    <Text style={[
                      styles.childGrade,
                      isSelected && styles.childGradeSelected
                    ]}>
                      {child.grade}
                      {child.section && ` ${child.section}`}
                    </Text>
                    <Text style={styles.childCode}>
                      Mã HS: {child.studentCode}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkIcon}>
                      <Icon name="check" size={24} color="#0284C7" />
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={handleConfirm}>
          <View style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>
              Xác nhận
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F9FAFB',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  childrenList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  childCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  childCardSelected: {
    backgroundColor: '#F0F9FF',
    borderColor: '#0284C7',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: '#E5E7EB',
  },
  avatarSelected: {
    backgroundColor: '#0284C7',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#6B7280',
  },
  avatarTextSelected: {
    color: '#FFFFFF',
  },
  childInfo: {
    flex: 1,
    marginLeft: 16,
  },
  childName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  childGrade: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginTop: 2,
    color: '#9CA3AF',
  },
  childGradeSelected: {
    color: '#0284C7',
  },
  childCode: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#9CA3AF',
    marginTop: 4,
  },
  checkIcon: {
    width: 24,
    height: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  footer: {
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  confirmButton: {
    backgroundColor: '#0284C7',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center' as const,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
});
