// Order1.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  message,
} from "antd";
import axios from "axios";
import { baseurl } from "../helper/Helper";

const Order1 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form] = Form.useForm();

  const admin = JSON.parse(localStorage.getItem("auth"))

  // ✅ Fetch all orders
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseurl}/api/orders1/getAll/${admin.user._id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Open Add Modal
  const handleAdd = () => {
    setEditingOrder(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // ✅ Open Edit Modal
  const handleEdit = (record) => {
    setEditingOrder(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // ✅ Delete Order
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseurl}/api/orders1/${id}`);
      message.success("Order deleted successfully!");
      fetchData();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete order");
    }
  };

  // ✅ Create or Update Order
  const handleSubmit = async (values) => {
    try {
          const updatedValues = { 
      ...values, 
      admin: admin.user._id
    };

      if (editingOrder) {
        await axios.put(`${baseurl}/api/orders1/${editingOrder._id}`, updatedValues);
        message.success("Order updated successfully!");
      } else {
        await axios.post(`${baseurl}/api/orders1/create`, updatedValues);
        message.success("Order created successfully!");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      message.error("Failed to save order");
    }
  };

  // ✅ Table Columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Date", dataIndex: "date", key: "date" },
    // { title: "Equity", dataIndex: "equity", key: "equity" },
    { title: "Price 1", dataIndex: "price1", key: "price1" },
    { title: "Price 2", dataIndex: "price2", key: "price2" },
    { title: "Price 3", dataIndex: "price3", key: "price3" },
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
          Order1 Management
        </h1>
        <Button type="primary" onClick={handleAdd}>
          + Add Order
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
        title={editingOrder ? "Edit Order" : "Add Order"}
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

          <Form.Item name="date" label="Date">
            <Input placeholder="Expiring Tommorrow" />
          </Form.Item>

          {/* <Form.Item name="equity" label="Equity">
            <Input placeholder="Enter Equity" />
          </Form.Item> */}

          <Form.Item name="price1" label="Price 1">
            <InputNumber className="w-full" placeholder="Enter Price 1" />
          </Form.Item>

          <Form.Item name="price2" label="Price 2">
            <InputNumber className="w-full" placeholder="Enter Price 2" />
          </Form.Item>

          <Form.Item name="price3" label="Price 3">
            <Input placeholder="Enter Price 3" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              {editingOrder ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Order1;
