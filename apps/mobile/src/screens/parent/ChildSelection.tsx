/**
 * Child Selection Screen
 * Allows parents to switch between their children
 * Based on wireframe: childselection.html
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useParentStore } from '../../stores';
import { ScreenHeader, Icon } from '../../components/ui';
import type { ParentHomeStackNavigationProp } from '../../navigation/types';

interface ChildSelectionScreenProps {
  navigation?: ParentHomeStackNavigationProp;
}

export const ChildSelectionScreen: React.FC<ChildSelectionScreenProps> = ({ navigation }) => {
  const { children, selectedChildId, setSelectedChildId } = useParentStore();
  const [tempSelectedId, setTempSelectedId] = useState(selectedChildId);

  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0]?.slice(0, 2).toUpperCase() ?? 'U';
    const first = parts[0]?.charAt(0) ?? '';
    const last = parts[parts.length - 1]?.charAt(0) ?? '';
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
        <Text style={styles.description}>
          Vui lòng chọn tài khoản học sinh bạn muốn theo dõi thông tin.
        </Text>

        <View style={styles.childrenList}>
          {children.map((child) => {
            const isSelected = tempSelectedId === child.id;
            return (
              <TouchableOpacity
                key={child.id}
                style={[styles.childCard, isSelected && styles.childCardActive]}
                onPress={() => handleSelectChild(child.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.avatar, isSelected && styles.avatarActive]}>
                  <Text style={[styles.avatarText, isSelected && styles.avatarTextActive]}>
                    {getInitials(child.name)}
                  </Text>
                </View>
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={[styles.childClass, isSelected && styles.childClassActive]}>
                    {child.grade}
                    {child.section && ` ${child.section}`}
                  </Text>
                  <Text style={styles.studentCode}>Mã HS: {child.studentCode}</Text>
                </View>
                {isSelected && (
                  <View style={styles.checkIcon}>
                    <Icon name="check" size={24} color="#0284C7" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  childrenList: {
    gap: 16,
    marginBottom: 24,
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  childCardActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0284C7',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarActive: {
    backgroundColor: '#0284C7',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#6B7280',
  },
  avatarTextActive: {
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
    marginBottom: 4,
  },
  childClass: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  childClassActive: {
    color: '#0284C7',
  },
  studentCode: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  checkIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  confirmButton: {
    backgroundColor: '#0284C7',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
