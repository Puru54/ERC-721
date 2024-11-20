const TurfGuardian = artifacts.require("TurfGuardian");

contract("TurfGuardian", (accounts) => {
    let turfGuardianInstance;

    const owner = accounts[0];
    const user1 = accounts[1];
    // const user2 = accounts[2];

    beforeEach(async () => {
        turfGuardianInstance = await TurfGuardian.new(owner);
    });

    it("should allow the owner to mint a booking slot", async () => {
        const startTime = Math.floor(Date.now() / 1000) + 3600; // One hour from now
        const endTime = startTime + 3600; // One hour time slot
        const price = web3.utils.toWei("0.01", "ether");
        const bookingId = await turfGuardianInstance.nextBookingId.call();

        await turfGuardianInstance.mintBookingSlot(startTime, endTime, "id", {
            from: owner,
            value: price
        });

        const booking = await turfGuardianInstance.getBookingDetails(bookingId);
        assert.equal(booking[0], "0x0000000000000000000000000000000000000000"); // Booker should be the zero address
        assert.equal(booking[1].toNumber(), startTime);
        assert.equal(booking[2].toNumber(), endTime);
        assert.equal(booking[4].toString(), price);
    });

    it("should allow a user to book a time slot", async () => {
        const startTime = Math.floor(Date.now() / 1000) + 3600; // One hour from now
        const endTime = startTime + 3600; // One hour time slot
        const price = web3.utils.toWei("0.01", "ether");
        const bookingId = await turfGuardianInstance.nextBookingId.call();

        await turfGuardianInstance.mintBookingSlot(startTime, endTime, price, {
            from: owner,
        });

        await turfGuardianInstance.bookTimeSlot(bookingId, {
            from: user1,
            value: price,
        });

        const booking = await turfGuardianInstance.getBookingDetails(bookingId);
        assert.equal(booking[0], user1); // Booker should be user1
    });
});
