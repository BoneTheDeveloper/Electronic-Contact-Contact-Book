/**
 * Teacher Directory Screen
 * Contact list of teachers with search, filter, and detail modal
 * Wireframe: teacher-directory.html
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { mockTeachers } from '../../mock-data';
import { Icon } from '../../components/ui';
import { ScreenHeader } from '../../components/ui';
import type { ParentHomeStackNavigationProp } from '../../navigation/types';

const { width } = Dimensions.get('window');

interface TeacherDirectoryScreenProps {
  navigation?: ParentHomeStackNavigationProp;
}

type SubjectFilter = 'all' | 'GVCN' | 'Toán' | 'Văn' | 'Anh' | 'Lý' | 'Hóa';

const getGradientColors = (type: string) => {
  const colors = {
    blue: ['#60A5FA', '#3B82F6'],
    purple: ['#C084FC', '#A855F7'],
    pink: ['#F472B6', '#EC4899'],
    green: ['#4ADE80', '#22C55E'],
    amber: ['#FCD34D', '#F59E0B'],
    cyan: ['#5EEAD4', '#2DD4BF'],
  };
  return colors[type as keyof typeof colors] || colors.blue;
};

export const TeacherDirectoryScreen: React.FC<TeacherDirectoryScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<SubjectFilter>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<typeof mockTeachers[0] | null>(null);

  const subjects: { label: string; value: SubjectFilter }[] = [
    { label: 'Tất cả', value: 'all' },
    { label: 'GVCN', value: 'GVCN' },
    { label: 'Toán', value: 'Toán' },
    { label: 'Văn', value: 'Văn' },
    { label: 'Anh', value: 'Anh' },
    { label: 'Lý', value: 'Lý' },
    { label: 'Hóa', value: 'Hóa' },
  ];

  const filteredTeachers = mockTeachers.filter((teacher) => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || teacher.subjects.some(s => s.includes(selectedFilter));
    return matchesSearch && matchesFilter;
  });

  const homeroomTeacher = filteredTeachers.find(t => t.type === 'homeroom');
  const subjectTeachers = filteredTeachers.filter(t => t.type === 'subject');

  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return 'GV';
    if (parts.length === 1) return (parts[0] || '').slice(0, 2).toUpperCase();
    const first = (parts[0] || '').charAt(0);
    const last = (parts[parts.length - 1] || '').charAt(0);
    return `${first}${last}`.toUpperCase();
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'GVCN': '#DBEAFE',
      'Toán': '#E9D5FF',
      'Ngữ văn': '#FFEDD5',
      'Văn': '#FFEDD5',
      'Tiếng Anh': '#FBCFE8',
      'Anh': '#FBCFE8',
      'Vật lý': '#D1FAE5',
      'Lý': '#D1FAE5',
      'Hóa học': '#CFFAFE',
      'Hóa': '#CFFAFE',
    };
    return colors[subject] || '#E5E7EB';
  };

  const getSubjectTextColor = (subject: string) => {
    const colors: Record<string, string> = {
      'GVCN': '#0284C7',
      'Toán': '#9333EA',
      'Ngữ văn': '#F97316',
      'Văn': '#F97316',
      'Tiếng Anh': '#EC4899',
      'Anh': '#EC4899',
      'Vật lý': '#10B981',
      'Lý': '#10B981',
      'Hóa học': '#06B6D4',
      'Hóa': '#06B6D4',
    };
    return colors[subject] || '#6B7280';
  };

  const renderSubjectFilter = (subject: { label: string; value: SubjectFilter }) => {
    const isActive = selectedFilter === subject.value;
    return (
      <TouchableOpacity
        key={subject.value}
        style={[
          styles.subjectTag,
          isActive ? styles.subjectTagActive : styles.subjectTagInactive,
        ]}
        onPress={() => setSelectedFilter(subject.value)}
      >
        <Text style={[styles.subjectTagText, isActive ? styles.subjectTagTextActive : styles.subjectTagTextInactive]}>
          {subject.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderHomeroomTeacher = (teacher: typeof mockTeachers[0]) => (
    <View style={styles.homeroomCard}>
      <View style={styles.homeroomHeader}>
        <Icon name="star" size={16} color="#0284C7" />
        <Text style={styles.homeroomHeaderText}>Giáo viên chủ nhiệm</Text>
      </View>
      <TouchableOpacity
        style={styles.teacherCard}
                    onPress={() => {
              const parent = navigation?.getParent();
              parent?.navigate('ParentMessages' as never);
            }}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <View style={[
            styles.avatar,
            {
              backgroundColor: getGradientColors(teacher.avatarColor || 'blue')[0],
            }
          ]}>
            <View style={[
              styles.avatarInner,
              {
                backgroundColor: getGradientColors(teacher.avatarColor || 'blue')[1],
              }
            ]}>
              <Text style={[styles.avatarText, { color: '#FFFFFF' }]}>
                {getInitials(teacher.name)}
              </Text>
            </View>
          </View>
          {teacher.status === 'online' && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.teacherInfo}>
          <Text style={styles.teacherName}>{teacher.name}</Text>
          <Text style={styles.teacherRole}>{teacher.subjects[0]} 9A</Text>
        </View>
        <View style={styles.teacherActions}>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setSelectedTeacher(teacher)}
          >
            <Icon name="info" size={16} color="#0284C7" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.messageButton}
                        onPress={() => {
              const parent = navigation?.getParent();
              parent?.navigate('ParentMessages' as never);
            }}
          >
            <Icon name="message" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderSubjectTeacher = (teacher: typeof mockTeachers[0]) => (
    <TouchableOpacity
      key={teacher.id}
      style={styles.subjectTeacherCard}
                  onPress={() => {
              const parent = navigation?.getParent();
              parent?.navigate('ParentMessages' as never);
            }}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <View style={[
          styles.avatarSmall,
          {
            backgroundColor: getGradientColors(teacher.avatarColor || 'blue')[0],
          }
        ]}>
          <View style={[
            styles.avatarInnerSmall,
            {
              backgroundColor: getGradientColors(teacher.avatarColor || 'blue')[1],
            }
          ]}>
            <Text style={[styles.avatarTextSmall, { color: '#FFFFFF' }]}>
              {getInitials(teacher.name)}
            </Text>
          </View>
        </View>
        {teacher.status === 'online' && <View style={styles.onlineIndicatorSmall} />}
      </View>
      <View style={styles.teacherInfo}>
        <Text style={styles.teacherName}>{teacher.name}</Text>
        <View style={styles.subjectBadges}>
          {teacher.subjects.map((subject, idx) => (
            <View
              key={idx}
              style={[
                styles.subjectBadge,
                { backgroundColor: getSubjectColor(subject) },
              ]}
            >
              <Text style={[styles.subjectBadgeText, { color: getSubjectTextColor(subject) }]}>
                {subject}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.teacherActions}>
        <TouchableOpacity
          style={styles.infoButtonSmall}
          onPress={() => setSelectedTeacher(teacher)}
        >
          <Icon name="info" size={14} color="#64748B" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.messageButtonSmall}
                      onPress={() => {
              const parent = navigation?.getParent();
              parent?.navigate('ParentMessages' as never);
            }}
        >
          <Icon name="message" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ScreenHeader title="Danh bạ giáo viên" onBack={() => navigation?.goBack()} />

        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={16} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm giáo viên..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Subject Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {subjects.map(renderSubjectFilter)}
        </ScrollView>
      </View>

      {/* Teacher List */}
      <ScrollView
        style={styles.teacherList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.teacherListContent}
      >
        {homeroomTeacher && renderHomeroomTeacher(homeroomTeacher)}

        {subjectTeachers.length > 0 && (
          <Text style={styles.sectionTitle}>Giáo viên bộ môn</Text>
        )}

        {subjectTeachers.map(renderSubjectTeacher)}

        {filteredTeachers.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="user" size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Không tìm thấy giáo viên</Text>
            <Text style={styles.emptyText}>Thử thay đổi điều kiện tìm kiếm</Text>
          </View>
        )}
      </ScrollView>

      {/* Teacher Info Modal */}
      <Modal
        visible={!!selectedTeacher}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTeacher(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thông tin liên hệ</Text>
              <TouchableOpacity onPress={() => setSelectedTeacher(null)}>
                <Icon name="x" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedTeacher && (
              <>
                <View style={styles.modalTeacherInfo}>
                  <Text style={styles.modalTeacherName}>{selectedTeacher.name}</Text>
                  <Text style={styles.modalTeacherSubject}>
                    {selectedTeacher.subjects.join(' • ')}
                  </Text>
                </View>

                <View style={styles.contactRows}>
                  <View style={styles.contactRow}>
                    <View style={[styles.contactIcon, { backgroundColor: '#DBEAFE' }]}>
                      <Icon name="phone-alt" size={18} color="#0284C7" />
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactLabel}>Điện thoại</Text>
                      <Text style={styles.contactValue}>{selectedTeacher.phone}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.contactAction}
                                  onPress={() => {
              const parent = navigation?.getParent();
              parent?.navigate('ParentMessages' as never);
            }}
                    >
                      <Icon name="phone-alt" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.contactRow}>
                    <View style={[styles.contactIcon, { backgroundColor: '#F3E8FF' }]}>
                      <Icon name="email" size={18} color="#9333EA" />
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactLabel}>Email</Text>
                      <Text style={styles.contactValue}>{selectedTeacher.email}</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.contactAction, { backgroundColor: '#9333EA' }]}
                                  onPress={() => {
              const parent = navigation?.getParent();
              parent?.navigate('ParentMessages' as never);
            }}
                    >
                      <Icon name="email" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedTeacher(null)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  filterScroll: {
    marginBottom: 4,
  },
  filterContent: {
    gap: 8,
    paddingRight: 16,
  },
  subjectTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  subjectTagActive: {
    backgroundColor: '#0284C7',
  },
  subjectTagInactive: {
    backgroundColor: '#E5E7EB',
  },
  subjectTagText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  subjectTagTextActive: {
    color: '#FFFFFF',
  },
  subjectTagTextInactive: {
    color: '#6B7280',
  },
  teacherList: {
    flex: 1,
  },
  teacherListContent: {
    padding: 16,
    paddingBottom: 96,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 12,
    marginLeft: 2,
  },
  homeroomCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 16,
    marginBottom: 12,
  },
  homeroomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  homeroomHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  teacherCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectTeacherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInnerSmall: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  avatarTextSmall: {
    fontSize: 14,
    fontWeight: '700',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineIndicatorSmall: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  teacherRole: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subjectBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  subjectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  subjectBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  classesText: {
    fontSize: 9,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  teacherActions: {
    flexDirection: 'row',
    gap: 8,
  },
  infoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoButtonSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  messageButtonSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalTeacherInfo: {
    marginBottom: 16,
  },
  modalTeacherName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  modalTeacherSubject: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactRows: {
    gap: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  contactAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
});
