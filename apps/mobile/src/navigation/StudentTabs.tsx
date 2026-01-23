/**
 * Student Tabs Navigator
 * Bottom tab navigation for student users matching wireframe design
 * 2 tabs: Trang chủ, Cá nhân
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Polyline, Circle } from 'react-native-svg';
import { useUIStore } from '../stores';
import { colors } from '../theme';
import {
  DashboardScreen,
  ScheduleScreen,
  GradesScreen,
  AttendanceScreen,
  StudyMaterialsScreen,
  LeaveRequestScreen,
  TeacherFeedbackScreen,
  NewsScreen,
  SummaryScreen,
  PaymentScreen,
} from '../screens/student';
import {
  ProfileScreen,
  UpdateProfileScreen,
  ChangePasswordScreen,
  BiometricAuthScreen,
  FAQScreen,
  SupportScreen,
} from '../screens/profile';
import type { StudentTabParamList, StudentProfileStackParamList } from './types';

// Home Stack (Dashboard, Schedule, Grades, Attendance, Study Materials, Leave Request, Teacher Feedback, News, Summary, Payment)
const HomeStack = createNativeStackNavigator();
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="StudentDashboard" component={DashboardScreen as any} />
    <HomeStack.Screen name="StudentSchedule" component={ScheduleScreen as any} />
    <HomeStack.Screen name="StudentGrades" component={GradesScreen as any} />
    <HomeStack.Screen name="StudentAttendance" component={AttendanceScreen as any} />
    <HomeStack.Screen name="StudentStudyMaterials" component={StudyMaterialsScreen as any} />
    <HomeStack.Screen name="StudentLeaveRequest" component={LeaveRequestScreen as any} />
    <HomeStack.Screen name="StudentTeacherFeedback" component={TeacherFeedbackScreen as any} />
    <HomeStack.Screen name="StudentNews" component={NewsScreen as any} />
    <HomeStack.Screen name="StudentSummary" component={SummaryScreen as any} />
    <HomeStack.Screen name="StudentPayment" component={PaymentScreen as any} />
  </HomeStack.Navigator>
);

// Profile Stack with all profile screens
const ProfileStack = createNativeStackNavigator<StudentProfileStackParamList>();
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen as any} />
    <ProfileStack.Screen name="UpdateProfile" component={UpdateProfileScreen as any} />
    <ProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen as any} />
    <ProfileStack.Screen name="BiometricAuth" component={BiometricAuthScreen as any} />
    <ProfileStack.Screen name="FAQ" component={FAQScreen as any} />
    <ProfileStack.Screen name="Support" component={SupportScreen as any} />
  </ProfileStack.Navigator>
);

// Custom Tab Bar Icons
const HomeIcon = ({ focused }: { focused: boolean }) => (
  <View style={styles.iconContainer}>
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={focused ? colors.primary : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
      <Polyline points="9 22 9 12 15 12 15 22" stroke={focused ? colors.primary : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  </View>
);

const ProfileIcon = ({ focused }: { focused: boolean }) => (
  <View style={styles.iconContainer}>
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={focused ? colors.primary : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="12" cy="7" r="4" stroke={focused ? colors.primary : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  </View>
);

const Tab = createBottomTabNavigator<StudentTabParamList>();

const StudentTabs: React.FC = () => {
  const isDarkMode = useUIStore((state) => state.isDarkMode);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#D1D5DB',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1E1E1E' : 'rgba(255, 255, 255, 0.9)',
          borderTopColor: '#F3F4F6',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 65,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          textTransform: 'uppercase',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tab.Screen
        name="StudentHome"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="StudentProfile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default StudentTabs;

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
  },
});
