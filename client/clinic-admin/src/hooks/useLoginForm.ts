import { useFormik } from "formik";
import { loginSchema } from "../schemas/auth.schema";
import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { notify } from "../utils/toast";

export const useLoginForm = () => {
  const { nurseLogin, doctorLogin } = useAuth();
  // const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { staffId: "", password: "", role: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError(null);

        if (values.role === "DOCTOR") {
          await doctorLogin({
            staffId: values.staffId,
            password: values.password,
            role: values.role,
          });

          notify.success(`Successfully logged in!`);
          setSubmitting(false);
          // navigate("/dashboard");
        }

        if (values.role === "NURSE") {
          await nurseLogin({
            staffId: values.staffId,
            password: values.password,
            role: values.role,
          });

          notify.success(`Successfully logged in!`);
          setSubmitting(false);
          // navigate("/dashboard");
        }
      } catch (err: any) {
        setServerError(err.response?.data?.message || "Authentication failed");
        notify.error(err.response?.data?.message || "Login failed");
        console.log(err);
      }
    },
  });

  return { formik, serverError };
};
