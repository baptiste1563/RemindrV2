const { PrismaClient } = require('@prisma/client')
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { DateTime } from "luxon"


const prisma = new PrismaClient();

export default async function update_remind(req, res) {

    //on recupere la session
    const session = await getServerSession(req,res, authOptions);
    
    //on recupere l'id du groupe
    const idGroup = req.body.id_group;
    //on recupere l'id du remind
    const idRemind = req.body.id;

    //On verifie que l'utilisateur connecté est dans le groupe
    const isInGroup = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {group:{where:{id:idGroup}}}
    });

    //si l'utilisateur n'est pas dans le groupe
    if(!isInGroup)
        return res.status(401).json(["Vous n'êtes pas dans ce groupe"]);

    //on supprime le remind
    const delete_remind = await prisma.rappel.delete({ 
        where: { id: idRemind },
    });


    return res.status(200).json(["Rappel supprimé avec succès"]);
}