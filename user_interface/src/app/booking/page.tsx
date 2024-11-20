"use client";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import ImageFallback from "@/helpers/ImageFallback";
import Header from "@/partials/Header";
import Footer from "@/partials/Footer";
import { useRouter } from "next/navigation";

const GroundBookings = () => {
  const router = useRouter();
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
  const [hasLoaded, setHasLoaded] = useState("loading");

  async function getTurfs() {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/turfs");
      setTurfs(res.data.turfs);
      setHasLoaded("loaded");
      // console.log(res.data.turfs);
    } catch (error: unknown) {
      console.log(error);
      window.alert("Something went wrong while fetching the turf details");
      setHasLoaded("error");
      if (axios.isAxiosError(error)) {
        // The error is of type AxiosError
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error(
            "Server responded with an error:",
            axiosError.response.status,
          );
          console.error("Error data:", axiosError.response.data);
        } else if (axiosError.request) {
          console.error("No response received:", axiosError.request);
        } else {
          console.error("Request setup error:", axiosError.message);
        }
      } else {
        // Handle other types of errors
        console.error("Unknown error type:", error);
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getTurfs();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-75 z-50 flex justify-center items-center">
          <div className="customLoader"></div>
        </div>
      )}
      <Header />
      <section className="section pt-16 min-h-screen">
        <div className="container">
          {hasLoaded === "error" ? (
            <span className="text-xl font-bold text-red-600">
              Something went wrong while fetching the turf details. Check your
              internet connection and try refreshing the page once.
            </span>
          ) : hasLoaded === "loaded" ? (
            <>
              <h1 className="text-3xl mb-6">Football Ground Bookings</h1>
              <div className="flex flex-wrap gap-10">
                {turfs.map(
                  (turf, index) =>
                    turf.status === "active" && (
                      <div
                        key={index}
                        className="flex flex-col gap-2 w-80 rounded"
                      >
                        {turf.photo && (
                          <ImageFallback
                            className="card-img-top w-full h-60 object-cover rounded-md"
                            src={turf.photo}
                            width={1000}
                            height={1000}
                            alt={turf.name}
                          />
                        )}
                        <div className="pt-2  flex flex-col gap-3">
                          <h5 className="font-bold text-md">{turf.name}</h5>
                          <p className="text-sm">
                            {turf.description.slice(0, 135)}...
                          </p>
                          <button
                            onClick={() => router.push(`/booking/${turf._id}`)}
                            className="py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ),
                )}
              </div>
            </>
          ) : (
            // <span className="text-xl">Fetching data from database...</span>
            <span className="text-xl"></span>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default GroundBookings;
