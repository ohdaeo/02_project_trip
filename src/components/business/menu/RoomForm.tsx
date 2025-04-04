import { Button, Form, Input, InputNumber, message, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { amenities } from "../../../constants/dataArr";
import { IAPI } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";
import { categoryKor } from "../../../utils/match";

export interface ParlorType {
  maxCapacity: number;
  recomCapacity: number;
  surcharge: number;
  menuId?: number;
}
export interface CreateRoomDataType {
  strfId: number;
  busiNum: string;
  category: string;
  menuId: number;
  ameniPoints?: number[];
  parlors: ParlorType[];
  rooms: number[];
}
interface RoomResponseType {}
interface EditRoomDataType {
  stayReq: CreateRoomDataType;
}

const RoomForm = () => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  const userInfo = getCookie("user");
  const busiNum = userInfo?.strfDtos[0].busiNum;
  // 쿼리
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId"));
  const category = searchParams.get("category");
  const menuId = searchParams.get("menuId");
  const navigate = useNavigate();
  const [form] = useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  // router
  const location = useLocation();
  const pathName = location.pathname;
  const state = location.state;
  console.log("state", state);
  // API 객실 생성
  const createRoom = async (
    data: CreateRoomDataType,
  ): Promise<IAPI<string> | null> => {
    setIsLoading(true);
    const url = "/api/detail/stay";
    try {
      const res = await axios.post<IAPI<string>>(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(res.data);
      const resultData = res.data;
      if (resultData) {
        setIsLoading(false);
        message.success("객실 생성 완료");
        navigate(`/business/menu?strfId=${strfId}&category=${category}`);
      }
      return resultData;
    } catch (error) {
      setIsLoading(false);
      return null;
    }
  };
  // API 객실 수정
  const updateRoom = async (
    data: EditRoomDataType,
  ): Promise<IAPI<RoomResponseType> | null> => {
    setIsLoading(true);
    const url = "/api/detail/stay";
    try {
      const res = await axios.patch<IAPI<RoomResponseType>>(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(res.data);
      const resultData = res.data;
      if (resultData) {
        setIsLoading(false);
        message.success("객실 수정이 완료되었습니다");
        navigate(
          `/business/menu/detail?strfId=${strfId}&category=${category}&menuId=${menuId}`,
        );
      }
      return resultData;
    } catch (error) {
      setIsLoading(false);
      return null;
    }
  };

  // 편의 시설 클릭
  const handleAmenityClick = (amenityId: number) => {
    if (selectedAmenities.includes(amenityId)) {
      setSelectedAmenities(prev => prev.filter(id => id !== amenityId));
    } else {
      setSelectedAmenities(prev => [...prev, amenityId]);
    }
  };
  // 폼 제출
  const onFinish = (values: any) => {
    console.log(values);
    const { recomCapacity, maxCapacity, surcharge, rooms } = values;
    // const numberRooms = rooms.map((item: any) => Number(item));
    const createPayload: CreateRoomDataType = {
      strfId: strfId,
      busiNum: busiNum,
      category: categoryKor(category) as string,
      menuId: Number(menuId),
      ameniPoints: selectedAmenities,
      parlors: [
        {
          menuId: Number(menuId),
          recomCapacity: recomCapacity,
          maxCapacity: maxCapacity,
          surcharge: surcharge,
        },
      ],
      rooms: rooms,
    };
    const editPayload: EditRoomDataType = {
      stayReq: {
        strfId: strfId,
        busiNum: busiNum,
        category: categoryKor(category) as string,
        menuId: Number(menuId),
        parlors: [
          {
            recomCapacity: recomCapacity,
            maxCapacity: maxCapacity,
            surcharge: surcharge,
          },
        ],
        rooms: rooms,
      },
    };
    if (pathName === "/business/menu/create") {
      console.log("생성 payload", createPayload);

      createRoom(createPayload);
    }
    if (pathName === "/business/menu/edit") {
      console.log("수정 payload", editPayload);
      updateRoom(editPayload);
    }
  };
  useEffect(() => {
    if (state) {
      form.setFieldsValue({
        rooms: state.roomNum.length,
        recomCapacity: state.recomCapacity,
        maxCapacity: state.maxCapacity,
        surcharge: state.surcharge,
      });
    }
  }, []);
  return (
    <div className="px-4 py-3">
      <Spin spinning={isLoading}>
        <Form form={form} onFinish={onFinish} name="room/parlors/amenities">
          <div className="py-2 flex flex-col gap-1">
            <h3 className="text-slate-700 text-lg font-semibold">객실 수량</h3>
            <p className="text-sm text-slate-500">
              해당 객실 종류의 수량을 선택해주세요.
            </p>
          </div>
          <Form.Item
            name={"rooms"}
            rules={[
              {
                required: true,
                message: "객실 번호를 입력해주세요.",
              },
            ]}
            className="w-full pb-5"
          >
            <Input placeholder="객실 수량을 선택해주세요" size="large" />
          </Form.Item>
          <div className="py-2 flex flex-col gap-1">
            <h3 className="text-slate-700 text-lg font-semibold">객실 인원</h3>
            <p className="text-sm text-slate-500">
              해당 객실 종류의 권장 인원 및 최대 인원과 그에 따른 추가금액을
              <br />
              입력해주세요.
            </p>
          </div>
          <Form.Item
            name={"recomCapacity"}
            rules={[
              {
                required: true,
                message: "권장 인원을 입력해주세요.",
              },
            ]}
            label="권장 인원"
            labelCol={{ span: 30 }}
            className="w-full"
          >
            <InputNumber
              size="large"
              placeholder="권장 인원"
              className="w-3/4"
              suffix="명"
              onChange={value => form.setFieldsValue({ maxCapacity: value })}
            />
          </Form.Item>
          <Form.Item
            name={"maxCapacity"}
            rules={[
              {
                required: true,
                message: "최대 인원을 입력해주세요.",
              },
            ]}
            label="최대 인원"
            labelCol={{ span: 30 }}
            className="w-full"
          >
            <InputNumber
              size="large"
              placeholder="최대 인원"
              className="w-3/4"
              suffix="명"
            />
          </Form.Item>
          <Form.Item
            name={"surcharge"}
            rules={[
              {
                required: true,
                message: "추가 금액을 입력해주세요.",
              },
            ]}
            label="추가 금액"
            labelCol={{ span: 30 }}
            className="w-full pb-5"
          >
            <InputNumber
              size="large"
              placeholder="추가 금액"
              className="w-3/4"
              suffix="원"
              formatter={value =>
                value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
              }
            />
          </Form.Item>
          {pathName !== "/business/menu/edit" && (
            <div className="py-2 flex flex-col gap-1 pb-10">
              <h3 className="text-slate-700 text-lg font-semibold">
                편의 시설
              </h3>
              <p className="text-sm text-slate-500 pb-2">
                해당 객실 종류의 편의 시설을 선택해주세요.
                <br /> * 해당 편의시설은 검색 필터에 적용됩니다.
              </p>
              <div className="flex flex-wrap gap-2">
                {amenities.map((item, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`flex text-base items-center gap-2
                border rounded-2xl w-fit px-2 py-1
                ${selectedAmenities.includes(item.amenity_id as number) ? "border-primary text-primary" : "border-slate-300 text-slate-500"}`}
                    onClick={() =>
                      handleAmenityClick(item.amenity_id as number)
                    }
                  >
                    {item.icon}
                    {item.key}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Form.Item className="w-full flex justify-end">
            <Button type="primary" htmlType="submit" size="large">
              {pathName === "/business/menu/create" ? "등록하기" : "수정하기"}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default RoomForm;
