import React, { useState } from "react";
import { Button, Modal, Form, Input, Upload, message, Typography } from "antd";
import { UploadOutlined, EditOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../api/api";

const { Title } = Typography;

function EditSchoolCourse({ course, refetch }) {
  const { control, handleSubmit, reset } = useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (course && visible) {
      reset({
        title: course.title || "",
      });
    }
  }, [course, visible, reset]);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    reset();
    setVisible(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("title", data.title);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0].originFileObj);
    }

    try {
      await API.put(`/school-courses/update/${course.id}`, formData);
      message.success("Course updated successfully!");
      refetch();
      handleCancel();
    } catch (error) {
      message.error("Failed to update course. Please try again.");
      console.error("Error updating course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button icon={<EditOutlined />} onClick={showModal}>
        Edit
      </Button>

      <Modal
        title={<Title level={3}>Edit Course: {course?.title}</Title>}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        centered
        destroyOnClose
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Image Upload */}
          <Form.Item label="Course Image">
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange, value } }) => {
                const initialFileList = course?.image
                  ? [
                      {
                        uid: "-1",
                        name: "Current Image",
                        status: "done",
                        url: course?.image,
                      },
                    ]
                  : [];

                return (
                  <Upload
                    listType="picture-card"
                    beforeUpload={() => false}
                    maxCount={1}
                    accept="image/*"
                    fileList={value || initialFileList}
                    onChange={({ fileList }) => {
                      if (fileList[0]?.originFileObj) {
                        onChange(fileList);
                      } else if (fileList.length === 0) {
                        onChange([]);
                      }
                    }}
                    onPreview={(file) => {
                      const src =
                        file.url || URL.createObjectURL(file.originFileObj);
                      const imgWindow = window.open(src);
                      imgWindow.document.write(
                        `<img src="${src}" style="width: 100%;" />`
                      );
                    }}
                  >
                    {value && value.length >= 1 ? null : (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload Image</div>
                      </div>
                    )}
                  </Upload>
                );
              }}
            />
          </Form.Item>

          {/* Course Title */}
          <Form.Item label="Course Title">
            <Controller
              name="title"
              control={control}
              rules={{ required: "Course title is required" }}
              render={({ field }) => (
                <Input placeholder="Enter course title..." {...field} />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Updating..." : "Update Course"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EditSchoolCourse;
