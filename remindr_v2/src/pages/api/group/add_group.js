import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"


const prisma = new PrismaClient();

export default async function get_group(req, res) {

    const session = await getServerSession(req,res, authOptions);
    
    const group = await prisma.group.create({ data: {
            name: req.body.name,
            desc: req.body.desc,
            //users: [session.userId]
        }});
    
    return res.status(200).json(["Add group Ok"]);
}