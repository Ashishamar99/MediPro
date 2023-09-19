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
exports.getAvailableDoctors = exports.getDoctorWithRole = exports.handleDoctorRegister = exports.handleDoctorLogin = exports.getDoctorWithID = exports.getDoctorsList = void 0;
const knex_1 = __importDefault(require("../database/knex"));
const getDoctorsList = (req, res) => {
    knex_1.default.select('*')
        .from('doctor')
        .then((doctors) => {
        res.status(200).send(doctors);
    })
        .catch((err) => {
        res.status(400).send('Unable to get user');
        console.error(err);
    });
};
exports.getDoctorsList = getDoctorsList;
const getDoctorWithID = (req, res) => {
    const id = req.params.id;
    knex_1.default.select('*')
        .from('doctor')
        .where('did', '=', id)
        .then((doctor) => {
        if (doctor && doctor[0].signature !== null) {
            doctor[0].signature = doctor[0].signature.toString();
        }
        res.status(200).send(doctor);
    })
        .catch((err) => {
        res.status(400).send('Unable to get user');
        console.error(err);
    });
};
exports.getDoctorWithID = getDoctorWithID;
const handleDoctorLogin = (req, res) => {
    const { phno, password } = req.body;
    if (!phno || !password) {
        return res.status(400).json('incorrect form submission');
    }
    knex_1.default.select('dphno', 'dpasswd')
        .from('doctor')
        .where('dphno', '=', phno)
        .then((data) => __awaiter(void 0, void 0, void 0, function* () {
        if (data.length && password.toString() === data[0].dpasswd) {
            yield knex_1.default
                .select('*')
                .from('doctor')
                .where('dphno', '=', phno)
                .then((user) => {
                res.json(user[0]);
            })
                .catch((err) => {
                console.error(err);
                res.status(400).json('unable to get user');
            });
        }
        else {
            res.status(400).json('wrong credentials');
        }
    }))
        .catch((err) => {
        console.error(err);
        res.status(400).json(err);
    });
};
exports.handleDoctorLogin = handleDoctorLogin;
const handleDoctorRegister = (req, res) => {
    const { name, phno, email, password, role, signature } = req.body;
    knex_1.default.transaction(function (trx) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = {
                dname: name,
                dpasswd: password,
                demail: email,
                dphno: phno,
                role: role.toLowerCase(),
                signature
            };
            yield trx
                .insert(doctor)
                .into('doctor')
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
        res.status(400).send('unable to register');
        console.error(err);
    });
};
exports.handleDoctorRegister = handleDoctorRegister;
const getDoctorWithRole = (req, res) => {
    const role = req.body.role;
    knex_1.default.select('*')
        .from('doctor')
        .where({ role, isAvailable: '1' })
        .then((doctor) => {
        res.status(200).send(doctor[0]); // return only one doctor
    })
        .catch((err) => {
        res.status(400).send('Unable to get user');
        console.error(err);
    });
};
exports.getDoctorWithRole = getDoctorWithRole;
const getAvailableDoctors = (req, res) => {
    knex_1.default.select('*')
        .from('doctor')
        .where({ isAvailable: '1' })
        .then((doctor) => {
        res.status(200).send(doctor);
    })
        .catch((err) => {
        res.status(400).send('Unable to get user');
        console.error(err);
    });
};
exports.getAvailableDoctors = getAvailableDoctors;
//# sourceMappingURL=doctor.js.map