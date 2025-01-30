import { useAuth } from "@/contexts";
import { SignIn } from "./SignIn";

export const App = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <SignIn />;

  return <>App</>;
};
