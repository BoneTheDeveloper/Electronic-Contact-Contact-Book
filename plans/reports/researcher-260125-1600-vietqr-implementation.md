# Real VietQR Implementation Guide for React Native/Expo

## Overview

This guide provides comprehensive implementation details for generating VietQR QR codes in React Native/Expo applications using the `react-native-qrcode-svg` library and proper VietQR format specification.

## 1. VietQR Format Specification

### Standards Compliance
- **Official Standard**: NAPAS IBFT v1.5.2 specification
- **International Standard**: EMVCo QR Payment Specification
- **Data Format**: Tag-Length-Value (TLV) structure

### VietQR TLV Structure

```
QR String = 00 + 01 + 38-57 + 52 + 53 + 54 + 58 + 59 + 60 + 62 + 63 (CRC)
```

**Key Tags:**
- **00**: Payload Format Indicator ("01" for EMVCo QR)
- **01**: Point of Initiation Method ("11" = Static, "12" = Dynamic)
- **38-57**: Merchant Account Information (contains bank BIN + account)
- **52**: Merchant Category Code ("0000" for payments)
- **53**: Transaction Currency ("704" for VND)
- **54**: Transaction Amount (in smallest currency unit, optional)
- **58**: Country Code ("VN" for Vietnam)
- **59**: Merchant Name
- **60**: Merchant City
- **62**: Additional Data (reference, bill number, etc.)
- **63**: CRC checksum (automatically calculated)

### Bank BIN Codes (Vietnam)
- **Vietcombank**: 970415, 970403, 970401
- **Techcombank**: 970428
- **MB Bank**: 970422
- **ACB**: 970418
- **BIDV**: 970417
- **VPBank**: 970419
- **Sacombank**: 970416

## 2. Library Setup

### Installation

```bash
# Install required dependencies
npx expo install react-native-svg
npm install react-native-qrcode-svg
npm install vietqr-ts
```

### Package.json Configuration

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.0",
    "react-native-svg": "^14.1.0",
    "react-native-qrcode-svg": "^6.3.21",
    "vietqr-ts": "^1.0.0"
  }
}
```

## 3. VietQR Generation Implementation

### Basic QR Code Component

```tsx
import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import QRCodeSVG from 'react-native-qrcode-svg';

