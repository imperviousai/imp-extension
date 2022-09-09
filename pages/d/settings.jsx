import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import {
  LockClosedIcon,
  LinkIcon,
  PhotographIcon,
  RefreshIcon,
} from "@heroicons/react/outline";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import MainNavigation from "../../components/MainNavigation";
import { BigHead } from "@bigheads/core";
import { useAtom } from "jotai";
import { myAvatarAtom } from "../../stores/settings";
import { getRandomAvatar } from "../../utils/contacts";
import { resolveDid } from "../../utils/id";
import { useFetchMyDid } from "../../hooks/id";
import RelayLightningSettings from "../../components/settings/RelayLightningSettings";
import { auth0TokenAtom } from "../../stores/auth";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import { CheckCircleIcon } from "@heroicons/react/solid";

const subNavigation = [
  // {
  //   name: "General",
  //   description: "General application settings",
  //   href: "#",
  //   icon: CogIcon,
  //   current: true,
  // },
  // {
  //   name: "Security",
  //   description: "Security Settings",
  //   href: "#",
  //   icon: KeyIcon,
  //   current: false,
  // },
  {
    name: "Relay & Lightning",
    description: "Manage your relay node.",
    href: "#",
    icon: LinkIcon,
    current: false,
  },
  {
    name: "Identity",
    description: "Manage your decentralized settings",
    href: "#",
    icon: PhotographIcon,
    current: false,
  },
  // {
  //   name: "Notifications",
  //   description: "Manage your notification settings",
  //   href: "#",
  //   icon: BellIcon,
  //   current: false,
  // },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const pageTitle = "Settings";

const GeneralSettings = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
      <h1 className="text-3xl font-extrabold text-blue-gray-900">General</h1>

      <div className="mt-6 space-y-8 divide-y divide-y-blue-gray-200">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
          <div className="sm:col-span-6">
            <h2 className="text-xl font-medium text-blue-gray-900">Section</h2>
            <p className="mt-1 text-sm text-blue-gray-500">
              General settings subtitle.
            </p>
          </div>
        </div>

        <div className="pt-8 flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-blue-gray-900 hover:bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
      <h1 className="text-3xl font-extrabold text-blue-gray-900">Security</h1>
      <div className="mt-6 space-y-8 divide-y divide-y-blue-gray-200">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
          <div className="sm:col-span-6">
            <h2 className="text-xl font-medium text-blue-gray-900">Section</h2>
            <p className="mt-1 text-sm text-blue-gray-500">
              Security settings subtitle.
            </p>
          </div>
        </div>

        <div className="pt-8 flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-blue-gray-900 hover:bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

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

  const handlePublish = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      console.log("USER", user);
      setAuth0Token(accessToken);
      console.info("ACCESS TOKEN: ", accessToken);
      // need to set the token here, it can't be set in useEffect quickly enough it seems
      // TODO: handle the actual graphql mutation
    } catch (e) {
      console.log(e);
    }
  };

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
            {!isAuthenticated && (
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
            )}
            {isAuthenticated && (
              // TODO: work the conditional logic around these displays and actions
              <div>
                <button
                  type="button"
                  onClick={() => logoutWithRedirect({ state: "Identity" })}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Log out of Twitter
                </button>

                <div className="bg-white shadow overflow-hidden sm:rounded-md mt-4">
                  <ul role="list" className="divide-y divide-gray-200">
                    {/* future proof for multi did support */}
                    <li>
                      <div className="flex items-center px-4 py-4 sm:px-6 content-between">
                        <div className="w-full flex justify-between">
                          <div className="flex items-center space-x-4">
                            <p className="font-semi-bold text-md">Identity</p>
                            <p className="flex items-center text-sm text-gray-500">
                              <CheckCircleIcon
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                                aria-hidden="true"
                              />
                              Published
                            </p>
                            <p className="flex items-center text-sm text-gray-500">
                              <LockClosedIcon
                                className="flex-shrink-0 mr-1.5 h-5 w-5"
                                aria-hidden="true"
                              />
                              Private
                            </p>
                          </div>
                          <div className="flex space-x-4">
                            <button>Edit</button>
                            <button
                              type="button"
                              onClick={() => handlePublish()}
                              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Publish
                            </button>
                            {/* <button
                                type="button"
                                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Unpublish
                              </button> */}
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationSettings = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
      <h1 className="text-3xl font-extrabold text-blue-gray-900">
        Notification Settings
      </h1>

      <form className="mt-6 space-y-8 divide-y divide-y-blue-gray-200">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
          <div className="sm:col-span-6">
            <h2 className="text-xl font-medium text-blue-gray-900">
              Message Settings
            </h2>
            <p className="mt-1 text-sm text-blue-gray-500">
              Message Settings Coming Soon - Below are boilerplate settings.
              They are not yet operational.
            </p>
          </div>

          <div className="sm:col-span-6">
            <ul role="list" className="mt-2 divide-y divide-gray-200">
              <Switch.Group
                as="li"
                className="py-4 flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <Switch.Label
                    as="p"
                    className="text-sm font-medium text-gray-900"
                    passive
                  >
                    Allow messages from everyone
                  </Switch.Label>
                  <Switch.Description className="text-sm text-gray-500">
                    You will receive messages from everyone, even if they are
                    not a known contact. Disable this setting if you only want
                    to receive messages from known contacts.
                  </Switch.Description>
                </div>
                <Switch
                  checked={true}
                  onChange={() => console.log("cool")}
                  className={classNames(
                    true ? "bg-teal-500" : "bg-gray-200",
                    "ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      true ? "translate-x-5" : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    )}
                  />
                </Switch>
              </Switch.Group>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6 pt-6">
          <div className="sm:col-span-6">
            <h2 className="text-xl font-medium text-blue-gray-900">
              Call Settings
            </h2>
            <p className="mt-1 text-sm text-blue-gray-500">
              Edit your call settings here
            </p>
          </div>

          <div className="sm:col-span-6">
            <ul role="list" className="mt-2 divide-y divide-gray-200">
              <Switch.Group
                as="li"
                className="py-4 flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <Switch.Label
                    as="p"
                    className="text-sm font-medium text-gray-900"
                    passive
                  >
                    Push notifications for call requests from unknown
                  </Switch.Label>
                  <Switch.Description className="text-sm text-gray-500">
                    Do you want to receive a push notification for call requests
                    from unknown
                  </Switch.Description>
                </div>
                <Switch
                  checked={true}
                  onChange={() => console.log("cool")}
                  className={classNames(
                    true ? "bg-teal-500" : "bg-gray-200",
                    "ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      true ? "translate-x-5" : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    )}
                  />
                </Switch>
              </Switch.Group>
              <Switch.Group
                as="li"
                className="py-4 flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <Switch.Label
                    as="p"
                    className="text-sm font-medium text-gray-900"
                    passive
                  >
                    Set yourself away
                  </Switch.Label>
                  <Switch.Description className="text-sm text-gray-500">
                    You will not receive any notification, and will auto decline
                    invitations to call.
                  </Switch.Description>
                </div>
                <Switch
                  checked={true}
                  onChange={() => console.log("cool")}
                  className={classNames(
                    true ? "bg-teal-500" : "bg-gray-200",
                    "ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      true ? "translate-x-5" : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    )}
                  />
                </Switch>
              </Switch.Group>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-blue-gray-900 hover:bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default function Settings() {
  const [settingsPage, setSettingsPage] = useState("Relay & Lightning");
  const router = useRouter();

  useEffect(() => {
    if (router.query) {
      const { state } = router.query;
      setSettingsPage(state);
    }
  }, [router]);

  return (
    <>
      <MainNavigation currentPage={pageTitle}>
        <main className="flex-1 flex overflow-hidden h-full">
          <div className="flex-1 flex flex-col overflow-y-auto xl:overflow-hidden">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="bg-white border-b border-blue-gray-200 xl:hidden"
            >
              <div className="max-w-3xl mx-auto py-3 px-4 flex items-start sm:px-6 lg:px-8">
                <a
                  href="#"
                  className="-ml-1 inline-flex items-center space-x-3 text-sm font-medium text-blue-gray-900"
                >
                  <ChevronLeftIcon
                    className="h-5 w-5 text-blue-gray-400"
                    aria-hidden="true"
                  />
                  <span>Settings</span>
                </a>
              </div>
            </nav>

            <div className="flex-1 flex xl:overflow-hidden">
              {/* Secondary sidebar */}
              <nav
                aria-label="Sections"
                className="hidden flex-shrink-0 w-96 bg-white border-r border-blue-gray-200 xl:flex xl:flex-col"
              >
                {/* <div className="flex-shrink-0 h-16 px-6 border-b border-blue-gray-200 flex items-center">
                  <p className="text-lg font-medium text-blue-gray-900">
                    Settings
                  </p>
                </div> */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {subNavigation.map((item) => (
                    <div
                      key={item.name}
                      onClick={() => setSettingsPage(item.name)}
                      className={classNames(
                        item.current
                          ? "bg-blue-50 bg-opacity-50"
                          : "hover:bg-blue-50 hover:bg-opacity-50",
                        "flex p-6 border-b border-blue-gray-200"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      <item.icon
                        className="flex-shrink-0 -mt-0.5 h-6 w-6 text-blue-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-3 text-sm">
                        <p className="font-medium text-blue-gray-900">
                          {item.name}
                        </p>
                        <p className="mt-1 text-blue-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </nav>

              {/* Main content */}
              <div className="flex-1 xl:overflow-y-auto">
                {/* {settingsPage === "General" && <GeneralSettings />} */}
                {/* {settingsPage === "Security" && <SecuritySettings />} */}
                {settingsPage === "Relay & Lightning" && (
                  <RelayLightningSettings />
                )}
                {settingsPage === "Identity" && <IdentitySettings />}
                {/* {settingsPage === "Notifications" && <NotificationSettings />} */}
              </div>
            </div>
          </div>
        </main>
      </MainNavigation>
    </>
  );
}
