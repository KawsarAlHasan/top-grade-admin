import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const API = axios.create({
  baseURL: "https://education-management-backend-8jm1.onrender.com/api/v1",
  // baseURL: "http://localhost:3001/api/v1",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// get admin
export const useAdminProfile = () => {
  const getAdmin = async () => {
    const response = await API.get("/admin/me");
    return response.data;
  };

  const {
    data: admin = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin"],
    queryFn: getAdmin,
  });

  return { admin, isLoading, isError, error, refetch };
};

// sign out
export const signOutAdmin = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};


export const useDashboard = () => {
  const getDashboard = async () => {
    const response = await API.get("/dashboard");
    return response.data;
  };

  const {
    data: dashboardData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: getDashboard,
  });

  return { dashboardData, isLoading, isError, error, refetch };
};

// get all user
export const useAllUsers = () => {
  const getAllUsers = async () => {
    const response = await API.get("/user/all?page=&limit=&status=");
    return response.data.data;
  };

  const {
    data: allUsers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });

  return { allUsers, isLoading, isError, error, refetch };
};

// /school-order

// get courses all
export const useAllCourses = () => {
  const getAllCourses = async () => {
    const response = await API.get("/courses/all");
    return response.data.data;
  };

  const {
    data: allCourses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allCourses"],
    queryFn: getAllCourses,
  });

  return { allCourses, isLoading, isError, error, refetch };
};



// get topics by course id
export const useTopicsByCoursesID = (coursesID) => {
  const getTopicsbyCoursesID = async () => {
    const response = await API.get(`/courses/with-topic/${coursesID}`);
    return response.data;
  };

  const {
    data: topicsByCoursesID = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["topicsByCoursesID", coursesID],
    queryFn: getTopicsbyCoursesID,
  });

  return { topicsByCoursesID, isLoading, isError, error, refetch };
};

// get single topics with teacher
export const useSingleTopicsWithTeacher = (topicId) => {
  const getTopicWithTeacher = async () => {
    const response = await API.get(`/courses-topic/${topicId}`);
    return response.data;
  };

  const {
    data: topicsWithTeacher = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["topicsWithTeacher", topicId],
    queryFn: getTopicWithTeacher,
  });

  return { topicsWithTeacher, isLoading, isError, error, refetch };
};

// courses-deatials/?course_topic_id=2&teacher_id=4
export const useCourseContents = (course_topic_id, teacher_id) => {
  const getContents = async () => {
    const response = await API.get(
      `/courses-deatials/?course_topic_id=${course_topic_id}&teacher_id=${teacher_id}`
    );

    return response.data;
  };

  const {
    data: contentsWithDetails = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["contentsWithDetails", course_topic_id, teacher_id],
    queryFn: getContents,
  });

  return { contentsWithDetails, isLoading, isError, error, refetch };
};

// courses-deatials by id
export const useCourseContentsByID = (course_details_id) => {
  const getContents = async () => {
    const response = await API.get(
      `/courses-deatials/single/${course_details_id}`
    );

    return response.data;
  };

  const {
    data: contentsWithDetailsByID = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["contentsWithDetailsByID", course_details_id],
    queryFn: getContents,
  });

  return { contentsWithDetailsByID, isLoading, isError, error, refetch };
};

// school courses start
// get courses all
export const useAllSchoolCourses = () => {
  const getAllSchoolCourses = async () => {
    const response = await API.get("/school-courses/all");
    return response.data.data;
  };

  const {
    data: allSchoolCourses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allSchoolCourses"],
    queryFn: getAllSchoolCourses,
  });

  return { allSchoolCourses, isLoading, isError, error, refetch };
};

// get single School Courses
export const useSingleSchoolCourse = (schoolCoursesID) => {
  const getSingleSchoolCourse = async () => {
    const response = await API.get(`/school-courses/${schoolCoursesID}`);
    return response.data;
  };

  const {
    data: singleSCDetail = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singleSCDetail", schoolCoursesID],
    queryFn: getSingleSchoolCourse,
  });

  return { singleSCDetail, isLoading, isError, error, refetch };
};

// get all Orders
export const useOrders = ({ page = 1, limit = 50, status } = {}) => {
  const getOrders = async () => {
    const response = await API.get("/order/all", {
      params: { page, limit, status },
    });
    return response.data;
  };

  const {
    data: response = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders", page, limit, status],
    queryFn: getOrders,
    keepPreviousData: true,
  });

  const { data: orders = [], pagination = {} } = response;

  return { orders, pagination, isLoading, isError, error, refetch };
};

// get single order
export const useSingleOrder = (orderId) => {
  const getSingleOrder = async () => {
    const response = await API.get(`/order/${orderId}`);
    return response.data;
  };

  const {
    data: singleOrder = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singleOrder", orderId],
    queryFn: getSingleOrder,
  });

  return { singleOrder, isLoading, isError, error, refetch };
};

// get all School Orders
export const useSchoolOrders = ({ page = 1, limit = 50, status } = {}) => {
  const getSchoolOrders = async () => {
    const response = await API.get("/school-order/all", {
      params: { page, limit, status },
    });
    return response.data;
  };

  const {
    data: response = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["schoolOrders", page, limit, status],
    queryFn: getSchoolOrders,
    keepPreviousData: true,
  });

  const { data: schoolOrders = [], pagination = {} } = response;

  return { schoolOrders, pagination, isLoading, isError, error, refetch };
};

// get single School order
export const useSingleSchoolOrder = (schoolOrderId) => {
  const getSingleSchoolOrder = async () => {
    const response = await API.get(`/school-order/single/${schoolOrderId}`);
    return response.data;
  };

  const {
    data: singleSchoolOrder = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singleSchoolOrder", schoolOrderId],
    queryFn: getSingleSchoolOrder,
  });

  return { singleSchoolOrder, isLoading, isError, error, refetch };
};

// get single School order
export const useSingleVideoPackage = (contentID) => {
  const getSingleVideoPackage = async () => {
    const response = await API.get(`/video/package/${contentID}`);
    return response.data;
  };

  const {
    data: singleVideoPackage = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singleVideoPackage", contentID],
    queryFn: getSingleVideoPackage,
  });

  return { singleVideoPackage, isLoading, isError, error, refetch };
};



// get all coupon code
export const useAllCoupons = () => {
  const getAllCoupons = async () => {
    const response = await API.get(`/coupon`);
    return response.data;
  };

  const {
    data: allCoupons = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allCoupons"],
    queryFn: getAllCoupons,
  });

  return { allCoupons, isLoading, isError, error, refetch };
};




// not use
// not use
// not use
// not use
// not use

export const useGlobalData = (table, { status, page = 1, limit = 10 }) => {
  const fetchGlobalData = async () => {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(status && { status }),
    });

    const res = await API.get(`/global/${table}`, {
      params: { page, limit, status },
    });
    return res.data;
  };

  const {
    data = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["globalData", table, status, page, limit],
    queryFn: fetchGlobalData,
    keepPreviousData: true,
  });

  return {
    globalData: data.data || [],
    pagination: data.pagination || {},
    isLoading,
    isError,
    error,
    refetch,
  };
};



