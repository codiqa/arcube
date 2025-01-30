import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import axios from "axios";
import { get } from "lodash";
import { useAuth } from "./contexts";

const schema = yup
  .object({
    orgUrl: yup.string().required(),
  })
  .required();

export const InputForm = () => {
  const { accessToken, refreshToken } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      orgUrl: "https://github.com/codiqa/arcube",
    },
  });

  const onSubmit = async (payload: { orgUrl: string }) => {
    try {
      setLoading(true);
      setError("orgUrl", { message: "" });
      setShortUrl("");

      const response = await axios.post("/shorten", payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "refresh-token": refreshToken,
        },
      });

      const errMessage = get(response.data, "errMessage");

      if (!!errMessage) {
        setError("orgUrl", { message: errMessage });
        return;
      }

      const shortUrl = get(response.data, "shortUrl");
      setShortUrl(shortUrl);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Arcube Test
        </h2>
        {!!shortUrl && (
          <h3 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
            <a
              href={`${window.location.origin}/${shortUrl}`}
              target="_blank"
              rel="noreferrer"
            >{`${window.location.origin}/${shortUrl}`}</a>
          </h3>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="orgUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Paste your long link here
              </label>
              <div className="mt-1">
                <input
                  id="orgUrl"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={isLoading}
                  {...register("orgUrl")}
                />
              </div>
              {!!errors.orgUrl && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {errors.orgUrl.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
