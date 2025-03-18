import { useNavigate, useSearchParams } from "react-router-dom";
import { ProductPic } from "../../../constants/pic";
import { useRecoilState } from "recoil";
import { strfAtom } from "../../../atoms/strfAtom";
import { useEffect, useState } from "react";
import { Button, Form, Input, message, Spin, Upload, UploadFile } from "antd";
import { matchName } from "../../../utils/match";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { getCookie } from "../../../utils/cookie";
import { IAPI } from "../../../types/interface";
import { IGetGeoCode } from "../../../components/business/register/Step1";
import DaumPostcodeEmbed from "react-daum-postcode";

const StroeEdit = (): JSX.Element => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  const userInfo = getCookie("user");
  const busiNum = userInfo.strfDtos[0].busiNum;
  console.log(busiNum);
  // 쿼리
  const [searchParmas] = useSearchParams();
  const strfId = searchParmas.get("strfId");
  const category = searchParmas.get("category");
  const edit = searchParmas.get("edit");
  // navigate
  const navigate = useNavigate();
  const navigateToStore = () => {
    navigate(`/business/store?strfId=${strfId}&category=${category}&tab=0`);
  };
  // recoil
  const [strfData, _] = useRecoilState(strfAtom);
  const initialFileList: UploadFile[] = strfData.strfPics.map(
    (item, index) => ({
      uid: `-${index}`,
      name: item.strfPic,
      status: "done" as const,
      url: `${ProductPic}/${strfId}/${item.strfPic}`,
    }),
  );
  // useState
  const [fileList, setFileList] = useState(initialFileList);
  const [isLoading, setIsLoading] = useState(false);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState<boolean>(false);
  // Form
  const [form] = useForm();
  const onFinish = async (values: any) => {
    console.log("form", values);
    const pData = {
      strfId,
      busiNum,
    };
    const formData = new FormData();
    if (!fileList || fileList.length === 0) {
      console.error("fileList가 비어 있습니다!");
      return;
    }
    formData.append(
      "p",
      new Blob([JSON.stringify(pData)], { type: "application/json" }),
    );
    if (fileList.length ?? 0 > 0) {
      fileList.forEach(image => {
        formData.append("strfPic", image.originFileObj as File);
      });
    }
    await updateStrfPic(formData);
  };
  // antD 이미지
  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };
  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  // API 사진 변경
  const updateStrfPic = async (
    formData: FormData,
  ): Promise<IAPI<string> | null> => {
    const url = "/api/detail/strf/pic";
    setIsLoading(true);
    try {
      const res = await axios.patch<IAPI<string>>(
        `${url}?strfId=${strfId}&busiNum=${busiNum}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        setIsLoading(false);
        message.success("사진 변경을 성공했습니다");
        navigateToStore();
      }
      console.log("사진 변경", res.data);
      return resultData;
    } catch (error) {
      console.log("사진 변경", error);
      message.error("사진 변경에 실패했습니다");
      setIsLoading(false);
      return null;
    }
  };

  // 우편 번호 및 주소
  useEffect(() => {
    // Daum 우편번호 스크립트 로드
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  // 우편번호 검색
  const handleComplete = (data: any) => {
    console.log("data", data);
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
  };
  // 카카오 REST API
  const getGeoCode = async (address: string): Promise<IGetGeoCode | null> => {
    const url = "https://dapi.kakao.com/v2/local/search/address";
    try {
      const res = await axios.get<IGetGeoCode>(`${url}?query=${address}`, {
        headers: {
          Authorization: `KakaoAK ${import.meta.env.VITE_KKO_REST_API_KEY}`,
        },
      });
      console.log("좌표", res.data.documents[0]);

      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return null;
    }
  };

  return (
    <div className="px-4 py-4">
      <Spin spinning={isLoading}>
        {edit === "address" && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <h3 className="text-slate-700 text-lg font-semibold">
                <i className="text-secondary3_3">*</i> 업체 주소
              </h3>
              <p className="text-base text-slate-500">
                고객이 방문할 수 있는 주소를 적어주세요.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full justify-between">
              <label className="text-sm text-slate-700 flex items-center gap-3 whitespace-nowrap w-full">
                우편번호
                <Input
                  size="large"
                  placeholder="우편번호를 입력해주세요."
                  className="w-full"
                />
              </label>
              <Button
                type="primary"
                size="large"
                onClick={() => setIsPostcodeOpen(true)}
              >
                검색
              </Button>
            </div>
            <label className="text-sm text-slate-700 flex items-center gap-9 whitespace-nowrap w-full">
              주소
              <Input
                size="large"
                placeholder="주소를 입력해주세요."
                className="w-full"
              />
            </label>
            <label className="text-sm text-slate-700 flex items-center gap-3 whitespace-nowrap w-full">
              상세주소
              <Input
                size="large"
                placeholder="상세주소를 입력해주세요."
                className="w-full"
              />
            </label>
            {isPostcodeOpen && (
              <DaumPostcodeEmbed
                onComplete={handleComplete}
                onClose={() => setIsPostcodeOpen(false)}
                style={{ height: "450px" }}
              />
            )}
          </div>
        )}
        {edit === "strfPic" && (
          <Form
            form={form}
            onFinish={onFinish}
            name="edit"
            className="flex flex-col gap-5"
          >
            <Form.Item
              name="strfPic"
              rules={[
                {
                  required: true,
                  message: "메뉴 사진을 등록해주세요.",
                  validator: () => {
                    if (fileList.length > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("메뉴 사진을 등록해주세요."),
                    );
                  },
                },
              ]}
              help={`${matchName(category)} 이미지는 다수(최대 5장)을 등록하실 수 있습니다.`}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                beforeUpload={() => false}
                accept="image/*"
                maxCount={5}
              >
                {fileList.length < 5 && "+ Upload"}
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="text-lg"
              >
                등록하기
              </Button>
            </Form.Item>
          </Form>
        )}
      </Spin>
    </div>
  );
};

export default StroeEdit;
