/**
 * Debug Logs Screen
 * Shows all logged messages for debugging in Expo Go
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text as RNText,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logger, LogEntry } from '@/lib/logger';

const DebugLogsScreen: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // Update logs every second
    const interval = setInterval(() => {
      setLogs(logger.getLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = filter
    ? logs.filter((log) =>
        log.tag.toLowerCase().includes(filter.toLowerCase()) ||
        log.message.toLowerCase().includes(filter.toLowerCase())
      )
    : logs;

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return '#EF4444';
      case 'warn': return '#F59E0B';
      case 'info': return '#3B82F6';
      case 'debug': return '#6B7280';
      default: return '#1F2937';
    }
  };

  const copyLogs = () => {
    const logsText = logger.getLogsAsString();
    console.log('=== COPY THESE LOGS ===');
    console.log(logsText);
    console.log('=== END LOGS ===');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <RNText style={styles.title}>Debug Logs</RNText>
        <RNText style={styles.subtitle}>Total: {filteredLogs.length} entries</RNText>
      </View>

      <View style={styles.toolbar}>
        <TextInput
          value={filter}
          onChangeText={setFilter}
          style={styles.filterInput}
          placeholder="Filter by tag or message..."
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity onPress={() => logger.clearLogs()} style={styles.clearButton}>
          <RNText style={styles.clearButtonText}>Clear</RNText>
        </TouchableOpacity>
        <TouchableOpacity onPress={copyLogs} style={styles.copyButton}>
          <RNText style={styles.copyButtonText}>Copy to Console</RNText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.logsContainer}>
        {filteredLogs.reverse().map((log, index) => (
          <View key={index} style={[styles.logEntry, { borderLeftColor: getLogColor(log.level) }]}>
            <View style={styles.logHeader}>
              <RNText style={[styles.logTimestamp, { color: getLogColor(log.level) }]}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </RNText>
              <RNText style={[styles.logLevel, { color: getLogColor(log.level) }]}>
                {log.level.toUpperCase()}
              </RNText>
              <RNText style={styles.logTag}>
                [{log.tag}]
              </RNText>
            </View>
            <RNText style={styles.logMessage}>{log.message}</RNText>
            {log.data && (
              <RNText style={styles.logData}>
                {typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)}
              </RNText>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  toolbar: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  filterInput: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  copyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  logsContainer: {
    flex: 1,
    padding: 8,
  },
  logEntry: {
    backgroundColor: '#1E293B',
    borderLeftWidth: 4,
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  logTimestamp: {
    fontSize: 10,
    fontWeight: '600',
    marginRight: 8,
  },
  logLevel: {
    fontSize: 10,
    fontWeight: '700',
    marginRight: 8,
  },
  logTag: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  logMessage: {
    color: '#E2E8F0',
    fontSize: 12,
    marginBottom: 4,
  },
  logData: {
    color: '#94A3B8',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});

export default DebugLogsScreen;
