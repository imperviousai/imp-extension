import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth0 } from "@auth0/auth0-react";
import { BigHead } from "@bigheads/core";
import { useAtom } from "jotai";
import { RefreshIcon } from "@heroicons/react/outline";
import { resolveDid } from "../../utils/id";
import { useFetchMyDid } from "../../hooks/id";
import { getRandomAvatar } from "../../utils/contacts";
import { myAvatarAtom } from "../../stores/settings";
import { auth0TokenAtom } from "../../stores/auth";
import Identity from "./Identity";

const IdentitySettings = () => {
  const [showAvatarSave, setShowAvatarSave] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState({});
  const [longFormDid, setLongFormDid] = useState("");
  const router = useRouter();
  const [myAvatar, setMyAvatar] = useAtom(myAvatarAtom);
  const [, setAuth0Token] = useAtom(auth0TokenAtom);
  const { data: myDid } = useFetchMyDid();
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    const getToken = async () => {
      if (user) {
        const accessToken = await getAccessTokenSilently();
        setAuth0Token(accessToken);
      }
    };
    getToken();
  }, [getAccessTokenSilently, user, setAuth0Token]);

  let returnUrl = "";
  if (typeof window !== "undefined") {
    returnUrl = window.location.origin;
  }

  const redirectAppState = {
    appState: {
      targetUrl: returnUrl,
      pathname: router.pathname,
      state: "Identity",
    },
  };

  useEffect(() => {
    if (myDid) {
      resolveDid(myDid.id)
        .then((res) => {
          setLongFormDid(res.data.longFormDid);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [myDid]);

  const logoutWithRedirect = ({ state }) =>
    // for some reason it doesn't honor ?state=Identity yet
    logout({
      returnTo: returnUrl,
    });

  useEffect(() => {
    setCurrentAvatar(myAvatar);
  }, [myAvatar]);

  const handleAvatarRotation = () => {
    setShowAvatarSave(true);
    setCurrentAvatar({ ...getRandomAvatar() });
  };

  const cancelAvatarSave = () => {
    setShowAvatarSave(false);
    setCurrentAvatar(myAvatar);
  };

  const saveNewAvatar = () => {
    setMyAvatar(currentAvatar);
    setShowAvatarSave(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
      <h1 className="text-3xl font-extrabold text-blue-gray-900">Identity</h1>
      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
        <div className="sm:col-span-6">
          <h2 className="text-xl font-medium text-blue-gray-900">Profile</h2>
          <p className="mt-1 text-sm text-blue-gray-500">
            Manage your decentalized identity.
          </p>
        </div>

        <div className="sm:col-span-6">
          <label
            htmlFor="photo"
            className="block text-xl font-medium text-blue-gray-900"
          >
            Avatar
          </label>
          <p className="mt-1 text-md text-blue-gray-500">
            Here is your avatar, you can rotate your avatar at any time.
          </p>
          <div className="pb-12 flex flex-col items-center">
            <div className="flex flex-col items-center">
              <BigHead
                {...currentAvatar}
                className="h-32 w-full object-cover lg:h-48"
              />
              <button
                type="button"
                onClick={() => handleAvatarRotation()}
                className="pt-2"
              >
                <RefreshIcon
                  className="-ml-1 mr-2 h-6 w-6 text-gray-900"
                  aria-hidden="true"
                />
              </button>
              {showAvatarSave && (
                <div className="flex space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => cancelAvatarSave()}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => saveNewAvatar()}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sm:col-span-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-blue-gray-900"
          >
            Decentralized Identity
          </label>
          <div className="mt-1">
            <p className="mt-1 text-sm font-medium text-blue-gray-900 pb-4">
              This is your Long Form Decentralized Identity that you share with
              your connections
            </p>
            <textarea
              id="description"
              name="description"
              disabled
              rows={4}
              className="block w-full p-4 border border-blue-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-primary focus:border-blue-500"
              defaultValue={longFormDid}
            />
          </div>
        </div>
        <div className="sm:col-span-6">
          <label
            htmlFor="description"
            className="block text-xl font-medium text-blue-gray-900"
          >
            Publish to Impervious Contacts Registry
          </label>
          <p className="mt-1 text-md font-medium text-blue-gray-900">
            You can publish your Identity to the Impervious Contacts Registry.
            Peers can search for your Twitter username in the Registry to find
            your latest Identity.
          </p>
          <div className="my-4">
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => loginWithRedirect(redirectAppState)}
                className="text-white bg-blue-400 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-400/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
              >
                <svg
                  className="mr-2 -ml-1 w-4 h-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="twitter"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M459.4 151.7c.325 4.548 .325 9.097 .325 13.65 0 138.7-105.6 298.6-298.6 298.6-59.45 0-114.7-17.22-161.1-47.11 8.447 .974 16.57 1.299 25.34 1.299 49.06 0 94.21-16.57 130.3-44.83-46.13-.975-84.79-31.19-98.11-72.77 6.498 .974 12.99 1.624 19.82 1.624 9.421 0 18.84-1.3 27.61-3.573-48.08-9.747-84.14-51.98-84.14-102.1v-1.299c13.97 7.797 30.21 12.67 47.43 13.32-28.26-18.84-46.78-51.01-46.78-87.39 0-19.49 5.197-37.36 14.29-52.95 51.65 63.67 129.3 105.3 216.4 109.8-1.624-7.797-2.599-15.92-2.599-24.04 0-57.83 46.78-104.9 104.9-104.9 30.21 0 57.5 12.67 76.67 33.14 23.72-4.548 46.46-13.32 66.6-25.34-7.798 24.37-24.37 44.83-46.13 57.83 21.12-2.273 41.58-8.122 60.43-16.24-14.29 20.79-32.16 39.31-52.63 54.25z"
                  ></path>
                </svg>
                Sign in with Twitter
              </button>
            ) : (
              <div>
                {" "}
                <button
                  type="button"
                  onClick={() => logoutWithRedirect({ state: "Identity" })}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Log out of Twitter
                </button>
                <Identity user={user} longFormDid={longFormDid} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentitySettings;
