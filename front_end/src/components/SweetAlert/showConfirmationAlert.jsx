import Swal from "sweetalert2";
import ReactDOMServer from "react-dom/server";
import { FaExclamationTriangle } from "react-icons/fa";

export const showConfirmationAlert = async ({
  title,
  text,
  iconComponent = null, // Optional custom icon
  confirmButtonText = "Yes, Proceed",
  cancelButtonText = "Cancel"
}) => {
  // If no icon provided, use the default one
  const defaultIconComponent = (
    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 border-2 border-red-600">
      <FaExclamationTriangle className="text-red-600 text-3xl " />
    </div>
  );

  const finalIcon = iconComponent || defaultIconComponent;

  // Convert React component to static HTML string
  const iconHtml = ReactDOMServer.renderToStaticMarkup(finalIcon);

  const result = await Swal.fire({
    title: `<div>${title}</div>`,
    html: `
      <div class="icon-container">${iconHtml}</div>
      <div>${text}</div>
    `,
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
