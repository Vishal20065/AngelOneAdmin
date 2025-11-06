import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Popconfirm,
  message,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { baseurl } from "../helper/Helper";

const Profits = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfit, setEditingProfit] = useState(null);
  const [form] = Form.useForm();

    const admin = JSON.parse(localStorage.getItem("auth"))
  // ✅ Fetch all profits
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseurl}/api/profits/getAll/${admin.user._id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch profits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Open Add Modal
  const handleAdd = () => {
    setEditingProfit(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // ✅ Open Edit Modal
  const handleEdit = (record) => {
    setEditingProfit(record);
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date) : null,
    });
    setIsModalOpen(true);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseurl}/api/profits/delete/${id}`);
      message.success("Profit deleted successfully!");
      fetchData();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete profit");
    }
  };

  // ✅ Create or Update
  const handleSubmit = async (values) => {
     const updatedValues = { 
      ...values, 
      admin: admin.user._id
    };

    try {
      if (editingProfit) {
        await axios.put(`${baseurl}/api/profits/update/${editingProfit._id}`, updatedValues);
        message.success("Profit updated successfully!");
      } else {
        await axios.post(`${baseurl}/api/profits/create`, updatedValues);
        message.success("Profit created successfully!");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      message.error("Failed to save profit");
    }
  };

  // ✅ Table Columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Equity", dataIndex: "equity", key: "equity" },
    { title: "Realised P&L", dataIndex: "realisedPl", key: "realisedPl" },
    { title: "Charges", dataIndex: "charges", key: "charges" },
    { title: "Net Realised", dataIndex: "netRealised", key: "netRealised" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Profit Management
        </h1>
        <Button type="primary" onClick={handleAdd}>
          + Add Profit
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          className="p-2"
          scroll={{ x: "max-content" }}
        />
      </div>

      {/* Add / Edit Modal */}
      <Modal
        title={editingProfit ? "Edit Profit" : "Add Profit"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter Name" />
          </Form.Item>

          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select date" }]}
          >
             <Input placeholder="Enter date" />
          </Form.Item>

          <Form.Item name="equity" label="Equity">
            <Input placeholder="Enter Equity" />
          </Form.Item>

          <Form.Item name="realisedPl" label="Realised P&L">
  <InputNumber
    className="w-full"
    placeholder="Enter Realised P&L"
    min={-Infinity}   // ✅ allows negative numbers
  />
</Form.Item>

<Form.Item name="charges" label="Charges">
  <InputNumber
    className="w-full"
    placeholder="Enter Charges"
    min={-Infinity}   // ✅ allows negative numbers
  />
</Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              {editingProfit ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profits;
