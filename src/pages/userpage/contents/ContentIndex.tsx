import { Tabs } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import Amenities from "../../../components/contents/Amenities";
import Parlor from "../../../components/contents/Parlor";
import Reviews from "../../../components/contents/Reviews";
import StrDetail from "../../../components/contents/StrDetail";
import StrInfo from "../../../components/contents/StrInfo";
import ContentsHeader from "../../../components/layout/header/ContentsHeader";
import "../../../styles/antd-styles.css";
import { useEffect, useState } from "react";
import { IStrf, MenuType } from "../../../types/interface";
import jwtAxios from "../../../apis/jwt";
import StickyActionBar from "../../../components/contents/StickyActionBar";
import DishBoard from "../../../components/contents/DishBoard";
import EntryTicket from "../../../components/contents/EntryTicket";

const ContentIndex = (): JSX.Element => {
  const [contentData, setContentData] = useState<IStrf | null>(null);
  const [menuData, setMenuData] = useState<MenuType[]>([]);
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId")) || 0;

  const getDetailMember = async () => {
    try {
      const res = await jwtAxios.get(`/api/detail/member?&strf_id=${strfId}`);
      res.data.data;
      console.log("상품조회-회원", res.data.data);
      setContentData(res.data.data);
    } catch (error) {
      console.log("상품조회-회원", error);
    }
  };

  const getMenuDetail = async () => {
    try {
      const res = await jwtAxios.get(`/api/detail/menu?strf_id=${strfId}`);
      setMenuData(res.data.data);
      console.log("상품조회-메뉴", res.data.data);
    } catch (error) {
      console.log("상품조회-메뉴", error);
    }
  };

  useEffect(() => {
    getMenuDetail();
    getDetailMember();
  }, []);

  return (
    <div>
      {contentData && (
        <ContentsHeader
          strfId={strfId}
          contentData={contentData}
          getDetailMember={getDetailMember}
        />
      )}
      <section>
        {contentData && <StrInfo strfId={strfId} contentData={contentData} />}
      </section>
      {/* 카테고리별 컨텐츠 표시 */}
      {menuData.length > 0 && (
        <>
          <section className="w-full h-[10px] bg-slate-100" />
          <section>
            {contentData?.category === "STAY" && (
              <Parlor strfId={strfId} menuData={menuData} />
            )}
            {contentData?.category === "RESTAUR" && (
              <DishBoard strfId={strfId} menuData={menuData} />
            )}
            {(contentData?.category === "TOUR" ||
              contentData?.category === "FEST") && (
              <EntryTicket strfId={strfId} menuData={menuData} />
            )}
          </section>
          {/* STAY 카테고리일 때만 Amenities 섹션 표시 */}
          <section className="w-full h-[10px] bg-slate-100" />
        </>
      )}
      {contentData?.category === "STAY" && (
        <>
          <section>
            <Amenities strfId={strfId} />
          </section>
          <section className="w-full h-[10px] bg-slate-100" />
        </>
      )}
      <section>
        <Tabs
          defaultActiveKey="1"
          centered
          className="custom-strf-tabs"
          items={[
            {
              label: "상세정보",
              key: "1",
              children: (
                <>
                  {contentData && (
                    <StrDetail strfId={strfId} contentData={contentData} />
                  )}
                </>
              ),
            },
            {
              label: "리뷰",
              key: "2",
              children: (
                <>
                  {contentData && (
                    <Reviews strfId={strfId} contentData={contentData} />
                  )}
                </>
              ),
            },
          ]}
        />
      </section>
      {contentData && (
        <StickyActionBar strfId={strfId} contentData={contentData} />
      )}
    </div>
  );
};

export default ContentIndex;
