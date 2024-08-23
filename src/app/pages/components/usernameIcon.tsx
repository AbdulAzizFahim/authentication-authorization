import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const UsernameIcon = () => {
  return (
    <div className="h-[5vh] w-fit justify-center items-center p-2 my-2 rounded-l-md bg-slate-400">
      <FontAwesomeIcon icon={faUser} className="text-lg mt-1.5"/>
    </div>
  );
};

export default UsernameIcon;
