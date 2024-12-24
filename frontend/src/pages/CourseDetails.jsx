import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { Footer, Loader, SearchThings } from "../components";
import axios from "axios";
import "../styles/Courses.css";
import "../styles/Components.css";
// import "../styles/AllUsers.css";

const CourseDetails = () => {
  const [courses, setCourses] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearchResults = (e) => {
    // e.preventDefault();
    setLoading(true);
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        const searchedResults = courses.filter((item) =>
          item.courseCode.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedResults(searchedResults);
      }, 500)
    );
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/courses/get-courses", {
        headers: { "x-auth-token": token },
      })
      .then((response) => {
        const sortedCourses = response.data.sort((a, b) =>
          a.courseCode.localeCompare(b.courseCode)
        );
        setCourses(sortedCourses);
      })
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="courses-details-container">
        <SearchThings
          searchText={searchText}
          handleSearchChange={handleSearchResults}
        />
        <div className="course-details-list">
          <h2 className="course-title">Course Details</h2>
          <hr style={{ marginBottom: "0.3rem" }} />
          {searchText ? (
            <>
              {loading ? (
                <>
                  <div className="loader-container-actual">
                    <Loader />
                  </div>
                </>
              ) : (
                <>
                  {searchedResults?.length > 0 ? (
                    <>
                      <ul className="course-info-list">
                        <li className="list-header course-info-items course-info-item-id">
                          Course Code
                        </li>
                        <li className="list-header course-info-items">
                          Course Title
                        </li>
                        <li className="list-header course-info-items">
                          Credit
                        </li>
                      </ul>
                      {searchedResults.map((course, index) => (
                        <ul
                          key={course._id}
                          className={
                            index % 2
                              ? "course-info-list-inner custom-bg-1"
                              : "course-info-list-inner custom-bg-3"
                          }
                        >
                          <li className="course-info-items course-info-item-id">
                            {course.courseCode}
                          </li>
                          <li className="course-info-items">{course.name}</li>
                          <li className="course-info-items">{course.credit}</li>
                        </ul>
                      ))}
                    </>
                  ) : (
                    <>
                      <h2 className="no-users-data">
                        No Searched Result Found.
                      </h2>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {loading ? (
                <>
                  <div className="loader-container-actual">
                    <Loader />
                  </div>
                </>
              ) : (
                <>
                  {courses?.length > 0 ? (
                    <>
                      <ul className="course-info-list">
                        <li className="list-header course-info-items course-info-item-id">
                          Course Code
                        </li>
                        <li className="list-header course-info-items">
                          Course Title
                        </li>
                        <li className="list-header course-info-items">
                          Credit
                        </li>
                      </ul>
                      {courses.map((course, index) => (
                        <ul
                          key={course._id}
                          className={
                            index % 2
                              ? "course-info-list-inner custom-bg-1"
                              : "course-info-list-inner custom-bg-3"
                          }
                        >
                          <li className="course-info-items course-info-item-id">
                            {course.courseCode}
                          </li>
                          <li className="course-info-items">{course.name}</li>
                          <li className="course-info-items">{course.credit}</li>
                        </ul>
                      ))}
                    </>
                  ) : (
                    <>
                      <h2 className="no-users-data">No Courses Found.</h2>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetails;
