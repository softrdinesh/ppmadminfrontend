import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
    <PageMeta
       title= "PPM - Project Management"
  description="PPM - A Project Management Software"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
