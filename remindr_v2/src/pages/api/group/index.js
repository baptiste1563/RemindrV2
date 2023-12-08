import { PrismaClient } from "@prisma/client";
import { getSession } from 'next-auth/react';


const prisma = new PrismaClient();

export default async function get_group(req, res) {

    const session = getSession();
    const group = await prisma.group.findMany(
        {
            where: {users : session.userId}
        }
    );
    
    return res.status(200).json(group);
}