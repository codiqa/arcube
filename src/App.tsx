import { useAuth } from "@/contexts";
import { SignIn } from "./SignIn";
import { InputForm } from "./InputForm";

export const App = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <SignIn />;

  return <InputForm />;
};
