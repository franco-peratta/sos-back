import { prisma } from "../config/db"
import { Request, Response } from "express"
import bcrypt from "bcrypt"

export const getAll = async (req: Request, res: Response) => {
	try {
		const data = await prisma.admin.findMany()
		res.json({ data })
	} catch (error) {
		res.json({ msg: "Error, couldn't retrieve admins", error })
		console.log(error)
	}
}

export const getAdminById = async (req: Request, res: Response) => {
	const adminId = parseInt(req.params.id)
	try {
		const data = await prisma.admin.findUniqueOrThrow({
			where: {
				id: adminId
			}
		})

		res.json({ msg: "Admin retrieved SUCCESSFULLY", data })
	} catch (error) {
		res.json({ msg: "Error, couldn't retrieve admin", error })
		console.log(error)
	}
}

export const addAdmin = async (req: Request, res: Response) => {
	const admin = req.body

	const randomPassword = Math.random().toString(36).slice(-8)

	try {
		const newAdmin = await prisma.admin.create({
			data: {
				name: admin.name,
				user: {
					create: {
						email: admin.email,
						password: await bcrypt.hash(admin.password || randomPassword, 10),
						role: "admin"
					}
				}
			}
		})
		res.json({ msg: "Admin added SUCCESSFULLY", data: newAdmin.id })
	} catch (error) {
		res.json({ msg: "Error, couldn't add the admin ", error })
		console.log(error)
	}
}

export const updateAdmin = async (req: Request, res: Response) => {
	const adminId = parseInt(req.params.id)
	const updatedAdmin = req.body
	try {
		const data = await prisma.admin.update({
			where: {
				id: adminId
			},
			data: {
				name: updatedAdmin.name
			}
		})
		res.json({ msg: "Admin updated SUCCESSFULLY", data })
	} catch (error) {
		res.json({ msg: "Error, couldn't update admin", error })
		console.log(error)
	}
}

export const deleteAdmin = async (req: Request, res: Response) => {
	const adminId = parseInt(req.params.id)
	try {
		const admin = await prisma.admin.delete({
			where: {
				id: adminId
			}
		})
		res.json({ msg: "Admin deleted SUCCESSFULLY", data: admin.id })
	} catch (error) {
		res.json({ msg: "Error, couldn't delete admin", error })
		console.log(error)
	}
}
