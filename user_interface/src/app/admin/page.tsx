"use client";
import axios from "axios";
import { useState } from "react";
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

const AdminHome = () => {
  const [turfName, setName] = useState("");
  const [turfDescription, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [turfPhoto, setPhoto] = useState("");
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [ipfsLoading, setIpfsLoading] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  async function handleUpload(file: string | Blob) {
    return new Promise((resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          true,
        );
        xhr.setRequestHeader("pinata_api_key", "4e2e0b082a3a7a7624d3");
        xhr.setRequestHeader(
          "pinata_secret_api_key",
          "f9ccf3142e278df713936a3a8032d7c2e5b5336543a884f4b44e40b707ddba35",
        );

        xhr.onload = function () {
          if (xhr.status === 200) {
            const resFile = JSON.parse(xhr.responseText);
            const imgHash = `https://gateway.ipfs.io/ipfs/${resFile.IpfsHash}`;
            // console.log(imgHash);
            resolve(imgHash);
          } else {
            reject("Unable to upload image to Pinata");
          }
        };

        xhr.send(formData);
      } catch (err) {
        reject("Unable to upload image to Pinata");
        console.log(err);
      }
    });
  }

  async function handlePhotoUpload() {
    if (fileInput !== null) {
      setIpfsLoading(true);
      await handleUpload(fileInput).then((x) => {
        if (typeof x === "string") {
          setPhoto(x as string); // Type assertion to ensure x is a string
          setIpfsLoading(false);
        } else {
          // Handle the case where x is not a string (optional)
          console.error("Received an unexpected type for x:", typeof x);
        }
      });
    } else {
      toast.error("No file selected", toastOption);
    }
  }

  async function handleRegister() {
    if (!turfName || !turfDescription || !location || !fileInput) {
      toast.warn("Please fill all the fields!", toastOption);
      return;
    }
    if (!turfPhoto) {
      toast.warn("Please upload the file to get the ipfs path", toastOption);
      return;
    }
    setIsloading(true);
    try {
      const res = await axios.post("/api/turfs", {
        name: turfName,
        description: turfDescription,
        location,
        photo: turfPhoto,
      });
      console.log(res);
      toast.success("Turf added successfully!", toastOption);
      setName("");
      setDescription("");
      setLocation("");
      setPhoto("");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", toastOption);
    }
    setIsloading(false);
  }

  return (
    <div className="min-h-screen w-full">
      <ToastContainer />
      {isLoading && (
        <div className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-75 z-10 flex justify-center items-center">
          <div className="customLoader"></div>
        </div>
      )}
      <div className="flex gap-20 justify-center py-10 text-xl text-white">
        <Link href={"/admin"} className="text-lg text-blue-500 font-bold">
          Add Turf
        </Link>
        <Link className="text-lg text-gray-400" href={"/admin/tgnft"}>
          New Booking
        </Link>
        <Link className="text-lg text-gray-400" href={"/admin/allturfs"}>
          Manage Turfs
        </Link>
        <Link className="text-lg text-gray-400" href={"/admin/details"}>
          Get Booking Details
        </Link>
      </div>
      <form className="container p-6 rounded shadow shadow-gray-800 flex flex-col gap-4">
        <h3>Add Turf for Booking</h3>
        <div>
          <label className="block text-gray-400 mb-1">Turf Name:</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={turfName}
            type="text"
            className="w-full rounded p-2 text-sm border border-slate-500 text-black"
            placeholder="Enter the Football Turf Name"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Turf Description:</label>
          <textarea
            spellCheck="false"
            className="w-full rounded p-2 text-sm border border-slate-500 text-black"
            placeholder="Describe the Football Turf"
            onChange={(e) => setDescription(e.target.value)}
            value={turfDescription}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Turf Location:</label>
          <input
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            type="text"
            className="w-full rounded p-2 text-sm border border-slate-500 text-black"
            placeholder="Enter Football Turf Location"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">
            Upload a Photo of the Football Turf:
          </label>
          <div className="w-full border border-slate-500 rounded bg-inpBg">
            <input
              className="w-3/4 p-2 file:cursor-pointer"
              type="file"
              onChange={(e) => {
                const selectedFile = e.target.files && e.target.files[0];
                if (selectedFile) {
                  setFileInput(selectedFile);
                }
              }}
            />
            <button
              className="p-2 w-1/4 bg-white text-black hover:bg-gray-500 hover:text-white rounded"
              onClick={(e) => {
                e.preventDefault();
                handlePhotoUpload();
              }}
            >
              Upload
            </button>
          </div>
          {ipfsLoading ? (
            <div className="w-full h-24 flex justify-center items-center">
              <div className="loader">Uploading Photo to IFPS...</div>
            </div>
          ) : (
            <p className="mt-2 text-xs break-words">
              IPFS path generated:{" "}
              <span className="text-gray-100">
                {turfPhoto === ""
                  ? "Upload file to generate IPFS path"
                  : turfPhoto}
              </span>
            </p>
          )}
        </div>
        <button
          className="p-2 bg-blue-700 hover:bg-blue-600 text-white rounded"
          onClick={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          Add Turf
        </button>
      </form>
    </div>
  );
};

export default AdminHome;
