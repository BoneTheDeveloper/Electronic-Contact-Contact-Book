/**
 * FAQ Screen
 * Frequently Asked Questions for users
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
} from 'react-native';
import { colors } from '../../theme';
import Svg, { Path } from 'react-native-svg';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface FAQScreenProps {
  navigation?: NativeStackNavigationProp<any>;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19l-7-7 7-7" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ChevronDownIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ChevronUpIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M18 15l-6-6-6 6" stroke={colors.primary} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    id: '1',
    category: 'Tài khoản',
    question: 'Làm sao để thay đổi mật khẩu?',
    answer: 'Bạn vào mục "Cá nhân" > "Đổi mật khẩu", nhập mật khẩu hiện tại và mật khẩu mới, sau đó nhấn "Đổi mật khẩu" để hoàn tất.',
  },
  {
    id: '2',
    category: 'Tài khoản',
    question: 'Tôi quên mật khẩu thì phải làm sao?',
    answer: 'Bạn có thể sử dụng tính năng "Quên mật khẩu" trên màn hình đăng nhập hoặc liên hệ với văn phòng nhà trường để được hỗ trợ đặt lại mật khẩu.',
  },
  {
    id: '3',
    category: 'Tài khoản',
    question: 'Làm sao để cập nhật thông tin cá nhân?',
    answer: 'Chọn "Cá nhân" > "Cập nhật thông tin", chỉnh sửa các thông tin cần thay đổi và nhấn "Lưu thay đổi".',
  },
  {
    id: '4',
    category: 'Học phí',
    question: 'Làm sao để xem lịch sử học phí?',
    answer: 'Từ màn hình chính, chọn icon "Học phí" để xem danh sách các khoản học phí cần thanh toán và lịch sử thanh toán.',
  },
  {
    id: '5',
    category: 'Học phí',
    question: 'Tôi có thể thanh toán học phí online không?',
    answer: 'Hiện tại ứng dụng đang trong giai đoạn thử nghiệm. Tính năng thanh toán online sẽ được cập nhật trong phiên bản tới.',
  },
  {
    id: '6',
    category: 'Học tập',
    question: 'Làm sao để xem điểm số của con?',
    answer: 'Chọn icon "Bảng điểm môn học" từ màn hình chính để xem chi tiết điểm số của các môn học.',
  },
  {
    id: '7',
    category: 'Học tập',
    question: 'Làm sao để xem lịch sử điểm danh?',
    answer: 'Chọn icon "Lịch sử điểm danh" từ màn hình chính để xem chi tiết các ngày đi học, vắng mặt.',
  },
  {
    id: '8',
    category: 'Học tập',
    question: 'Làm sao để xin nghỉ học cho con?',
    answer: 'Chọn icon "Đơn xin nghỉ phép", điền lý do và ngày nghỉ, sau đó gửi đơn. Giáo viên sẽ nhận được thông báo.',
  },
  {
    id: '9',
    category: 'Ứng dụng',
    question: 'Làm sao để bật thông báo?',
    answer: 'Vào Cài đặt của điện thoại > Tìm ứng dụng EContact > Bật quyền thông báo.',
  },
  {
    id: '10',
    category: 'Ứng dụng',
    question: 'Ứng dụng có miễn phí không?',
    answer: 'Có, ứng dụng EContact hoàn toàn miễn phí cho phụ huynh và học sinh.',
  },
  {
    id: '11',
    category: 'Bảo mật',
    question: 'Làm sao để bật đăng nhập bằng vân tay?',
    answer: 'Chọn "Cá nhân" > "Xác thực sinh trắc học" và bật tính năng này. Thiết bị của bạn cần hỗ trợ vân tay/Face ID.',
  },
  {
    id: '12',
    category: 'Bảo mật',
    question: 'Thông tin của tôi có được bảo mật không?',
    answer: 'Có, mọi thông tin cá nhân đều được bảo mật theo quy định của nhà trường và pháp luật hiện hành.',
  },
];

const CATEGORIES = ['Tất cả', ...Array.from(new Set(FAQS.map(f => f.category)))];

export const FAQScreen: React.FC<FAQScreenProps> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFAQs = selectedCategory === 'Tất cả'
    ? FAQS
    : FAQS.filter(f => f.category === selectedCategory);

  const toggleExpand = (id: string) => {
    LayoutAnimation.easeInEaseOut();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Câu hỏi thường gặp
        </Text>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryFilter}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category ? styles.categoryButtonActive : styles.categoryButtonInactive,
              ]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category ? styles.categoryButtonTextActive : styles.categoryButtonTextInactive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* FAQ List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {filteredFAQs.map((faq) => (
          <View
            key={faq.id}
            style={styles.faqCard}
          >
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => toggleExpand(faq.id)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeaderContent}>
                <View style={styles.faqCategoryTag}>
                  <View style={[styles.categoryTag, { backgroundColor: `${colors.primary}15` }]}>
                    <Text style={[styles.categoryTagText, { color: colors.primary }]}>
                      {faq.category}
                    </Text>
                  </View>
                </View>
                <Text style={styles.faqQuestion}>
                  {faq.question}
                </Text>
              </View>
              <View style={styles.chevronContainer}>
                {expandedId === faq.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </View>
            </TouchableOpacity>

            {expandedId === faq.id && (
              <View style={styles.faqAnswer}>
                <View style={styles.faqDivider} />
                <Text style={styles.faqAnswerText}>
                  {faq.answer}
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Contact Support */}
        <View style={[styles.contactCard, { backgroundColor: '#E0F2FE' }]}>
          <Text style={[styles.contactTitle, { color: colors.primary }]}>
            Không tìm thấy câu trả lời?
          </Text>
          <Text style={styles.contactSubtitle}>
            Liên hệ với chúng tôi để được hỗ trợ trực tiếp.
          </Text>
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation?.navigate('Support' as never)}
            activeOpacity={0.8}
          >
            <Text style={styles.contactButtonText}>
              Liên hệ hỗ trợ
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Phiên bản ứng dụng 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  categoryFilter: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryScrollContent: {
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary || '#0284C7',
  },
  categoryButtonInactive: {
    backgroundColor: '#F3F4F6',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  categoryButtonTextInactive: {
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  faqHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  faqHeaderContent: {
    flex: 1,
    marginRight: 12,
  },
  faqCategoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  faqQuestion: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  chevronContainer: {
    marginTop: 2,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  faqDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
  },
  faqAnswerText: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },
  contactCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  contactSubtitle: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 12,
  },
  contactButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
});
