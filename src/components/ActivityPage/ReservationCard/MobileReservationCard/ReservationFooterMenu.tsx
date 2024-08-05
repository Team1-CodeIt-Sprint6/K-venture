import DateTimeSummary from '@/components/ActivityPage/ReservationCard/ReservationCommon/DateTimeSummary';
import PriceDisplay from '@/components/ActivityPage/ReservationCard/ReservationCommon/PriceDisplay';
import ReservationButton from '@/components/ActivityPage/ReservationCard/ReservationCommon/ReservationButton';
import SelectDateTextButton from '@/components/ActivityPage/ReservationCard/ReservationCommon/SelectDateTextButton';
import { isReservationValid } from '@/lib/utils/isReservationValid';
import {
  CardEventHandlerType,
  ReservationStateType,
} from '@/types/activityDetailPageTypes';

interface ReservationFooterMenuProps {
  onClick: CardEventHandlerType;
  reservationState: ReservationStateType;
}

function ReservationFooterMenu({
  onClick,
  reservationState,
}: ReservationFooterMenuProps) {
  const isValidate = isReservationValid(reservationState);

  return (
    <div className="fixed bottom-0 left-0 h-[83px] w-full border-[1px] border-kv-gray-300 bg-white">
      <div className="mx-4 flex h-full items-center justify-between">
        <div className="w-[121px]">
          <PriceDisplay
            price={reservationState.price * reservationState.headCount}
            headCount={reservationState.headCount}
            priceClassName={`font-kv-bold text-kv-xl ${reservationState.headCount > 1 ? 'text-kv-primary-blue' : ''}`}
            containerClassName="min-w-[200px] pl-0 pt-0"
            unitClassName="text-kv-xl font-kv-medium"
          />
          {isValidate && (
            <DateTimeSummary
              date={reservationState.date}
              startTime={reservationState.startTime}
              endTime={reservationState.endTime}
              onClick={onClick.handleModalToggle}
            />
          )}
          {!isValidate && (
            <SelectDateTextButton
              onClick={onClick}
              className="mt-0 underline"
            />
          )}
        </div>
        <ReservationButton
          className={`h-[48px] w-[106px] text-kv-lg font-kv-bold text-white ${isValidate ? 'bg-kv-primary-blue' : 'bg-kv-gray-600'}`}
        />
      </div>
    </div>
  );
}

export default ReservationFooterMenu;
