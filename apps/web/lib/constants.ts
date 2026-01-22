// ==================== APP CONSTANTS ====================
// Application-wide constants

// Grade level contract for middle school (THCS grades 6-9)
export const SUPPORTED_GRADES = ['6', '7', '8', '9']

// Class ID pattern validation for grades 6-9
export const CLASS_ID_PATTERN = /^[6-9][A-Z]\d*$/

// Vietnamese grade labels for display
export const GRADE_LABELS_VN: Record<string, string> = {
  '6': 'Khối 6',
  '7': 'Khối 7',
  '8': 'Khối 8',
  '9': 'Khối 9'
}
