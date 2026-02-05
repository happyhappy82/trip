// 주차장 데이터 타입 정의 (공공데이터포털 전국무료주차장/공영주차장 표준 스키마 기반)

export interface ParkingLot {
  name: string;           // 주차장명
  type: '공영' | '민영';   // 주차장구분
  category: '노외' | '노상' | '부설'; // 주차장유형
  address: string;        // 소재지주소
  lat: number;            // 위도
  lng: number;            // 경도
  totalSpaces: number;    // 주차구획수
  isFree: boolean;        // 무료구분
  operatingDays: string;  // 운영요일
  weekdayOpen: string;    // 평일운영시작
  weekdayClose: string;   // 평일운영종료
  weekendOpen: string;    // 주말운영시작
  weekendClose: string;   // 주말운영종료
  holidayOpen: string;    // 공휴일운영시작
  holidayClose: string;   // 공휴일운영종료
  feeInfo: string;        // 요금정보
  phone: string;          // 전화번호
  updatedAt: string;      // 데이터기준일자
}

// 더미 데이터 - 추후 공공데이터포털 API로 교체
export const DUMMY_PARKING_DATA: ParkingLot[] = [
  {
    name: '종로구청 공영주차장',
    type: '공영',
    category: '노외',
    address: '서울특별시 종로구 종로1가 24',
    lat: 37.5704,
    lng: 126.9822,
    totalSpaces: 150,
    isFree: true,
    operatingDays: '평일+토요일+공휴일',
    weekdayOpen: '00:00',
    weekdayClose: '24:00',
    weekendOpen: '00:00',
    weekendClose: '24:00',
    holidayOpen: '00:00',
    holidayClose: '24:00',
    feeInfo: '무료',
    phone: '02-2148-1114',
    updatedAt: '2025-01-01',
  },
  {
    name: '광화문 공영주차장',
    type: '공영',
    category: '노외',
    address: '서울특별시 종로구 세종대로 175',
    lat: 37.5759,
    lng: 126.9769,
    totalSpaces: 800,
    isFree: false,
    operatingDays: '평일+토요일+공휴일',
    weekdayOpen: '06:00',
    weekdayClose: '24:00',
    weekendOpen: '06:00',
    weekendClose: '24:00',
    holidayOpen: '06:00',
    holidayClose: '24:00',
    feeInfo: '5분당 300원',
    phone: '02-735-7961',
    updatedAt: '2025-01-01',
  },
  {
    name: '남산공원 무료주차장',
    type: '공영',
    category: '노외',
    address: '서울특별시 중구 소파로 105',
    lat: 37.5512,
    lng: 126.9882,
    totalSpaces: 100,
    isFree: true,
    operatingDays: '평일+토요일+공휴일',
    weekdayOpen: '09:00',
    weekdayClose: '21:00',
    weekendOpen: '09:00',
    weekendClose: '21:00',
    holidayOpen: '09:00',
    holidayClose: '21:00',
    feeInfo: '무료',
    phone: '02-3783-5900',
    updatedAt: '2025-01-01',
  },
  {
    name: '성수동 공영주차장',
    type: '공영',
    category: '노상',
    address: '서울특별시 성동구 성수이로 51',
    lat: 37.5445,
    lng: 127.0566,
    totalSpaces: 60,
    isFree: true,
    operatingDays: '평일+토요일',
    weekdayOpen: '09:00',
    weekdayClose: '22:00',
    weekendOpen: '09:00',
    weekendClose: '22:00',
    holidayOpen: '',
    holidayClose: '',
    feeInfo: '무료',
    phone: '02-2286-5114',
    updatedAt: '2025-01-01',
  },
  {
    name: '해운대해수욕장 공영주차장',
    type: '공영',
    category: '노외',
    address: '부산광역시 해운대구 해운대해변로 264',
    lat: 35.1587,
    lng: 129.1604,
    totalSpaces: 1200,
    isFree: false,
    operatingDays: '평일+토요일+공휴일',
    weekdayOpen: '00:00',
    weekdayClose: '24:00',
    weekendOpen: '00:00',
    weekendClose: '24:00',
    holidayOpen: '00:00',
    holidayClose: '24:00',
    feeInfo: '10분당 500원 (성수기 10분당 1,000원)',
    phone: '051-749-4000',
    updatedAt: '2025-01-01',
  },
  {
    name: '광안리 무료주차장',
    type: '공영',
    category: '노상',
    address: '부산광역시 수영구 광안해변로 219',
    lat: 35.1531,
    lng: 129.1186,
    totalSpaces: 80,
    isFree: true,
    operatingDays: '평일+토요일+공휴일',
    weekdayOpen: '00:00',
    weekdayClose: '24:00',
    weekendOpen: '00:00',
    weekendClose: '24:00',
    holidayOpen: '00:00',
    holidayClose: '24:00',
    feeInfo: '무료',
    phone: '051-610-4000',
    updatedAt: '2025-01-01',
  },
  {
    name: '제주시청 공영주차장',
    type: '공영',
    category: '노외',
    address: '제주특별자치도 제주시 광양9길 10',
    lat: 33.4996,
    lng: 126.5312,
    totalSpaces: 300,
    isFree: false,
    operatingDays: '평일+토요일+공휴일',
    weekdayOpen: '08:00',
    weekdayClose: '22:00',
    weekendOpen: '08:00',
    weekendClose: '22:00',
    holidayOpen: '08:00',
    holidayClose: '22:00',
    feeInfo: '30분당 500원',
    phone: '064-728-2114',
    updatedAt: '2025-01-01',
  },
  {
    name: '한라산 무료주차장',
    type: '공영',
    category: '노외',
    address: '제주특별자치도 제주시 1100로 2070-61',
    lat: 33.3617,
    lng: 126.5292,
    totalSpaces: 200,
    isFree: true,
    operatingDays: '평일+토요일+공휴일',
    weekdayOpen: '05:00',
    weekdayClose: '20:00',
    weekendOpen: '05:00',
    weekendClose: '20:00',
    holidayOpen: '05:00',
    holidayClose: '20:00',
    feeInfo: '무료',
    phone: '064-713-9950',
    updatedAt: '2025-01-01',
  },
  {
    name: '강남역 공영주차장',
    type: '공영',
    category: '노외',
    address: '서울특별시 강남구 강남대로 396',
    lat: 37.4979,
    lng: 127.0276,
    totalSpaces: 500,
    isFree: false,
    operatingDays: '평일+토요일+공휴일',
    weekdayOpen: '00:00',
    weekdayClose: '24:00',
    weekendOpen: '00:00',
    weekendClose: '24:00',
    holidayOpen: '00:00',
    holidayClose: '24:00',
    feeInfo: '5분당 300원',
    phone: '02-3423-5114',
    updatedAt: '2025-01-01',
  },
  {
    name: '경포해변 무료주차장',
    type: '공영',
    category: '노외',
    address: '강원특별자치도 강릉시 창해로 514',
    lat: 37.8058,
    lng: 128.9080,
    totalSpaces: 400,
    isFree: true,
    operatingDays: '평일+토요일+공휴일',
    weekdayOpen: '00:00',
    weekdayClose: '24:00',
    weekendOpen: '00:00',
    weekendClose: '24:00',
    holidayOpen: '00:00',
    holidayClose: '24:00',
    feeInfo: '무료 (성수기 유료)',
    phone: '033-640-5420',
    updatedAt: '2025-01-01',
  },
];

