/**
 * My Notifications API Routes
 * GET /api/notifications/my - Get current user's notifications
 * PATCH /api/notifications/my - Mark notifications as read
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  getMyNotifications,
  markAsRead,
} from '@/lib/services/notification-service';

/**
 * GET /api/notifications/my - Get current user's notifications
 */
export async function GET(request: Request) {
  try {
    const user = await requireAuth();

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const notifications = await getMyNotifications(user.id, unreadOnly);

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error: unknown) {
    console.error('[API] GET /api/notifications/my error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications';
    const errorStatus = (error as { status?: number }).status || 500;

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: errorStatus }
    );
  }
}

/**
 * PATCH /api/notifications/my - Mark notifications as read
 */
export async function PATCH(request: Request) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const { notificationIds } = body as { notificationIds: string[] };

    if (!Array.isArray(notificationIds)) {
      return NextResponse.json(
        {
          success: false,
          message: 'notificationIds must be an array',
        },
        { status: 400 }
      );
    }

    if (notificationIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'At least one notification ID is required',
        },
        { status: 400 }
      );
    }

    await markAsRead(notificationIds, user.id);

    return NextResponse.json({
      success: true,
      message: 'Notifications marked as read',
    });
  } catch (error: unknown) {
    console.error('[API] PATCH /api/notifications/my error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to mark notifications as read';
    const errorStatus = (error as { status?: number }).status || 500;

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: errorStatus }
    );
  }
}
