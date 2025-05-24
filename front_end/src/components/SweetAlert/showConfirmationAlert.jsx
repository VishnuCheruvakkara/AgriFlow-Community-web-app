import Swal from "sweetalert2";
import ReactDOMServer from "react-dom/server"; // Import ReactDOMServer to render React components as HTML
import { FaExclamationTriangle } from "react-icons/fa"; // Example icon import

// showConfirmationAlert now accepts the icon as a React component
export const showConfirmationAlert = async ({
  title,
  text,
  iconComponent = null, // Icon is passed as a React component
  confirmButtonText = "Yes, Proceed",
  cancelButtonText = "Cancel"
}) => {
  // Convert React component to static HTML string
  const iconHtml = iconComponent ? ReactDOMServer.renderToStaticMarkup(iconComponent) : '';

  const result = await Swal.fire({
    title: `<div>${title}</div>`, // Title without icon here
    html: `
      <div class="icon-container">${iconHtml}</div> 
      <div>${text}</div>`,  // Icon placed between title and content (text)
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
