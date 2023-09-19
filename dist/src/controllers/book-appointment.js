"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unblockAllSlots = exports.bookSlot = exports.getAvailableSlots = exports.getSlots = void 0;
const moment_1 = __importDefault(require("moment"));
const knex_1 = __importDefault(require("../database/knex"));
const getSlots = (req, res) => {
    // returns all slots (including booked slots)
    knex_1.default.select()
        .from('slots')
        .then((slotArr) => {
        res.status(200).send(slotArr);
    })
        .catch((err) => res.status(400).send(err));
};
exports.getSlots = getSlots;
const getAvailableSlots = (req, res) => {
    // returns all available slots for booking (i.e., isBooked = 0)
    knex_1.default.select()
        .from('slots')
        .then((slotArr) => {
        const result = [];
        slotArr.forEach((slot) => {
            if (slot.isBooked === 0) {
                result.push(slot);
            }
        });
        res.status(200).send(result);
    })
        .catch((err) => res.status(400).send(err));
};
exports.getAvailableSlots = getAvailableSlots;
const bookSlot = (req, res) => {
    // get slot details for given slot number
    const { slotNo, pid, did } = req.body;
    (0, knex_1.default)('slots')
        .where({ slot_no: slotNo, isBooked: 0 })
        .then((slotArr) => {
        void (0, knex_1.default)('doctor')
            .where({ isAvailable: 1 })
            .then((doc) => __awaiter(void 0, void 0, void 0, function* () {
            if (!slotArr.length || !doc.length) {
                res.status(400).send('Slot unavailable');
            }
            else {
                const slotDetails = slotArr[0];
                const startTime = slotDetails.slot_start;
                const endTime = slotDetails.slot_end;
                yield (0, knex_1.default)('appointments')
                    .insert({
                    booking_date: (0, moment_1.default)().format('YYYY-MM-DD'),
                    start_time: startTime,
                    end_time: endTime,
                    slot_no: slotNo,
                    pid,
                    did
                })
                    // update available slots and doctor availability
                    .then(() => {
                    (0, knex_1.default)('slots')
                        .where({ slot_no: slotNo })
                        .update({ isBooked: 1 })
                        .then(() => {
                        (0, knex_1.default)('doctor')
                            .where({ did })
                            .update({ isAvailable: 0 })
                            .then(() => {
                            res.status(200).send('Booking successful');
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
                });
            }
        }));
    })
        .catch(function (err) {
        res.status(500).send('unable to register');
        console.error(err);
    });
};
exports.bookSlot = bookSlot;
const unblockAllSlots = (req, res) => {
    const { did } = req.body;
    void (0, knex_1.default)('doctor')
        .select('did')
        .where('did', did)
        .then((doc) => {
        if (!doc.length) {
            res.status(400).send('Action unauthorized');
        }
    });
    (0, knex_1.default)('slots')
        .update({ isBooked: 0 })
        .then(() => {
        (0, knex_1.default)('doctor')
            .update({ isAvailable: 1 })
            .then(() => {
            void (0, knex_1.default)('appointments')
                .del()
                .then(() => {
                res.status(200).send('slots and doctors Unblock successful');
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
exports.unblockAllSlots = unblockAllSlots;
//# sourceMappingURL=book-appointment.js.map