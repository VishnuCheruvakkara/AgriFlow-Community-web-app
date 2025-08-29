import React, { useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import ModalSkeleton from "../Modal/ModalSkeleton";
import useModal from "../../custom-hook/useModal";
import { showToast } from "../toast-notification/CustomToast";
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";
import { FaEdit } from "react-icons/fa";
import UserLocation from "./UserLocation";

const EditProfileModal = ({ user, onSuccess }) => {
  const { isOpen, openModal, closeModal } = useModal();

  // Animation Variant for shaking
  const shakeErrorInputVariant = {
    shake: {
      x: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.4 },
    },
  };

  // Yup Validation Schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Username can only contain letters and spaces")
      .min(2, "Username must be at least 2 characters")
      .max(45, "Username must be at most 45 characters")
      .required("Username is required"),

    phone_number: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),


    farming_type: Yup.string()
      .max(100, "Farming type must be at most 100 characters")
      .nullable(),

    experience: Yup.number()
      .integer("Experience must be a whole number")
      .min(0, "Experience must be 0 or more")
      .max(100, "Experience seems too high")
      .nullable(),

    bio: Yup.string()
      .max(1000, "Bio must be at most 1000 characters")
      .nullable(),

    location: Yup.object()
      .nullable()
      .required("Location is required"),
  });

  const initialValues = useMemo(
    () => ({
      username: user?.username || "",
      phone_number: user?.phone_number || "",
      farming_type: user?.farming_type || "",
      experience: user?.experience || "",
      bio: user?.bio || "",
      location: user?.location || null,
    }),
    [user]
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        className="bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center  "
        onClick={openModal}
      >
        <FaEdit className="mr-2 w-5 h-5" />
        Edit Profile
      </button>

      {isOpen && (
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            console.log("Submitting values:", values);   // ✅ Debug here
            try {
              const response = await AuthenticatedAxiosInstance.patch(
                "/users/edit-profile-details/",
                values
              );
              console.log("Server response:", response.data);  // ✅ Debug response
              showToast("Profile updated successfully", "success");
              await onSuccess();
              closeModal();
            } catch (error) {
              console.error("Error updating profile:", error); // ✅ Debug error
              showToast("Failed to update profile", "error");
            } finally {
              setSubmitting(false);
            }
          }}

        >
          {({ values, setFieldValue, errors, touched, isSubmitting, submitForm, isValid }) => (
            <ModalSkeleton
              isOpen={isOpen}
              onClose={closeModal}
              title="Edit Your Profile"
              onSubmit={submitForm}
              isSubmitDisabled={!isValid || isSubmitting}
              submitButtonText={isSubmitting ? "Saving..." : "Save Changes"}
              submitButtonId="editProfileSubmit"
              width="w-[550px]"
              height="h-[600px]"
            >
              <Form className="space-y-6 px-5 my-5">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <motion.div
                    variants={shakeErrorInputVariant}
                    animate={errors.username && touched.username ? "shake" : ""}
                  >
                    <Field
                      name="username"
                      className={`w-full px-4 py-3 border border-zinc-400 rounded-md dark:bg-zinc-900 dark:text-white 
                      ${errors.username && touched.username
                          ? "ring-2 ring-red-500 border-none"
                          : "dark:border-zinc-600 focus:ring-2 focus:ring-green-500"}`}
                    />
                  </motion.div>
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <motion.div
                    variants={shakeErrorInputVariant}
                    animate={errors.phone_number && touched.phone_number ? "shake" : ""}
                  >
                    <Field
                      name="phone_number"
                      className={`w-full px-4 py-3 border border-zinc-400 rounded-md dark:bg-zinc-900 dark:text-white 
                      ${errors.phone_number && touched.phone_number
                          ? "ring-2 ring-red-500 border-none"
                          : "dark:border-zinc-600 focus:ring-2 focus:ring-green-500"}`}
                    />
                  </motion.div>
                  <ErrorMessage
                    name="phone_number"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Farming Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">Farming Type</label>
                  <motion.div
                    variants={shakeErrorInputVariant}
                    animate={errors.farming_type && touched.farming_type ? "shake" : ""}
                  >
                    <Field
                      name="farming_type"
                      className={`w-full px-4 py-3 border border-zinc-400 rounded-md dark:bg-zinc-900 dark:text-white 
                      ${errors.farming_type && touched.farming_type
                          ? "ring-2 ring-red-500 border-none"
                          : "dark:border-zinc-600 focus:ring-2 focus:ring-green-500"}`}
                    />
                  </motion.div>
                  <ErrorMessage
                    name="farming_type"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium mb-1">Experience (Years)</label>
                  <motion.div
                    variants={shakeErrorInputVariant}
                    animate={errors.experience && touched.experience ? "shake" : ""}
                  >
                    <Field
                      name="experience"
                      type="number"
                      className={`w-full px-4 py-3 border border-zinc-400 rounded-md dark:bg-zinc-900 dark:text-white 
                      ${errors.experience && touched.experience
                          ? "ring-2 ring-red-500 border-none"
                          : "dark:border-zinc-600 focus:ring-2 focus:ring-green-500"}`}
                    />
                  </motion.div>
                  <ErrorMessage
                    name="experience"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <motion.div
                    variants={shakeErrorInputVariant}
                    animate={errors.bio && touched.bio ? "shake" : ""}
                  >
                    <Field
                      as="textarea"
                      name="bio"
                      rows="3"
                      className={`w-full px-4 py-3 border border-zinc-400 rounded-md dark:bg-zinc-900 dark:text-white resize-none
                      ${errors.bio && touched.bio
                          ? "ring-2 ring-red-500 border-none"
                          : "dark:border-zinc-600 focus:ring-2 focus:ring-green-500"}`}
                    />
                  </motion.div>
                  <ErrorMessage
                    name="bio"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <UserLocation
                    formData={values.location}
                    setFormData={(newFormData) => setFieldValue("location", newFormData.location)}
                    errors={errors.location}
                    fieldErrors={touched.location && errors.location}
                    defaultQuery={values.location?.full_location || ""}
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

              </Form>
            </ModalSkeleton>
          )}
        </Formik>
      )}
    </>
  );
};

export default EditProfileModal;
