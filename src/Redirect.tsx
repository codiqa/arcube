import { get, isEmpty, replace } from "lodash";
import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { supabase } from "./utils";

export const Redirect: FC<{}> = () => {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const shortUrl = replace(get(params, "shortUrl", ""), "/", "");

    if (isEmpty(shortUrl)) return;

    try {
      supabase
        .from("URLs")
        .select()
        .eq("shortUrl", shortUrl)
        .single()
        .then(({ data: { orgUrl } }) => (window.location.href = orgUrl));
    } catch (error) {
      navigate("/");
    }
  }, [params, navigate]);

  return <></>;
};
