/**
 * Study Materials Screen
 * Learning resources and documents with teacher upload functionality
 */

import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal, TextInput, Pressable } from 'react-native';

interface MaterialItem {
  id: string;
  title: string;
  subject: string;
  type: 'pdf' | 'doc' | 'img';
  uploadDate: string;
  fileSize: string;
}

const SUBJECTS = ['Tất cả', 'Toán', 'Văn', 'Anh', 'Lý', 'Hóa', 'Sinh', 'Sử', 'Địa'] as const;

const SUBJECT_COLORS: Record<string, { bg: string; text: string }> = {
  'Toán': { bg: 'bg-orange-100', text: 'text-orange-600' },
  'Văn': { bg: 'bg-purple-100', text: 'text-purple-600' },
  'Anh': { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  'Lý': { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  'Hóa': { bg: 'bg-amber-100', text: 'text-amber-600' },
  'Sinh': { bg: 'bg-green-100', text: 'text-green-600' },
  'Sử': { bg: 'bg-rose-100', text: 'text-rose-600' },
  'Địa': { bg: 'bg-cyan-100', text: 'text-cyan-600' },
};

const FILE_TYPE_CONFIG = {
  pdf: { icon: '📄', color: '#EF4444', bg: 'bg-red-50' },
  doc: { icon: '📝', color: '#3B82F6', bg: 'bg-blue-50' },
  img: { icon: '🖼️', color: '#10B981', bg: 'bg-green-50' },
};

export const StudentStudyMaterialsScreen: React.FC = () => {
  const { student } = useStudentStore();

  const [selectedSubject, setSelectedSubject] = useState('Tất cả');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('Toán');

  const materials: MaterialItem[] = [
    { id: '1', title: 'Giáo trình Toán học chương trình mới', subject: 'Toán', type: 'pdf', uploadDate: '10/01/2026', fileSize: '2.5 MB' },
    { id: '2', title: 'Bài tập vận dụng Văn học', subject: 'Văn', type: 'doc', uploadDate: '08/01/2026', fileSize: '1.2 MB' },
    { id: '3', title: 'Flash cards tiếng Anh Unit 5-8', subject: 'Anh', type: 'img', uploadDate: '05/01/2026', fileSize: '3.8 MB' },
    { id: '4', title: 'Bài giảng Vật lý chương 4', subject: 'Lý', type: 'pdf', uploadDate: '03/01/2026', fileSize: '4.1 MB' },
    { id: '5', title: 'Hóa chất thực hành', subject: 'Hóa', type: 'doc', uploadDate: '15/12/2025', fileSize: '890 KB' },
  ];

  const filteredMaterials = selectedSubject === 'Tất cả'
    ? materials
    : materials.filter(m => m.subject === selectedSubject);

  const openUploadModal = () => setUploadModalVisible(true);
  const closeUploadModal = () => {
    setUploadModalVisible(false);
    setUploadTitle('');
    setUploadSubject('Toán');
  };
  const handleUpload = () => {
    console.log('Upload material:', { uploadTitle, uploadSubject });
    closeUploadModal();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <View style={{ backgroundColor: '#0284C7', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: 'white' }}>Tài liệu học tập</Text>
        <Text style={{ fontSize: 12, color: '#E0F2FE', marginTop: 2 }}>Tài liệu từ giáo viên</Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 24, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {SUBJECTS.map((subject) => (
              <TouchableOpacity
                key={subject}
                onPress={() => setSelectedSubject(subject)}
                style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: selectedSubject === subject ? '#0284C7' : 'white', borderWidth: selectedSubject === subject ? 0 : 1, borderColor: '#E5E7EB' }}
              >
                <Text style={{ fontSize: 12, fontWeight: '800', color: selectedSubject === subject ? 'white' : '#9CA3AF' }}>{subject}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Text style={{ fontSize: 14, fontWeight: '800', color: '#1F2937', marginBottom: 12 }}>
          {selectedSubject === 'Tất cả' ? 'Tất cả tài liệu' : 'Tài liệu ' + selectedSubject} ({filteredMaterials.length})
        </Text>

        {filteredMaterials.length === 0 ? (
          <View style={{ backgroundColor: 'white', padding: 32, borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6', alignItems: 'center' }}>
            <Text style={{ fontSize: 36, marginBottom: 12 }}>📁</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 4 }}>Không có tài liệu</Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>Chưa có tài liệu cho môn học này</Text>
          </View>
        ) : (
          filteredMaterials.map((material) => {
            const fileConfig = FILE_TYPE_CONFIG[material.type];
            const subjectColor = SUBJECT_COLORS[material.subject] || SUBJECT_COLORS['Toán'];
            return (
              <Pressable key={material.id} style={{ backgroundColor: 'white', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={{ width: 48, height: 48, backgroundColor: fileConfig.bg, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 24 }}>{fileConfig.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 4 }}>{material.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99, backgroundColor: subjectColor.bg }}>
                        <Text style={{ fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', color: subjectColor.text }}>{material.subject}</Text>
                      </View>
                      <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{material.uploadDate}</Text>
                      <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{'• ' + material.fileSize}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={{ width: 32, height: 32, backgroundColor: '#E0F2FE', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }} onPress={() => console.log('Download')}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#0284C7' }}>↓</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity onPress={openUploadModal} style={{ position: 'absolute', bottom: 96, right: 24, width: 56, height: 56, backgroundColor: '#0284C7', borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>+</Text>
      </TouchableOpacity>

      <Modal visible={uploadModalVisible} transparent animationType="slide" onRequestClose={closeUploadModal}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 32, padding: 24, width: '100%', maxHeight: '90%' }}>
            <View style={{ width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#1F2937' }}>Tải tài liệu lên</Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Chia sẻ tài liệu với học sinh</Text>
              </View>
              <TouchableOpacity onPress={closeUploadModal} style={{ width: 36, height: 36, backgroundColor: '#F3F4F6', borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, color: '#9CA3AF' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ gap: 16 }}>
                <View>
                  <Text style={{ fontSize: 10, color: '#374151', fontWeight: '800', textTransform: 'uppercase', marginBottom: 8 }}>Chọn file</Text>
                  <Pressable style={{ borderWidth: 2, borderStyle: 'dashed', borderColor: '#07EAFE', backgroundColor: '#E2F8FE', borderRadius: 12, padding: 24, alignItems: 'center' }}>
                    <Text style={{ fontSize: 36, marginBottom: 8 }}>📎</Text>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#0369A6', textAlign: 'center' }}>Tap để chọn file</Text>
                    <Text style={{ fontSize: 10, color: '#9CA3AF', textAlign: 'center', marginTop: 4 }}>PDF, DOC, DOCX, JPG, PNG</Text>
                  </Pressable>
                </View>

                <View>
                  <Text style={{ fontSize: 10, color: '#374151', fontWeight: '800', textTransform: 'uppercase', marginBottom: 8 }}>Tiêu đề tài liệu</Text>
                  <TextInput value={uploadTitle} onChangeText={setUploadTitle} placeholder="Nhập tiêu đề..." placeholderTextColor="#9CA3AF" style={{ backgroundColor: '#F9FAFB', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', color: '#1F2937', fontSize: 14 }} />
                </View>

                <View>
                  <Text style={{ fontSize: 10, color: '#374151', fontWeight: '800', textTransform: 'uppercase', marginBottom: 8 }}>Môn học</Text>
                  <View style={{ backgroundColor: '#F9FAFB', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#1F2937', fontSize: 14, fontWeight: '600' }}>{uploadSubject}</Text>
                    <Text style={{ color: '#9CA3AF', fontSize: 12 }}>▼</Text>
                  </View>
                </View>

                <TouchableOpacity onPress={handleUpload} style={{ backgroundColor: '#0284C7', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 }}>
                  <Text style={{ color: 'white', fontWeight: '800', fontSize: 14, textAlign: 'center' }}>Tải lên</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};


