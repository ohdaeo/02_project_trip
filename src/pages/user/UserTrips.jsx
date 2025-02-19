import { Button, Form, Input, Tooltip } from "antd";
import { memo, useEffect, useMemo, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "../../atoms/userAtom";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { LocationPic, ProfilePic } from "../../constants/pic";
import { getCookie } from "../../utils/cookie";
import Footer from "../Footer";
import axios from "axios";
import jwtAxios from "../../apis/jwt";
import { FaRegQuestionCircle } from "react-icons/fa";

const categoryArr = ["다가오는 여행", "완료된 여행"];
const UserTrips = () => {
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  const [useProfile, setUseProfile] = useState({});
  const [tripListData, setTripListData] = useState({});

  const [form] = Form.useForm();
  const accessToken = getCookie("accessToken");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState(0);

  useEffect(() => {
    // console.log("tripListData", tripListData);
  }, [tripListData]);

  useEffect(() => {}, [category]);

  // 여행 목록 불러오기
  const getTripList = async () => {
    try {
      const res = await jwtAxios.get(`/api/trip-list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      //   console.log(res.data);
      const resultData = res.data;
      const beforeArr = resultData.beforeTripList;
      const afterArr = resultData.afterTripList;

      setTripListData(resultData.data);
    } catch (error) {
      console.log("여행 목록 불러오기:", error);
    }
  };

  // 구성원 추가
  const postTripUser = async () => {
    const sendData = {
      inviteKey: code,
    };
    try {
      const res = await axios.post(`/api/trip/user`, sendData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log("구성원추가", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        navigate(`/schedule/index?tripId=${resultData.data}`);
      }
    } catch (error) {
      console.log("구성원 추가", error);
    }
  };
  // 유저 데이터 불러오기
  const getUserInfo = async () => {
    try {
      const res = await jwtAxios.get(`/api/user/userInfo`);
      // console.log(res.data);
      const resultData = res.data;
      setUseProfile(resultData.data);
    } catch (error) {
      console.log("유저 정보", error);
    }
  };
  useEffect(() => {
    if (accessToken) {
      getTripList();
      getUserInfo();
    }
  }, []);
  // useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  const navigateGoTrip = item => {
    console.log(item);
    navigate(`/schedule/index?tripId=${item.tripId}`);
  };

  useEffect(() => {
    // console.log("카테고리", category);
  }, [category]);
  // 미완료 여행 목록 불러오기

  //antD 툴팁 설정
  const [arrow, setArrow] = useState("Show");
  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false;
    }
    if (arrow === "Show") {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, [arrow]);

  return (
    <div className="flex flex-col gap-[30px]">
      <TitleHeader icon="back" title="여행" onClick={navigateBack} />

      {/* 여행코드 입력창 */}
      <div className="px-[32px] flex flex-col gap-[5px]">
        <div className="flex items-center gap-[5px]">
          <p className="text-slate-500 text-[18px] font-semibold">여행코드</p>
          <Button type="Outlined" className="group flex items-center focus:">
            <FaRegQuestionCircle className="text-[18px] text-slate-300 group-hover:text-[#b8c8d1] transition-all duration-300" />
            <p className="text-slate-300 w-0 group-hover:w-[350px] overflow-hidden transition-all duration-300">
              생성된 일정에서 일정 코드를 받아 친구를 초대해보세요!
            </p>
          </Button>
        </div>

        <Input
          placeholder="친구와 여행을 함께하기 위해 코드를 입력해주세요"
          className="px-[32px] py-[20px] h-[79px]"
          onChange={e => setCode(e.target.value)}
          onKeyDown={e => {
            if (e.code === "Enter") {
              postTripUser();
            }
          }}
        />
      </div>
      {/* 여행 리스트 카테고리 */}
      <div className="px-[32px]">
        <ul className="flex items-center">
          {categoryArr.map((item, index) => {
            return (
              <li
                className={`cursor-pointer w-full flex justify-center items-center
                            pt-[17px] pb-[16px]
                            ${category === index ? `text-primary border-b-[2px] border-primary` : `text-slate-400 border-b border-slate-200`}`}
                key={index}
                onClick={() => {
                  setCategory(index);
                }}
              >
                {item}
              </li>
            );
          })}
        </ul>
      </div>
      {/* 여행 목록 */}
      <div className="px-[28px] mb-[40px]">
        {/* 다가오는 여행 */}
        {category === 0 && (
          <ul className="flex flex-col gap-[40px]">
            {tripListData?.beforeTripList?.map((item, index) => {
              return (
                <li
                  className="flex items-center justify-between"
                  key={index}
                  onClick={() => {
                    navigateGoTrip(item);
                  }}
                >
                  {/* 좌측 */}
                  <div className="flex items-center gap-[29px]">
                    {/* 이미지 */}
                    <div className="w-[100px] h-[100px] bg-slate-100 rounded-full overflow-hidden">
                      <img
                        src={`${LocationPic}${item.locationPic}`}
                        alt={item.title}
                        className="w-full h-full"
                      />
                    </div>
                    {/* 정보 */}
                    <div className="flex flex-col gap-[5px]">
                      <h3 className="text-[24px] text-slate-700 font-semibold">
                        {item.title}
                      </h3>
                      <p className="text-[18px] text-slate-500">
                        <span>{item.startAt}</span>~<span>{item.endAt}</span>
                      </p>
                    </div>
                  </div>
                  {/* 우측 */}
                  <button className="w-[36px] h-[36px] bg-slate-100 px-[10px] py-[10px] rounded-full">
                    <AiOutlinePlus className="text-slate-400" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {/* 완료된 여행 */}
        {category === 1 && (
          <ul className="flex flex-col gap-[40px]">
            {tripListData.afterTripList?.map((item, index) => {
              return (
                <li
                  className="flex items-center justify-between"
                  key={index}
                  onClick={() => {
                    navigateGoTrip(item);
                  }}
                >
                  {/* 좌측 */}
                  <div className="flex items-center gap-[29px]">
                    {/* 이미지 */}
                    <div className="w-[100px] h-[100px] bg-slate-100 rounded-full">
                      <img src="" alt="" />
                    </div>
                    {/* 정보 */}
                    <div className="flex flex-col gap-[5px]">
                      <h3 className="text-[24px] text-slate-700 font-semibold">
                        {item.title}
                      </h3>
                      <p className="text-[18px] text-slate-500">
                        <span>{item.startAt}</span>~<span>{item.endAt}</span>
                      </p>
                    </div>
                  </div>
                  {/* 우측 */}
                  <button className="w-[36px] h-[36px] bg-slate-100 px-[10px] py-[10px] rounded-full">
                    <AiOutlinePlus className="text-slate-400" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default memo(UserTrips);
