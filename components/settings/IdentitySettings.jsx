import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { BigHead } from "@bigheads/core";
import { useAtom } from "jotai";
import { RefreshIcon } from "@heroicons/react/outline";
import { resolveDid } from "../../utils/id";
import { useFetchMyDid } from "../../hooks/id";
import { getRandomAvatar } from "../../utils/contacts";
import { myAvatarAtom } from "../../stores/settings";
import Identity from "./Identity";

const IdentitySettings = () => {
  const [showAvatarSave, setShowAvatarSave] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState({});
  const [longFormDid, setLongFormDid] = useState("");
  const [myAvatar, setMyAvatar] = useAtom(myAvatarAtom);
  const { data: myDid } = useFetchMyDid();
  const { isAuthenticated } = useAuth0();

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
        {isAuthenticated && (
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
            <Identity longFormDid={longFormDid} />
          </div>
        )}
      </div>
    </div>
  );
};

export default IdentitySettings;
