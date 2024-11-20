// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TurfGuardian is ERC721, Ownable {
    struct Booking {
        address booker;
        uint256 startTime;
        uint256 endTime;
        string metadataURI;
        uint256 price;
        string turfId;
    }

    Booking[] public bookings;
    uint256 public nextBookingId;
    mapping(uint256 => bool) public exists;

    event BookingCreated(
        uint256 indexed bookingId,
        address indexed booker,
        uint256 startTime,
        uint256 endTime,
        string turfId
    );

    constructor(
        address initialOwner
    ) ERC721("TurfGuardian", "TGNFT") Ownable(initialOwner) {
        nextBookingId = 1;
    }

    modifier onlyCustomOwner() {
        require(
            msg.sender == 0x94A1517f8D18dA08387CCC71B786Def6E92c4573,
            "Only the owner can call this function!"
        );
        _;
    }

    function mintBookingSlot(
        uint256 _startTime,
        uint256 _endTime,
        string memory _turfId,
        uint256 price
    ) external onlyCustomOwner {
        string memory apiResponse = fetchDataFromAPI();
        Booking memory newBooking = Booking({
            booker: address(0),
            startTime: _startTime,
            endTime: _endTime,
            metadataURI: apiResponse,
            price: price,
            turfId: _turfId
        });

        uint256 bookingId = nextBookingId;
        bookings.push(newBooking);
        _mint(address(this), bookingId);
        exists[bookingId] = true;
        nextBookingId++;

        emit BookingCreated(
            bookingId,
            address(0),
            _startTime,
            _endTime,
            _turfId
        );
    }

    function bookTimeSlot(uint256 _bookingId) external payable {
        require(exists[_bookingId], "Booking does not exist");
        Booking storage booking = bookings[_bookingId - 1];
        require(booking.booker == address(0), "Booking is already taken");
        require(msg.value >= booking.price, "Insufficient funds sent");
        _transfer(address(this), msg.sender, _bookingId);
        booking.booker = msg.sender;

        if (msg.value > booking.price) {
            payable(msg.sender).transfer(msg.value - booking.price);
        }

        emit BookingCreated(
            _bookingId,
            msg.sender,
            booking.startTime,
            booking.endTime,
            booking.turfId
        );
    }

    function getBookingDetails(
        uint256 _bookingId
    )
        external
        view
        returns (
            address,
            uint256,
            uint256,
            string memory,
            uint256,
            string memory
        )
    {
        require(exists[_bookingId], "Booking does not exist");
        Booking memory booking = bookings[_bookingId - 1];
        return (
            booking.booker,
            booking.startTime,
            booking.endTime,
            booking.metadataURI,
            booking.price,
            booking.turfId
        );
    }

    function fetchDataFromAPI() internal pure returns (string memory) {
        return "https://api.npoint.io/75fa3c7b086284985c20";
    }
}
