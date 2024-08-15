import { useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { GetAllOrganizationsOfDonar } from "../../../apicalls/users";
import { Table, message } from "antd";
import { useEffect, useState } from "react";
import { getDateFormat } from "../../../utiils/helpers";

const Organizations = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Organization Name",
      dataIndex: "organizationName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
  ];

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllOrganizationsOfDonar();
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

  return <Table className="mt-3" columns={columns} dataSource={data} />;
};

export default Organizations;
