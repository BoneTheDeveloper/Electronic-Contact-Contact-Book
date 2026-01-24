/**
 * News Screen - Matches news.html wireframe
 */
import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import { Svg } from 'react-native-svg';
import { Path } from 'react-native-svg';
import type { ParentHomeStackNavigationProp } from '../../navigation/types';

interface NewsItem {
  id: string;
  category: string;
  title: string;
  content: string;
  date: string;
  views: number;
  featured?: boolean;
}

const MOCK_NEWS: NewsItem[] = [
  { id: '1', category: 'Nhà trường', title: 'Thông báo nghỉ Tết Nguyên Đán 2026', content: 'Trường sẽ nghỉ từ 20/01 đến 02/02/2026...', date: '20/01/2026', views: 256, featured: true },
  { id: '2', category: 'Lớp học', title: 'Lịch họp phụ huynh cuối kỳ I', content: 'Thời gian: 15/01/2026 lúc 18:00...', date: '15/01/2026', views: 189 },
  { id: '3', category: 'Hoạt động', title: 'Hội thao thể thao học sinh 2026', content: 'Đăng ký tham gia các môn...', date: '20/01/2026', views: 412 },
  { id: '4', category: 'Nhà trường', title: 'Kết thúc kỳ thi giữa kỳ I', content: 'Kết quả sẽ được công bố...', date: '15/01/2026', views: 523 },
];

const CATEGORY_COLORS = {
  'Nhà trường': { bg: '#DBEAFE', text: '#0284C7' },
  'Lớp học': { bg: '#F3E8FF', text: '#9333EA' },
  'Hoạt động': { bg: '#D1FAE5', text: '#059669' },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 140, backgroundColor: '#0284C7', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  scrollContent: { flex: 1, paddingHorizontal: 24, paddingTop: 6, paddingBottom: 128 },
  categoryTabs: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  categoryTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: '#DBEAFE' },
  categoryTabActive: { backgroundColor: '#0284C7' },
  categoryTabText: { fontSize: 12, fontWeight: '800', color: '#9CA3AF' },
  categoryTabTextActive: { color: 'white' },
  featuredCard: { backgroundColor: '#0284C7', borderRadius: 24, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  featuredBadge: { backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  featuredBadgeText: { fontSize: 8, fontWeight: '800', color: 'white', textTransform: 'uppercase' },
  featuredDate: { fontSize: 9, color: '#E0F2FE', fontWeight: '500' },
  featuredTitle: { fontSize: 16, fontWeight: '800', color: 'white', marginBottom: 8 },
  featuredContent: { fontSize: 12, color: '#E0F2FE', lineHeight: 18, marginBottom: 12 },
  listTitle: { fontSize: 14, fontWeight: '800', color: '#1F2937', marginBottom: 12 },
  newsCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  newsCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  categoryBadgeText: { fontSize: 8, fontWeight: '800', textTransform: 'uppercase' },
  newsDate: { fontSize: 9, color: '#9CA3AF' },
  newsTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  newsContent: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  newsFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  newsViews: { fontSize: 9, color: '#9CA3AF' },
});

const BackIcon = () => <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}><Path d="M19 12H5" /><Path d="M12 19l-7-7 7-7" /></Svg>;
const CalendarIcon = () => <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}><Path d="M16 2v6" /><Path d="M8 2v6" /><Path d="M3 10h21" /><Rect x="3" y="4" width="18" height="18" rx="2" /></Svg>;
const EyeIcon = ({ color }: { color: string }) => <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5}><Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /></Svg>;

export const NewsScreen: React.FC<{ navigation?: ParentHomeStackNavigationProp }> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const categories = ['Tất cả', 'Nhà trường', 'Lớp học', 'Hoạt động'];

  return (
    <View style={styles.container}>
      <View style={styles.headerBg} />
      <View style={{ paddingHorizontal: 24, paddingTop: 64, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Pressable onPress={() => navigation?.goBack()} style={{ width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, alignItems: 'center' }}>
            <BackIcon />
          </Pressable>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: 'white' }}>Tin tức & sự kiện</Text>
            <Text style={{ fontSize: 12, color: '#E0F2FE', marginTop: 2 }}>Cập nhật từ trường và lớp học</Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.categoryTabs}>
          {categories.map((cat) => (
            <Pressable key={cat} style={[styles.categoryTab, selectedCategory === cat && styles.categoryTabActive]} onPress={() => setSelectedCategory(cat)}>
              <Text style={[styles.categoryTabText, selectedCategory === cat && styles.categoryTabTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </View>
        {MOCK_NEWS.filter(n => n.featured).map(item => (
          <Pressable key={item.id} style={styles.featuredCard}>
            <View style={styles.featuredBadge}><Text style={styles.featuredBadgeText}>Nổi bật</Text></View>
            <Text style={styles.featuredDate}>Hôm nay</Text>
            <Text style={styles.featuredTitle}>{item.title}</Text>
            <Text style={styles.featuredContent}>{item.content}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><CalendarIcon /><Text style={styles.featuredDate}>{item.date}</Text></View>
          </Pressable>
        ))}
        <Text style={styles.listTitle}>Tin mới nhất</Text>
        {MOCK_NEWS.filter(n => !n.featured).map(item => {
          const cc = CATEGORY_COLORS[item.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS['Nhà trường'];
          return (
            <Pressable key={item.id} style={styles.newsCard}>
              <View style={styles.newsCardHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: cc.bg }]}><Text style={[styles.categoryBadgeText, { color: cc.text }]}>{item.category}</Text></View>
                <Text style={styles.newsDate}>Hôm qua</Text>
              </View>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsContent}>{item.content}</Text>
              <View style={styles.newsFooter}><EyeIcon color="#9CA3AF" /><Text style={styles.newsViews}>{item.views} lượt xem</Text></View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
