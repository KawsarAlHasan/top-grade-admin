import { useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { API } from "../../api/api";

function AddCourseTopic({ refetch }) {
  const { courseId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  // Modal Open
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Modal Close
  const handleCancel = () => {
    setIsModalOpen(false);
    reset(); // Reset form fields
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);

    const submitData = {
      name: data.name,
      courses_id: courseId,
    };

    try {
      const response = await API.post("/courses-topic/create", submitData);
      message.success("courses topic added successfully!");
      refetch();
      handleCancel(); // Close modal on success
    } catch (error) {
      message.error("Failed to add courses topic. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Add Course Topic
      </Button>
      <Modal
        title="Add Course Topic"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // Custom footer to use form submit
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Courses Topics name */}
          <Form.Item label="Course Topic name">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Course Topic Name is required" }}
              render={({ field }) => (
                <Input placeholder="Enter Course Topic Name..." {...field} />
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
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddCourseTopic;
