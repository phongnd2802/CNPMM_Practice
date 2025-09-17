import { useEffect, useState } from "react";
import { Table, notification } from "antd";
import { getUserApi } from "../util/api.js";

const columns = [
  { title: "Id", dataIndex: "id" },
  { title: "Name", dataIndex: "name" },
  { title: "Email", dataIndex: "email" },
  { title: "Role", dataIndex: "role" },
];

export default function UserPage() {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getUserApi();
      if (Array.isArray(res)) setDataSource(res);
      else notification.error({ message: "USER", description: res?.EM || "Không lấy được danh sách user" });
    })();
  }, []);

  return (
    <div className="container">
      <h2>Users</h2>
      <Table bordered dataSource={dataSource} columns={columns} rowKey="id" />
    </div>
  );
}
