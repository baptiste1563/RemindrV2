const { PrismaClient } = require('@prisma/client')
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { DateTime } from "luxon"


const prisma = new PrismaClient();

export default async function update_remind(req, res) {
    const session = await getServerSession(req,res, authOptions);
    
    const idGroup = req.body.id_group;
    const idRemind = req.body.id;

    //On verifie que l'utilisateur connecté est dans le groupe
    const isInGroup = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {group:{where:{id:idGroup}}}
    });

    if(!isInGroup)
        return res.status(401).json(["Vous n'êtes pas dans ce groupe"]);

    //on supprime le remind
    const delete_remind = await prisma.rappel.delete({ 
        where: { id: idRemind },
    });


    return res.status(200).json(["Rappel supprimé avec succès"]);
}