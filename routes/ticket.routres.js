const { Router } = require("express");
const TicketModel = require("../Models/Ticket.model");

const ticket = Router();

//GET Tickets
ticket.get("/",  async (req, res) => {
	const {  } = req.body;
	try {
		let allTickets = await TicketModel.find({  });
		res.json({ data: allTickets })
	}
	catch (err) { res.status(404).send({ msg: "please login again" }) }
})

//POST Tickets
ticket.post("/create", async (req, res) => {
	const new_ticket = new TicketModel(req.body);
	console.log(new_ticket)
	await new_ticket.save()

	res.send({msg:"new Ticket added successfully"})
})

module.exports = ticket