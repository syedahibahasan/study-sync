import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useauth";
import { Link } from "react-router-dom";
import styles from "../Login/login.module.css";
import Input from "../../components/Input/input";

export default function LoginPage() {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) navigate("/");  // Redirect to main page if already logged in
  }, [user, navigate]);

  const submit = async ({ email, password }) => {
    try {
      await login(email, password);  // Call the login function
      navigate("/");  // Redirect to main page after successful login
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.authformcontainer}>
        <h2>Login</h2>
        <form className={styles.loginform} onSubmit={handleSubmit(submit)} noValidate>
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
            {...register("password", { required: true })}
            error={errors.password}
          />
          <button className={styles.loginbuttons} type="submit">Login</button>
          <div className={styles.registerlink}>
            <Link to="/register">Don't have an account? Register here.</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
