import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { TodayWidget } from './TodayWidget';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetAction, renderWidget } = props;

  switch (widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
      // Render widget with empty/placeholder state until app synchronizes data
      renderWidget(<TodayWidget tasks={[]} />);
      break;

    case 'WIDGET_CLICK':
      // App launch via OPEN_APP is handled natively
      break;

    case 'WIDGET_DELETED':
      break;
  }
}
