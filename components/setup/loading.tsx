"use client";
import React, { useEffect, useState } from "react";

const Loading = ({ status }: { status?: "failed" | "loading" }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    switch (status) {
      case "loading":
        setMessage("Loading...");
        break;
      case "failed":
        setMessage("We could not get the data you are looking for");
        break;
      default:
        setMessage("An unexpected error occured");
        break;
    }
  }, [status]);

  return (
    <div className="h-[60vh] w-full flex items-center justify-center flex-col gap-4 font-bold rounded-lg px-12 p-4 border-gray-500">
      <video
        src="/loading.webm"
        className="aspect-video object-contain w-full max-w[250px] h-[150px]"
        loop
        autoPlay
        muted
        playsInline
      >
        <source src="/loading.webm" type="video/webm" />
      </video>
      <p>{message}</p>
    </div>
  );
};

export default Loading;
