"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppointmentWithDID = exports.getAppointmentWithPID = exports.getAppointmentWithID = exports.cancelAppointment = exports.getAppointmentList = void 0;
const knex_1 = __importDefault(require("../database/knex"));
const getAppointmentList = (req, res) => {
    knex_1.default.select("*")
        .from("appointments")
        .then((appointments) => {
        res.status(200).send(appointments);
    })
        .catch((err) => {
        res.send("Unable to get appointment details");
        console.error(err);
    });
};
exports.getAppointmentList = getAppointmentList;
const cancelAppointment = (req, res) => {
    const { bid, slotNo, did } = req.body;
    (0, knex_1.default)("appointments")
        .where("bid", bid)
        .del()
        .then(() => {
        (0, knex_1.default)("slots")
            .where({ slot_no: slotNo })
            .update({ isBooked: 0 })
            .then(() => {
            (0, knex_1.default)("doctor")
                .where({ did: did })
                .update({ isAvailable: 1 })
                .then(() => {
                res.status(200).send("Appointment cancelled!");
            })
                .catch((err) => {
                res.status(400).send("Couldn't cancel appointment");
                console.error(err);
            });
        })
            .catch((err) => {
            res.status(400).send("Couldn't cancel appointment");
            console.error(err);
        });
    })
        .catch((err) => {
        res.send("Internal server error");
        console.error(err);
    });
};
exports.cancelAppointment = cancelAppointment;
const getAppointmentWithID = (req, res) => {
    const bid = req.params.id;
    knex_1.default.select("*")
        .from("appointments")
        .where("bid", "=", bid)
        .then((appointments) => {
        res.status(200).send(appointments);
    })
        .catch((err) => {
        res.send("Unable to get appointment details");
        console.error(err);
    });
};
exports.getAppointmentWithID = getAppointmentWithID;
const getAppointmentWithPID = (req, res) => {
    const pid = req.params.id;
    knex_1.default.select("*")
        .from("appointments")
        .where("pid", "=", pid)
        .then((appointments) => {
        res.status(200).send(appointments);
    })
        .catch((err) => {
        res.send("Unable to get appointment details");
        console.error(err);
    });
};
exports.getAppointmentWithPID = getAppointmentWithPID;
const getAppointmentWithDID = (req, res) => {
    const did = req.params.id;
    knex_1.default.select("*")
        .from("appointments")
        .where("did", "=", did)
        .then((appointments) => {
        res.status(200).send(appointments);
    })
        .catch((err) => {
        res.send("Unable to get appointment details");
        console.error(err);
    });
};
exports.getAppointmentWithDID = getAppointmentWithDID;
//# sourceMappingURL=appointment.js.map