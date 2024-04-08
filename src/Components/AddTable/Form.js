import React from "react";
import { useForm } from "react-hook-form";
import postNewTable from "../../Api/table/post";
import { useNavigate } from "react-router-dom";

function generateRandomId() {
  const randomNumber = Math.random();
  const randomId = Math.floor(randomNumber * 1000000);
  return randomId.toString();
}
function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    const submitData = {
      ...data,
      id: generateRandomId(),
      address: {
        line1: data?.addressLine1,
        line2: data?.addressLine2,
        city: data?.city,
        country: data?.country,
        zipCode: data.zipCode,
      },
    };
    delete submitData?.addressLine1;
    delete submitData?.addressLine2;
    delete submitData?.city;
    delete submitData?.country;
    delete submitData?.zipCode;
    const response = await postNewTable(submitData);
    if (response?.status == 201) {
      navigate("/");
    } else {
      alert(response?.message);
    }
  };
  return (
    <div className="container">
      <h1 className="f-2">ADD NEW TABLE</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row mb-4">
          <div className="col">
            <div className="form-outline">
              <label className="form-label" htmlFor="firstName">
                First name
              </label>
              <input
                type="text"
                id="firstName"
                className="form-control"
                {...register("firstName", {
                  required: true,
                  minLength: 3,
                  pattern: /^[a-zA-Z]{3,}$/,
                })}
              />
              {errors.firstName && (
                <span className="text-danger">
                  First name is required and must be at least 3 characters long
                  with only alphabets
                </span>
              )}
            </div>
          </div>
          <div className="col">
            <div className="form-outline">
              <label className="form-label" htmlFor="lastName">
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                className="form-control"
                {...register("lastName", {
                  required: true,
                  minLength: 3,
                  pattern: /^[a-zA-Z]{3,}$/,
                })}
              />
              {errors.lastName && (
                <span className="text-danger">
                  Last name is required and must be at least 3 characters long
                  with only alphabets
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="addressLine1">
            Address Line 1
          </label>
          <input
            type="text"
            id="addressLine1"
            className="form-control"
            {...register("addressLine1", { required: true, minLength: 8 })}
          />
          {errors.addressLine1 && (
            <span className="text-danger">
              Address is required and must be at least 8 characters long
            </span>
          )}
        </div>

        <div className="row mb-4">
          <div className="col">
            <div className="form-outline">
              <label className="form-label" htmlFor="addressLine2">
                Address Line 2
              </label>
              <input
                type="text"
                id="addressLine2"
                className="form-control"
                {...register("addressLine2")}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-outline">
              <label className="form-label" htmlFor="city">
                City
              </label>
              <input
                type="text"
                id="city"
                className="form-control"
                {...register("city", { required: true })}
              />
              {errors.city && (
                <span className="text-danger">City is required</span>
              )}
            </div>
          </div>
          <div className="col">
            <div className="form-outline">
              <label className="form-label" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                className="form-control"
                {...register("gender", { required: true })}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              {errors.gender && (
                <span className="text-danger">Gender is required</span>
              )}
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col">
            <div className="form-outline">
              <label className="form-label" htmlFor="country">
                Country
              </label>
              <input
                type="text"
                id="country"
                className="form-control"
                {...register("country", { required: true })}
              />
              {errors.country && (
                <span className="text-danger">Country is required</span>
              )}
            </div>
          </div>
          <div className="col">
            <div className="form-outline">
              <label className="form-label" htmlFor="zipCode">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                className="form-control"
                {...register("zipCode", { required: true, maxLength: 10 })}
              />
              {errors.zipCode && (
                <span className="text-danger">
                  ZIP Code is required and must be at most 10 characters long
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            {...register("email", {
              required: true,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            })}
          />
          {errors.email && (
            <span className="text-danger">Invalid email format</span>
          )}
        </div>

        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="phone">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            className="form-control"
            {...register("phone", { required: true, pattern: /^[0-9]{10}$/ })}
          />
          {errors.phone && (
            <span className="text-danger">
              Phone number is required and must be 10 digits long
            </span>
          )}
        </div>

        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="additionalInfo">
            Additional information
          </label>
          <textarea
            className="form-control"
            id="additionalInfo"
            rows={4}
            {...register("additionalInfo")}
          />
        </div>
        <button
          type="submit"
          className={` mb-4 ${
            Object.keys(errors).length > 0
              ? " disabled"
              : "btn btn-block btn-primary"
          }`}
          disabled={Object.keys(errors).length > 0}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Form;
