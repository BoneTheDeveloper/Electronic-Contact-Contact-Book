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

  // Finder pattern outer border (7x7)
  const isFinderOuter =
    (isTopLeft && (row === 0 || row === 6 || col === 0 || col === 6)) ||
    (isTopRight && (row === 0 || row === 6 || col === size - 7 || col === size - 1)) ||
    (isBottomLeft && (row === size - 7 || row === size - 1 || col === 0 || col === 6));

  // Finder pattern inner (3x3)
  const isFinderInner =
    (isTopLeft && row > 1 && row < 5 && col > 1 && col < 5) ||
    (isTopRight && row > 1 && row < 5 && col > size - 5 && col < size - 1) ||
    (isBottomLeft && row > size - 5 && row < size - 1 && col > 1 && col < 5);

  // Finder pattern white border
  const isFinderWhite =
    (isTopLeft && row >= 0 && row <= 6 && col >= 0 && col <= 6 && !isFinderOuter && !isFinderInner) ||
    (isTopRight && row >= 0 && row <= 6 && col >= size - 7 && col <= size - 1 && !isFinderOuter && !isFinderInner) ||
    (isBottomLeft && row >= size - 7 && row <= size - 1 && col >= 0 && col <= 6 && !isFinderOuter && !isFinderInner);

  // Timing patterns (dotted lines between finder patterns)
  const isTimingRow = row === 6 && !isTopLeft && !isTopRight;
  const isTimingCol = col === 6 && !isTopLeft && !isBottomLeft;

  // Alignment pattern (if applicable for larger QR codes)
  const isAlignmentPattern =
    !isTopLeft && !isTopRight && !isBottomLeft &&
    row >= size - 9 && row <= size - 1 &&
    col >= size - 9 && col <= size - 1;

  // Data area - generate pattern from QR string
  const isDataArea = !isTopLeft && !isTopRight && !isBottomLeft && !isTimingRow && !isTimingCol && !isAlignmentPattern;

  if (isFinderOuter) {
    return styles.qrCellDark;
  }

  if (isFinderInner) {
    return styles.qrCellDark;
  }

  if (isFinderWhite) {
    return styles.qrCellLight;
  }

  if (isAlignmentPattern) {
    const alignRow = row - (size - 9);
    const alignCol = col - (size - 9);
    // 5x5 alignment pattern
    if (alignRow === 0 || alignRow === 4 || alignCol === 0 || alignCol === 4) {
      return styles.qrCellDark;
    }
    if (alignRow > 0 && alignRow < 4 && alignCol > 0 && alignCol < 4) {
      return styles.qrCellLight;
    }
  }

  if (isTimingRow || isTimingCol) {
    return (row + col) % 2 === 0 ? styles.qrCellDark : styles.qrCellLight;
  }

  if (isDataArea) {
    // Use QR string to generate deterministic pattern
    const index = row * size + col;
    const charIndex = index % qrString.length;
    const charCode = qrString.charCodeAt(charIndex);

    // Create a more realistic data distribution
    // Use different methods based on position for variety
    const method = (row + col) % 4;

    switch (method) {
      case 0:
        return (charCode % 3) > 0 ? styles.qrCellDark : styles.qrCellLight;
      case 1:
        return ((charCode * (row + 1)) % 5) > 1 ? styles.qrCellDark : styles.qrCellLight;
      case 2:
        return ((charCode + col) % 4) > 0 ? styles.qrCellDark : styles.qrCellLight;
      default:
        return ((charCode * (col + 1) + row) % 3) > 0 ? styles.qrCellDark : styles.qrCellLight;
    }
  }

  return styles.qrCellLight;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  qrCell: {
    position: 'absolute',
  },
  qrCellDark: {
    backgroundColor: '#1F2937',
  },
  qrCellLight: {
    backgroundColor: '#FFFFFF',
  },
});
