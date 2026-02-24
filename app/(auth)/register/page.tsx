import AuthForm from "@/components/auths/AuthForm";

const page = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-20">
      <AuthForm auth_method="register" />
    </div>
  );
}

export default page