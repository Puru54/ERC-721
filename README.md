# TurfGuardian - Football Ground Booking System

## Overview
TurfGuardian is a decentralized platform designed to provide a secure, transparent, and efficient way for booking football grounds. By leveraging blockchain technology, TurfGuardian aims to eliminate common issues in traditional booking systems such as double bookings, disputes, and lack of transparency. TurfGuardian utilizes Non-Fungible Tokens (NFTs) based on the ERC721 standard to represent each booking slot, ensuring secure ownership and proof of reservation.

## Group Members
- Dechen Namgay
- Jampel Dorji
- Purushotam Adhikari

## Project Description
The **ERC721 Football Ground Booking Project (TurfGuardian)** aims to revolutionize the way football enthusiasts reserve and manage bookings using blockchain technology. TurfGuardian uses ERC721 tokens to create NFTs that represent unique time slots for football ground reservations. These tokens are minted by administrators and sold to users, providing a tamper-proof, immutable booking system that enhances transparency, security, and user experience.

### Project Objectives
- Demonstrate the practical application of ERC721 tokens for real-world use cases.
- Develop a secure and transparent football ground booking platform using blockchain technology.
- Provide users with ownership rights over their booking slots via NFTs.
- Enhance understanding and proficiency in blockchain development and smart contract implementation.

## Use Case Proposal
### Concept
The project addresses the common problem of disputes and inefficiencies in booking football grounds. By utilizing ERC721 tokens, TurfGuardian creates digital representations of booking time slots, allowing users to purchase and own NFTs representing specific reservations. This approach ensures that bookings are transparent, immutable, and verifiable on the blockchain, eliminating conflicts and ensuring a secure booking process.

### Innovation and Creativity
The project's innovation lies in the integration of NFTs for football ground reservations, providing a unique solution to long-standing booking disputes. By utilizing blockchain technology and ERC721 tokens, TurfGuardian adds transparency and trust to the booking process, making it a creative application of blockchain technology in the sports industry.

## Technical Implementation
### ERC721 Smart Contracts
The TurfGuardian smart contract is built using the ERC721 standard to create, manage, and transfer NFTs representing football ground booking slots. The smart contracts handle ownership and transfer of booking rights, while enforcing booking rules and restrictions.

### Metadata and Attributes
Each ERC721 token contains metadata and attributes, including booking start time, end time, associated football ground details, and price, allowing users to easily understand the booking slot's specifics.

### Smart Contract Components
- **Booking Struct**: Holds booking details such as start and end times, turf ID, price, and metadata URI.
- **Mappings**: The contract uses mappings to efficiently store booking information and validate the existence of bookings.

## User Interface Design
### Overview
The TurfGuardian user interface provides a user-friendly platform for browsing available booking slots, purchasing NFT tokens, and managing reservations. The UI includes a user-friendly dashboard, search functionality, and NFT wallet integration for managing tokens seamlessly.

### User Experience Considerations
The platform prioritizes usability and accessibility, ensuring that users can easily interact with the system regardless of their familiarity with blockchain technology. Accessibility features will be incorporated to accommodate a wide range of users.

## Blockchain Integration
TurfGuardian seamlessly interacts with the Ethereum blockchain, utilizing its decentralized nature to ensure secure and transparent bookings. The following aspects are emphasized:
- **Smart Contract Integration**: Smart contracts deployed on the Ethereum blockchain handle the creation, transfer, and management of ERC721 tokens representing booking slots.
- **Transaction Verification**: All transactions are recorded transparently on the blockchain, allowing users to independently verify the integrity of reservations.


## Features
- **Mint Booking Slot**: The administrator can mint NFTs representing available booking slots for a specific turf and time frame.
- **Book Time Slot**: Users can purchase booking slots by interacting with the blockchain, and the slots are represented as NFTs.
- **Fetch Booking Details**: Users can retrieve booking details for a specific NFT, including start and end times, price, and turf ID.
- **Ownership Verification**: NFTs are used to prove ownership of booked slots, eliminating disputes and ensuring transparent transactions.

## Smart Contract - TurfGuardian.sol
The TurfGuardian smart contract is written in Solidity and implements the ERC721 standard. Below are the key functions included in the smart contract:

### Key Functions
- **mintBookingSlot()**: Mints an NFT representing a booking slot. It requires parameters such as start time, end time, turf ID, and price.
- **bookTimeSlot()**: Allows users to book an available time slot by sending the required Ether. The NFT is transferred to the user upon payment.
- **getBookingDetails()**: Retrieves detailed information about a booking by providing the booking ID.
- **fetchDataFromAPI()**: A sample function to fetch metadata for NFTs from an external API.

## Platform Application
### Images Used in Application
- **Main Banner**: Displayed on the landing page.
- **Add Turf Page**: Illustrative image for adding new turf details.
- **Booking Process**: Used during the booking process to support users visually.
- **Manage Turfs**: Images to help users manage turf availability and bookings.
- **My Bookings Section**: Graphical header to distinguish user bookings.

## How to Use TurfGuardian
### Steps to Interact with the Smart Contract
1. **Add a Turf**: Administrators can add a new turf by providing the turf name, location, and description.
2. **Mint a Booking Slot**: Mint a new NFT for a specific time slot of a turf by providing details such as start time, end time, and price.
3. **Book a Time Slot**: Users can book an available slot by purchasing the NFT through the platform interface.
4. **View Booking Details**: Retrieve booking information by providing the NFT ID.

## Conclusion
TurfGuardian aims to provide a secure, transparent, and decentralized solution for football ground bookings using blockchain technology. By integrating smart contracts and NFTs, the platform ensures that each booking is verifiable, immutable, and free from disputes. The use of blockchain provides greater transparency and reliability, while the user-friendly interface makes the process accessible for all users, regardless of technical knowledge.

TurfGuardian has the potential to revolutionize the way football grounds are booked by reducing administrative tasks and enhancing booking security for both turf owners and users. Get started today by deploying the TurfGuardian smart contract and enjoy a seamless booking experience!

## License
This project is licensed under the MIT License.

## Contributors
- Dechen Namgay
- Jampel Dorji
- Purushotam Adhikari

## Contact
If you have any questions or suggestions, feel free to reach out.

