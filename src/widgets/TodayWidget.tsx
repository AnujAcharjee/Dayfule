import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export interface TodayWidgetTask {
  id: string;
  title: string;
  completed: number;
}

export interface TodayWidgetProps {
  tasks?: TodayWidgetTask[];
  dateStr?: string;
  isBreak?: boolean;
  isExam?: boolean;
}

export function TodayWidget({
  tasks = [],
  isBreak = false,
  isExam = false,
}: TodayWidgetProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed === 1).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const previewTasks = tasks.slice(0, 4);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#121214',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderColor: '#26262B',
        borderWidth: 1,
      }}
      clickAction="OPEN_APP"
    >
      {/* Header Row */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 'match_parent',
          marginBottom: 6,
        }}
      >
        <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextWidget
            text="DAYFULE"
            style={{
              fontSize: 13,
              fontWeight: 'bold',
              color: '#FF6D00',
              fontFamily: 'serif',
            }}
          />
          <TextWidget
            text=" · Today"
            style={{
              fontSize: 12,
              color: '#A1A1AA',
            }}
          />
        </FlexWidget>

        {/* Status indicator badge */}
        {isBreak ? (
          <FlexWidget
            style={{
              backgroundColor: '#FF8DA1',
              paddingHorizontal: 7,
              paddingVertical: 2,
              borderRadius: 6,
            }}
          >
            <TextWidget
              text="BREAK"
              style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: '#FFFFFF',
              }}
            />
          </FlexWidget>
        ) : isExam ? (
          <FlexWidget
            style={{
              backgroundColor: '#FFD600',
              paddingHorizontal: 7,
              paddingVertical: 2,
              borderRadius: 6,
            }}
          >
            <TextWidget
              text="EXAMS"
              style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: '#000000',
              }}
            />
          </FlexWidget>
        ) : (
          <FlexWidget
            style={{
              backgroundColor: '#1C1C20',
              borderColor: total > 0 && completed === total ? '#2ECC71' : '#33333C',
              borderWidth: 1,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 6,
            }}
          >
            <TextWidget
              text={total > 0 ? `${pct}% (${completed}/${total})` : '0 Tasks'}
              style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: total > 0 && completed === total ? '#2ECC71' : '#E4E4E7',
              }}
            />
          </FlexWidget>
        )}
      </FlexWidget>

      {/* Task List or Empty State */}
      <FlexWidget
        style={{
          flexDirection: 'column',
          width: 'match_parent',
          flex: 1,
          justifyContent: previewTasks.length > 0 ? 'flex-start' : 'center',
        }}
      >
        {previewTasks.length === 0 ? (
          <FlexWidget
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 'match_parent',
              paddingVertical: 8,
            }}
          >
            <TextWidget
              text={
                isBreak
                  ? 'Enjoy your break today!'
                  : isExam
                  ? 'Exam day active. Best of luck!'
                  : 'No tasks yet today'
              }
              style={{
                fontSize: 12,
                color: '#71717A',
                textAlign: 'center',
              }}
            />
          </FlexWidget>
        ) : (
          previewTasks.map((t, idx) => (
            <FlexWidget
              key={t.id || idx.toString()}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 'match_parent',
                paddingVertical: 3,
              }}
            >
              <TextWidget
                text={t.completed === 1 ? '✓ ' : '○ '}
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: t.completed === 1 ? '#2ECC71' : '#71717A',
                }}
              />
              <FlexWidget style={{ flex: 1 }}>
                <TextWidget
                  text={t.title}
                  style={{
                    fontSize: 12,
                    color: t.completed === 1 ? '#71717A' : '#FAFAFA',
                  }}
                  maxLines={1}
                />
              </FlexWidget>
            </FlexWidget>
          ))
        )}
        {total > 4 ? (
          <TextWidget
            text={`+${total - 4} more`}
            style={{
              fontSize: 10,
              color: '#71717A',
              marginTop: 2,
              marginLeft: 14,
            }}
          />
        ) : null}
      </FlexWidget>
    </FlexWidget>
  );
}
