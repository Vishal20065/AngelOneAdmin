// Order2.jsx

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

const Order2 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form] = Form.useForm();
  const admin = JSON.parse(localStorage.getItem("auth"))

  // ✅ Fetch all orders2
  const fetchData = async () => {
    try {
      setLoading(true);
      // const res = await axios.get(`${baseurl}/api/orders2/getAll`);
      const res = await axios.get(`${baseurl}/api/orders2/getAll/${admin.user._id}`);
      setData(res.data);
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
      await axios.delete(`${baseurl}/api/orders2/${id}`);
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
        await axios.put(`${baseurl}/api/orders2/${editingOrder._id}`, updatedValues);
        message.success("Order updated successfully!");
      } else {
        await axios.post(`${baseurl}/api/orders2/create`, updatedValues);
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
    { title: "Avg", dataIndex: "Avg", key: "Avg" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Lot", dataIndex: "lot", key: "lot" },
    { title: "LTP", dataIndex: "ltp", key: "ltp" },
    { title: "LT %", dataIndex: "ltpercent", key: "ltpercent" },
    { title: "Buy", dataIndex: "buy", key: "buy" },
    { title: "Sell", dataIndex: "sell", key: "sell" },
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
          Order2 Management
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
            <Input placeholder="21-Aug-25 25050 PE" />
          </Form.Item>

          {/* <Form.Item name="equity" label="Equity">
            <Input placeholder="Enter Equity" />
          </Form.Item> */}

          <Form.Item name="Avg" label="Avg">
            <Input placeholder="Enter Avg" />
          </Form.Item>

          <Form.Item name="price" label="Price">
            <InputNumber className="w-full" placeholder="Enter Price" />
          </Form.Item>

          <Form.Item name="lot" label="Lot">
            <InputNumber className="w-full" placeholder="Enter Lot" />
          </Form.Item>

          <Form.Item name="ltp" label="LTP">
            <InputNumber className="w-full" placeholder="Enter LTP" />
          </Form.Item>

          <Form.Item name="ltpercent" label="LT %">
            <InputNumber className="w-full" placeholder="Enter LT %" />
          </Form.Item>

          <Form.Item name="buy" label="Buy">
            <InputNumber className="w-full" placeholder="Enter Buy" />
          </Form.Item>

          <Form.Item name="sell" label="Sell">
            <InputNumber className="w-full" placeholder="Enter Sell" />
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

export default Order2;
