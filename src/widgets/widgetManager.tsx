import React from 'react';
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Task } from '@/types';

// Check if running in a standalone / development build on Android (not in Expo Go sandbox)
export const isWidgetSupported =
  Platform.OS === 'android' &&
  Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

/**
 * Registers the Android Widget Task Handler at startup.
 * Safely bypassed in Expo Go to prevent native runtime crashes.
 */
export function registerWidgets(): void {
  if (!isWidgetSupported) {
    return;
  }

  try {
    const { registerWidgetTaskHandler } = require('react-native-android-widget');
    const { widgetTaskHandler } = require('./widgetTaskHandler');
    registerWidgetTaskHandler(widgetTaskHandler);
  } catch (err) {
    console.warn('[Widgets] Registration skipped or failed:', err);
  }
}

/**
 * Synchronizes today's tasks and status to the Android Home Screen Widget.
 */
export async function syncTodayWidget(
  tasks: Task[],
  isBreak: boolean = false,
  isExam: boolean = false
): Promise<void> {
  if (!isWidgetSupported) {
    return;
  }

  try {
    const { requestWidgetUpdate } = require('react-native-android-widget');
    const { TodayWidget } = require('./TodayWidget');

    const widgetTasks = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      completed: t.completed,
    }));

    await requestWidgetUpdate({
      widgetName: 'TodayWidget',
      renderWidget: () => (
        <TodayWidget
          tasks={widgetTasks}
          isBreak={isBreak}
          isExam={isExam}
        />
      ),
    });
  } catch (err) {
    console.warn('[Widgets] Failed to synchronize widget:', err);
  }
}

/**
 * Requests the Android system to pin the Dayfule Today widget to the user's home screen.
 * Returns true if request was handed off to Android system, false otherwise.
 */
export async function pinTodayWidget(): Promise<boolean> {
  if (!isWidgetSupported) {
    return false;
  }

  try {
    const { requestPinWidget } = require('react-native-android-widget');
    await requestPinWidget({
      widgetName: 'TodayWidget',
    });
    return true;
  } catch (err) {
    console.warn('[Widgets] Pin widget request failed:', err);
    return false;
  }
}
