import Swal from "sweetalert2";
import ReactDOMServer from "react-dom/server"; // Convert React components to static HTML
import { FaExclamationTriangle } from "react-icons/fa";

// Info alert — simplified, no cancel button
export const showInfoAlert = async ({
    title,
    text,
    iconComponent = (
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 border-2 border-red-600">
            <FaExclamationTriangle className="text-red-600 text-3xl" />
        </div>
    ),
    confirmButtonText = "Okay"
}) => {
    const iconHtml = iconComponent
        ? ReactDOMServer.renderToStaticMarkup(iconComponent)
        : "";

    await Swal.fire({
        title: `<div>${title}</div>`,
        html: `
      <div class="icon-container">${iconHtml}</div> 
      <div>${text}</div>`,
        confirmButtonText,
        showCancelButton: false, // No cancel button
        customClass: {
            popup: "my-swal-popup",
            title: "my-swal-title",
            content: "my-swal-content",
            confirmButton: "my-swal-confirm",
        },
        showClass: {
            popup: "swal-fade-in",
        },
        hideClass: {
            popup: "swal-fade-out",
        },
    });
};
