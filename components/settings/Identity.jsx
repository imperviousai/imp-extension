import { useState, useEffect } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
  CREATE_DID,
  DELETE_DID,
  UPDATE_DID,
  GET_DID_BY_TWITTER,
} from "./../../utils/contacts";
import { toast } from "react-toastify";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { LockClosedIcon } from "@heroicons/react/outline";

function Identity({ user, longFormDid }) {
  const [publishedDid, setPublishedDid] = useState("");

  const { data, loading, error } = useQuery(GET_DID_BY_TWITTER, {
    variables: { twitterUsername: user?.nickname },
  });

  const [publishDid] = useMutation(CREATE_DID, {
    variables: {
      longFormDid: longFormDid,
      twitterUsername: user?.nickname,
      avatarUrl: user?.picture,
      name: user?.nickname,
      lastUpdated: new Date().getTime(),
    },
    refetchQueries: [{ query: GET_DID_BY_TWITTER }, "getDIDByTwitter"],
  });

  const [updateDid] = useMutation(UPDATE_DID, {
    variables: {
      id: publishedDid?.id,
      longFormDid: longFormDid,
      twitterUsername: user?.nickname,
      avatarUrl: user?.picture,
      name: user?.nickname,
      lastUpdated: new Date().getTime(),
    },
    refetchQueries: [{ query: GET_DID_BY_TWITTER }, "getDIDByTwitter"],
  });

  const [deleteDid] = useMutation(DELETE_DID, {
    variables: { id: publishedDid.id },
    refetchQueries: [{ query: GET_DID_BY_TWITTER }, "getDIDByTwitter"],
  });

  const publish = () => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="pb-4">
            Are you sure you want to update your published DID?
          </p>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => {
                try {
                  // TODO: handle the actual graphql mutation
                  if (user) {
                    publishDid()
                      .then(({ data }) => {
                        toast.success("DID Published Successfuly");
                      })
                      .catch((err) => {
                        console.log(err);
                        toast.error("Unable to publish DID. Please try again");
                      });
                  }
                } catch (e) {
                  console.log(e);
                }
                closeToast();
              }}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={closeToast}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  const update = () => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="pb-4">
            Are you sure you want to update your published DID?
          </p>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => {
                try {
                  // TODO: handle the actual graphql mutation
                  if (user) {
                    updateDid()
                      .then(() => {
                        toast.success("DID Sucessfully Updated!");
                      })
                      .catch((e) => {
                        toast.error("Unable to update DID. Please try again");
                        console.error(e);
                      });
                  }
                } catch (e) {
                  console.log(e);
                }
                closeToast();
              }}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={closeToast}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  const handlePublish = async () => {
    try {
      // TODO: handle the actual graphql mutation
      if (user) {
        publishedDid ? update() : publish();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const unpublish = async () => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="pb-4">Unpublish?</p>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => {
                try {
                  // TODO: handle the actual graphql mutation
                  if (user) {
                    deleteDid()
                      .then(() => {
                        toast.success("DID Sucessfully Unpublished!");
                      })
                      .catch((e) => {
                        toast.error("Unable to publish DID. Please try again");
                        console.error(e);
                      });
                  }
                } catch (e) {
                  console.log(e);
                }
                closeToast();
              }}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={closeToast}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  useEffect(() => {
    if (data?.listDIDS?.items?.length > 0) {
      setPublishedDid(data.listDIDS.items[0]);
    } else {
      setPublishedDid("");
    }
  }, [data]);

  if (loading) return "Loading ...";

  return (
    <div>
      <div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md mt-4">
          <ul role="list" className="divide-y divide-gray-200">
            {/* future proof for multi did support */}
            <li>
              <div className="flex items-center px-4 py-4 sm:px-6 content-between">
                <div className="w-full flex justify-between">
                  <div className="flex items-center space-x-4">
                    {publishedDid && (
                      <img
                        className="inline-block h-8 w-8 rounded-full"
                        src={publishedDid.avatarUrl}
                        alt=""
                      />
                    )}
                    <p className="font-semi-bold text-md">Identity</p>
                    {publishedDid ? (
                      <p className="flex items-center text-sm text-gray-500">
                        <CheckCircleIcon
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                          aria-hidden="true"
                        />
                        Published
                      </p>
                    ) : (
                      <p className="flex items-center text-sm text-gray-500">
                        <LockClosedIcon
                          className="flex-shrink-0 mr-1.5 h-5 w-5"
                          aria-hidden="true"
                        />
                        Private
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    {publishedDid && (
                      <button
                        type="button"
                        className="text-red-500"
                        onClick={() => unpublish()}
                      >
                        Unpublish
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handlePublish()}
                      className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {publishedDid ? "Update" : "Publish"}
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
    </div>
  );
}

export default Identity;
