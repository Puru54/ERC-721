"use client";
import { useParams } from "next/navigation";
import Header from "@/partials/Header";
import Footer from "@/partials/Footer";
import ImageFallback from "@/helpers/ImageFallback";
import { useState, useEffect, SetStateAction } from "react";
import axios from "axios";
import contract from "@/config/contract.json";
import Web3, { Contract } from "web3";
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
  autoClose: 10000,
  hideProgressBar: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "dark",
};

interface Booking {
  bookingId: number;
  booker: string;
  startTime: number;
  endTime: number;
  metadataURI: string;
  price: number;
  turfId: string;
}

type myContractABI = [
  {
    inputs: [
      {
        internalType: "address";
        name: "initialOwner";
        type: "address";
      },
    ];
    stateMutability: "nonpayable";
    type: "constructor";
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "sender";
        type: "address";
      },
      {
        internalType: "uint256";
        name: "tokenId";
        type: "uint256";
      },
      {
        internalType: "address";
        name: "owner";
        type: "address";
      },
    ];
    name: "ERC721IncorrectOwner";
    type: "error";
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "operator";
        type: "address";
      },
      {
        internalType: "uint256";
        name: "tokenId";
        type: "uint256";
      },
    ];
    name: "ERC721InsufficientApproval";
    type: "error";
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "approver";
        type: "address";
      },
    ];
    name: "ERC721InvalidApprover";
    type: "error";
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "operator";
        type: "address";
      },
    ];
    name: "ERC721InvalidOperator";
    type: "error";
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "owner";
        type: "address";
      },
    ];
    name: "ERC721InvalidOwner";
    type: "error";
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "receiver";
        type: "address";
      },
    ];
    name: "ERC721InvalidReceiver";
    type: "error";
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "sender";
        type: "address";
      },
    ];
    name: "ERC721InvalidSender";
    type: "error";
  },
  {
    inputs: [
      {
        internalType: "uint256";
        name: "tokenId";
        type: "uint256";
      },
    ];
    name: "ERC721NonexistentToken";
    type: "error";
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "owner";
        type: "address";
      },
    ];
    name: "OwnableInvalidOwner";
    type: "error";
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "account";
        type: "address";
      },
    ];
    name: "OwnableUnauthorizedAccount";
    type: "error";
  },
  {
    anonymous: false;
    inputs: [
      {
        indexed: true;
        internalType: "address";
        name: "owner";
        type: "address";
      },
      {
        indexed: true;
        internalType: "address";
        name: "approved";
        type: "address";
      },
      {
        indexed: true;
        internalType: "uint256";
        name: "tokenId";
        type: "uint256";
      },
    ];
    name: "Approval";
    type: "event";
  },
  {
    anonymous: false;
    inputs: [
      {
        indexed: true;
        internalType: "address";
        name: "owner";
        type: "address";
      },
      {
        indexed: true;
        internalType: "address";
        name: "operator";
        type: "address";
      },
      {
        indexed: false;
        internalType: "bool";
        name: "approved";
        type: "bool";
      },
    ];
    name: "ApprovalForAll";
    type: "event";
  },
  {
    anonymous: false;
    inputs: [
      {
        indexed: true;
        internalType: "uint256";
        name: "bookingId";
        type: "uint256";
      },
      {
        indexed: true;
        internalType: "address";
        name: "booker";
        type: "address";
      },
      {
        indexed: false;
        internalType: "uint256";
        name: "startTime";
        type: "uint256";
      },
      {
        indexed: false;
        internalType: "uint256";
        name: "endTime";
        type: "uint256";
      },
      {
        indexed: false;
        internalType: "string";
        name: "turfId";
        type: "string";
      },
    ];
    name: "BookingCreated";
    type: "event";
  },
  {
    anonymous: false;
    inputs: [
      {
        indexed: true;
        internalType: "address";
        name: "previousOwner";
        type: "address";
      },
      {
        indexed: true;
        internalType: "address";
        name: "newOwner";
        type: "address";
      },
    ];
    name: "OwnershipTransferred";
    type: "event";
  },
  {
    anonymous: false;
    inputs: [
      {
        indexed: true;
        internalType: "address";
        name: "from";
        type: "address";
      },
      {
        indexed: true;
        internalType: "address";
        name: "to";
        type: "address";
      },
      {
        indexed: true;
        internalType: "uint256";
        name: "tokenId";
        type: "uint256";
      },
    ];
    name: "Transfer";
    type: "event";
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "to";
        type: "address";
      },
      {
        internalType: "uint256";
        name: "tokenId";
        type: "uint256";
      },
    ];
    name: "approve";
    outputs: [];
    stateMutability: "nonpayable";
    type: "function";
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "owner";
        type: "address";
      },
    ];
    name: "balanceOf";
    outputs: [
      {
        internalType: "uint256";
        name: "";
        type: "uint256";
      },
    ];
    stateMutability: "view";
    type: "function";
    constant: true;
  },
  {
    inputs: [
      {
        internalType: "uint256";
        name: "";
        type: "uint256";
      },
    ];
    name: "bookings";
    outputs: [
      {
        internalType: "address";
        name: "booker";
        type: "address";
      },
      {
        internalType: "uint256";
        name: "startTime";
        type: "uint256";
      },
      {
        internalType: "uint256";
        name: "endTime";
        type: "uint256";
      },
      {
        internalType: "string";
        name: "metadataURI";
        type: "string";
      },
      {
        internalType: "uint256";
        name: "price";
        type: "uint256";
      },
      {
        internalType: "string";
        name: "turfId";
        type: "string";
      },
    ];
    stateMutability: "view";
    type: "function";
    constant: true;
  },
  {
    inputs: [
      {
        internalType: "uint256";
        name: "";
        type: "uint256";
      },
    ];
    name: "exists";
    outputs: [
      {
        internalType: "bool";
        name: "";
        type: "bool";
      },
    ];
    stateMutability: "view";
    type: "function";
    constant: true;
  },
  {
    inputs: [
      {
        internalType: "uint256";
        name: "tokenId";
        type: "uint256";
      },
    ];
    name: "getApproved";
    outputs: [
      {
        internalType: "address";
        name: "";
        type: "address";
      },
    ];
    stateMutability: "view";
    type: "function";
    constant: true;
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "owner";
        type: "address";
      },
      {
        internalType: "address";
        name: "operator";
        type: "address";
      },
    ];
    name: "isApprovedForAll";
    outputs: [
      {
        internalType: "bool";
        name: "";
        type: "bool";
      },
    ];
    stateMutability: "view";
    type: "function";
    constant: true;
  },
  {
    inputs: [];
    name: "name";
    outputs: [
      {
        internalType: "string";
        name: "";
        type: "string";
      },
    ];
    stateMutability: "view";
    type: "function";
    constant: true;
  },
  {
    inputs: [];
    name: "nextBookingId";
    outputs: [
      {
        internalType: "uint256";
        name: "";
        type: "uint256";
      },
    ];
    stateMutability: "view";
    type: "function";
    constant: true;
  },
  {
    inputs: [];
    name: "owner";
    outputs: [
      {
        internalType: "address";
        name: "";
        type: "address";
      },
    ];
    stateMutability: "view";
    type: "function";
    constant: true;
  },
  {
    inputs: [
      {
        internalType: "uint256";
        name: "tokenId";
        type: "uint256";
      },
    ];
    name: "ownerOf";
    outputs: [
      {
        internalType: "address";
        name: "";
        type: "address";
      },
    ];
    stateMutability: "view";
    type: "function";
    constant: true;
  },
  {
    inputs: [];
    name: "renounceOwnership";
    outputs: [];
    stateMutability: "nonpayable";
    type: "function";
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "from";
        type: "address";
      },
      {
        internalType: "address";
        name: "to";
        type: "address";
      },
      {
        internalType: "uint256";
        name: "tokenId";
        type: "uint256";
      },
    ];
    name: "safeTransferFrom";
    outputs: [];
    stateMutability: "nonpayable";
    type: "function";
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "from";
        type: "address";
      },
      {
        internalType: "address";
        name: "to";
        type: "address";
      },
      {
        internalType: "uint256";
        name: "tokenId";
        type: "uint256";
      },
      {
        internalType: "bytes";
        name: "data";
        type: "bytes";
      },
    ];
    name: "safeTransferFrom";
    outputs: [];
    stateMutability: "nonpayable";
    type: "function";
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "operator";
        type: "address";
      },
      {
        internalType: "bool";
        name: "approved";
        type: "bool";
      },
    ];
    name: "setApprovalForAll";
    outputs: [];
    stateMutability: "nonpayable";
    type: "function";
  },
  {
    inputs: [
      {
        internalType: "bytes4";
        name: "interfaceId";
        type: "bytes4";
      },
    ];
    name: "supportsInterface";
    outputs: [
      {
        internalType: "bool";
        name: "";
        type: "bool";
      },
    ];
    stateMutability: "view";
    type: "function";
    constant: true;
  },
  {
    inputs: [];
    name: "symbol";
    outputs: [
      {
        internalType: "string";
        name: "";
        type: "string";
      },
    ];
    stateMutability: "view";
    type: "function";
    constant: true;
  },
  {
    inputs: [
      {
        internalType: "uint256";
        name: "tokenId";
        type: "uint256";
      },
    ];
    name: "tokenURI";
    outputs: [
      {
        internalType: "string";
        name: "";
        type: "string";
      },
    ];
    stateMutability: "view";
    type: "function";
    constant: true;
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "from";
        type: "address";
      },
      {
        internalType: "address";
        name: "to";
        type: "address";
      },
      {
        internalType: "uint256";
        name: "tokenId";
        type: "uint256";
      },
    ];
    name: "transferFrom";
    outputs: [];
    stateMutability: "nonpayable";
    type: "function";
  },
  {
    inputs: [
      {
        internalType: "address";
        name: "newOwner";
        type: "address";
      },
    ];
    name: "transferOwnership";
    outputs: [];
    stateMutability: "nonpayable";
    type: "function";
  },
  {
    inputs: [
      {
        internalType: "uint256";
        name: "_startTime";
        type: "uint256";
      },
      {
        internalType: "uint256";
        name: "_endTime";
        type: "uint256";
      },
      {
        internalType: "string";
        name: "_turfId";
        type: "string";
      },
      {
        internalType: "uint256";
        name: "price";
        type: "uint256";
      },
    ];
    name: "mintBookingSlot";
    outputs: [];
    stateMutability: "nonpayable";
    type: "function";
  },
  {
    inputs: [
      {
        internalType: "uint256";
        name: "_bookingId";
        type: "uint256";
      },
    ];
    name: "bookTimeSlot";
    outputs: [];
    stateMutability: "payable";
    type: "function";
    payable: true;
  },
  {
    inputs: [
      {
        internalType: "uint256";
        name: "_bookingId";
        type: "uint256";
      },
    ];
    name: "getBookingDetails";
    outputs: [
      {
        internalType: "address";
        name: "";
        type: "address";
      },
      {
        internalType: "uint256";
        name: "";
        type: "uint256";
      },
      {
        internalType: "uint256";
        name: "";
        type: "uint256";
      },
      {
        internalType: "string";
        name: "";
        type: "string";
      },
      {
        internalType: "uint256";
        name: "";
        type: "uint256";
      },
      {
        internalType: "string";
        name: "";
        type: "string";
      },
    ];
    stateMutability: "view";
    type: "function";
    constant: true;
  },
];

