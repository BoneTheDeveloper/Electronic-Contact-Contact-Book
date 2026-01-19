/**
 * Parent Tabs Navigator
 * Bottom tab navigation for parent users matching wireframe design
 * 3 tabs: Trang chủ, Tin nhắn, Cá nhân
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import Svg, { Path, Polyline, Circle, Line } from 'react-native-svg';
import { useUIStore } from '../stores';
import { colors } from '../theme';
import {
  DashboardScreen,
  ScheduleScreen,
  GradesScreen,
  AttendanceScreen,
  TeacherFeedbackScreen,
  SummaryScreen,
  LeaveRequestScreen,
} from '../screens/parent';
import { PaymentOverviewScreen, PaymentDetailScreen, PaymentMethodScreen, PaymentReceiptScreen } from '../screens/parent';
import { MessagesScreen, NotificationsScreen, NewsScreen } from '../screens/parent';
import { TeacherDirectoryScreen } from '../screens/parent';
import type { ParentPaymentStackParamList, ParentTabParamList } from './types';

// Home Stack (Dashboard, Schedule, Grades, Attendance, TeacherFeedback, LeaveRequest, Summary, TeacherDirectory)
const HomeStack = createNativeStackNavigator();
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Dashboard" component={DashboardScreen} />
    <HomeStack.Screen name="Schedule" component={ScheduleScreen} />
    <HomeStack.Screen name="Grades" component={GradesScreen} />
    <HomeStack.Screen name="Attendance" component={AttendanceScreen} />
    <HomeStack.Screen name="TeacherFeedback" component={TeacherFeedbackScreen} />
    <HomeStack.Screen name="LeaveRequest" component={LeaveRequestScreen} />
    <HomeStack.Screen name="Summary" component={SummaryScreen} />
    <HomeStack.Screen name="TeacherDirectory" component={TeacherDirectoryScreen} />
  </HomeStack.Navigator>
);

// Payment Stack (Overview, Detail, Method, Receipt)
const PaymentStack = createNativeStackNavigator<ParentPaymentStackParamList>();
const PaymentStackNavigator: React.FC = () => (
  <PaymentStack.Navigator screenOptions={{ headerShown: false }}>
    <PaymentStack.Screen name="PaymentOverview" component={PaymentOverviewScreen} />
    <PaymentStack.Screen name="PaymentDetail" component={PaymentDetailScreen} />
    <PaymentStack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
    <PaymentStack.Screen name="PaymentReceipt" component={PaymentReceiptScreen} />
  </PaymentStack.Navigator>
);

// Communication Stack (Messages, Notifications, News)
const CommStack = createNativeStackNavigator();
const CommStackNavigator = () => (
  <CommStack.Navigator screenOptions={{ headerShown: false }}>
    <CommStack.Screen name="Messages" component={MessagesScreen} />
    <CommStack.Screen name="Notifications" component={NotificationsScreen} />
    <CommStack.Screen name="News" component={NewsScreen} />
  </CommStack.Navigator>
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
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={focused ? colors.primary : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
      <Polyline points="9 22 9 12 15 12 15 22" stroke={focused ? colors.primary : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  </View>
);

const MessageIcon = ({ focused, hasBadge }: { focused: boolean; hasBadge?: boolean }) => (
  <View style={{ alignItems: 'center' }}>
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={focused ? colors.primary : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
    {hasBadge && <View style={{ position: 'absolute', top: -2, right: -4, width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#FFFFFF' }} />}
  </View>
);

const ProfileIcon = ({ focused }: { focused: boolean }) => (
  <View style={{ alignItems: 'center' }}>
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={focused ? colors.primary : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="12" cy="7" r="4" stroke={focused ? colors.primary : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  </View>
);

const Tab = createBottomTabNavigator<ParentTabParamList>();

const ParentTabs: React.FC = () => {
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
          fontSize: 9,
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
        name="ParentHome"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ParentMessages"
        component={CommStackNavigator}
        options={{
          tabBarLabel: 'Tin nhắn',
          tabBarIcon: ({ focused }) => <MessageIcon focused={focused} hasBadge />,
        }}
      />
      <Tab.Screen
        name="ParentProfile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default ParentTabs;
