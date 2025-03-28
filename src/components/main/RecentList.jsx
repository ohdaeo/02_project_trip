import { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Rate } from "antd";
import { useNavigate } from "react-router-dom";
import { ProductPic } from "../../constants/pic";

const RecentList = ({
  recent,
  getMainList,
  setFestivities,
  setLocations,
  setRecent,
  setRecommend,
}) => {
  // navigate
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("STAY");

  const categoryNameMap = {
    STAY: "숙소",
    RESTAUR: "맛집",
    TOUR: "관광지",
  };

  const activeTabData = recent.find(item => item.category === activeTab);

  // 찜하기
  const postWishList = async item => {
    const sendData = {
      strfId: item.strfId,
    };
    console.log("찜하기 데이터:", sendData);
    try {
      const res = await axios.post(
        `/api/wish-list`,
        { ...sendData },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log("찜하기", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        getMainList();
      }
    } catch (error) {
      console.log("찜하기", error);
    }
  };

  // recent가 비어있으면 null을 반환하여 아무것도 렌더링하지 않음
  if (!recent || recent.length === 0) {
    return null;
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-700">최근 본 목록</h1>
      <div>
        {recent.map(item => (
          <button
            key={item.category}
            onClick={() => setActiveTab(item.category)}
            className={`px-4 py-1.5 my-5 border cursor-pointer text-base mr-3 rounded-2xl ${
              activeTab === item.category
                ? "bg-primary text-white border-none"
                : "bg-white text-slate-500 border-1 border-slate-300"
            }`}
          >
            {categoryNameMap[item.category]}
          </button>
        ))}
      </div>

      <div className=" flex flex-wrap ">
        {activeTabData?.recent.slice(0, 6).map(content => (
          <div
            key={content.strfId}
            className="w-full flex items-center gap-5 mb-5 cursor-pointer"
            onClick={() => {
              navigate(`/contents/index?strfId=${content.strfId}`);
            }}
          >
            <div className="w-[14vw] min-w-32 aspect-square rounded-lg relative overflow-hidden">
              <img
                src={`${ProductPic}/${content.strfId}/${content.strfPic}`}
                alt={content.strfTitle}
                className="w-full h-full object-cover"
              />
              <i
                className="absolute top-2.5 right-2.5 cursor-pointer"
                onClick={() => postWishList(item)}
              >
                {content.wishIn ? (
                  <AiFillHeart className="text-secondary3 text-lg" />
                ) : (
                  <AiOutlineHeart className="text-white text-lg" />
                )}
              </i>
            </div>

            <div className="flex-1 pr-3">
              <h3 className="text-lg font-semibold text-slate-700 break-keep">
                {content.strfTitle}
              </h3>
              <p className="font-light text-sm text-slate-400">
                {content.locationName} · {categoryNameMap[activeTab]}
              </p>

              <div>
                <Rate
                  disabled
                  allowHalf
                  defaultValue={content.averageRating}
                  className="custom-star"
                />
              </div>
              <div className="flex text-slate-400 text-sm items-center gap-1">
                {content.wishIn ? (
                  <AiFillHeart className="text-secondary3 text-lg" />
                ) : (
                  <AiOutlineHeart className="text-slate-400 text-lg" />
                )}
                {content.wishCnt}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentList;
