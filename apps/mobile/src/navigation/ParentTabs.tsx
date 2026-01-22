/**
 * Parent Tabs Navigator
 * Bottom tab navigation for parent users matching wireframe design
 * 3 tabs: Trang chủ, Tin nhắn, Cá nhân
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import Svg, { Path, Polyline, Circle } from 'react-native-svg';
import { useUIStore } from '../stores';
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
import type { ParentTabParamList, ParentHomeStackParamList } from './types';

// Home Stack (Dashboard + all service screens accessible from dashboard)
// Including News and Payment screens for dashboard navigation
const HomeStack = createNativeStackNavigator<ParentHomeStackParamList>();
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
    {/* News screen for dashboard navigation */}
    <HomeStack.Screen name="News" component={NewsScreen} />
    {/* Payment screens for dashboard navigation */}
    <HomeStack.Screen name="PaymentOverview" component={PaymentOverviewScreen} />
    <HomeStack.Screen name="PaymentDetail" component={PaymentDetailScreen} />
    <HomeStack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
    <HomeStack.Screen name="PaymentReceipt" component={PaymentReceiptScreen} />
  </HomeStack.Navigator>
);

// Communication Stack (Messages, Notifications - News is in HomeStack for Dashboard access)
const CommStack = createNativeStackNavigator();
const CommStackNavigator = () => (
  <CommStack.Navigator screenOptions={{ headerShown: false }}>
    <CommStack.Screen name="Messages" component={MessagesScreen} />
    <CommStack.Screen name="Notifications" component={NotificationsScreen} />
  </CommStack.Navigator>
);

// Profile Stack (placeholder for now)
const ProfileStack = createNativeStackNavigator();
const ProfileScreen = () => (
  <View className="flex-1 justify-center items-center bg-slate-50">
    <Text className="text-lg font-extrabold text-gray-800">Profile Screen</Text>
    <Text className="text-sm text-gray-500 mt-2">Coming soon...</Text>
  </View>
);
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

// Custom Tab Bar Icons
const HomeIcon = ({ focused }: { focused: boolean }) => (
  <View className="items-center">
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={focused ? '#0284C7' : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
      <Polyline points="9 22 9 12 15 12 15 22" stroke={focused ? '#0284C7' : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  </View>
);

const MessageIcon = ({ focused, hasBadge }: { focused: boolean; hasBadge?: boolean }) => (
  <View className="items-center">
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={focused ? '#0284C7' : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
    {hasBadge && <View className="absolute top-[-2px] right-[-4px] w-[10px] h-[10px] rounded-[5px] bg-red-500 border-2 border-white" />}
  </View>
);

const ProfileIcon = ({ focused }: { focused: boolean }) => (
  <View className="items-center">
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={focused ? '#0284C7' : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="12" cy="7" r="4" stroke={focused ? '#0284C7' : '#D1D5DB'} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
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
        tabBarActiveTintColor: '#0284C7',
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
