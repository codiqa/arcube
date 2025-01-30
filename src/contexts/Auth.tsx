import { AuthError, Session } from "@supabase/supabase-js";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/utils";

type Nullable<T> = T | null;

type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken?: Nullable<string>;
  refreshToken?: Nullable<string>;
  authError: Nullable<AuthError>;

  onSignIn: (payload: { email: string; password: string }) => void;
};

export const AuthContext = createContext<AuthContextType>({
  isLoading: false,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  authError: null,
  onSignIn: () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Nullable<Session>>(null);
  const [authError, setAuthError] = useState<Nullable<AuthError>>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const onSignIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) setAuthError(error);
    } catch (error) {
      setAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session,
        accessToken: session?.access_token,
        refreshToken:session?.refresh_token,
        onSignIn,
        authError,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
