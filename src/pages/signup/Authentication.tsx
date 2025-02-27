import { Button, Form, Input } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TitleHeaderTs from "../../components/layout/header/TitleHeaderTs";
import "../../styles/antd-styles.css";

interface CERTProps {
  email: string;
  code: string;
}

const Authentication = (): JSX.Element => {
  const [isEmail, setIsEmail] = useState("");
  const [certCode, setCertCode] = useState("");
  const [timer, setTimer] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.state?.userType;

  const getEmailCode = async (): Promise<string | null> => {
    try {
      const res = await axios.get<string | null>(`/api/mail?email=${isEmail}`);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log("error :", error);
      return null;
    }
  };

  const postCERT = async ({
    email,
    code,
  }: CERTProps): Promise<CERTProps | null> => {
    try {
      const res = await axios.post<CERTProps>(`/api/mail`, {
        email,
        code,
      });
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    if (timer !== null && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsExpired(true);
    }
  }, [timer]);

  const onSubmit = async () => {
    const result = await postCERT({
      email: isEmail,
      code: certCode,
    });

    if (result) {
      // 인증 성공 시 userType에 따라 적절한 페이지로 이동
      if (userType === "user") {
        navigate("/signup/user");
      } else if (userType === "business") {
        navigate("/signup/business");
      }
    }
  };

  const handleRequestCode = async () => {
    setTimer(300); // 5분 타이머 시작
    setIsExpired(false);
    await getEmailCode();
  };

  return (
    <div>
      <TitleHeaderTs
        title="이메일 인증"
        icon="back"
        onClick={() => navigate(-1)}
      />
      <Form
        autoComplete="off"
        className="mt-6 px-4"
        onFinish={onSubmit} // Form 제출 핸들러 추가
      >
        <Form.Item
          label="이메일"
          className="custom-form-item !text-xs"
          rules={[{ required: true, message: "Please input!" }]}
        >
          <Input
            placeholder="이메일을 입력하세요"
            className="py-[14px] px-3"
            value={isEmail}
            onChange={e => setIsEmail(e.target.value)}
          />
          <Button
            type="primary"
            className="text-xs font-medium inline-block px-4 !h-auto"
            onClick={handleRequestCode}
            disabled={!isEmail}
          >
            인증코드 받기
          </Button>
        </Form.Item>

        <Form.Item
          label="인증코드"
          rules={[
            {
              required: true,
              message: isExpired
                ? "입력 시간이 초과되었습니다"
                : "인증 코드를 다시 입력해주세요",
            },
          ]}
          className="custom-form-item !text-xs mt-3"
        >
          <Input
            className="py-[14px] px-3 relative"
            value={certCode}
            onChange={e => setCertCode(e.target.value)}
            disabled={isExpired || timer === null}
          />
          <div className="text-secondary3 text-base absolute top-1/2 -translate-y-1/2 right-4 ">
            {timer !== null
              ? timer > 0
                ? `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`
                : "시간 초과"
              : ""}
          </div>
        </Form.Item>
        <p className="text-xs text-slate-400">
          메일을 받지 못했다면 인증 코드 재전송을 요청하거나 스팸 메일함을
          확인해 보세요. 이메일이 오지 않았나요?{" "}
          <span className="text-slate-600 underline cursor-pointer">
            이메일 재발송
          </span>
        </p>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="text-base py-3 !h-auto w-full mt-6"
            disabled={!isEmail || !certCode}
          >
            이메일 인증
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Authentication;
