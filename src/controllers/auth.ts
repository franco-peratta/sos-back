import { Patient, Provider, Role, User } from "@prisma/client"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { getUserByEmail } from "../repos/user"
import { addPatient } from "../repos/patient"
import { addProvider } from "../repos/provider"

const JWT_SECRET = process.env.JWT_SECRET || "secret"
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "3h"

type TPatientUser = Omit<User & Patient, "id">
type TProviderUser = Omit<User & Provider, "id">

export const login = async (req: Request, res: Response) => {
	const { email, password, role } = req.body

	if (!email || !password) {
		return res.status(400).send({ error: "Missing email or password" })
	}

	const user = await getUserByEmail(email)

	console.log(user?.role)
	console.log(role)

	if (!user || user.role !== role) {
		return res.status(401).send({ error: "Invalid login credentials" })
	}

	const passwordMatch = await bcrypt.compare(password, user.password)

	if (!passwordMatch) {
		return res.status(400).send({ error: "Invalid login credentials" })
	}

	const jwt_body = {
		id: user.id,
		email: user.email,
		isAdmin: user.role === "admin"
	}

	const token = jwt.sign(jwt_body, JWT_SECRET, {
		algorithm: "HS512",
		expiresIn: JWT_EXPIRATION,
		notBefore: "0s",
		audience: req.hostname,
		issuer: req.hostname,
		subject: user.id.toString()
	})

	const userToReturn = {
		id: user.id,
		email: user.email,
		role: user.role
	}

	res.send({ data: { token, user: userToReturn } })
}

export const register = async (req: Request, res: Response) => {
	try {
		const { email, role } = req.body

		const user = await getUserByEmail(email)

		if (user) {
			console.error("User already exists", email)
			return res.status(400).send({ error: "User already exists" })
		}

		let id

		if (role === "admin") {
			console.log("Cannot create admin user this way")
			res
				.status(400)
				.send({ errorMsg: "Cannot create admin user using this route" })
		}

		if (role === "patient") {
			console.log("Creating patient user")
			id = await createPatientUser(req.body as TPatientUser)
		}

		if (role === "provider") {
			console.log("Creating provider user")
			id = await createProviderUser(req.body as TProviderUser)
		}

		res.status(201).send({ data: { id }, message: "User created successfully" })
	} catch (error) {
		console.log(error)
		if (error instanceof Error && error.message.includes("prisma")) {
			res.statusMessage = "Invalid payload"
			return res.status(400).end()
		}
		res.statusMessage = "Something went wrong"
		res.status(400).end()
	}
}

const createPatientUser = async (data: TPatientUser) => {
	const hashedPassword = await bcrypt.hash(data.password, 10)

	const newUser = {
		email: data.email,
		password: hashedPassword,
		role: "patient" as Role,
		name: data.name,
		dni: data.dni,
		dob: data.dob,
		phoneNumber: data.phoneNumber,
		emr: ""
	}

	const user = await addPatient(newUser)
	return user.id
}

const createProviderUser = async (data: TProviderUser) => {
	const hashedPassword = await bcrypt.hash(data.password, 10)

	const newUser: TProviderUser = {
		email: data.email,
		password: hashedPassword,
		role: "provider" as Role,
		name: data.name,
		shifts: data.shifts,
		phoneNumber: data.phoneNumber
	}

	const user = await addProvider(newUser)
	return user.id
}
