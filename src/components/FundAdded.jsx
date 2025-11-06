import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  message,
} from "antd";
import axios from "axios";
import { baseurl } from "../helper/Helper";

// hkfksd

const FundAdded = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFund, setEditingFund] = useState(null);
  const [form] = Form.useForm();


  const admin = JSON.parse(localStorage.getItem("auth"))
  
  // ✅ Fetch all funds
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseurl}/api/funds/get/${admin.user._id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch funds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Open Add Modal
  const handleAdd = () => {
    setEditingFund(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // ✅ Open Edit Modal
  const handleEdit = (record) => {
    setEditingFund(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // ✅ Delete Fund
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseurl}/api/funds/delete/${id}`);
      message.success("Fund deleted successfully!");
      fetchData();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete fund");
    }
  };

  // ✅ Create or Update Fund
  const handleSubmit = async (values) => {
    try {


       const updatedValues = { 
      ...values, 
      admin: admin.user._id
    };

      if (editingFund) {
        await axios.put(`${baseurl}/api/funds/update/${editingFund._id}`, updatedValues);
        message.success("Fund updated successfully!");
      } else {

        
        await axios.post(`${baseurl}/api/funds/create`, updatedValues);
        message.success("Fund created successfully!");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      message.error("Failed to save fund");
    }
  };

  // ✅ Table Columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Account", dataIndex: "account", key: "account" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "date", dataIndex: "date", key: "date" },
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
          Fund Management
        </h1>
        <Button type="primary" onClick={handleAdd}>
          + Add Fund
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
        title={editingFund ? "Edit Fund" : "Add Fund"}
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
            name="account"
            label="Account"
            rules={[{ required: true, message: "Please enter account" }]}
          >
            <Input placeholder="Enter Account" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber className="w-full" placeholder="Enter Price" />
          </Form.Item>

          <Form.Item
                      name="date"
                      label="Date"
                      rules={[{ required: true, message: "Please select date" }]}
                    >
                       <Input placeholder="Enter date" />
                    </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select>
              <Select.Option value="success">Success</Select.Option>
              <Select.Option value="pending">Pending</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              {editingFund ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FundAdded;
