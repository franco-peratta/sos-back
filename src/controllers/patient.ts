import { Request, Response } from "express"
import * as repo from "../repos/patient"

export const getAll = async (_req: Request, res: Response) => {
	try {
		const data = await repo.getAllPatients()
		res.json({ data })
	} catch (error) {
		res.json({ msg: "Error, couldn't retrieve patients", error })
		console.log(error)
	}
}

export const getPatientById = async (req: Request, res: Response) => {
	const patientId = parseInt(req.params.id)
	try {
		const data = await repo.getPatientById(patientId)

		res.json({ msg: "Patient retrieved SUCCESSFULLY", data })
	} catch (error) {
		res.json({ msg: "Error, couldn't retrieve patient", error })
		console.log(error)
	}
}

export const getPatientByIdWithAppointments = async (
	req: Request,
	res: Response
) => {
	const patientId = parseInt(req.params.id)
	try {
		const data = await repo.getPatientByIdWithAppointments(patientId)

		res.json({ msg: "Patient retrieved SUCCESSFULLY", data })
	} catch (error) {
		res.json({ msg: "Error, couldn't retrieve patient", error })
		console.log(error)
	}
}

export const addPatient = async (req: Request, res: Response) => {
	const patient = req.body

	try {
		const patientData = await repo.addPatient(patient)

		res.json({ msg: "Patient added SUCCESSFULLY", data: patientData.id })
	} catch (error) {
		res.json({ msg: "Error, couldn't add a patient ", error })
		console.log(error)
	}
}

export const updatePatient = async (req: Request, res: Response) => {
	const patientId = parseInt(req.params.id)
	const updatedPatient = req.body
	try {
		const data = await repo.updatePatient(patientId, updatedPatient)
		res.json({ msg: "Patient updated SUCCESSFULLY", data })
	} catch (error) {
		res.json({ msg: "Error, couldn't update patient", error })
		console.log(error)
	}
}

export const updateEmr = async (req: Request, res: Response) => {
	const patientId = parseInt(req.params.id)
	const { emr } = req.body
	console.log(emr);


	try {
		const data = await repo.updateEmr(patientId, emr)
		res.json({ msg: "Patient EMR updated SUCCESSFULLY", data })
	} catch (error) {
		res.json({ msg: "Error, couldn't update patient EMR", error })
		console.log(error)
	}
}

export const deletePatient = async (req: Request, res: Response) => {
	const patientId = parseInt(req.params.id)
	try {
		const patient = await repo.deletePatient(patientId)
		res.json({ msg: "Patient deleted SUCCESSFULLY", data: patient.id })
	} catch (error) {
		res.json({ msg: "Error, couldn't delete patient", error })
		console.log(error)
	}
}
