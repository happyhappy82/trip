export const prerender = false;

import type { APIRoute } from 'astro';

const DATA_GO_KR_API_URL = 'http://api.data.go.kr/openapi/tn_pubr_prkplce_info_api';

export const GET: APIRoute = async ({ url }) => {
  const region = url.searchParams.get('region') || '';
  const filter = url.searchParams.get('filter') || 'all'; // all | free | public
  const page = url.searchParams.get('page') || '1';
  const size = url.searchParams.get('size') || '50';

  const serviceKey = import.meta.env.DATA_GO_KR_SERVICE_KEY;

  if (!serviceKey) {
    return new Response(
      JSON.stringify({ error: 'API 키가 설정되지 않았습니다.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!region) {
    return new Response(
      JSON.stringify({ error: '지역명(region)을 입력해주세요.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 공공데이터 API 호출 - 도로명주소 기준 검색
    const params = new URLSearchParams({
      serviceKey,
      pageNo: page,
      numOfRows: size,
      type: 'json',
    });

    const apiUrl = `${DATA_GO_KR_API_URL}?${params.toString()}&rdnmadr=${encodeURIComponent(region)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`공공데이터 API 응답 오류: ${response.status}`);
    }

    const text = await response.text();
    let data: any;

    try {
      data = JSON.parse(text);
    } catch {
      // XML이나 에러 메시지가 반환된 경우
      throw new Error(`API 응답 파싱 실패: ${text.substring(0, 200)}`);
    }

    const header = data?.response?.header;
    if (header?.resultCode !== '00') {
      throw new Error(`API 오류: ${header?.resultMsg || '알 수 없는 오류'}`);
    }

    const body = data?.response?.body;
    const rawItems = body?.items || [];
    const totalCount = parseInt(body?.totalCount || '0', 10);

    // API 응답을 프론트엔드 형식으로 변환
    let items = rawItems.map((item: any) => ({
      name: item.prkplceNm || '',
      type: item.prkplceSe || '',
      category: item.prkplceType || '',
      address: item.rdnmadr || item.lnmadr || '',
      lat: parseFloat(item.latitude) || 0,
      lng: parseFloat(item.longitude) || 0,
      totalSpaces: parseInt(item.prkcmprt, 10) || 0,
      isFree: item.parkingchrgeInfo === '무료',
      operatingDays: item.operDay || '',
      weekdayOpen: item.weekdayOperOpenHhmm || '',
      weekdayClose: item.weekdayOperCloseHhmm || '',
      weekendOpen: item.satOperOperOpenHhmm || '',
      weekendClose: item.satOperCloseHhmm || '',
      holidayOpen: item.holidayOperOpenHhmm || '',
      holidayClose: item.holidayCloseOpenHhmm || '',
      feeInfo: formatFeeInfo(item),
      phone: item.phoneNumber || '',
      updatedAt: item.referenceDate || '',
    }));

    // 클라이언트 필터 적용
    if (filter === 'free') {
      items = items.filter((lot: any) => lot.isFree);
    } else if (filter === 'public') {
      items = items.filter((lot: any) => lot.type === '공영');
    }

    return new Response(
      JSON.stringify({
        items,
        totalCount,
        pageNo: parseInt(page, 10),
        numOfRows: parseInt(size, 10),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('주차장 API 오류:', err);
    return new Response(
      JSON.stringify({ error: err.message || '서버 오류가 발생했습니다.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

function formatFeeInfo(item: any): string {
  if (item.parkingchrgeInfo === '무료') return '무료';

  const parts: string[] = [];
  if (item.basicTime && item.basicCharge) {
    parts.push(`기본 ${item.basicTime}분 ${Number(item.basicCharge).toLocaleString()}원`);
  }
  if (item.addUnitTime && item.addUnitCharge) {
    parts.push(`추가 ${item.addUnitTime}분당 ${Number(item.addUnitCharge).toLocaleString()}원`);
  }
  return parts.length > 0 ? parts.join(' / ') : '유료';
}
