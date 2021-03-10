import Swal from "sweetalert2";
import SweetAlertCSS from "./SweetAlert.module.css";

export default class Toast {

  constructor({icon="success", title="Successfully", cb}) {
    this.title = title
    this.icon = icon
    this.cb = cb
  }

  shoot() {
    Swal.fire({
      customClass: {
        container: SweetAlertCSS.toastMargin,
      },
      position: "top-right",
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      icon: this.icon,
      title: this.title
    });
  }
}
