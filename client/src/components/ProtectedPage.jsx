import { message } from "antd";
import { GetCurrentUser } from "../apicalls/users";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser } from "../redux/usersSlice";
import { SetLoading } from "../redux/loadersSlice";
import { getLoggedinUsername } from "../utiils/helpers";

// eslint-disable-next-line react/prop-types
const ProtectedPage = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const getCurrentUser = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetCurrentUser();
      dispatch(SetLoading(false));
      if (response.success) {
        // setCurrentUser(response.data);
        dispatch(SetCurrentUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      if (error.message === "jwt expired") {
        localStorage.removeItem("token");
        navigate("/login");
        message.error("your session has ended");
        return;
      }
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
      return;
    } else {
      navigate("/login");
    }
  }, []);

  return (
    currentUser && (
      <section>
        {/* header */}
        <section className=" bg-primary text-white p-5 py-3">
          <section className="sm:max-w-3xl lg:max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl">Bloodbank</h1>
              <span className="text-xs">
                {currentUser.userType.toUpperCase()}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <i className="ri-shield-user-line"></i>
                <div className="flex flex-col">
                  <span className="mr-5 text-md cursor-pointer">
                    <Link to="/profile">
                      {getLoggedinUsername(currentUser).toUpperCase()}
                    </Link>
                  </span>
                </div>

                <div className="ml-3">
                  <i
                    className="ri-logout-circle-r-line text-red-500 cursor-pointer"
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                    }}
                  ></i>
                </div>
              </div>
            </div>
          </section>
        </section>

        {/* body */}
        <section className="px-5 py-2 xl:max-w-7xl lg:mx-auto">
          {children}
        </section>
      </section>
    )
  );
};

export default ProtectedPage;
