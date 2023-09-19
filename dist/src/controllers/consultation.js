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
exports.addConsultationInfo = exports.getDoctorConsultation = exports.getPatientConsultation = exports.getConsultationWithID = exports.getConsultationList = void 0;
const knex_1 = __importDefault(require("../database/knex"));
const getConsultationList = (req, res) => {
    knex_1.default.select('*')
        .from('consultations')
        .then((consultations) => {
        res.status(200).send(consultations);
    })
        .catch((err) => {
        res.send('Unable to get consultation details');
        console.error(err);
    });
};
exports.getConsultationList = getConsultationList;
const getConsultationWithID = (req, res) => {
    const cid = req.params.id;
    knex_1.default.select('*')
        .from('consultations')
        .where('cid', '=', cid)
        .then((consultations) => {
        res.status(200).send(consultations);
    })
        .catch((err) => {
        res.send('Unable to get consultation details');
        console.error(err);
    });
};
exports.getConsultationWithID = getConsultationWithID;
const getPatientConsultation = (req, res) => {
    const pid = req.params.id;
    knex_1.default.select('*')
        .from('consultations')
        .where('pid', '=', pid)
        .then((consultations) => {
        consultations.forEach((consultation) => {
            if ((consultation === null || consultation === void 0 ? void 0 : consultation.pdf) !== undefined) {
                consultation.pdf = consultation.pdf.toString();
            }
        });
        res.status(200).send(consultations);
    })
        .catch((err) => {
        res.send('Unable to get consultation details');
        console.error(err);
    });
};
exports.getPatientConsultation = getPatientConsultation;
const getDoctorConsultation = (req, res) => {
    const did = req.params.id;
    knex_1.default.select('*')
        .from('consultations')
        .where('did', '=', did)
        .then((consultations) => {
        consultations.forEach((consultation) => {
            if ((consultation === null || consultation === void 0 ? void 0 : consultation.pdf) !== undefined) {
                consultation.pdf = consultation.pdf.toString();
            }
        });
        res.status(200).send(consultations);
    })
        .catch((err) => {
        res.send('Unable to get consultation details');
        console.error(err);
    });
};
exports.getDoctorConsultation = getDoctorConsultation;
const addConsultationInfo = (req, res) => {
    const speechData = req.body.audio;
    let formattedSpeechData = '';
    formattedSpeechData += `Diagnosing for, ${speechData.diagnosis}.`;
    const medicine = speechData.medicineData.join('\n');
    formattedSpeechData += ` Medicines prescribed, ${medicine}\n`;
    formattedSpeechData += speechData.advice.length
        ? `Advice, ${speechData.advice}`
        : '';
    req.body.audio = formattedSpeechData;
    knex_1.default.transaction(function (trx) {
        return __awaiter(this, void 0, void 0, function* () {
            const consultationInfo = req.body;
            yield trx
                .insert(consultationInfo)
                .into('consultations')
                .then((id) => {
                // trx.commit
                // db.select("pphno")
                //   .from("patient")
                //   .where("pid", "=", consultationInfo.pid)
                //   .then((pphno) => {
                //     console.log(pphno[0].pphno, consultationInfo.pid);
                //     //SendSMS
                //     var patientPhoneNumber = String(pphno[0].pphno);
                //     //Removing +91 from phone number
                //     if (patientPhoneNumber.startsWith("+91")) {
                //       patientPhoneNumber = patientPhoneNumber.slice(3);
                //     }
                //     let SMSmessage = formattedSpeechData;
                //     console.log(SMSmessage.length);
                //     if (formattedSpeechData.length < 190) {
                //       sendSMS(SMSmessage, patientPhoneNumber);
                //     } else {
                //       SMSmessage = `Your audio prescription is generated for  ${speechData.diagnosis}, please call IVR service to listen to it`;
                //       sendSMS(SMSmessage, patientPhoneNumber);
                //     }
                //   })
                //   .catch((err) => {
                //     res.status(400).send("Unable to get user");
                //     console.error(err);
                //   });
                res.status(200).send(id);
            })
                .catch((err) => {
                // trx.rollback
                res.status(500).send("Couldn't complete consultation");
                console.error(err);
            });
        });
    }).catch(function (err) {
        res.status(400).send('unable to complete consultation');
        console.error(err);
    });
};
exports.addConsultationInfo = addConsultationInfo;
//# sourceMappingURL=consultation.js.map