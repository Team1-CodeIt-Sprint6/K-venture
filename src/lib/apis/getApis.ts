import instance from '@/lib/apis/axios';
import { ActivityResponse as ActivityDetailResponse } from '@/types/activityDetailPageTypes';
import { ActivityReviewsResponse } from '@/types/activityReviewTypes';
import { ActivityResponse } from '@/types/activityTypes';
import {
  MyReservation,
  MyReservationsResponse,
} from '@/types/get/reservationTypes';
import { MyActivityListResponse } from '@/types/myActivitiesTypes';
import {
  MyActivitiesResponse,
  ReservationDashboardResponse,
} from '@/types/page/ReservationDashboardPageTypes';
import { ReservationResponse } from '@/types/post/reservationTypes';

export const getMyActivities = async (): Promise<{
  data: MyActivitiesResponse;
}> => {
  const response = await instance.get<MyActivitiesResponse>('/my-activities');
  return { data: response.data };
};

export const getReservationDashboard = async (
  activityId: number,
  year: string,
  month: string,
): Promise<{ data: ReservationDashboardResponse[] }> => {
  const response = await instance.get<ReservationDashboardResponse[]>(
    `/my-activities/${activityId}/reservation-dashboard`,
    {
      params: { year, month },
    },
  );
  return { data: response.data };
};

// 예약 상세 조회
export const getActivityDetail = async (
  activityId: number,
): Promise<{ data: ActivityDetailResponse }> => {
  const response = await instance.get<ActivityDetailResponse>(
    `/activities/${activityId}`,
  );
  return { data: response.data };
};

// 체험 상세 조회
export const getActivity = async (
  activityId: number,
): Promise<{ data: ActivityResponse }> => {
  const response = await instance.get<ActivityResponse>(
    `/activities/${activityId}`,
  );
  return { data: response.data };
};

// 내 예약 리스트 조회
// export const getMyReservations = async (
//   nextCursorId: string | null,
//   status: string | null,
//   isFirstFetch: boolean,
// ): Promise<{ reservations: MyReservation[]; cursorId: string | null }> => {
//   let url = `/my-reservations?size=10`;

//   if (nextCursorId && !isFirstFetch) {
//     url += `&cursorId=${nextCursorId}`;
//   }
//   if (status) {
//     url += `&status=${status}`;
//   }

//   const { data } = await instance.get(url);
//   return data;
// };

/**
 * 주소를 좌표로 변환하는 함수
 * @param address - 변환할 주소
 * @returns { lat: number, lng: number } - 좌표 또는 오류 발생 시 null
 */
export const geocodeAddress = async (address: string) => {
  try {
    // 카카오 주소 검색 API 요청
    const response = await instance.get(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
        },
      },
    );

    const data = response.data;

    if (data.documents.length > 0) {
      // 첫 번째 주소 좌표 추출
      const { x: lng, y: lat } = data.documents[0].address;
      return { lat: parseFloat(lat), lng: parseFloat(lng) };
    }
  } catch (error) {
    console.error('주소-좌표 변환 중 에러가 발생했습니다.', error);
  }
};

// 체험 상세 리뷰 조회
export const getActivityReview = async (activityId: number, page: number) => {
  const response = await instance.get<ActivityReviewsResponse>(
    `/activities/${activityId}/reviews`,
    {
      params: { page },
    },
  );
  return response.data;
};

export const getActivities = async (
  cursorId: string | null = null,
): Promise<MyActivityListResponse> => {
  const response = await instance.get('/my-activities', {
    params: {
      size: 10,
      cursorId,
    },
  });
  return response.data;
};

export const getMyReservations = async (
  cursorId: string | null = null,
  status: string | null = null,
): Promise<MyReservationsResponse> => {
  const response = await instance.get('/my-reservations', {
    params: {
      size: 10,
      status,
      cursorId,
    },
  });
  return response.data;
};
