import React, { useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ModalSkeleton from "../Modal/ModalSkeleton";
import useModal from "../../custom-hook/useModal";
import { showToast } from "../toast-notification/CustomToast";
import AuthenticatedAxiosInstance from "../../axios-center/AuthenticatedAxiosInstance";
import { FaEdit } from "react-icons/fa";

const EditProfileModal = ({ user, onSuccess }) => {
  const { isOpen, openModal, closeModal } = useModal();

  console.log("user", user);


  // Yup Validation Schema
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    phone_number: Yup.string()
      .matches(/^\d{10,15}$/, "Enter a valid phone number")
      .required("Phone number is required"),
    farming_type: Yup.string().nullable(),
    experience: Yup.number()
      .min(0, "Experience must be 0 or more")
      .nullable(),
    date_of_birth: Yup.date().nullable(),
    bio: Yup.string().nullable(),
  });

  const initialValues = useMemo(
    () => ({
      username: user?.username || "",
      phone_number: user?.phone_number || "",
      farming_type: user?.farming_type || "",
      experience: user?.experience || "",
      bio: user?.bio || "",
      date_of_birth: user?.date_of_birth || "",
    }),
    [user]
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        className="bg-green-600 dark:bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center"
        onClick={openModal}
      >
        <FaEdit className="mr-2" />
        Edit Profile
      </button>

      {isOpen && (
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await AuthenticatedAxiosInstance.patch("/users/edit-profile-details/", values);
              showToast("Profile updated successfully", "success");

              await onSuccess();

              closeModal();
            } catch (error) {
              console.error(error);
              showToast("Failed to update profile", "error");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, submitForm, isValid }) => (
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
              <Form className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <Field
                    name="username"
                    className="w-full px-4 py-2 border rounded-md dark:bg-zinc-700 dark:text-white"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <Field
                    name="phone_number"
                    className="w-full px-4 py-2 border rounded-md dark:bg-zinc-700 dark:text-white"
                  />
                  <ErrorMessage
                    name="phone_number"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Farming Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">Farming Type</label>
                  <Field
                    name="farming_type"
                    className="w-full px-4 py-2 border rounded-md dark:bg-zinc-700 dark:text-white"
                  />
                  <ErrorMessage
                    name="farming_type"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium mb-1">Experience (Years)</label>
                  <Field
                    name="experience"
                    type="number"
                    className="w-full px-4 py-2 border rounded-md dark:bg-zinc-700 dark:text-white"
                  />
                  <ErrorMessage
                    name="experience"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <Field
                    name="date_of_birth"
                    type="date"
                    className="w-full px-4 py-2 border rounded-md dark:bg-zinc-700 dark:text-white"
                  />
                  <ErrorMessage
                    name="date_of_birth"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <Field
                    as="textarea"
                    name="bio"
                    rows="3"
                    className="w-full px-4 py-2 border rounded-md dark:bg-zinc-700 dark:text-white resize-none"
                  />
                  <ErrorMessage
                    name="bio"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* No submit button here */}
              </Form>
            </ModalSkeleton>
          )}
        </Formik>
      )}
    </>
  );
};

export default EditProfileModal;
