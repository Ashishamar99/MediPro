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
exports.getPatientWithID = exports.getPatientsList = exports.handlePatientLogin = exports.updatePatientRegister = exports.handlePatientRegister = void 0;
const knex_1 = __importDefault(require("../database/knex"));
const handlePatientRegister = (req, res) => {
    const { name, phno, gender, email, dob, password } = req.body;
    knex_1.default.transaction(function (trx) {
        return __awaiter(this, void 0, void 0, function* () {
            const patient = {
                pname: name,
                ppasswd: password,
                pemail: email,
                pphno: phno,
                dob,
                gender
            };
            yield trx
                .insert(patient)
                .into('patient')
                .then((id) => {
                // trx.commit
                res.status(200).send(id);
            })
                .catch((err) => {
                // trx.rollback
                res.status(400).send('User already exists');
                console.error(err);
            });
        });
    }).catch(function (err) {
        res.status(500).json({ status: 'ERROR', message: 'Internal server error' });
        console.error(err);
    });
};
exports.handlePatientRegister = handlePatientRegister;
const updatePatientRegister = (req, res) => {
    const { pname, pid, pphno, gender, dob } = req.body;
    const patient = {
        pname,
        pphno,
        dob,
        gender
    };
    (0, knex_1.default)('patient')
        .where('pid', pid)
        .update(patient)
        .then((isUpdated) => {
        if (isUpdated === 1) {
            res.status(200).send('Update successful!');
            return;
        }
        res.status(404).send('Incorrect PID');
    })
        .catch((err) => {
        // trx.rollback;
        res.status(400).send("User doesn't exist");
        console.error(err);
    });
};
exports.updatePatientRegister = updatePatientRegister;
const handlePatientLogin = (req, res) => {
    const { phno, password } = req.body;
    if (!phno || !password) {
        return res.status(400).json('incorrect form submission');
    }
    knex_1.default.select('pphno', 'ppasswd')
        .from('patient')
        .where('pphno', '=', phno)
        .then((data) => __awaiter(void 0, void 0, void 0, function* () {
        if (password.toString() === data[0].ppasswd) {
            return yield knex_1.default
                .select('*')
                .from('patient')
                .where('pphno', '=', phno)
                .then((user) => {
                res.json(user[0]);
            })
                .catch(() => res.status(400).json('unable to get user'));
        }
        else {
            res.status(400).json('wrong credentials');
        }
    }))
        .catch((err) => res.status(400).json(err));
};
exports.handlePatientLogin = handlePatientLogin;
const getPatientsList = (req, res) => {
    knex_1.default.select('*')
        .from('patient')
        .then((patients) => {
        res.status(200).send(patients);
    })
        .catch((err) => {
        res
            .status(500)
            .json({ status: 'ERROR', message: 'Internal server error' });
        console.error(err);
    });
};
exports.getPatientsList = getPatientsList;
const getPatientWithID = (req, res) => {
    const id = req.params.id;
    knex_1.default.select('*')
        .from('patient')
        .where('pid', '=', id)
        .then((patient) => {
        res.status(200).send(patient);
    })
        .catch((err) => {
        res.status(400).send('Unable to get user');
        console.error(err);
    });
};
exports.getPatientWithID = getPatientWithID;
//# sourceMappingURL=patient.js.map