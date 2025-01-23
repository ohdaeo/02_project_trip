import { Button, Divider, Form, Input } from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 0,
    },
  },
};

// 약관 동의
const CheckboxGroup = Checkbox.Group;
const plainOptions = [
  { label: "[필수] 만 14세 이상입니다.", value: "required-1" },
  { label: "[필수] 서비스 이용약관", value: "required-2" },
  { label: "[필수] 개인정보 수집 및 이용 동의", value: "required-3" },
  { label: "[필수] 위치서비스 이용 동의", value: "required-4" },
  { label: "[선택] 이벤트 및 할인 혜택 안내 동의", value: "option-1" },
];
const defaultCheckedList = [];
// 필수 약관 체크 기준
// const requiredOptionArr = plainOptions.filter(item =>
//   item.includes("required"),
// );
// const requiredOptionLength = requiredOptionArr.length;
// const optionArr = plainOptions.filter(item => item.includes("option"));

const SignUpUser = () => {
  const [form] = Form.useForm();
  // useState
  const [formLayout, setFormLayout] = useState("vertical");
  const [formData, setFormData] = useState({});
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [validateStatus, setValidateStatus] = useState(null); // validateStatus 상태
  // useNavigate
  const navigate = useNavigate();
  const handleClickNavigate = () => {
    navigate(``, { state: formData });
  };

  // 약관 체크
  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < plainOptions.length;

  const onChange = list => {
    setCheckedList(list);
  };

  const onCheckAllChange = e => {
    setCheckedList(
      e.target.checked ? plainOptions.map(option => option.value) : [],
    );
  };
  //getiDCheck
  const getIdCheck = async () => {
    console.log("아이디 중복 체크 시도");
    setValidateStatus("validating");
    try {
      const res = await axios.get(`/api/user/sign-up?email=email`);
      setValidateStatus("success");
      console.log("아이디 중복 체크", res.data);
    } catch (error) {
      console.log(error);
      setValidateStatus("error");
    }
  };
  // post emailLink api
  const postEmail = async data => {
    console.log("이메일 발송 데이터:", data);

    try {
      const res = await axios.get(`/api/mail?email=email`, data);
      console.log("이메일 발송 결과:", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // post signUp api
  const handleClickPost = async data => {
    try {
      const res = await axios.post(`/api/signUpUser`, data);
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = values => {
    const optionArr = checkedList.filter(item => item === "option");
    const requiredArr = checkedList.filter(item => item.includes("required"));
    const { confirm, ...filterData } = values;
    const emailData = values.email;
    // console.log("emailData", emailData);
    const postData = {
      ...filterData,
      profile_pic: null,
      busi_num: null,
      agree: optionArr.length,
    };
    setFormData(postData);
    console.log("보내지는 데이터:", postData);
    if (requiredArr.length === 4 && validateStatus === "success") {
      console.log("이메일 링크 요청", { email: emailData });
      postEmail({ email: emailData });
    } else {
      console.log("제출 조건에 맞지 않음");
    }
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={values => onFinish(values)}
      style={{ maxWidth: 600 }}
      layout={formLayout}
      scrollToFirstError
    >
      {/* 이름 */}
      <Form.Item
        name="name"
        label="이름"
        rules={[
          {
            required: true,
            message: "이름은 필수 입력 항목입니다.",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      {/* 이메일 */}
      <Form.Item
        name="email"
        label="이메일"
        rules={[
          {
            type: "email",
            message:
              "이메일 형식에 맞지 않는 메일 주소입니다. 다시 입력해주세요.",
          },
          {
            required: true,
            message: "이메일은 필수 입력 항목입니다.",
          },
        ]}
        hasFeedback
        validateStatus={validateStatus}
      >
        <Input onBlur={() => getIdCheck()} />
      </Form.Item>
      {/* 비밀번호 */}
      <Form.Item
        name="pw"
        label="비밀번호"
        rules={[
          {
            required: true,
            message: "비밀번호는 필수 입력 항목입니다.",
          },
          {
            pattern:
              /^(?=.*[A-Za-z])(?=.*[\d~!@#$%^&*()_+=])[A-Za-z\d~!@#$%^&*()_+=]{8,20}$/,
            message:
              "비밀번호는 반드시 8-20자 이내 숫자, 특수문자(), 영문자 중 2가지 이상을 조합하셔야 합니다",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      {/* 비밀번호 확인 */}
      <Form.Item
        name="confirm"
        label="비밀번호 확인"
        dependencies={["password"]}
        rules={[
          {
            required: true,
            message: "비밀번호 확인은 필수 입력 항목입니다.",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("pw") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("비밀번호가 일치하지 않습니다. 다시 입력해주세요."),
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      {/* 약관 동의 */}
      <Checkbox
        indeterminate={indeterminate}
        onChange={onCheckAllChange}
        checked={checkAll}
      >
        Check all
      </Checkbox>
      <Divider />
      <CheckboxGroup
        options={plainOptions}
        value={checkedList}
        onChange={onChange}
        style={{ display: "flex", flexDirection: "column" }}
      />
      {/* 제출 버튼 */}
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" block>
          다음
        </Button>
      </Form.Item>
    </Form>
  );
};
export default SignUpUser;
