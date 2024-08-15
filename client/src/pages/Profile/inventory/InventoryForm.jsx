import { Form, Input, Modal, Radio, message } from "antd";
import { useState } from "react";
import { getAntdInputValidation } from "../../../utiils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { AddInventory } from "../../../apicalls/inventory";

const InventoryForm = ({ open, setOpen, reloadData }) => {
  const { currentUser } = useSelector((state) => state.users);
  const [inventoryType, setInventoryType] = useState("in");
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      const response = await AddInventory({
        ...values,
        inventoryType,
        organization: currentUser._id,
      });
      dispatch(SetLoading(false));

      if (response.success) {
        message.success("Inventory Added Successfully");
        setOpen(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  return (
    <Modal
      title="ADD INVENTORY"
      open={open}
      onCancel={() => setOpen(false)}
      centered
      onOk={() => {
        form.submit();
      }}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Inventory Type">
          <Radio.Group onChange={(e) => setInventoryType(e.target.value)}>
            <Radio value="in">In</Radio>
            <Radio value="out">Out</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Blood Group"
          name="bloodGroup"
          rules={getAntdInputValidation()}
        >
          <select name="" id="">
            <option value="a+">A+</option>
            <option value="a-">A-</option>
            <option value="b+">B+</option>
            <option value="b-">B-</option>
            <option value="ab+">AB+</option>
            <option value="ab-">AB-</option>
            <option value="o+">O+</option>
            <option value="o-">O-</option>
          </select>
        </Form.Item>

        <Form.Item
          label={inventoryType == "out" ? "Hospital Email" : "Donar Email"}
          name="email"
          rules={getAntdInputValidation()}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Quantity (ml)"
          name="quantity"
          rules={getAntdInputValidation()}
        >
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InventoryForm;
