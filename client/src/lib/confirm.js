import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const confirm = (title, text) =>
  MySwal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  }).then((r) => r.isConfirmed);
