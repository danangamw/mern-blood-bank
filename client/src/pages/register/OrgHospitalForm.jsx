import { Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { getAntdInputValidation } from "../../utiils/helpers";

// eslint-disable-next-line react/prop-types
const OrgHospitalForm = ({ type }) => {
  return (
    <>
      <Form.Item
        label={type === "hospital" ? "Hospital Name" : "Organization Name"}
        name={type === "hospital" ? "hospitalName" : "organizationName"}
        rules={getAntdInputValidation()}
      >
        <Input />
      </Form.Item>

      <Form.Item name="owner" label="owner" rules={getAntdInputValidation()}>
        <Input />
      </Form.Item>

      <Form.Item name="email" label="Email" rules={getAntdInputValidation()}>
        <Input />
      </Form.Item>

      <Form.Item name="phone" label="Phone" rules={getAntdInputValidation()}>
        <Input />
      </Form.Item>

      <Form.Item
        name="website"
        label="Website"
        rules={getAntdInputValidation()}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={getAntdInputValidation()}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="address"
        label="Address"
        className="col-span-2"
        rules={getAntdInputValidation()}
      >
        <TextArea />
      </Form.Item>
    </>
  );
};

export default OrgHospitalForm;
