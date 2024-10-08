import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import MyReservationCard from '@/components/common/ActivityCard/MyReservationCard';
import SortDropDown from '@/components/common/Dropdown/SortDropdown';
import EmptyState from '@/components/common/EmptyState';
import Loading from '@/components/common/Loading';
import { Modal } from '@/components/common/Modal';
import useInfiniteScrollReservation from '@/hooks/useInfiniteScrollReservation';
import useModal from '@/hooks/useModal';
import { cancelReservation } from '@/lib/apis/patchApis';
import { MyReservation } from '@/types/get/reservationTypes';

export default function ReservationList() {
  const {
    reservations,
    loading,
    error,
    setError,
    updateStatus,
    fetchReservations,
  } = useInfiniteScrollReservation(null);

  const { modalProps: cancelModalProps, openModal: openCancelModal } =
    useModal();
  const { modalProps: reviewModalProps, openModal: openReviewModal } =
    useModal();

  const [selectedReservation, setSelectedReservation] =
    useState<MyReservation | null>(null);

  const handleFilterSelect = (option: string) => {
    const statusMapping: { [key: string]: string } = {
      '예약 신청': 'pending',
      '예약 취소': 'canceled',
      '예약 승인': 'confirmed',
      '예약 거절': 'declined',
      '체험 완료': 'completed',
    };
    const selectedStatus = statusMapping[option] || null;
    updateStatus(selectedStatus);
  };

  const handleCancelReservation = async (reservationId: number) => {
    try {
      await cancelReservation(reservationId);
      await fetchReservations(true);
    } catch (error) {
      setError('예약 취소 중 오류가 발생했습니다.');
    }
  };

  const handleCancelClick = (reservationId: number) => {
    openCancelModal('confirm', '예약을 취소하시겠습니까?', {
      onConfirm: () => handleCancelReservation(reservationId),
    });
  };

  const handleReviewClick = (reservation: MyReservation) => {
    setSelectedReservation(reservation);
    openReviewModal(
      'review',
      '',
      {
        onConfirm: async () => {
          await fetchReservations(true);
        },
      },
      reservation,
    );
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="mb-4 flex h-[53px] w-full items-center justify-between">
        <h1 className="font-kv-bold kv-text-3xl">예약 내역</h1>
        <div className="block">
          <SortDropDown
            label="필터"
            options={[
              '예약 신청',
              '예약 취소',
              '예약 승인',
              '예약 거절',
              '체험 완료',
            ]}
            onSelect={handleFilterSelect}
          />
        </div>
      </div>
      {reservations.length === 0 && !loading ? (
        <EmptyState message="아직 예약한 체험이 없어요" />
      ) : (
        <div>
          {reservations.map((reservation) => (
            <MyReservationCard
              key={reservation.id}
              reservation={reservation}
              onReviewClick={() => handleReviewClick(reservation)}
              onCancelClick={() => handleCancelClick(reservation.id)}
            />
          ))}
          {loading && <Loading />}
        </div>
      )}
      <Modal {...cancelModalProps} />
      <Modal {...reviewModalProps} reservation={selectedReservation} />
    </div>
  );
}
