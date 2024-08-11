import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const TruncatedText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const characterLimit = 80;

  const textString = typeof text === "string" ? text : "";

  if (textString.length <= characterLimit) {
    return <span>{textString}</span>;
  }

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        setExpanded((prev) => !prev);
      }}
      className="cursor-pointer"
    >
      {expanded ? (
        <>
          {text}
          <button
            className="ml-1 text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(false);
            }}
          >
            Show Less
          </button>
        </>
      ) : (
        <span className="cursor-pointer">
          {text.slice(0, characterLimit)}
          <span className="text-gray-600 cursor-pointer font-medium">...</span>
        </span>
      )}
    </span>
  );
};

const formatDate = (timestamp) => {
  if (timestamp && typeof timestamp.toDate === "function") {
    return timestamp.toDate().toLocaleDateString();
  }
  return "Invalid Date";
};

const capitalizeFirstWord = (str) => {
  if (typeof str !== "string" || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Table = () => {
  const [friends, setFriends] = useState([]);
  const { userId, crmId } = useParams();
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendsRef = collection(
          db,
          "users",
          userId,
          "crms",
          crmId,
          "friends"
        );
        const querySnapshot = await getDocs(friendsRef);
        const friendsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFriends(friendsData);
      } catch (error) {
        console.error("Error fetching friends data:", error);
      }
    };

    fetchData();
  }, [userId, crmId]);

  const handleViewEmail = (e, email) => {
    e.stopPropagation();
    setSelectedEmail(email);
  };

  return (
    <div className="bg-primary p-10">
      <h1 className="text-4xl mb-10 font-bold ml-1">Friend CRM</h1>

      <div className="shadow-lg overflow-hidden rounded-3xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="table-auto w-full md:table-fixed">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="pl-4 pr-6 py-3 text-left text-sm font-medium text-gray-600 rounded-tl-3xl">
                  Date Added
                </th>
                <th className="px-2 py-3 text-left text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="px-2 py-3 text-left text-sm font-medium text-gray-600">
                  Key Facts
                </th>
                <th className="px-2 py-3 text-left text-sm font-medium text-gray-600">
                  Category
                </th>
                <th className="px-2 py-3 text-left text-sm font-medium text-gray-600">
                  Outreach Email
                </th>
              </tr>
            </thead>
            <tbody>
              {friends.map((friend, index) => (
                <tr
                  key={friend.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 cursor-pointer transition-colors duration-150 ease-in-out`}
                  onClick={() => handleViewFriend(friend.id)}
                >
                  <td className="pl-4 pr-6 py-5 align-top whitespace-nowrap text-sm text-primary-contrast border-y border-gray-200">
                    <div className="flex items-center">
                      <span>{formatDate(friend.dateAdded)}</span>
                    </div>
                  </td>
                  <td className="px-2 py-5 align-top text-sm text-primary-contrast border-y border-gray-200">
                    {friend.name}
                  </td>
                  <td className="px-2 py-5 align-top text-sm text-primary-contrast border-y border-gray-200">
                    <ul className="list-disc pl-5">
                      {friend.keyFacts &&
                        friend.keyFacts.map((fact, i) => (
                          <li key={i}>
                            <TruncatedText text={fact} />
                          </li>
                        ))}
                    </ul>
                  </td>
                  <td className="px-2 py-5 align-top text-sm text-primary-contrast border-y border-gray-200">
                    {capitalizeFirstWord(friend.category)}
                  </td>
                  <td className="px-2 py-5 align-top text-sm text-primary-contrast border-y border-gray-200">
                    {friend.outreachEmail && (
                      <button
                        onClick={(e) =>
                          handleViewEmail(e, friend.outreachEmail)
                        }
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View Email
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!selectedEmail} onClose={() => setSelectedEmail(null)}>
        <h2 className="text-2xl font-bold mb-4">Outreach Email</h2>
        <div className="whitespace-pre-wrap">{selectedEmail}</div>
      </Modal>
    </div>
  );
};

export default Table;
