import { Button, Select, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import TripReviewItem from "../../../components/scheduleboard/TripReviewItem";
import { TRIP_REVIEW_ORDER } from "../../../types/enum";
import { IAPI, ITripReview } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";

interface TripReviewData {
  reviews: ITripReview[];
  hasMore: boolean;
}

const Index = () => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  const selectOption = [
    { label: "최신순", value: TRIP_REVIEW_ORDER.LATEST },
    { label: "추천순", value: TRIP_REVIEW_ORDER.POPULAR },
  ];
  // useState
  const [reviewList, setReviewList] = useState<ITripReview[]>([]);
  const [allcount, setAllcount] = useState(0);
  const [isMore, setIsMore] = useState(true);
  const [orderType, setOrderType] = useState(TRIP_REVIEW_ORDER.LATEST);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  console.log(reviewList);
  // API 여행기 리스트
  const getTripReviewList = async (): Promise<IAPI<TripReviewData> | void> => {
    const url = "/api/trip-review/allTripReview";
    setIsLoading(true);
    if (!accessToken) {
      try {
        const res = await axios.get<IAPI<TripReviewData>>(
          `${url}?orderType=${orderType}&pageNumber=${page}`,
        );
        const resultData = res.data;
        console.log("여행기 리스트 조회", resultData);
        if (resultData.code === "200 성공") {
          setIsMore(resultData.data.hasMore);
          setReviewList(prev => [...prev, ...resultData.data.reviews]);
        }
        return resultData;
      } catch (error) {
        console.log("여행기 리스트 조회", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (accessToken) {
      try {
        const res = await axios.get<IAPI<TripReviewData>>(
          `${url}?orderType=${orderType}&pageNumber=${page}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const resultData = res.data;
        console.log("여행기 리스트 조회", resultData);
        if (resultData.code === "200 성공") {
          setIsMore(resultData.data.hasMore);
          setReviewList(prev => [...prev, ...resultData.data.reviews]);
        }
        return resultData;
      } catch (error) {
        console.log("여행기 리스트 조회", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  //   API 여행기 수
  const getTripReviewCount = async (): Promise<IAPI<number> | null> => {
    try {
      const res = await axios.get(`/api/trip-review/allTripReviewCount`);
      const resultData = res.data;
      setAllcount(resultData.data);
      return resultData;
    } catch (error) {
      console.log("여행기 개수", error);
      return null;
    }
  };

  // 정렬 버튼
  const handleSelect = (e: TRIP_REVIEW_ORDER) => {
    setOrderType(e);
    setReviewList([]);
  };
  // 더보기
  const handleClickMoreBtn = () => {
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    getTripReviewList();
  }, [orderType, page]);
  useEffect(() => {
    getTripReviewCount();
    // setReviewList(tripReviewMockData.data.reviews);
  }, []);

  return (
    <div className="flex flex-col">
      {/* 정렬, 총 건수 */}
      <section className="flex justify-between items-center px-4 py-4 border-b border-t border-slate-100">
        <p className="font-semibold text-sm text-slate-700">
          총 {allcount?.toLocaleString()}건
        </p>
        <Select
          options={selectOption}
          defaultValue={TRIP_REVIEW_ORDER.LATEST}
          variant="borderless"
          className="text-sm text-slate-700"
          onChange={e => handleSelect(e)}
        />
      </section>
      {/* 여행기 */}
      <section>
        <Spin spinning={isLoading}>
          {reviewList.map((item, index) => {
            return <TripReviewItem key={index} item={item} />;
          })}
        </Spin>
        <div className="flex items-center justify-center py-5">
          {isMore && (
            <Button
              className="px-5 py-4 border border-slate-300 
        rounded-3xl text-base text-slate-600"
              onClick={handleClickMoreBtn}
            >
              더보기
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
