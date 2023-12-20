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


    //on update le remind
    const update_remind = await prisma.rappel.update({ 
        where: { id: idRemind },
        data: {
            name: req.body.name,
            desc: req.body.desc,
            date: DateTime.fromISO(req.body.date),
            color: req.body.color,
        },
    });


    return res.status(200).json(["Rappel modifié avec succès"]);

}