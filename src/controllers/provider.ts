import { Request, Response } from "express"
import * as repo from "../repos/provider"

export const getAll = async (req: Request, res: Response) => {
	try {
		const data = await repo.getAll()
		res.json({ data })
	} catch (error) {
		console.log(error)
		res.json({ msg: "Error, couldn't retrieve providers", error })
	}
}

export const getProviderById = async (req: Request, res: Response) => {
	const providerId = parseInt(req.params.id)
	try {
		const data = await repo.getProviderById(providerId)

		res.json({ msg: "provider retrieved SUCCESSFULLY", data })
	} catch (error) {
		console.log(error)
		res.json({ msg: "Error, couldn't retrieve provider", error })
	}
}

export const addProvider = async (req: Request, res: Response) => {
	const provider = req.body
	try {
		const data = await repo.addProvider(provider)
		res.json({ msg: "Provider added SUCCESSFULLY", data: data.id })
	} catch (error) {
		console.log(error)
		res.json({ msg: "Error, couldn't add a provider", error })
	}
}

export const updateProvider = async (req: Request, res: Response) => {
	const providerId = parseInt(req.params.id)
	const updatedProvider = req.body
	try {
		const data = await repo.updateProvider(providerId, updatedProvider)
		res.json({ msg: "provider updated SUCCESSFULLY", data })
	} catch (error) {
		console.log(error)
		res.json({ msg: "Error, couldn't update provider", error })
	}
}

export const deleteProvider = async (req: Request, res: Response) => {
	const providerId = parseInt(req.params.id)
	try {
		const data = await repo.deleteProvider(providerId)
		res.json({ msg: "provider deleted SUCCESSFULLY", data })
	} catch (error) {
		console.log(error)
		res.json({ msg: "Error, couldn't delete provider", error })
	}
}
