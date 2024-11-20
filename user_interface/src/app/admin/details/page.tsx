"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Contract from "web3";
import Web3 from "web3";
import BookingDetails from "@/app/components/BookingDetails";
import contract from "@/config/contract.json";
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

declare global {
  interface Window {
    ethereum?: any;
  }
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

const TGNFTDetails = () => {
  const [turfID, setTurfID] = useState("");
  const [booking, setBooking] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [TGNFT, setTGNFT] = useState<Contract<myContractABI> | null>(null);

  async function connectAccount() {
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
      if (isRequesting) {
        console.log("Request is already in progress. Please wait.");
        return;
      }
      setIsRequesting(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setConnected(true);
      console.log("Connected");
    } catch (error) {
      // window.alert(
      //   "Something went wrong while connecting to web3. Refresh the page once.",
      // );
      console.log(error);
    }
  }

  async function getContract() {
    const web3 = new Web3(
      Web3.givenProvider ||
        "https://sepolia.infura.io/v3/368bd52eca6d4a388859e1e9aa6e0b4e",
    );
    const myContract = new web3.eth.Contract(
      contract.TurfGuardian.abi,
      contract.TurfGuardian.address,
    );
    setTGNFT(myContract);
  }

  useEffect(() => {
    getContract();
  }, []);

  useEffect(() => {
    connectAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  async function getBookingDetails(bookingId: number) {
    if (TGNFT) {
      try {
        toast.info("Fetching TGNFT Details...", toastOption);
        setIsLoading(true);
        await TGNFT.methods
          .getBookingDetails(bookingId)
          .call()
          .then((x) => {
            console.log(x);
            setBooking(x);
            toast.success("Booking Details Fetched Successfully!", toastOption);
          });
      } catch (error) {
        console.log(error);
        setBooking("none");
        toast.error("TGNFT ID does not exist!", toastOption);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warn("Please connect your wallet", toastOption);
    }
  }

  async function handleSubmit() {
    if (!turfID) {
      toast.warn("Please provide an id to search", toastOption);
      return;
    }
    if (!connected) {
      toast.warn(
        "Please connect to your wallet (the one used to deploy the contract) to mint",
        toastOption,
      );
      return;
    }
    getBookingDetails(parseInt(turfID));
  }

  return (
    <div className="min-h-screen w-full">
      <ToastContainer />
      <div className="flex gap-20 justify-center py-10 text-xl text-white">
        <Link href={"/admin"} className="text-lg text-gray-400">
          Add Turf
        </Link>
        <Link className="text-lg text-gray-400" href={"/admin/tgnft"}>
          New Booking
        </Link>
        <Link className="text-lg text-gray-400" href={"/admin/allturfs"}>
          Manage Turfs
        </Link>
        <Link
          className="text-lg text-blue-500 font-bold"
          href={"/admin/details"}
        >
          Get Booking Details
        </Link>
      </div>
      {isLoading && (
        <div className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-75 z-10 flex justify-center items-center">
          <div className="customLoader"></div>
        </div>
      )}
      <form
        className="container p-6 rounded shadow shadow-gray-800 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label className="">Search TGNFT:</label>
        <div className="flex justify-between">
          <input
            type="search"
            className="w-11/12 rounded-l text-dark"
            placeholder="TGNFT ID (eg. 1)"
            onChange={(e) => {
              const reg = /^[1-9]\d*$/;
              if (e.target.value === "" || reg.test(e.target.value)) {
                setTurfID(e.target.value);
              }
            }}
            value={turfID}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-r px-12"
          >
            Search
          </button>
        </div>

        {booking &&
          booking != "" &&
          (booking === "none" ? (
            <div className="my-5">
              <p className="text-red-600 text-xl">Booking does not exist...</p>
            </div>
          ) : (
            <BookingDetails bookingItem={booking} />
            // const turf = await axios.get(`/bookings/${booking[5]}`)
            // <div className="my-10">
            //   <h1 className="text-3xl">Booking Details</h1>
            //   <div className="mt-8 flex flex-col gap-4">
            //     <p className="text-gray-400">Football Turf: {turf.name}</p>
            //     <p className="text-gray-400">
            //       TGNFT Booking Owner: {booking[0]}
            //     </p>
            //     <p className="text-gray-400">Date: {getDay(booking[1])}</p>
            //     <p className="text-gray-400">
            //       Start Time: {getTime(booking[1])}
            //     </p>
            //     <p className="text-gray-400">End Time: {getTime(booking[2])}</p>
            //     <p className="text-gray-400">
            //       Price: {Web3.utils.fromWei(booking[4], "ether")} ETH
            //     </p>
            //   </div>
            // </div>
          ))}
      </form>
    </div>
  );
};

export default TGNFTDetails;
