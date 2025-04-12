
import Swal from "sweetalert2";

export const showConfirmationAlert = async ({ title, text,confirmButtonText = "Yes, Proceed", cancelButtonText = "Cancel" }) => {
  const result = await Swal.fire({
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    showClass: {
      popup: "swal-fade-in",
    },
    hideClass: {
      popup: "swal-fade-out",
    },
    customClass: {
      popup: 'my-swal-popup',
      title: 'my-swal-title',
      content: 'my-swal-content',
      confirmButton: 'my-swal-confirm',
      cancelButton: 'my-swal-cancel',
    },
  });
  return result.isConfirmed;
};
