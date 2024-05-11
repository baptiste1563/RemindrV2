const { PrismaClient } = require('@prisma/client')
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { DateTime } from "luxon";


const prisma = new PrismaClient();

export default async function add_remind(req, res) {
    
    //on recupere la session
    const session = await getServerSession(req,res, authOptions);
    
    //on recupere l'id du groupe
    const idGroup = req.body.id;

    //On verifie que l'utilisateur connecté est dans le groupe
    const isInGroup = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {group:{where:{id:idGroup}}}
    });

    //si l'utilisateur n'est pas dans le groupe
    if(!isInGroup)
        return res.status(401).json(["Vous n'êtes pas dans ce groupe"]);

    //on crée le remind
    const add_remind = await prisma.rappel.create({ 
        data: {
            name: req.body.name,
            desc: req.body.desc,
            date: DateTime.fromISO(req.body.date),
            color: req.body.color,
            group: { connect: { id: idGroup } }
        },
    });

    return res.status(200).json(["Remind ajouté avec succès"]);
}