// 지역별 중심 좌표 (검색 시 지도 이동용)
export const REGION_CENTERS: Record<string, { lat: number; lng: number }> = {
  '서울': { lat: 37.5665, lng: 126.9780 },
  '부산': { lat: 35.1796, lng: 129.0756 },
  '제주': { lat: 33.4996, lng: 126.5312 },
  '강릉': { lat: 37.7519, lng: 128.8760 },
  '인천': { lat: 37.4563, lng: 126.7052 },
  '대전': { lat: 36.3504, lng: 127.3845 },
  '대구': { lat: 35.8714, lng: 128.6014 },
  '광주': { lat: 35.1595, lng: 126.8526 },
  '울산': { lat: 35.5384, lng: 129.3114 },
  '수원': { lat: 37.2636, lng: 127.0286 },
  '전주': { lat: 35.8242, lng: 127.1480 },
  '경주': { lat: 35.8562, lng: 129.2247 },
  '속초': { lat: 38.2070, lng: 128.5918 },
  '여수': { lat: 34.7604, lng: 127.6622 },
  '통영': { lat: 34.8544, lng: 128.4332 },
};

/**
 * 주차장 검색 함수
 * 현재는 더미 데이터에서 지역명으로 필터링
 * 추후 공공데이터포털 API 호출로 교체 예정
 *
 * @param region - 검색할 지역명 (예: "서울", "부산")
 * @param filterType - 필터 타입 ('all' | 'free' | 'public')
 */
export function searchParking(
  region: string,
  filterType: 'all' | 'free' | 'public' = 'all'
): ParkingLot[] {
  let results = DUMMY_PARKING_DATA.filter((lot) =>
    lot.address.includes(region)
  );

  if (filterType === 'free') {
    results = results.filter((lot) => lot.isFree);
  } else if (filterType === 'public') {
    results = results.filter((lot) => lot.type === '공영');
  }

  return results;
}
