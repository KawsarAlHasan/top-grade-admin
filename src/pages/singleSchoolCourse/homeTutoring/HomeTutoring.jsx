import React from "react";
import { useParams } from "react-router-dom";

function HomeTutoring() {
  const { schoolCoursesID } = useParams();

  return <div>HomeTutoring</div>;
}

export default HomeTutoring;
