"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const knex_1 = __importDefault(require("../database/knex"));
const getSlots = (req, res) => {
    //returns all slots (including booked slots)
    knex_1.default.select()
        .from("slots")
        .then((slotArr) => {
        res.status(200).send(slotArr);
    })
        .catch((err) => res.status(400).send(err));
};
const getAvailableSlots = (req, res) => {
    //returns all available slots for booking (i.e., isBooked = 0)
    knex_1.default.select()
        .from("slots")
        .then((slotArr) => {
        let result = [];
        slotArr.map((slot) => {
            if (slot.isBooked == 0) {
                result.push(slot);
            }
        });
        res.status(200).send(result);
    })
        .catch((err) => res.status(400).send(err));
};
const bookSlot = (req, res) => {
    //get slot details for given slot number
    const { slotNo, pid, did } = req.body;
    (0, knex_1.default)("slots")
        .where({ slot_no: slotNo, isBooked: 0 })
        .then((slotArr) => {
        (0, knex_1.default)("doctor")
            .where({ isAvailable: 1 })
            .then((doc) => {
            if (!slotArr.length || !doc.length) {
                res.status(400).send("Slot unavailable");
            }
            else {
                let slotDetails = slotArr[0];
                let startTime = slotDetails.slot_start;
                let endTime = slotDetails.slot_end;
                return ((0, knex_1.default)("appointments")
                    .insert({
                    booking_date: (0, moment_1.default)().format("YYYY-MM-DD"),
                    start_time: startTime,
                    end_time: endTime,
                    slot_no: slotNo,
                    pid: pid,
                    did: did,
                })
                    //update available slots and doctor availability
                    .then(() => {
                    (0, knex_1.default)("slots")
                        .where({ slot_no: slotNo })
                        .update({ isBooked: 1 })
                        .then(() => {
                        (0, knex_1.default)("doctor")
                            .where({ did: did })
                            .update({ isAvailable: 0 })
                            .then(() => {
                            res.status(200).send("Booking successful");
                        })
                            .catch((err) => {
                            res.status(400).send("Couldn't book appointment");
                            console.error(err);
                        });
                    })
                        .catch((err) => {
                        res.status(400).send("Couldn't book appointment");
                        console.error(err);
                    });
                })
                    .catch((err) => {
                    res.status(500).send("Couldn't book appointment");
                    console.error(err);
                }));
            }
        });
    })
        .catch(function (err) {
        res.status(500).send("unable to register");
        console.error(err);
    });
};
const unblockAllSlots = (req, res) => {
    const { did } = req.body;
    (0, knex_1.default)("doctor")
        .select("did")
        .where("did", did)
        .then((doc) => {
        if (!doc.length) {
            res.status(400).send("Action unauthorized");
        }
    });
    (0, knex_1.default)("slots")
        .update({ isBooked: 0 })
        .then(() => {
        (0, knex_1.default)("doctor")
            .update({ isAvailable: 1 })
            .then(() => {
            (0, knex_1.default)("appointments")
                .del()
                .then(() => {
                res.status(200).send("slots and doctors Unblock successful");
            });
        })
            .catch((err) => {
            res.status(500).send("Couldn't unblock slots and doctors");
            console.error(err);
        });
    })
        .catch((err) => {
        res.status(500).send("Couldn't unblock slots and doctors");
        console.error(err);
    });
};
module.exports = {
    getSlots: getSlots,
    getAvailableSlots: getAvailableSlots,
    bookSlot: bookSlot,
    unblockAllSlots: unblockAllSlots,
};
//# sourceMappingURL=book-appointment.js.map