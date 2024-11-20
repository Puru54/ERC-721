"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Contract from "web3";
import Web3 from "web3";
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
type TurfValue = { id: string; name: string };

const TGNFT = () => {
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  //   const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState<TurfValue | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [connected, setConnected] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [TGNFT, setTGNFT] = useState<Contract<myContractABI> | null>(null);

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
      setSelectedAccount(accounts[0]);
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
    getTurfs();
    getContract();
  }, []);

  useEffect(() => {
    connectAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  useEffect(() => {
    const firstActiveTurf = turfs.find((turf) => turf.status === "active");
    if (firstActiveTurf) {
      const data: TurfValue = {
        id: firstActiveTurf._id,
        name: firstActiveTurf.name,
      };
      setSelectedTurf(data);
    }
  }, [turfs]);

  async function mintBookingSlot(
    startTime: number, // Use number or any other appropriate type
    endTime: number,
    price: string, // Use string or any other appropriate type
    turfId: string,
  ) {
    if (TGNFT) {
      try {
        toast.info("Minting TGNFT...", toastOption);
        setIsLoading(true);
        await TGNFT.methods
          .mintBookingSlot(startTime, endTime, turfId, price)
          .send({
            from: selectedAccount,
            // value: price.toString(),
            // gas: "3000000",
          })
          .then((x) => {
            console.log(x);
            toast.success("Booking Slot NFT Minted Successfully!", toastOption);
            setTimeout(() => {
              setIsLoading(false);
              setPrice("");
              setDate("");
              setStartTime("");
              setEndTime("");
            }, 500);
          });
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        toast.error(
          "Booking Slot NFT Minting Failed! Check if your account is the contract deployer account",
          toastOption,
        );
      }
    } else {
      toast.warn("Please connect your wallet", toastOption);
    }
  }

  async function handleMinting() {
    if (!selectedTurf || !price || !date || !startTime || !endTime) {
      toast.warn("Please fill out all fields.", toastOption);
      return;
    }
    if (!connected) {
      toast.warn(
        "Please connect to your wallet (the one used to deploy the contract) to mint",
        toastOption,
      );
      return;
    }
    const currentDate = new Date();
    const selectedDate = new Date(date);
    if (selectedDate < currentDate) {
      toast.warn("Please select a date from the tomorrow.", toastOption);
      return;
    }
    const startDateTime = new Date(`${date} ${startTime}`);
    const endDateTime = new Date(`${date} ${endTime}`);
    const timeDifference = endDateTime.getTime() - startDateTime.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    if (hoursDifference < 1) {
      toast.warn(
        "End time must be at least 1 hour later than start time.",
        toastOption,
      );
      return;
    }
    const unixStartTime = Math.floor(startDateTime.getTime() / 1000);
    const unixEndTime = Math.floor(endDateTime.getTime() / 1000);
    const weiValue = Web3.utils.toWei(price.toString(), "ether").toString();

    const turfId = selectedTurf.id;
    // console.log(selectedAccount);
    // console.log(unixStartTime, unixEndTime, weiValue, turfId);

    mintBookingSlot(unixStartTime, unixEndTime, weiValue, turfId);
  }

  return (
    <div className="min-h-screen w-full">
      <ToastContainer />
      <div className="flex gap-20 justify-center py-10 text-xl text-white">
        <Link href={"/admin"} className="text-lg text-gray-400">
          Add Turf
        </Link>
        <Link href={"/admin/tgnft"} className="text-lg text-blue-500 font-bold">
          New Booking
        </Link>
        <Link className="text-lg text-gray-400" href={"/admin/allturfs"}>
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
      <form className="container p-6 rounded shadow shadow-gray-800 flex flex-col gap-4">
        <h3>Mint Booking Slot</h3>
        <div>
          <label className="block text-gray-400 mb-1">Select Turf:</label>
          <select
            value={selectedTurf ? JSON.stringify(selectedTurf) : ""}
            onChange={(e) => {
              setSelectedTurf(JSON.parse(e.target.value));
            }}
            className="w-full rounded p-2 text-sm border border-slate-500 text-black"
          >
            {turfs.map((turf) => {
              const data: TurfValue = { id: turf._id, name: turf.name };
              return (
                turf.status === "active" && (
                  <option
                    className="text-gray-400"
                    key={turf._id}
                    value={JSON.stringify(data)}
                  >
                    {turf.name}
                  </option>
                )
              );
            })}
          </select>
        </div>
        <div>
          <label className="block text-gray-400 mb-1">
            Booking Price (ETH):
          </label>
          <input
            onChange={(e) => {
              const reg = /^[0-9]*\.?[0-9]*$/;
              if (e.target.value === "" || reg.test(e.target.value)) {
                setPrice(e.target.value);
              }
            }}
            value={price}
            type="text"
            className="w-full rounded p-2 text-sm border border-slate-500 text-black"
            placeholder="Enter Booking Price (in ETH)"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded p-2 text-sm border border-slate-500 text-black"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Start Time:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded p-2 text-sm border border-slate-500 text-black"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">End Time:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full rounded p-2 text-sm border border-slate-500 text-black"
          />
        </div>

        <button
          className="p-2 bg-blue-700 hover:bg-blue-600 text-white rounded"
          onClick={(e) => {
            e.preventDefault();
            handleMinting();
          }}
        >
          Mint NFT
        </button>
      </form>
    </div>
  );
};

export default TGNFT;