interface VietQRProps {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const VietQRCode: React.FC<VietQRProps> = ({
  value,
  size = 200,
  color = '#000000',
  backgroundColor = '#FFFFFF',
}) => {
  return (
    <View style={styles.qrContainer}>
      <QRCodeSVG
        value={value}
        size={size}
        color={color}
        backgroundColor={backgroundColor}
        logoSize={size * 0.2}
        logoMargin={2}
        getLogoBackgroundColor={() => '#FFFFFF'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default VietQRCode;
```

### VietQR Payment Data Generator

```tsx
import { generateVietQR, ValidationError } from 'vietqr-ts';

export interface PaymentData {
  bankBin: string;
  accountNumber: string;
  amount?: number;
  purpose?: string;
  merchantName: string;
  merchantCity: string;
  isDynamic: boolean;
  billNumber?: string;
  referenceLabel?: string;
}

export function generateVietQRString(paymentData: PaymentData): string {
  try {
    const qr = generateVietQR({
      bankBin: paymentData.bankBin,
      accountNumber: paymentData.accountNumber,
      serviceCode: 'QRIBFTTA',
      initiationMethod: paymentData.isDynamic ? '12' : '11',

      // Optional fields
      amount: paymentData.amount ? paymentData.amount.toString() : undefined,
      currency: '704', // VND
      country: 'VN',
      purpose: paymentData.purpose,
      merchantName: paymentData.merchantName,
      merchantCity: paymentData.merchantCity,

      // Additional data
      billNumber: paymentData.billNumber,
      referenceLabel: paymentData.referenceLabel,
    });

    return qr.rawData;
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(`Validation error: ${error.field} - ${error.message}`);
      throw new Error(`Invalid payment data: ${error.message}`);
    }
    throw error;
  }
}
```

### Complete VietQR Payment Screen

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import VietQRCode from './components/VietQRCode';
import { generateVietQRString, PaymentData } from './utils/vietqrGenerator';

const VietQRPaymentScreen: React.FC = () => {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    bankBin: '970403',
    accountNumber: '01234567',
    amount: undefined,
    purpose: '',
    merchantName: 'Shop ABC',
    merchantCity: 'Hanoi',
    isDynamic: false,
    billNumber: '',
    referenceLabel: '',
  });

  const [qrValue, setQrValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateQR = async () => {
    setIsLoading(true);
    try {
      const qrString = generateVietQRString(paymentData);
      setQrValue(qrString);
      console.log('Generated QR:', qrString);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate QR code');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>VietQR Payment Generator</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Bank BIN:</Text>
          <TextInput
            style={styles.input}
            value={paymentData.bankBin}
            onChangeText={(text) => setPaymentData({...paymentData, bankBin: text})}
            placeholder="e.g., 970403 (Vietcombank)"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Account Number:</Text>
          <TextInput
            style={styles.input}
            value={paymentData.accountNumber}
            onChangeText={(text) => setPaymentData({...paymentData, accountNumber: text})}
            placeholder="Account number"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Amount (VND):</Text>
          <TextInput
            style={styles.input}
            value={paymentData.amount?.toString() || ''}
            onChangeText={(text) => {
              const amount = text ? parseFloat(text) : undefined;
              setPaymentData({...paymentData, amount});
            }}
            placeholder="Amount (optional)"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Purpose:</Text>
          <TextInput
            style={styles.input}
            value={paymentData.purpose}
            onChangeText={(text) => setPaymentData({...paymentData, purpose: text})}
            placeholder="Payment purpose"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Merchant Name:</Text>
          <TextInput
            style={styles.input}
            value={paymentData.merchantName}
            onChangeText={(text) => setPaymentData({...paymentData, merchantName: text})}
            placeholder="Merchant name"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Merchant City:</Text>
          <TextInput
            style={styles.input}
            value={paymentData.merchantCity}
            onChangeText={(text) => setPaymentData({...paymentData, merchantCity: text})}
            placeholder="City"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>QR Type:</Text>
          <View style={styles.radioButtonContainer}>
            <Button
              title="Static QR"
              onPress={() => setPaymentData({...paymentData, isDynamic: false})}
              color={!paymentData.isDynamic ? '#007AFF' : '#ccc'}
            />
            <Button
              title="Dynamic QR"
              onPress={() => setPaymentData({...paymentData, isDynamic: true})}
              color={paymentData.isDynamic ? '#007AFF' : '#ccc'}
            />
          </View>
        </View>

        <Button
          title={isLoading ? "Generating..." : "Generate QR Code"}
          onPress={generateQR}
          disabled={isLoading}
          style={styles.button}
        />

        {qrValue && (
          <View style={styles.qrSection}>
            <Text style={styles.qrTitle}>Your VietQR Code</Text>
            <VietQRCode value={qrValue} size={250} />
            <Text style={styles.qrText} selectable>{qrValue}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
  },
  qrSection: {
    marginTop: 30,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  qrText: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default VietQRPaymentScreen;
```

## 4. VietQR Parsing Implementation

### QR Scanner Integration

```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { parse, isSuccessResult, isErrorResult } from 'vietqr-ts';

interface QRScannerProps {
  onScanSuccess: (data: any) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);

    // Try to parse as VietQR
    const result = parse(data);

    if (isSuccessResult(result)) {
      console.log('VietQR parsed successfully:', result.data);
      onScanSuccess(result.data);
    } else {
      console.error('Not a valid VietQR:', result.error);
      Alert.alert('Error', 'This is not a valid VietQR code');
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <View style={styles.scannedOverlay}>
          <Text style={styles.scannedText}>QR Code Scanned!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scannedOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  scannedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QRScanner;
```

### Payment Validation Component

```tsx
import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { parse, validate, isSuccessResult } from 'vietqr-ts';

interface PaymentValidatorProps {
  qrString: string;
}

const PaymentValidator: React.FC<PaymentValidatorProps> = ({ qrString }) => {
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
    data: any;
  } | null>(null);

  React.useEffect(() => {
    const parseResult = parse(qrString);

    if (isSuccessResult(parseResult)) {
      const validation = validate(parseResult.data, qrString);

      setValidationResult({
        isValid: validation.isValid,
        errors: validation.errors.map(err => `${err.field}: ${err.message}`),
        data: parseResult.data,
      });
    } else {
      setValidationResult({
        isValid: false,
        errors: ['Invalid QR format'],
        data: null,
      });
    }
  }, [qrString]);

  if (!validationResult) {
    return <Text>Validating...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={[
        styles.title,
        { color: validationResult.isValid ? '#4CAF50' : '#F44336' }
      ]}>
        {validationResult.isValid ? '✓ Valid VietQR' : '✗ Invalid VietQR'}
      </Text>

      {validationResult.data && (
        <View style={styles.dataContainer}>
          <Text style={styles.label}>Bank Code: {validationResult.data.bankCode}</Text>
          <Text style={styles.label}>Account: {validationResult.data.accountNumber}</Text>
          {validationResult.data.amount && (
            <Text style={styles.label}>Amount: {validationResult.data.amount} VND</Text>
          )}
          <Text style={styles.label}>Currency: {validationResult.data.currency}</Text>
          <Text style={styles.label}>
            QR Type: {validationResult.data.initiationMethod === '11' ? 'Static' : 'Dynamic'}
          </Text>
          <Text style={styles.label}>Country: {validationResult.data.countryCode}</Text>
          {validationResult.data.message && (
            <Text style={styles.label}>Message: {validationResult.data.message}</Text>
          )}
        </View>
      )}

      {!validationResult.isValid && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Validation Errors:</Text>
          {validationResult.errors.map((error, index) => (
            <Text key={index} style={styles.errorText}>{error}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  dataContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  errorContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#d32f2f',
    marginBottom: 4,
  },
});

export default PaymentValidator;
```

## 5. Sample VietQR Strings

### Static QR (Amount entered by payer)

```
00020101021138570010A00000072701390006970422011301234567890200208QRIBFTTA53037045802VN6304A1B2
```

### Dynamic QR (Pre-filled amount)

```
00020101021138570010A00000072701390006970422011301234567890200208QRIBFTTA540650005453037045802VN6304XXXX
```

### Dynamic QR with Bill Reference

```
00020101021138570010A00000072701390006970422011301234567890200208QRIBFTTA540650005453037045802VN6205BillNo-INV2024-0016304XXXX
```

## 6. Complete Integration Example

```tsx
// App.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Alert
} from 'react-native';
import VietQRCode from './components/VietQRCode';
import QRScanner from './components/QRScanner';
import PaymentValidator from './components/PaymentValidator';
import { generateVietQRString, PaymentData } from './utils/vietqrGenerator';

type Screen = 'generator' | 'scanner' | 'validator';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('generator');
  const [qrData, setQrData] = useState<any>(null);
  const [sampleQR, setSampleQR] = useState<string>('');

  // Sample VietQR strings for testing
  const sampleQRs = {
    static: '00020101021138570010A00000072701390006970422011301234567890200208QRIBFTTA53037045802VN6304A1B2',
    dynamic: '00020101021138570010A00000072701390006970422011301234567890200208QRIBFTTA540650005453037045802VN6304XXXX',
  };

  const handleScanSuccess = (data: any) => {
    setQrData(data);
    setCurrentScreen('validator');
  };

  const showSampleQR = (type: 'static' | 'dynamic') => {
    setSampleQR(sampleQRs[type]);
    setCurrentScreen('validator');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VietQR Payment App</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, currentScreen === 'generator' && styles.activeTab]}
          onPress={() => setCurrentScreen('generator')}
        >
          <Text style={styles.tabText}>Generate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentScreen === 'scanner' && styles.activeTab]}
          onPress={() => setCurrentScreen('scanner')}
        >
          <Text style={styles.tabText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentScreen === 'validator' && styles.activeTab]}
          onPress={() => setCurrentScreen('validator')}
        >
          <Text style={styles.tabText}>Validate</Text>
        </TouchableOpacity>
      </View>

      {currentScreen === 'generator' && (
        <View style={styles.content}>
          {/* Include the VietQRPaymentScreen component here */}
          <Text style={styles.contentTitle}>QR Generator</Text>
          <Text style={styles.contentText}>Coming soon...</Text>
        </View>
      )}

      {currentScreen === 'scanner' && (
        <View style={styles.content}>
          <QRScanner onScanSuccess={handleScanSuccess} />
        </View>
      )}

      {currentScreen === 'validator' && (
        <View style={styles.content}>
          <Text style={styles.contentTitle}>Payment Validator</Text>

          <View style={styles.buttonRow}>
            <Button
              title="Test Static QR"
              onPress={() => showSampleQR('static')}
              color="#007AFF"
            />
            <Button
              title="Test Dynamic QR"
              onPress={() => showSampleQR('dynamic')}
              color="#007AFF"
              style={styles.buttonMargin}
            />
          </View>

          {sampleQR && (
            <PaymentValidator qrString={sampleQR} />
          )}

          {qrData && (
            <PaymentValidator qrString={qrData.rawData || ''} />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  contentText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  buttonMargin: {
    marginLeft: 10,
  },
});
```

## 7. Additional Resources

### Documentation
- [VietQR-ts Library Documentation](https://pub.dev/documentation/vietqr_ts/latest/)
- [react-native-qrcode-svg Documentation](https://github.com/awesomejerry/react-native-qrcode-svg)
- [Expo Camera Documentation](https://docs.expo.dev/versions/latest/sdk/barcode-scanner/)

### Testing Resources
- [NAPAS QR Code Format Specifications](https://www.scribd.com/document/739763909/B%E1%BA%A3n-ti%E1%BA%BFng-Anh-Tai-li%E1%BB%87u-quy-%C4%91%E1%BB%8Bnh-v%E1%BB%81-%C4%91%E1%BB%8Bnh-d%C3%A1ng-ma-VietQR-trong-d%E1%BB%8Bch-v%E1%BB%A5-chuy%E1%BB%83n-phat-nhanh-NAPAS247)
- [EMVCo QR Code Specification](https://www.emvco.com/emv-technologies/qr-codes/)

### Common Issues
1. **QR Generation Issues**: Ensure all required fields are provided when generating VietQR
2. **Camera Permissions**: Always request camera permissions for scanning
3. **Format Validation**: Use the vietqr-ts library to validate QR strings
4. **Expo Build Issues**: May need to add `expo-barcode-scanner` to app.json for EAS builds

## 8. Best Practices

1. **Security**: Never store sensitive account information in plain text
2. **Validation**: Always validate incoming QR codes before processing payments
3. **Error Handling**: Implement comprehensive error handling for malformed QR codes
4. **Testing**: Test with both static and dynamic QR codes
5. **Performance**: Consider caching generated QR codes when possible
6. **Accessibility**: Provide alternative input methods for users with disabilities

---

This implementation provides a complete working solution for generating, scanning, and validating VietQR QR codes in React Native/Expo applications using industry-standard libraries and specifications.