import { AxiosError } from 'axios';
import { getCookie, setCookie } from 'cookies-next';

import { UserProfile } from '@/components/userProfile/EditProfileForm';
import instance from '@/lib/apis/axios';
import { ActivityResponse, MyActivityForm } from '@/types/activityTypes';
import {
  LogInForm,
  LogInResponse,
  SignUpForm,
  SignUpResponse,
} from '@/types/AuthTypes';
import {
  ReservationRequest,
  ReservationResponse,
} from '@/types/post/reservationTypes';
import { ReviewData } from '@/types/post/reviewTypes';
import {
  ActivityImageResponse,
  UploadImageForm,
} from '@/types/post/uploadImageTypes';

// access token을 업데이트 하기 위한 요청
export const updateAccessToken = async () => {
  const refreshToken = getCookie('refreshToken');
  const { data } = await instance.post(
    '/auth/tokens',
    {},
    { headers: { Authorization: `Bearer ${refreshToken}` } },
  );

  setCookie('accessToken', data.accessToken);
  setCookie('refreshToken', data.refreshToken);
};

// 로그인
export const postLogin = async (
  formData: LogInForm,
): Promise<LogInResponse> => {
  const response = await instance.post<LogInResponse>('/auth/login', formData);
  return response.data;
};

// 프로필 이미지 url 생성
export const postProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await instance.post<UserProfile>('/users/me/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.profileImageUrl;
};

// 체험 업로드
export const postActivity = async (formData: MyActivityForm) => {
  const response = await instance.post<ActivityResponse>(
    '/activities',
    formData,
  );
  return response.data.id;
};

// 체험 이미지 업로드
export const postActivityImage = async (formData: UploadImageForm) => {
  const response = await instance.post<ActivityImageResponse>(
    `/activities/image`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response.data.activityImageUrl;
};

// 예약 신청
export const createReservation = async (
  activityId: number,
  data: ReservationRequest,
): Promise<ReservationResponse> => {
  const response = await instance.post<ReservationResponse>(
    `/activities/${activityId}/reservations`,
    data,
  );
  return response.data;
};

// 후기 전송
export const postReview = async (
  reservationId: number,
  reviewData: ReviewData,
) => {
  const response = await instance.post(
    `/my-reservations/${reservationId}/reviews`,
    reviewData,
  );
  return response.data;
};

export const postSignup = async (
  formData: SignUpForm,
): Promise<SignUpResponse> => {
  const { email, nickname, password } = formData;
  const response = await instance.post<SignUpResponse>(`/users`, {
    email,
    nickname,
    password,
  });
  return response.data;
};
