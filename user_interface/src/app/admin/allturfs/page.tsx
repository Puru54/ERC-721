"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import ImageFallback from "@/helpers/ImageFallback";
import Link from "next/link";
import {
  ToastContainer,
  ToastOptions,
  ToastPosition,
  toast,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CustomToastOptions extends ToastOptions {
  position: ToastPosition;
}
const toastOption: CustomToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "dark",
};

const AllTurfs = () => {
  const [state, setState] = useState(0);
  const [turfs, setTurfs] = useState<
    {
      _id: string;
      name: string;
      description: string;
      location: string;
      photo: string;
      status: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getTurfs() {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/turfs");
      setTurfs(res.data.turfs);
      // console.log(res.data.turfs);
    } catch (error) {
      console.log(error);
      window.alert("Something went wrong while fetching the turf details");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getTurfs();
  }, [state]);

  async function handleActive(id: string) {
    setIsLoading(true);
    try {
      const res = await axios.put(`/api/turfs/${id}`, { status: "inactive" });
      // console.log(res);
      setState(state + 1);
      toast.success("Success", toastOption);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", toastOption);
    }
    setIsLoading(false);
  }

  async function handleInactive(id: string) {
    setIsLoading(true);
    try {
      const res = await axios.put(`/api/turfs/${id}`, { status: "active" });
      // console.log(res);
      setState(state + 1);
      toast.success("Success", toastOption);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", toastOption);
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen w-full">
      <ToastContainer />
      <div className="flex gap-20 justify-center py-10 text-xl text-white">
        <Link href={"/admin"} className="text-lg text-gray-400">
          Add Turf
        </Link>
        <Link href={"/admin/tgnft"} className="text-lg text-gray-400">
          New Booking
        </Link>
        <Link
          className="text-lg text-blue-500 font-bold"
          href={"/admin/allturfs"}
        >
          Manage Turfs
        </Link>
        <Link className="text-lg text-gray-400" href={"/admin/details"}>
          Get Booking Details
        </Link>
      </div>
      {isLoading && (
        <div className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-75 z-10 flex justify-center items-center">
          <div className="customLoader"></div>
        </div>
      )}
      <div className="flex flex-wrap gap-10 mx-24 my-10">
        {turfs &&
          turfs.map((turf, index) => (
            <div key={index} className="flex flex-col w-80 rounded-md">
              <div className="py-2 flex flex-col">
                <h5 className="text-sm font-bold">{turf.name}</h5>
                {turf.status === "active" ? (
                  <span className="text-xs text-blue-400">Available</span>
                ) : (
                  <span className="text-xs text-red-500">Not available</span>
                )}
              </div>
              {turf.photo && (
                <ImageFallback
                  className="card-img-top rounded-t-md w-full h-60 object-cover"
                  src={turf.photo}
                  width={500}
                  height={500}
                  alt={turf.name}
                />
              )}
              {turf.status === "active" ? (
                <button
                  className="py-3 text-sm bg-red-500 hover:bg-red-600 text-white rounded-b-md text-whitish"
                  onClick={() => handleActive(turf._id)}
                >
                  Make Unavailable
                </button>
              ) : (
                <button
                  className="py-3 text-sm bg-blue-600 text-white rounded-b-md text-whitish"
                  onClick={() => handleInactive(turf._id)}
                >
                  Make Available
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllTurfs;
