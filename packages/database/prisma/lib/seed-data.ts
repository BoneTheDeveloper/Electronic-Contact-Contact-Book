// Vietnamese names and realistic data generators for seed script

export const vietnameseFirstNames = [
  'Anh', 'Bảo', 'Chi', 'Dũng', 'Giang', 'Hải', 'Hương', 'Khánh',
  'Lan', 'Minh', 'Nam', 'Oanh', 'Phong', 'Quang', 'Sơn', 'Thảo',
  'Thịnh', 'Tuấn', 'Vy', 'Yến', 'Hà', 'Hùng', 'Linh', 'Mai',
  'Ngọc', 'Phúc', 'Quyên', 'Sáng', 'Thị', 'Trung', 'Vân', 'Xuân'
];

export const vietnameseLastNames = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ',
  'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'
];

export const vietnameseMiddleNames = [
  'Văn', 'Thị', 'Đình', 'Thái', 'Minh', 'Quốc', 'Gia', 'Tuấn',
  'Thanh', 'Hoàng', 'Nhật', 'Phương', 'Kim', 'Xuân', 'Hồng', 'Công'
];

export const subjectNames = [
  { name: 'Toán', code: 'MATH' },
  { name: 'Ngữ Văn', code: 'LIT' },
  { name: 'Tiếng Anh', code: 'ENG' },
  { name: 'Vật Lý', code: 'PHY' },
  { name: 'Hóa Học', code: 'CHEM' },
  { name: 'Sinh Học', code: 'BIO' },
  { name: 'Lịch Sử', code: 'HIST' },
  { name: 'Địa Lý', code: 'GEO' }
];

export const classConfigs = [
  { name: '9A', gradeLevel: 9 },
  { name: '9B', gradeLevel: 9 },
  { name: '10A', gradeLevel: 10 },
  { name: '10B', gradeLevel: 10 }
];

export const cities = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng',
  'Cần Thơ', 'Huế', 'Nha Trang', 'Buôn Ma Thuột'
];

export function generateVietnameseName(): string {
  const lastName = vietnameseLastNames[Math.floor(Math.random() * vietnameseLastNames.length)];
  const middleName = vietnameseMiddleNames[Math.floor(Math.random() * vietnameseMiddleNames.length)];
  const firstName = vietnameseFirstNames[Math.floor(Math.random() * vietnameseFirstNames.length)];
  return `${lastName} ${middleName} ${firstName}`;
}

export function generateEmail(name: string, domain: string = 'econtact.vn'): string {
  // Remove spaces and convert to lowercase
  const cleanName = name.toLowerCase().replace(/\s+/g, '.');
  return `${cleanName}@${domain}`;
}

export function generatePhone(): string {
  // Vietnamese phone number format: 0xx xxx xxxx
  const prefixes = ['090', '091', '093', '094', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const middle = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const last = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${middle}${last}`;
}

export function generateAddress(): string {
  const streetNumbers = Math.floor(Math.random() * 500) + 1;
  const streetNames = ['Đường Nguyễn Huệ', 'Đường Lê Lợi', 'Đường Trần Phú', 'Đường Quang Trung', 'Đường Hai Bà Trưng'];
  const wards = ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5'];
  const districts = ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 10', 'Quận Tân Bình'];
  const city = cities[Math.floor(Math.random() * cities.length)];

  const street = streetNames[Math.floor(Math.random() * streetNames.length)];
  const ward = wards[Math.floor(Math.random() * wards.length)];
  const district = districts[Math.floor(Math.random() * districts.length)];

  return `${streetNumbers} ${street}, ${ward}, ${district}, ${city}`;
}

export function generateScore(min: number = 5, max: number = 10): number {
  // Generate scores weighted towards better performance
  const score = Math.random() * (max - min) + min;
  return Math.round(score * 10) / 10;
}

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function generateDateInPast(daysBack: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date;
}

export function generateDateInRange(startDate: Date, endDate: Date): Date {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return new Date(start + Math.random() * (end - start));
}
