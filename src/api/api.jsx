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

// get Category
export const useCategory = (status) => {
  const getCategory = async () => {
    const response = await API.get("/category/all", {
      params: { status },
    });
    return response.data.data;
  };

  const {
    data: category = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["category", status],
    queryFn: getCategory,
  });

  return { category, isLoading, isError, error, refetch };
};

// get Flavor
export const useFlavor = () => {
  const getFlavor = async () => {
    const response = await API.get("/flavor/all");
    return response.data.data;
  };

  const {
    data: flavor = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["flavor"],
    queryFn: getFlavor,
  });

  return { flavor, isLoading, isError, error, refetch };
};

// get Product feature
export const useFeature = () => {
  const getFeature = async () => {
    const response = await API.get(`/feature/all/1`);
    return response.data;
  };

  const {
    data: feature = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["feature"],
    queryFn: getFeature,
  });

  return { feature, isLoading, isError, error, refetch };
};

// get Dip
export const useDip = () => {
  const getDip = async () => {
    const response = await API.get("/dip/all");
    return response.data.data;
  };

  const {
    data: dip = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dip"],
    queryFn: getDip,
  });

  return { dip, isLoading, isError, error, refetch };
};

// get Drink
export const useDrink = () => {
  const getDrink = async () => {
    const response = await API.get("/drink/all");
    return response.data.data;
  };

  const {
    data: drink = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["drink"],
    queryFn: getDrink,
  });

  return { drink, isLoading, isError, error, refetch };
};

// get Drink
export const useDrinkName = () => {
  const getDrinkName = async () => {
    const response = await API.get("/drink-name/all");
    return response.data.data;
  };

  const {
    data: drinkname = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["drinkname"],
    queryFn: getDrinkName,
  });

  return { drinkname, isLoading, isError, error, refetch };
};

// get Beverage
export const useBeverage = () => {
  const getBeverage = async () => {
    const response = await API.get("/beverage/all");
    return response.data.data;
  };

  const {
    data: beverage = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["beverage"],
    queryFn: getBeverage,
  });

  return { beverage, isLoading, isError, error, refetch };
};

// get side
export const useSide = () => {
  const getSide = async () => {
    const response = await API.get("/side/all");
    return response.data.data;
  };

  const {
    data: side = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["side"],
    queryFn: getSide,
  });

  return { side, isLoading, isError, error, refetch };
};

// get Toppings
export const useToppings = () => {
  const getToppings = async () => {
    const response = await API.get("/toppings/all");
    return response.data.data;
  };

  const {
    data: toppings = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["toppings"],
    queryFn: getToppings,
  });

  return { toppings, isLoading, isError, error, refetch };
};

// get Sauce
export const useSauce = () => {
  const getSauce = async () => {
    const response = await API.get("/sauce/all");
    return response.data.data;
  };

  const {
    data: sauces = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["sauces"],
    queryFn: getSauce,
  });

  return { sauces, isLoading, isError, error, refetch };
};

// get Fish choice
export const useFishChoice = () => {
  const getFishChoice = async () => {
    const response = await API.get("/fish-choice/all");
    return response.data.data;
  };

  const {
    data: fishChoice = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["fishChoice"],
    queryFn: getFishChoice,
  });

  return { fishChoice, isLoading, isError, error, refetch };
};

// get sand-cust
export const useSandCust = () => {
  const getSandCust = async () => {
    const response = await API.get("/sand-cust/all");
    return response.data.data;
  };

  const {
    data: sandCust = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["sandCust"],
    queryFn: getSandCust,
  });

  return { sandCust, isLoading, isError, error, refetch };
};

// get Food Menu
export const useFoodMenu = () => {
  const getFoodMenu = async () => {
    const response = await API.get("/foodmenu/admin");
    return response.data.data;
  };

  const {
    data: foodMenu = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["foodMenu"],
    queryFn: getFoodMenu,
  });

  return { foodMenu, isLoading, isError, error, refetch };
};

// get single Food Menu
export const useSingleFoodMenu = (foodMenuID) => {
  const getSingleFoodMenu = async () => {
    const response = await API.get(`/foodmenu/${foodMenuID}`);
    return response.data.data;
  };

  const {
    data: singleFoodMenu = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singleFoodMenu"],
    queryFn: getSingleFoodMenu,
  });

  return { singleFoodMenu, isLoading, isError, error, refetch };
};

