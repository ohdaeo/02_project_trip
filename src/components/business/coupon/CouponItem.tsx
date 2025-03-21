import dayjs from "dayjs";
import "dayjs/locale/ko";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { IoIosArrowForward } from "react-icons/io";
import { ICoupon } from "../../../types/interface";
import { useState } from "react";
import BottomSheet from "../../basic/BottomSheet";
import { BiSolidEditAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { formatId } from "../../../utils/format";

dayjs.locale("ko");
dayjs.extend(customParseFormat);

interface CouponItemProps {
  strfId: number;
  item: ICoupon;
  selected: boolean;
  onClick: () => void;
}

const CouponItem = ({
  strfId,
  item,
  selected,
  onClick,
}: CouponItemProps): JSX.Element => {
  const { couponId, title, discountPer, expiredAt, distributeAt } = item;
  //usenavigate
  const navigate = useNavigate();
  const navigateToEditCoupon = () => {
    navigate(
      `/business/coupon/edit?strfId=${strfId}&couponId=${couponId}&title=${title}&discountPer=${discountPer}&expiredAt=${expiredAt}&distributeAt=${distributeAt}`,
    );
  };
  const [isEdit, setIsEdit] = useState(false);

  // 날짜 포멧
  const matchDate = (date: string | undefined): string => {
    return dayjs(date).format("YYYY-MM-DD(ddd)");
  };

  // 바텀시트 action
  const actions = [
    {
      label: (
        <div className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiSolidEditAlt className="text-slate-300" />
          수정하기
        </div>
      ),
      onClick: () => {
        navigateToEditCoupon();
      },
    },
  ];
  // 바텀시트 열기/닫기
  const handleEdit = () => {
    setIsEdit(!isEdit);
  };

  return (
    <div className="px-2 pt-2 pb-5 flex flex-col gap-3 border-b border-slate-200">
      <div className="flex flex-col gap-2 relative">
        {/* 쿠폰 내용 */}
        <ul className="flex flex-col gap-1 w-full ">
          <li className="grid grid-cols-4 items-center">
            <h4 className="text-lg text-slate-700 font-semibold col-span-1">
              쿠폰 ID
            </h4>
            <p className="text-base text-slate-500 font-semibold col-span-3">
              {formatId(couponId ?? 0)}
            </p>
          </li>
          <li className="grid grid-cols-4 items-center">
            <h4 className="text-lg text-slate-700 font-semibold col-span-1">
              쿠폰 관리명
            </h4>
            <p className="text-base text-slate-500 font-semibold col-span-3">
              {title}
            </p>
          </li>
        </ul>
        {/* 버튼 */}
        <div className="flex justify-end gap-3 absolute bottom-1 right-0">
          <button
            type="button"
            className="flex items-center gap-2 text-base text-slate-500"
            onClick={onClick}
          >
            자세히
            <i
              className={`text-base text-slate-500 ${
                selected ? "rotate-90" : "rotate-0"
              } transition-transform duration-300`}
            >
              <IoIosArrowForward />
            </i>
          </button>
          <button
            type="button"
            className="text-base text-slate-500"
            onClick={handleEdit}
          >
            <CgMoreVerticalAlt />
          </button>
        </div>
      </div>
      {/* 자세히 보기 */}
      <div
        className={`${selected ? "visible h-auto opacity-100 relative" : "invisible max-h-0 opacity-0 absolute"}
          overflow-hidden transition-[max-height] duration-300 ease-in-out opacity-transition`}
        style={{
          transitionProperty: "opacity, max-height, visibility",
          transitionDuration: selected ? "400ms" : "300ms",
        }}
      >
        {selected && (
          <ul className="px-4 py-4 bg-slate-100">
            <li className="flex justify-between items-center">
              <h5 className="text-base text-slate-700 font-semibold">
                쿠폰 ID
              </h5>
              <p className="text-sm text-slate-500 ">
                {formatId(couponId ?? 0)}
              </p>
            </li>
            <li className="flex justify-between items-center">
              <h5 className="text-base text-slate-700 font-semibold">
                쿠폰 관리명
              </h5>
              <p className="text-sm text-slate-500 ">{title}</p>
            </li>
            <li className="flex justify-between items-center">
              <h5 className="text-base text-slate-700 font-semibold">
                쿠폰 할인
              </h5>
              <p className="text-sm text-slate-500 ">{discountPer}%</p>
            </li>
            <li className="flex justify-between items-center">
              <h5 className="text-base text-slate-700 font-semibold">
                쿠폰 유효기간
              </h5>
              <p className="text-sm text-slate-500">
                {matchDate(distributeAt)} ~ {matchDate(expiredAt)}
              </p>
            </li>
          </ul>
        )}
      </div>
      <BottomSheet open={isEdit} onClose={handleEdit} actions={actions} />
    </div>
  );
};

export default CouponItem;
