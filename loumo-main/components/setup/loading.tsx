"use client";

const Loading = ({ status }: { status?: "failed" | "loading" }) => {
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
      {status === "failed" ? (
        <p className="text-center text-red-600">
          Une erreur est survenue lors du chargement des données. Veuillez
          réessayer plus tard.
        </p>
      ) : (
        <p className="text-center">Chargement des données...</p>
      )}
    </div>
  );
};

export default Loading;
