import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Spinner from "./Spinner";
import { HOST_URL } from "../utils/constant";
import axios from "axios"; // Import axios at the top of your file
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/features/UserSlice";
import useLocalStorage from "../utils/hooks/useLocalStorage";
import toast from "react-hot-toast";

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [token, setToken] = useLocalStorage("authToken"); // 1 day expiry
  const [showText , setShowText] = useState("");


  const navigate =  useNavigate();
  const dispatch = useDispatch();

  // Toggle between Sign In and Sign Up
  const toggleSignIn = () => {
    setIsSignIn((prev) => !prev);
  };

  // Form initial values
  const initialValues = {
    first_name:isSignIn ? "" : "",
    last_name: isSignIn ? "" : "",
    email: isSignIn ? "" : "",
    password: "",
    phone_number: "",
    invited_referral_code:isSignIn ? "" : "",
   

  };

  // Form validation schema
  const validationSchema = Yup.object({
    email: !isSignIn ? 
     Yup.string()
      .email("Invalid email address")
      .required("Email is required") : null,
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    first_name: !isSignIn
      ? Yup.string().required("First Name is required")
      : null, 

      invited_referral_code: !isSignIn
      ? Yup.string().min(5, "Referral Must be 5 Character ")
      : null, // referral code

    last_name: !isSignIn
      ? Yup.string().required("Last Name is required")
      : null, // Only require 'name' for sign-up form
    phone_number: Yup.string()
          .required("Phone Number is required")
          .matches(/^[0-9]+$/, "Phone Number must be a number") // Regex to ensure it's a number
          .min(10, "Phone Number must be at least 10 digits") // Minimum length check
          .max(15, "Phone Number cannot exceed 15 digits")
       // Only require 'name' for sign-up form
  });

  // Handle form submission
  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    console.log("Form Data:", values);
  
    // If user is signing up
    if (!isSignIn) {
      setSubmitting(true)
      const postUrl = `${HOST_URL}/user/save+user`; // Ensure URL is correct
      try {
        const checkReferral = await axios.get(`${HOST_URL}/user/getvalid+referralcode/${values.invited_referral_code}`);
        if(checkReferral.data){
          setShowText("Correct Referral");
          console.log("check refrral" , checkReferral);
          
          const response = await axios.post(postUrl, values);
          console.log("Response:", response.data);
          setIsSignIn(true)
          setSubmitting(false)
          resetForm();
          
          // Send POST request to save user data
        // Handle success, e.g., reset the form or display a success message
        toast.success("You have Successfully Registered");

        }else{
          setSubmitting(false)
          setShowText("Incorrect Referral");
          toast.error("Pease Enter Correct Referral Code..");
          

        }
     
    
      } catch (error) {
        setSubmitting(false)
        resetForm();
        console.error("Error submitting form:", error);
        // Handle error, e.g., display an error message
        toast.error("Failed to Create User");
      } finally {
        // Always set submitting to false once request is completed
        setSubmitting(false);
      }
  
    // If user is signing in
    } else {
      try {
        const phone = parseInt(values.phone_number);
        console.log("Phone number:", phone);
  
        const getUrl = `${HOST_URL}/user/getSingleUserByNumber/${phone}`;
        
        // Send GET request to fetch user data by phone number
        const response = await axios.get(getUrl);
        console.log("Login data:", response.data);

        if(values.password === response.data.password  && values.phone_number === response.data.phone_number){
         
          const user_id = response.data.user_id;
          dispatch(addUser(response.data));
         toast.success("You have Logged in Successfully");
        
          navigate("/machine_listing")
          

          // Save the user_id in localStorage for 1 hour
          setToken(user_id);

        }else{
          resetForm();
          setSubmitting(false)
          toast.error("Credentials Incorrect");
          
        }
  
  
      } catch (error) {
        console.error("Error logging in:", error);
        // Handle error, e.g., display an error message
        // Example: toast.error("Login failed!");
        toast.error("Login Failed");
      } finally {
        setSubmitting(false); // Ensure to stop submitting after request
      }
    }
  };


  useEffect(() => {
    if (token) {
      // If token exists and is valid, redirect to /machine_listing
      navigate("/machine_listing");
    }
  }, [token, navigate]);



  return (
    <div className="relative h-screen w-full">
    {/* Background Image */}
    <div className="absolute inset-0">
      <img
        src="/Images/building.jpg"
        alt="background"
        className="object-cover w-full h-full"
      />
      <div className="absolute inset-0 bg-black opacity-45"></div>
    </div>
    <div className="flex items-center justify-center h-full relative p-4">
      <div className="bg-[#271A84] bg-opacity-80 md:p-8 p-6 mt-20 md:mt-10 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-3xl font-bold text-white mb-6">
          {isSignIn ? "Login" : "Register"}
        </h2>
  
        {/* Formik form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          validateOnChange={true}
          validateOnBlur={true}
          context={{ isSignIn }}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Show Name fields only if it's Sign Up */}
              {!isSignIn && (
                <>
                  <div className="mb-4">
                    <Field
                      type="text"
                      name="first_name"
                      placeholder="First Name"
                      className="w-full p-3 rounded bg-[#271A84] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#271A84]"
                    />
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <Field
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                      className="w-full p-3 rounded bg-[#271A84] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#271A84]"
                    />
                    <ErrorMessage
                      name="last_name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="w-full p-3 rounded bg-[#271A84] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#271A84]"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
  
                  <div className="mb-4">
                    <Field
                      type="text"
                      name="invited_referral_code"
                      placeholder="Referral Code"
                      className="w-full p-3 rounded bg-[#271A84] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#271A84]"
                    />
                    <div className="text-red-400 text-[14px]">{showText}</div>
                    <ErrorMessage
                      name="invited_referral_code"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </>
              )}
  
              <div className="mb-4">
                <Field
                  type="number"
                  name="phone_number"
                  placeholder="Phone Number"
                  className="w-full p-3 rounded bg-[#271A84] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#271A84]"
                />
                <ErrorMessage
                  name="phone_number"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
  
              <div className="mb-4">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-3 rounded bg-[#271A84] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#271A84]"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
  
              <div className="relative">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#7D60F9] py-3 rounded text-white font-semibold transition duration-200 relative flex items-center justify-center"
                >
                  {isSubmitting && (
                    <div className="absolute inset-0 flex justify-center items-center">
                      <Spinner />
                    </div>
                  )}
                  {!isSubmitting && (
                    <span className="relative z-10">
                      {isSignIn ? "Login" : "Register"}
                    </span>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
  
        {/* Additional Links */}
        <div className="mt-6 text-gray-400 text-center">
          <p>
            {isSignIn ? `New to Mining? ` : "Already a Member? "}
            <a
              href="#"
              onClick={toggleSignIn}
              className="text-white cursor-pointer hover:underline"
            >
              {isSignIn ? "Register" : "Login"}
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default Login;
