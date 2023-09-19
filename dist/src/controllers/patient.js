"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("../database/knex"));
const handlePatientRegister = (req, res) => {
    const { name, phno, gender, email, dob, password } = req.body;
    knex_1.default.transaction(function (trx) {
        const patient = {
            pname: name,
            ppasswd: password,
            pemail: email,
            pphno: phno,
            dob: dob,
            gender: gender,
        };
        return trx
            .insert(patient)
            .into("patient")
            .then((id) => {
            trx.commit;
            res.status(200).send(id);
        })
            .catch((err) => {
            trx.rollback;
            res.status(400).send("User already exists");
            console.error(err);
        });
    }).catch(function (err) {
        res.status(500).json({ status: "ERROR", message: "Internal server error" });
        console.error(err);
    });
};
const updatePatientRegister = (req, res) => {
    const { pname, pid, pphno, gender, dob } = req.body;
    const patient = {
        pname: pname,
        pphno: pphno,
        dob: dob,
        gender: gender,
    };
    (0, knex_1.default)("patient")
        .where("pid", pid)
        .update(patient)
        .then((isUpdated) => {
        if (isUpdated === 1) {
            res.status(200).send("Update successful!");
            return;
        }
        res.status(404).send("Incorrect PID");
    })
        .catch((err) => {
        //trx.rollback;
        res.status(400).send("User doesn't exist");
        console.error(err);
    });
};
const handlePatientLogin = (req, res) => {
    const { phno, password } = req.body;
    if (!phno || !password) {
        return res.status(400).json("incorrect form submission");
    }
    knex_1.default.select("pphno", "ppasswd")
        .from("patient")
        .where("pphno", "=", phno)
        .then((data) => {
        if (password.toString() === data[0].ppasswd) {
            return knex_1.default
                .select("*")
                .from("patient")
                .where("pphno", "=", phno)
                .then((user) => {
                res.json(user[0]);
            })
                .catch((err) => res.status(400).json("unable to get user"));
        }
        else {
            res.status(400).json("wrong credentials");
        }
    })
        .catch((err) => res.status(400).json(err));
};
const getPatientsList = (req, res) => {
    knex_1.default.select("*")
        .from("patient")
        .then((patients) => {
        res.status(200).send(patients);
    })
        .catch((err) => {
        res
            .status(500)
            .json({ status: "ERROR", message: "Internal server error" });
        console.error(err);
    });
};
const getPatientWithID = (req, res) => {
    const id = req.params.id;
    knex_1.default.select("*")
        .from("patient")
        .where("pid", "=", id)
        .then((patient) => {
        res.status(200).send(patient);
    })
        .catch((err) => {
        res.status(400).send("Unable to get user");
        console.error(err);
    });
};
module.exports = {
    handlePatientRegister: handlePatientRegister,
    handlePatientLogin: handlePatientLogin,
    getPatientsList: getPatientsList,
    getPatientWithID: getPatientWithID,
    updatePatientRegister: updatePatientRegister,
};
//# sourceMappingURL=patient.js.map