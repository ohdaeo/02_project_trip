import { Button } from "antd";
import { IoIosArrowRoundForward } from "react-icons/io";

// 하드
const state = 0;
const BookingList = () => {
  // const today = dayjs().format("YYYY.MM.DD");
  //오늘 날짜 기준으로 버튼 상태 변경하기
  // const categorizeDate = (inputDate: string) => {
  //   const today = dayjs().startOf("day");
  //   const targetDate = dayjs(inputDate).startOf("day");
  //   const sevenDaysLater = today.add(7, "day");

  //   return targetDate.isBefore(today)
  //     ? "문의하기"
  //     : targetDate.isBefore(sevenDaysLater)
  //       ? "리뷰작성"
  //       : "리뷰 만료";
  // };
  const matchState = (state: number) => {
    switch (state) {
      case 0:
        return "결제완료";
      case 1:
        return "예약확정";
      case 2:
        return "이용완료";
      case 3:
        return "취소완료";
    }
  };
  const matchStateStyle = (state: number) => {
    switch (state) {
      case 0:
        return "bg-[rgba(255,253,204,0.6)] text-[#FFCC00]";
      case 1:
        return "bg-[rgba(165,238,254,0.3)] text-primary";
      case 2:
        return "bg-slate-100 text-slate-400";
      case 3:
        return "bg-[rgba(253,180,161,0.3)] text-secondary3";
    }
  };
  // const matchButton = (state: number) => {
  //   switch (state) {
  //     case 0:
  //     case 1:
  //       return (
  //         <>
  //           <Button className="w-full h-auto py-3 rounded-lg text-base font-semibold text-slate-700">
  //             상세보기
  //           </Button>
  //           <Button className="w-full h-auto py-3 rounded-lg text-base font-semibold text-slate-700">
  //             예약 취소
  //           </Button>
  //         </>
  //       );
  //     case 2:
  //       return (
  //         <>
  //           <Button className="w-full h-auto py-3 rounded-lg text-base font-semibold text-slate-700">
  //             상세보기
  //           </Button>
  //           <Button
  //             type="primary"
  //             className="w-full h-auto py-3 rounded-lg text-base font-semibold  text-white bg-primary"
  //           >
  //             리뷰작성
  //           </Button>
  //         </>
  //       );
  //     case 3:
  //       return (
  //         <>
  //           <Button className="w-full h-auto py-3 rounded-lg text-base font-semibold text-slate-700">
  //             상세보기
  //           </Button>
  //         </>
  //       );
  //   }
  // };
  return (
    <div className="flex flex-col gap-3">
      <div className="px-4 py-3 flex flex-col gap-2">
        {/* 날짜 */}
        <div className="flex items-start justify-between h-[10vw] max-h-[60px] border-b border-slate-200 ">
          <p>날짜</p>
          <button
            type="button"
            className="flex gap-1 items-center text-primary"
          >
            <p>상세보기</p>
            <i>
              <IoIosArrowRoundForward />
            </i>
          </button>
        </div>
        <section className="flex flex-col gap-5">
          {/* 예약 정보 */}
          <div className="flex flex-col gap-3">
            {/* 상태 */}
            <div
              className={`w-fit flex items-center justify-center px-2 py-1 text-sm font-bold ${matchStateStyle(state)}`}
            >
              <p>{matchState(state)}</p>
            </div>
            {/*  제목 */}
            <div>
              <h2 className="text-xl font-bold text-slate-700">이름</h2>
            </div>
            {/* 내용 */}
            <div className="flex items-start gap-5">
              <div className="w-20 aspect-square rounded-2xl bg-slate-200">
                <img src="" alt="" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-base text-slate-700">날짜</p>
                <p className="text-slate-500 text-sm">
                  1박, 체크인 시간, 체크아웃 시간
                </p>
                <p className="text-slate-500 text-sm">결제 금액</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full">
            <Button className="w-full h-[16vw] max-h-[50px]">예약 취소</Button>
            <Button type="primary" className="w-full h-[16vw] max-h-[50px]">
              예약 승인
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookingList;