const Booking = () => {
  const { id } = useParams();
  const [TGNFT, setTGNFT] = useState<Contract<myContractABI> | null>(null);
  const [bookings, setBookings] = useState<Set<Booking>>(new Set());
  const [filteredBookings, setFilteredBookings] = useState<Set<Booking>>(
    new Set(),
  );
  const [selectedAccount, setSelectedAccount] = useState("");
  const [connected, setConnected] = useState(false);
  const [state, setState] = useState(0);

  const [turf, setTurf] = useState<{
    _id: string;
    name: string;
    description: string;
    location: string;
    photo: string;
    status: string;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    (() => {
      const filteredBookings = selectedDate
        ? Array.from(bookings).filter(
            (booking) =>
              getDate(booking.startTime) ===
              getDate(Math.floor(new Date(selectedDate).getTime() / 1000)),
          )
        : Array.from(bookings);
      setFilteredBookings(new Set(filteredBookings));
      // console.log(filteredBookings);
    })();
  }, [selectedDate, bookings]); // Add selectedDate and bookings as dependencies

  async function fetchTurfDetails() {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/turfs/${id}`);
      setTurf(res.data.turf);
      // console.log(res.data.turf);
    } catch (error) {
      console.log(error);
      window.alert("Something went wrong while fetching the turf details");
    }
    setIsLoading(false);
  }

  async function connectAccount() {
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setSelectedAccount(accounts[0]);
      setConnected(true);
      console.log("Connected");
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchAvailableBookings() {
    const web3 = new Web3(
      Web3.givenProvider ||
        "https://sepolia.infura.io/v3/368bd52eca6d4a388859e1e9aa6e0b4e",
    );
    const myContract = new web3.eth.Contract(
      contract.TurfGuardian.abi,
      contract.TurfGuardian.address,
    );
    setTGNFT(myContract);
    const bookingCount = await myContract.methods.nextBookingId().call();
    const uniqueBookings = new Set<Booking>();
    for (let i = 0; i < Number(bookingCount) - 1; i++) {
      const booking = (await myContract.methods.bookings(i).call()) as Booking;
      booking.bookingId = i + 1;
      if (booking && typeof booking === "object" && "turfId" in booking) {
        if (booking.turfId === id) uniqueBookings.add(booking);
      }
    }
    setBookings(uniqueBookings);
  }

  useEffect(() => {
    fetchTurfDetails();
    connectAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchAvailableBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function getDate(UnixTime: number) {
    const unixTimestampInMilliseconds = Number(UnixTime) * 1000;
    const date = new Date(unixTimestampInMilliseconds);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  }

  function getTime(UnixTime: number) {
    const unixTimestampInMilliseconds = Number(UnixTime) * 1000;
    const date = new Date(unixTimestampInMilliseconds);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
    return formattedTime;
  }

  function getPrice(Price: number) {
    const ethValue = parseFloat(Price.toString()) / 1e18;
    return ethValue;
  }

  function isBooked(Booker: string) {
    if (Booker === "0x0000000000000000000000000000000000000000") {
      return false;
    }
    return true;
  }

  function checkBooker(Booker: string) {
    if (Booker === "0x0000000000000000000000000000000000000000") {
      return "Available";
    } else if (Booker.toLowerCase() === selectedAccount.toLowerCase()) {
      return "Yours";
    }
    return "Not Available";
  }

  async function bookSlot(bookingId: number, price: number) {
    if (!connected) {
      toast.warn(
        "Please connect to your account before trying to book the turf",
        toastOption,
      );
      return;
    }
    if (TGNFT) {
      toast.info("Booking...", toastOption);
      setIsLoading(true);
      try {
        console.log(bookingId, price);
        await TGNFT.methods
          .bookTimeSlot(bookingId)
          .send({
            from: selectedAccount,
            value: price.toString(),
            gas: "3000000",
          })
          .then((x) => {
            setState(state + 1);
            toast.success("Turf Booked Successfully!", toastOption);
            setTimeout(() => {
              toast.info(`Your TGNFT id is ${bookingId}`, toastOption);
            }, 500);
            console.log(x);
          });
      } catch (error) {
        console.log(error);
        toast.error("Booking Slot Action Failed!", toastOption);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <>
      <ToastContainer />
      {isLoading && (
        <div className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-75 z-50 flex justify-center items-center">
          <div className="customLoader"></div>
        </div>
      )}
      <Header />
      <section className="section pt-16 min-h-screen">
        {turf && (
          <div className="container flex flex-col gap-10">
            <div>
              <h1 className="text-3xl mb-5">{turf.name}</h1>
              <div className="flex justify-between gap-10">
                <ImageFallback
                  className="w-1/2 h-100 object-cover rounded-t-md"
                  src={turf.photo}
                  width={1000}
                  height={1000}
                  alt={turf.name}
                />
                <div className="w-1/2">
                  <h5 className="font-bold">Turf Details</h5>
                  {turf.description.split("\n").map((paragraphText, index) => (
                    <p
                      key={index}
                      className="text-md font-light text-gray-500 mt-2 mb-4"
                    >
                      {paragraphText}
                    </p>
                  ))}
                  <p className="text-md font-light text-gray-500 mt-2 mb-4">
                    Location: {turf.location}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="relative overflow-x-auto">
                <h1 className="text-xl mb-3">Turf Bookings Available</h1>
                <div className="my-2">
                  <label>Find bookings for a specific date:</label>
                  <input
                    type="date"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="rounded ml-3 text-black"
                  />
                </div>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Start Time
                      </th>
                      <th scope="col" className="px-6 py-3">
                        End Time
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!filteredBookings ? (
                      <tr>
                        <td>Loading...</td>
                      </tr>
                    ) : Array.from(filteredBookings).length === 0 ? (
                      <tr>
                        <td className="py-4">No Bookings Available</td>
                      </tr>
                    ) : (
                      Array.from(filteredBookings)
                        .reverse()
                        .map((booking, index) => (
                          <tr key={index}>
                            <td className="px-6 py-3">
                              {getDate(booking.startTime)}
                            </td>
                            <td className="px-6 py-3">
                              {getTime(booking.startTime)}
                            </td>
                            <td className="px-6 py-3">
                              {getTime(booking.endTime)}
                            </td>
                            <td className="px-6 py-3">
                              {getPrice(booking.price)} ETH
                            </td>
                            <td className="px-6 py-3">
                              {checkBooker(booking.booker) === "Yours"
                                ? "Booked"
                                : checkBooker(booking.booker) ===
                                  "Not Available"
                                ? "Not Available"
                                : "Available"}
                            </td>
                            <td className="px-6 py-3">
                              {!isBooked(booking.booker) ? (
                                <button
                                  className="text-xs py-2 px-4 bg-blue-600 text-white rounded"
                                  onClick={() =>
                                    bookSlot(booking.bookingId, booking.price)
                                  }
                                >
                                  Book Turf
                                </button>
                              ) : (
                                <span className=""></span>
                              )}
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
};

export default Booking;
