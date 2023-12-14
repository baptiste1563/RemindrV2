import { useSession, signIn, signOut } from "next-auth/react"
import React from 'react'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
const { PrismaClient } = require('@prisma/client')
import { useState } from 'react';
import { useRouter } from 'next/router';

const prisma = new PrismaClient();





export default function Page({list_group}) {
  const { data: session } = useSession()
  const router = useRouter();

  //input value for add group
  const [inputValueName, setInputValueName] = useState('');
  const [inputValueDesc, setInputValueDesc] = useState('');
  

  const handleInputChangeName = (event) => {
    setInputValueName(event.target.value);
  };

  const handleInputChangeDesc = (event) => {
    setInputValueDesc(event.target.value);
  };

  const handleButtonAdd_group = async () => {

    const res = await fetch('/api/group/add_group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name : inputValueName, desc : inputValueDesc}),
    });

    router.reload();
  };

  
  
  if (session) {
    console.log(list_group)
    return (
      <>

            <header>
              <a href="../">ReminDR</a>
              <div id="connect">
                <button onClick={() => signOut()}>Sign out</button>
                <img id='pp' src={session.user.image} title={session.user.name}></img>
              </div>
            </header>
  
            <div id='content'>
              <div id='lestitre'>
                <h1 id='titre'>Remindr</h1>
              </div>

              <div id="group_create">
                <h1>Creation de groupe</h1>
                <form action="/api/group/create" method="post">
                  <input type="text" value={inputValueName} onChange={handleInputChangeName} placeholder="Nom du groupe" required/>
                  <input type="text" value={inputValueDesc} onChange={handleInputChangeDesc} placeholder="Description" required/>
                </form>
                <button onClick={handleButtonAdd_group}>Créer Groupe</button>

              </div>

              <div id="group_list">
                <h1>Liste des groupes</h1>
              {
                  list_group.map((item) => {
                    return (
                      <div class="group_card">
                        <a href={"/group/" + item.id}>{item.name}</a>
                      </div>
                    )})
              }
              </div>
              
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
              <h2>Va te connecter</h2>
            </div>
          </div>
        </>
      )
}
    
    
    
export async function getServerSideProps(context) {

  const session = await getServerSession(context.req, context.res, authOptions);

  if (session == null) {
    return { props: { list_group: null }}
  }
  const current_user = await prisma.user.findUnique({ 
    where: { email: session.user.email }, 
    include: { group: true }
  });

  return { props: { list_group: current_user.group }}
}



