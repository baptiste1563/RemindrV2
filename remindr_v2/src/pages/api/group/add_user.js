const { PrismaClient } = require('@prisma/client')
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"


const prisma = new PrismaClient();

export default async function get_user(req, res) {
    
    const session = await getServerSession(req,res, authOptions);
    
    const idGroup = req.body.id;
    console.log(idGroup);
    
    //test si un user existe avec ce mail
    const user_exists = await prisma.user.findUnique({ where: { email: req.body.email } });

    if(!user_exists) 
        return res.status(400).json(["Le groupe portant le même nom existe déjà ou le nom est vide"]);

    //On verifie que l'utilisateur connecté est dans le groupe
    const isInGroup = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {group:{where:{id:idGroup}}}
    });

    if(!isInGroup)
        return res.status(401).json(["Vous n'êtes pas dans ce groupe"]);

    //on ajoute l'utilisateur au groupe
    const current_group = await prisma.group.update({ 
        data: {
            users:  { connect: { id: user_exists.id } }
        }, 
        where: { id: idGroup },
    });

    return res.status(200).json(["Utilisateur ajouté avec succès"]);
}