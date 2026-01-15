/**
 * Student Tabs Navigator
 * Bottom tab navigation for student users matching wireframe design
 * 2 tabs: Trang chủ, Cá nhân
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import Svg, { Path, Polyline, Circle } from 'react-native-svg';
import { useUIStore } from '../stores';
import { colors } from '../theme';
import { DashboardScreen } from '../screens/student';
import {
  StudentScheduleScreen,
  StudentGradesScreen,
  StudentAttendanceScreen,
  StudentTeacherFeedbackScreen,
  StudentLeaveRequestScreen,
  StudentNewsScreen,
  StudentSummaryScreen,
  StudentPaymentScreen,
  StudentStudyMaterialsScreen,
} from '../screens/student';

// Home Stack (Dashboard, Schedule, Grades, Attendance, Study Materials, Leave Request, Teacher Feedback, News, Summary, Payment)
const HomeStack = createNativeStackNavigator();
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="StudentDashboard" component={DashboardScreen} />
    <HomeStack.Screen name="StudentSchedule" component={StudentScheduleScreen} />
    <HomeStack.Screen name="StudentGrades" component={StudentGradesScreen} />
    <HomeStack.Screen name="StudentAttendance" component={StudentAttendanceScreen} />
    <HomeStack.Screen name="StudentStudyMaterials" component={StudentStudyMaterialsScreen} />
    <HomeStack.Screen name="StudentLeaveRequest" component={StudentLeaveRequestScreen} />
    <HomeStack.Screen name="StudentTeacherFeedback" component={StudentTeacherFeedbackScreen} />
    <HomeStack.Screen name="StudentNews" component={StudentNewsScreen} />
    <HomeStack.Screen name="StudentSummary" component={StudentSummaryScreen} />
    <HomeStack.Screen name="StudentPayment" component={StudentPaymentScreen} />
  </HomeStack.Navigator>
);

// Profile Stack (placeholder for now)
const ProfileStack = createNativeStackNavigator();
const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
    <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937' }}>Profile Screen</Text>
    <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 8 }}>Coming soon...</Text>
  </View>
);
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

// Custom Tab Bar Icons
const HomeIcon = ({ focused }: { focused: boolean }) => (
  <View style={{ alignItems: 'center' }}>
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={focused ? colors.primary : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
      <Polyline points="9 22 9 12 15 12 15 22" stroke={focused ? colors.primary : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  </View>
);

const ProfileIcon = ({ focused }: { focused: boolean }) => (
  <View style={{ alignItems: 'center' }}>
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={focused ? colors.primary : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="12" cy="7" r="4" stroke={focused ? colors.primary : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  </View>
);

export type StudentTabParamList = {
  StudentHome: undefined;
  StudentProfile: undefined;
};

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
