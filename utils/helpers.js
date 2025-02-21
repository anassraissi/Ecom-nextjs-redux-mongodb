import toast from "react-hot-toast";

export const makeToast = (text) => {
    toast.success(text, {
        style: {
            borderRadius: "4px",
            background: "#333",
            color: "#fff",
        },
    });
};  