// get Food Details
export const useFoodDatails = (foodMenuID) => {
  const getFoodDetails = async () => {
    const response = await API.get(
      `/food-details/all?food_menu_id=${foodMenuID}`
    );
    return response.data.data;
  };

  const {
    data: foodDetails = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["foodDetails", foodMenuID],
    queryFn: getFoodDetails,
  });

  return { foodDetails, isLoading, isError, error, refetch };
};

// get Food Details
export const useFoodDetail = (id) => {
  const getFoodDetail = async () => {
    const response = await API.get(`/food-details/${id}`);
    return response.data.data;
  };

  const {
    data: foodDetail = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["foodDetail", id],
    queryFn: getFoodDetail,
  });

  return { foodDetail, isLoading, isError, error, refetch };
};

// get all food details
export const useAllFoodDetails = ({
  page = 1,
  limit = 10,
  status,
  name,
} = {}) => {
  const getAllFoodDetails = async () => {
    const response = await API.get("/food-details/all", {
      params: { page, limit, status, name },
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
    queryKey: ["allFoodDetails", page, limit, status, name],
    queryFn: getAllFoodDetails,
    keepPreviousData: true,
  });

  const { data: allFoodDetails = [], pagination = {} } = response;

  return { allFoodDetails, pagination, isLoading, isError, error, refetch };
};

// get all food details Admin Panel
export const useAllFoodDetailsAdminPanel = ({ name, checkPrice } = {}) => {
  const getAllFoodDetailsAdminPanel = async () => {
    const response = await API.get("/food-details/admin-panel", {
      params: { name, checkPrice },
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
    queryKey: ["allFoodDetailsAdminPanel", name, checkPrice],
    queryFn: getAllFoodDetailsAdminPanel,
    keepPreviousData: true,
  });

  const { data: allFoodDetailsAdminPanel = [] } = response;

  return {
    allFoodDetailsAdminPanel,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// get Users
export const useUsers = () => {
  const getUsers = async () => {
    const response = await API.get("/user/all");
    return response.data.data;
  };

  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return { users, isLoading, isError, error, refetch };
};

// get User Details
export const useuserDetails = (id) => {
  const getUserDetails = async () => {
    const response = await API.get(`/user/${id}`);
    return response.data;
  };

  const {
    data: userDetails = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userDetails", id],
    queryFn: getUserDetails,
  });

  return { userDetails, isLoading, isError, error, refetch };
};

// get Food Details
export const useOrderDetails = (id) => {
  const getOrderDetails = async () => {
    const response = await API.get(`/orders/${id}`);
    return response.data.data;
  };

  const {
    data: orderDetails = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orderDetails", id],
    queryFn: getOrderDetails,
  });

  return { orderDetails, isLoading, isError, error, refetch };
};

// get delevery-fee
export const useDeleveryFee = () => {
  const getDeleveryFee = async () => {
    const response = await API.get("/settings/delevery-fee");
    return response.data.data;
  };

  const {
    data: deleveryFee = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["deleveryFee"],
    queryFn: getDeleveryFee,
  });

  return { deleveryFee, isLoading, isError, error, refetch };
};

// get terms
export const useTerms = () => {
  const getTerms = async () => {
    const response = await API.get("/settings/terms");
    return response.data.data;
  };

  const {
    data: terms = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["terms"],
    queryFn: getTerms,
  });

  return { terms, isLoading, isError, error, refetch };
};

// get privacy
export const usePrivacy = () => {
  const getPrivacy = async () => {
    const response = await API.get("/settings/privacy");
    return response.data.data;
  };

  const {
    data: privacy = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["privacy"],
    queryFn: getPrivacy,
  });

  return { privacy, isLoading, isError, error, refetch };
};

// get about
export const useAbout = () => {
  const getAbout = async () => {
    const response = await API.get("/settings/about");
    return response.data.data;
  };

  const {
    data: about = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["about"],
    queryFn: getAbout,
  });

  return { about, isLoading, isError, error, refetch };
};

// get tax
export const useTax = () => {
  const getTax = async () => {
    const response = await API.get("/settings/tax");
    return response.data.data;
  };

  const {
    data: tax = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tax"],
    queryFn: getTax,
  });

  return { tax, isLoading, isError, error, refetch };
};

// get Fees
export const useFees = () => {
  const getFees = async () => {
    const response = await API.get(`/fees`);
    return response.data.data;
  };

  const {
    data: fees = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["fees"],
    queryFn: getFees,
  });

  return { fees, isLoading, isError, error, refetch };
};
