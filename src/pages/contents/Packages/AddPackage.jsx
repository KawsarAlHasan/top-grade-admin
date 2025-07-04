import React, { useState } from "react";
import { API } from "../../../api/api";
import { useParams } from "react-router-dom";
import { Button, Modal, Input, InputNumber, message } from "antd";
import { useForm, Controller } from "react-hook-form";

function AddPackage({ refetch }) {
  const { courseDetailsID } = useParams();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await API.post(`/content/package/create`, {
        course_details_id: courseDetailsID,
        title: data.title,
        price: data.price,
        duration: data.duration,
        intro_url: data.intro_url,
        description: data.description,
      });

      if (response.data.success) {
        message.success("Package added successfully!");
        refetch();
        setVisible(false);
        reset();
      }
    } catch (error) {
      console.log(error, "error");
      message.error(error.response?.data?.message || "Failed to add package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        type="primary"
        className="bg-blue-500 hover:bg-blue-600 text-white"
        onClick={() => setVisible(true)}
      >
        Add New Package
      </Button>

      <Modal
        title="Add New Package"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter package title"
                  status={errors.title ? "error" : ""}
                />
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Price</label>
            <Controller
              name="price"
              control={control}
              rules={{ required: "Price is required" }}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className="w-full"
                  placeholder="Enter package price"
                  min={0}
                  status={errors.price ? "error" : ""}
                />
              )}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Duration (Minutes)
            </label>
            <Controller
              name="duration"
              control={control}
              rules={{ required: "Duration is required" }}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className="w-full"
                  placeholder="Enter duration in days"
                  min={1}
                  status={errors.duration ? "error" : ""}
                />
              )}
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.duration.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Intro Video URL</label>
            <Controller
              name="intro_url"
              control={control}
              rules={{
                required: "Intro URL is required",
                // pattern: {
                //   value:
                //     /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                //   message: "Please enter a valid URL",
                // },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter intro video URL"
                  status={errors.intro_url ? "error" : ""}
                />
              )}
            />
            {errors.intro_url && (
              <p className="text-red-500 text-sm mt-1">
                {errors.intro_url.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  rows={4}
                  placeholder="Enter package description"
                  status={errors.description ? "error" : ""}
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button onClick={() => setVisible(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Submit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AddPackage;
