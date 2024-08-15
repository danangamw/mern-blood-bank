import { Button, Table, message } from "antd";
import InventoryForm from "./InventoryForm";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { GetInventory } from "../../../apicalls/inventory";
import { getDateFormat } from "../../../utiils/helpers";

const Inventory = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const columns = [
    {
      title: "Inventory Type",
      dataIndex: "inventoryType",
      key: "inventoryType",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      key: "bloodGroup",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => `${text} ML`,
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "refenrece",
      render: (text, record) => {
        if (record.inventoryType === "in") {
          return record.donar.name;
        } else {
          return record.hospital.hospitalName;
        }
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => getDateFormat(text),
    },
  ];

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetInventory();
      dispatch(SetLoading(false));
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="flex flex-col justify-end">
      <Button type="primary" className="w-36" onClick={() => setOpen(true)}>
        Add Inventory
      </Button>

      <Table className="mt-3" columns={columns} dataSource={data} />

      {open && <InventoryForm open={open} setOpen={setOpen} />}
    </section>
  );
};

export default Inventory;
