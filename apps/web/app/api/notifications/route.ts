/**
 * Notification API Routes (Admin)
 * GET /api/notifications - List all notifications (admin only)
 * POST /api/notifications - Create new notification (admin only)
 * DELETE /api/notifications?id={id} - Delete notification (admin only)
 */

import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import {
  createNotification,
  getNotifications,
} from '@/lib/services/notification-service';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/notifications - List notifications (admin only)
 */
export async function GET(request: Request) {
  try {
    const user = await requireRole('admin');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await getNotifications({ page, limit });

    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.total,
      page,
      limit,
    });
  } catch (error: unknown) {
    console.error('[API] GET /api/notifications error:', error);
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
 * POST /api/notifications - Create notification (admin only)
 */
export async function POST(request: Request) {
  try {
    const user = await requireRole('admin');

    const body = await request.json();

    // Validate required fields
    if (!body.title?.trim() || !body.content?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title and content are required',
        },
        { status: 400 }
      );
    }

    if (!body.category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category is required (announcement, emergency, reminder, system)',
        },
        { status: 400 }
      );
    }

    if (!body.targetRole) {
      return NextResponse.json(
        {
          success: false,
          message: 'Target role is required (admin, teacher, parent, student, all)',
        },
        { status: 400 }
      );
    }

    const notification = await createNotification(body, user.id);

    return NextResponse.json(
      {
        success: true,
        data: notification,
        message: 'Notification created successfully',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('[API] POST /api/notifications error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create notification';
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
 * DELETE /api/notifications?id={id} - Delete notification (admin only)
 */
export async function DELETE(request: Request) {
  try {
    const user = await requireRole('admin');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Notification ID is required',
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Delete notification (cascade will delete recipients and logs)
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id' as const, id as any);

    if (error) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error: unknown) {
    console.error('[API] DELETE /api/notifications error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete notification';
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
