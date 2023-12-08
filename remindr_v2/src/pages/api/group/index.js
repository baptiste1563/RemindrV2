import { PrismaClient } from "@prisma/client";
import { getSession } from 'next-auth/react';


const prisma = new PrismaClient();

export default async function get_group(req, res) {

    const session = getSession({req});

    if (!session) {
        return res.status(401).json({ message: 'Not sign In.'});
      }

    const current_user = await prisma.user.findUnique({ 
        where: { email: session.user.email }, 
        include: { group: true }
      });
    
    return res.status(200).json(current_user.group);
}