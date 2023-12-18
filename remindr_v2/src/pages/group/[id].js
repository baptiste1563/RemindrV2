import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react"
import React from 'react'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"
const { PrismaClient } = require('@prisma/client')
import { useState } from 'react';

const prisma = new PrismaClient();

export async function getServerSideProps(context) {

    const session = await getServerSession(context.req, context.res, authOptions);
    const idGroup = context.params.id;
    
    if (session == null) {
      return { props: { group: null }}
    }
    const current_group = await prisma.group.findUnique({ 
      where: { id: idGroup },
      include : {
        users: true
      }
    });
    
    return { props: { group: current_group }}
  }

export default function Page({group}) {
    const { data: session } = useSession();
    const router = useRouter()

    const [inputValueEmail, setInputValueEmail] = useState("");

    const handleInputChangeEmail = (event) => {
        setInputValueEmail(event.target.value);
    }

    const handleButtonAdd_user = async () => {

        const res = await fetch('/api/group/add_user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email : inputValueEmail}),
        });
    
        router.reload();
    };

    if(session) {
        return (
            <>
            <div>
                <h1>{group.name}</h1>
                <h3>{group.desc}</h3>
            </div>

            <div id="user_list">
                <h2>Utilisateurs :</h2>
                <ul>
                {
                    group.users.map((user) => {
                        return (
                                <li>{user.name}</li>
                        )
                    })
                }
                </ul>
            </div>

            <div id="add_user">
                <h2>Ajouter un utilisateur :</h2>
                <form>
                    <input type="email" value={inputValueEmail} onChange={handleInputChangeEmail} placeholder="email" />
                    <button onClick={handleButtonAdd_user}>+</button>
                </form>
            </div>    
            </>
        )
    }
    return (
        <>
          <header>
            <a href="#">ReminDR</a>
              <div id="connect">
              <button onClick={() => signIn()}>Sign in</button>
              <img></img>
            </div>
          </header>
          <div id='content'>
            <div id='lestitre'>
              <h1 id='titre'>Remindr</h1>
              <h2>Veuiller vous connecter</h2>
            </div>
          <div id="contener_boutonConnect">
            <button id='boutonConnect' onClick={() => signIn()}>Sign in</button>
          </div>

          </div>
        </>
      )
}