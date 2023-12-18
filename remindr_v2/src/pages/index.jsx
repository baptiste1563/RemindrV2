import { useSession, signIn, signOut } from "next-auth/react"
import React from 'react'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
const { PrismaClient } = require('@prisma/client')
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const prisma = new PrismaClient();



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
                <h1 id='titre'>Bon retour {session.user.name} sur Remindr</h1>


                <div id="group_create">
                  <h1>Créer un nouveau groupe</h1>
                  <form method="post">
                    <input type="text" value={inputValueName} onChange={handleInputChangeName} placeholder="Nom du groupe" />
                    <input type="text" value={inputValueDesc} onChange={handleInputChangeDesc} placeholder="Description" />
                    <button onClick={handleButtonAdd_group}>+</button>
                  </form>

                </div>

                <h1>Liste de vos groupes : </h1>
              </div>


              <div id="group_list">
              {
                  list_group.map((item) => {
                    return (
                      <a href={"/group/" + item.id}>
                        <div class="group_card">
                          <h1>{item.name}</h1>
                          <p>{item.desc}</p>
                        </div>
                      </a>
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
              <h2>Veuiller vous connecter</h2>
            </div>
          <div id="contener_boutonConnect">
            <button id='boutonConnect' onClick={() => signIn()}>Sign in</button>
          </div>

          </div>
        </>
      )
}
    
    
    



