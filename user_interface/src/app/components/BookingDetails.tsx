import { useEffect, useState } from "react";
import axios from "axios";

interface BookingItem {
  owner: string;
  start: string;
  end: string;
  metadata: string;
  price: string;
  turfid: string;
}

const BookingDetails = (bookingItem) => {
  const [turf, setTurf] = useState("");
  const [booking, setBooking] = useState("");

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        setBooking(bookingItem.bookingItem);
        if (bookingItem.bookingItem[5]) {
          const response = await axios.get(
            `http://localhost:3000/api/turfs/${bookingItem.bookingItem[5]}`,
          );
          setTurf(response.data.turf.name);
        }
      } catch (error) {
        console.error("Error fetching turf:", error);
      }
    };

    bookingItem && fetchTurf();
  }, [bookingItem]);

  if (!booking) {
    return <p>Loading...</p>;
  }

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
      {booking && (
        <div className="my-10">
          <h1 className="text-3xl">Booking Details</h1>
          <div className="mt-8 flex flex-col gap-4">
            <p className="text-gray-400">
              Football Turf: {!turf ? "Loading..." : turf}
            </p>
            <p className="text-gray-400">TGNFT Booking Owner: {booking[0]}</p>
            <p className="text-gray-400">Date: {getDay(booking[1])}</p>
            <p className="text-gray-400">Start Time: {getTime(booking[1])}</p>
            <p className="text-gray-400">End Time: {getTime(booking[2])}</p>
            <p className="text-gray-400">
              Price: {parseInt(booking[4]) / 1e18} ETH
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingDetails;
