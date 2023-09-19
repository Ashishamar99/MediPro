import db from '../database/knex'

export const getConsultationList = (req, res): void => {
  db.select('*')
    .from('consultations')
    .then((consultations) => {
      res.status(200).send(consultations)
    })
    .catch((err) => {
      res.send('Unable to get consultation details')
      console.error(err)
    })
}

export const getConsultationWithID = (req, res): void => {
  const cid = req.params.id
  db.select('*')
    .from('consultations')
    .where('cid', '=', cid)
    .then((consultations) => {
      res.status(200).send(consultations)
    })
    .catch((err) => {
      res.send('Unable to get consultation details')
      console.error(err)
    })
}

export const getPatientConsultation = (req, res): void => {
  const pid = req.params.id
  db.select('*')
    .from('consultations')
    .where('pid', '=', pid)
    .then((consultations) => {
      consultations.forEach((consultation) => {
        if ((consultation?.pdf as string) !== undefined) {
          consultation.pdf = consultation.pdf.toString()
        }
      })
      res.status(200).send(consultations)
    })
    .catch((err) => {
      res.send('Unable to get consultation details')
      console.error(err)
    })
}

export const getDoctorConsultation = (req, res): void => {
  const did = req.params.id
  db.select('*')
    .from('consultations')
    .where('did', '=', did)
    .then((consultations) => {
      consultations.forEach((consultation) => {
        if ((consultation?.pdf as string) !== undefined) {
          consultation.pdf = consultation.pdf.toString()
        }
      })
      res.status(200).send(consultations)
    })
    .catch((err) => {
      res.send('Unable to get consultation details')
      console.error(err)
    })
}

export const addConsultationInfo = (req, res): void => {
  const speechData = req.body.audio
  let formattedSpeechData = ''
  formattedSpeechData += `Diagnosing for, ${speechData.diagnosis}.`
  const medicine = speechData.medicineData.join('\n')
  formattedSpeechData += ` Medicines prescribed, ${medicine}\n`
  formattedSpeechData += speechData.advice.length as boolean
    ? `Advice, ${speechData.advice}`
    : ''
  req.body.audio = formattedSpeechData
  db.transaction(async function (trx) {
    const consultationInfo = req.body
    await trx
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
        res.status(200).send(id)
      })
      .catch((err) => {
        // trx.rollback
        res.status(500).send("Couldn't complete consultation")
        console.error(err)
      })
  }).catch(function (err) {
    res.status(400).send('unable to complete consultation')
    console.error(err)
  })
}
