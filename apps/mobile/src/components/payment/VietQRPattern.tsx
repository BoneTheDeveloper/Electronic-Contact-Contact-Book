/**
 * VietQR Visual Pattern Component
 * Renders a realistic QR code visual pattern based on VietQR string
 * This is a visual representation - for actual scannable QR, use react-native-qrcode-svg
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

export interface VietQRPatternProps {
  qrString: string;
  size?: number;
  cellSize?: number;
}

export const VietQRPattern: React.FC<VietQRPatternProps> = ({
  qrString,
  size = 204,
  cellSize = 8,
}) => {
  // Calculate QR code dimensions
  const qrSize = 25; // Standard 25x25 QR grid for compact VietQR
  const actualSize = qrSize * cellSize;
  const offset = (size - actualSize) / 2;

  // Generate QR pattern cells
  const renderQRPattern = () => {
    const cells = [];

    for (let i = 0; i < qrSize; i++) {
      for (let j = 0; j < qrSize; j++) {
        const cellStyle = getCellStyle(i, j, qrSize, qrString);
        cells.push(
          <View
            key={`${i}-${j}`}
            style={[
              styles.qrCell,
              {
                width: cellSize,
                height: cellSize,
                left: offset + j * cellSize,
                top: offset + i * cellSize,
              },
              cellStyle,
            ]}
          />
        );
      }
    }
    return cells;
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {renderQRPattern()}
    </View>
  );
};

/**
 * Determine cell style based on QR code standards
 */
const getCellStyle = (
  row: number,
  col: number,
  size: number,
  qrString: string
) => {
  // Finder patterns (corners) - 7x7 position markers
  const isTopLeft = row < 7 && col < 7;
  const isTopRight = row < 7 && col >= size - 7;
  const isBottomLeft = row >= size - 7 && col < 7;

  // Finder pattern outer border (7x7) - DARK
  const isFinderOuter =
    (isTopLeft && (row === 0 || row === 6 || col === 0 || col === 6)) ||
    (isTopRight && (row === 0 || row === 6 || col === size - 7 || col === size - 1)) ||
    (isBottomLeft && (row === size - 7 || row === size - 1 || col === 0 || col === 6));

  // Finder pattern inner (3x3) - DARK
  const isFinderInner =
    (isTopLeft && row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
    (isTopRight && row >= 2 && row <= 4 && col >= size - 5 && col <= size - 3) ||
    (isBottomLeft && row >= size - 5 && row <= size - 3 && col >= 2 && col <= 4);

  // Timing patterns (dotted lines) - alternating
  const isTimingRow = row === 6 && col >= 6 && col < size - 7;
  const isTimingCol = col === 6 && row >= 6 && row < size - 7;

  // Check for dark cells first (highest priority)
  if (isFinderOuter || isFinderInner) {
    return styles.qrCellDark;
  }

  // Timing pattern - alternating dark/light
  if (isTimingRow || isTimingCol) {
    return (row + col) % 2 === 0 ? styles.qrCellDark : styles.qrCellLight;
  }

  // Data area - generate pattern from QR string
  const isDataArea = !isTopLeft && !isTopRight && !isBottomLeft;
  if (isDataArea) {
    const index = row * size + col;
    const charCode = qrString.charCodeAt(index % qrString.length);
    // Simple deterministic pattern - more dark cells for visual QR appearance
    return (charCode % 2 === 0) ? styles.qrCellDark : styles.qrCellLight;
  }

  return styles.qrCellLight;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  qrCell: {
    position: 'absolute',
  },
  qrCellDark: {
    backgroundColor: '#000000',
  },
  qrCellLight: {
    backgroundColor: '#FFFFFF',
  },
});
