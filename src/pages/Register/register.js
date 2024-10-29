import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/Input/input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useauth";
import styles from "../Register/register.module.css";

export default function Register() {
  const auth = useAuth();
  const { user } = auth;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    navigate("/");  // Redirect to main page if user is already logged in
  }, [user, navigate]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const submit = async (data) => {
    try {
      await auth.register(data);  // Call the registration function
      navigate("/");  // Redirect to main page after successful registration
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.authformcontainer}>
        <h2>Register</h2>
        <form className={styles.loginform} onSubmit={handleSubmit(submit)} noValidate>
          <Input
            type="username"
            label="User Name"
            placeholder="User Name"
            {...register("username", {
              required: "This Field Is Required",
              minLength: { value: 2, message: "Field Is Too Short" },
              pattern: { value: /^[a-zA-Z]+$/, message: "Name Is Not Valid" },
            })}
            error={errors.firstname}
          />
          <Input
            type="email"
            label="Email"
            placeholder="youremail@gmail.com"
            {...register("email", {
              required: "This Field Is Required",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,63}$/i,
                message: "Email Is Not Valid",
              },
            })}
            error={errors.email}
          />
          <Input
            type="password"
            label="Password"
            placeholder="********"
            {...register("password", {
              required: true,
              minLength: { value: 8, message: "Field Is Too Short" },
            })}
            error={errors.password}
          />
          <Input
            type="password"
            label="Confirm Password"
            {...register("confirmPassword", {
              required: true,
              validate: (value) => value === getValues("password") || "Passwords do not match",
            })}
            error={errors.confirmPassword}
          />
          <button className={styles.loginbuttons} type="submit">Register</button>
          <div className={styles.registerlink}>
            <Link to="/login">Already have an account? Login here.</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
