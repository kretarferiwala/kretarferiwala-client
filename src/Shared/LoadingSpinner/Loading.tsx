import React from "react";

const Loading = () => {
  return (
    <>
      {/* <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div> */}
       <div className="w-full aspect-[16/9] md:aspect-[21/9] flex items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    </>
  );
};

export default Loading;
