import { Form, Input, Button, Radio, message } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { getAntdInputValidation } from "../../utiils/helpers";

const Login = () => {
  const [type, setType] = useState("donar");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      const response = await LoginUser({ ...values, userType: type });
      dispatch(SetLoading(false));

      if (response.success) {
        localStorage.setItem("token", response.data);
        message.success(response.message);
        navigate("/");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <section className="flex h-screen items-center justify-center bg-primary">
      <Form
        layout="vertical"
        className="bg-white rounded shadow p-5 gap-5 w-1/3"
        onFinish={onFinish}
      >
        <h1 className="uppercase text-xl mb-5">
          <span className="text-primary">{type.toUpperCase()} - Login</span>
          <hr />
        </h1>

        <Radio.Group onChange={(e) => setType(e.target.value)} className="mb-5">
          <Radio value="donar">Donar</Radio>
          <Radio value="hospital">Hospital</Radio>
          <Radio value="organization">Organization</Radio>
        </Radio.Group>

        <Form.Item label="Email" name="email" rules={getAntdInputValidation()}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={getAntdInputValidation()}
        >
          <Input type="password" />
        </Form.Item>

        <Button htmlType="submit" type="primary" block className="mb-5">
          Login
        </Button>

        <Link to="/register" className=" text-center text-gray-700 underline">
          Dont have an account ? Register
        </Link>
      </Form>
    </section>
  );
};

export default Login;
