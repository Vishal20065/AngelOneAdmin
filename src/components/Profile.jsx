// Profile.jsx
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

const Profile = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [form] = Form.useForm();
const admin = JSON.parse(localStorage.getItem("auth"))
  // ✅ Fetch all profiles
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseurl}/api/profiles/get/${admin.user._id}`);
      setData(res.data.data);
    //   console.log(res.data.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Open Add Modal
  const handleAdd = () => {
    setEditingProfile(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // ✅ Open Edit Modal
  const handleEdit = (record) => {
    setEditingProfile(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // ✅ Delete Profile
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseurl}/api/profiles/dalete/${id}`);
      message.success("Profile deleted successfully!");
      fetchData();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete profile");
    }
  };

  // ✅ Create or Update Profile
  const handleSubmit = async (values) => {
    try {

       const updatedValues = { 
      ...values, 
      admin: admin.user._id
    };
      if (editingProfile) {
        await axios.put(`${baseurl}/api/profiles/update/${editingProfile._id}`, updatedValues);
        message.success("Profile updated successfully!");
      } else {
        await axios.post(`${baseurl}/api/profiles/create`, updatedValues);
        message.success("Profile created successfully!");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      message.error("Failed to save profile");
    }
  };

  // ✅ Table Columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Client ID", dataIndex: "clientId", key: "clientId" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Date", dataIndex: "date", key: "date" },
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
          Profile Management
        </h1>
        {/* <Button type="primary" onClick={handleAdd}>
          + Add Profile
        </Button> */}
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
        title={editingProfile ? "Edit Profile" : "Add Profile"}
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
            name="clientId"
            label="Client ID"
            rules={[{ required: true, message: "Please enter client ID" }]}
          >
            <Input placeholder="Enter Client ID" />
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
            rules={[{ required: true, message: "Please enter date" }]}
          >
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              {editingProfile ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
