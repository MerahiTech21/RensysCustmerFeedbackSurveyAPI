import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { buttonAction } from "../../store/slices/ButtonSpinerSlice";
import { userAction } from "../../store/slices/UserSlice";
import apiClient from "../../url/index";
import classes from "./Login.module.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

const LoginPage = () => {
  const isLoading = useSelector((state) => state.btn.isLoading);
  const [cridentials, setCridentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    errNotify: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setCridentials((prevValues) => {
      return { ...prevValues, [name]: value };
    });
    if (e.target.value) {
      setErrors((prevErrors) => {
        return { ...prevErrors, [name]: "" };
      });
    }
  };

  const validate = (values) => {
    const regexExp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    const errorValues = {};
    if (!values.email.trim()) {
      errorValues.email = "email is required";
    } else if (!regexExp.test(values.email)) {
      errorValues.email = "invalid email address";
    }
    if (!values.password) {
      errorValues.password = "password is required";
    } else if (values.length > 15) {
      errorValues.password = "password must not be greater than 15 characters";
    }
    return errorValues;
  };

  const fetchUserData = async () => {
    try {
      const response = await apiClient.get("admin/auth/my-account");
      if (response.status === 200) {
        dispatch(userAction.setUser(response.data));
      }
    } catch (err) {}
  };

  const saveUserData = (data) => {
    // apiClient.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    localStorage.setItem("token", data.token);
    localStorage.setItem("user",JSON.stringify({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNo,
    }));
    dispatch(userAction.setToken(data.token));
    dispatch(userAction.setIsAuthenticated(true));
  };

  const loginHandler = async () => {
    setErrors(validate(cridentials));
    if (!errors.email && !errors.password) {
      dispatch(buttonAction.setBtnSpiner(true));
      var response;
      try {
        // var response = await axios.post("https://hotroom.merahitechnologies.com/admin/auth/login", cridentials);
        var response = await apiClient.post("api/users/login", cridentials);
        if (response.status === 200) {
          saveUserData(response.data);
          // fetchUserData();
          console.log("login data", response.data);

          navigate(from, { replace: true });
        }
      } catch (err) {
        console.log(err);
        setErrors((prevErrors) => {
          return { ...prevErrors, errNotify: err.response?.data.msg };
        });
      } finally {
        dispatch(buttonAction.setBtnSpiner(false));
      }
    }
  };
  return (
    <div
      className={`${classes.wraper} mx-5 px-5  d-flex justify-content-center`}
    >
      <div className="bg-light border rounded m-5 p-5">
        <div className="d-flex justify-content-center  fw-bold mb-5">
          <span className={classes.yellowTxt + " fs-5 "}>RENSYS</span>
          <span className={classes.greenTxt + " fs-5 "}>ENGINEERING</span>
        </div>
        <Form>
          <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
            <Form.Label className="fw-bold">Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              className={errors.email ? classes.errorBorder : ""}
              onChange={changeHandler}
            />
            <span className={classes.errorText}>{errors.email}</span>
          </Form.Group>
          <Form.Group className="mb-4" controlId="exampleForm.ControlTextarea1">
            <Form.Label className="fw-bold">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              className={errors.password ? classes.errorBorder : ""}
              onChange={changeHandler}
            />
            <span className={classes.errorText}>{errors.password}</span>
          </Form.Group>
          <Button
            className={`${classes.btn} w-100`}
            variant="none"
            onClick={loginHandler}
          >
            Login
            <span className="ms-2">
              {isLoading && (
                <Spinner animation="border" variant="light" size="sm" />
              )}
            </span>
          </Button>
        </Form>
        <p className={`${classes.errorText} mt-3`}>{errors.errNotify}</p>
        <div className="d-flex justify-content-end mt-4">
          <Link to={"/forgot-password"}>Forgot Password</Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
