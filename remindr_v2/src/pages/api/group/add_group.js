const { PrismaClient } = require('@prisma/client')
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"


const prisma = new PrismaClient();

export default async function get_group(req, res) {

    const session = await getServerSession(req,res, authOptions);
    //test si un groupe existe déjà avec ce nom
    const group_exists = await prisma.group.findUnique({ where: { name: req.body.name } });
    
    if(group_exists || req.body.name == "") 
        return res.status(400).json(["Le groupe portant le même nom existe déjà ou le nom est vide"]);
    
    const group = await prisma.group.create({ data: {
            name: req.body.name,
            desc: req.body.desc,
            users:  { connect: { id: session.user.id } }
        }});
    
    return res.status(200).json(["Groupe créé avec succès"]);
}