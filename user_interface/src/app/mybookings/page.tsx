"use client";
import { useState, useEffect } from "react";
import Header from "@/partials/Header";
import Footer from "@/partials/Footer";
import contract from "@/config/contract.json";
import Web3 from "web3";

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
type Booking = [string, string, string, string, string, string, string];

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState("loading");
  const [connected, setConnected] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [TGNFT, setTGNFT] = useState<Contract<myContractABI> | null>(null);

  async function getContract() {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");
    if (isRequesting) {
      console.log("Request is already in progress. Please wait.");
      return;
    }
    setIsRequesting(true);
    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setConnected(true);
      console.log("Connected");
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
      const uniqueCampaigns = new Set();

      for (let i = 0; i < bookingCount - 1; i++) {
        const booking = await myContract.methods.bookings(i).call();
        uniqueCampaigns.add(booking);
      }

      let bookings: Booking[] = Array.from(uniqueCampaigns) as Booking[];
      //   console.log(bookings);
      let myBookings = [];
      for (var i = 0; i < bookings.length; i++) {
        if (bookings[i][0].toLowerCase() === accounts[0]) {
          var newBooking = { ...bookings[i], id: i + 1 };
          myBookings.push(newBooking);
        }
      }
      setBookings(myBookings);
      //   console.log(myBookings);
      setHasLoaded("loaded");
    } catch (error) {
      console.log(error);
      setHasLoaded("error");
      window.alert("Error! Please check your console");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getDay(timestamp: any) {
    const date = new Date(timestamp * 1000);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const formattedDate = monthNames[monthIndex] + " " + day + ", " + year;
    return formattedDate;
  }

  function getTime(timestamp: any) {
    const date = new Date(timestamp * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const meridiem = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    const formattedTime =
      hours + ":" + (minutes < 10 ? "0" : "") + minutes + " " + meridiem;
    return formattedTime;
  }

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
          {!connected ? (
            <span className="text-xl font-bold text-red-600">
              Please connect to your metamask to view your TGNFT bookings.
            </span>
          ) : hasLoaded === "error" ? (
            <span className="text-xl font-bold text-red-600">
              Something went wrong while fetching the booking details. Check
              your internet connection and try refreshing the page once.
            </span>
          ) : hasLoaded === "loaded" ? (
            <>
              <div className="relative overflow-x-auto">
                <h1 className="text-3xl mb-6">My Bookings</h1>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        TGNFT ID
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Start Time
                      </th>
                      <th scope="col" className="px-6 py-3">
                        End Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(bookings).length === 0 ? (
                      <tr>
                        <td className="px-6 py-3">No bookings made...</td>
                      </tr>
                    ) : (
                      Array.from(bookings).map((booking, index) => {
                        return (
                          <tr key={index}>
                            <td className="px-6 py-3">{booking.id}</td>
                            <td className="px-6 py-3">{getDay(booking[1])}</td>
                            <td className="px-6 py-3">{getTime(booking[1])}</td>
                            <td className="px-6 py-3">{getTime(booking[2])}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <span className="text-xl"></span>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default MyBookings;
