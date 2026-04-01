import { useFormik } from "formik";
import { loginSchema } from "../schemas/auth.schema";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { notify } from "../utils/toast";
import { useAuth } from "../context/AuthContext";

export const useLoginForm = () => {
  const { nurseLogin, doctorLogin, setLoadingError } = useAuth();
  // const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { staffId: "", password: "", role: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setServerError(null);

        if (values.role === "DOCTOR") {
          const results = await doctorLogin({
            staffId: values.staffId,
            password: values.password,
            role: values.role,
          });

          if (results?.status === "fail") {
            notify.error(results?.message);
            setLoadingError(results?.message);
            setServerError(results?.message);
          }

          if (results?.status === "success")
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
        console.log("error from the useLoginForm", err);
        setServerError(err.response?.message || "Authentication failed");
        notify.error(err.response?.message || "Login failed");
      }
    },
  });

  return { formik, serverError };
};
