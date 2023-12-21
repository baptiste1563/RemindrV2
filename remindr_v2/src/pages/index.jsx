import { useSession, signIn, signOut } from "next-auth/react"
import React from 'react'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
const { PrismaClient } = require('@prisma/client')
import { useState } from 'react';
import { useRouter } from 'next/router';


const prisma = new PrismaClient();


//on recupere la session et les groupes de l'utilisateur
export async function getServerSideProps(context) {

  const session = await getServerSession(context.req, context.res, authOptions); //on recupere la session

  let dateInFiveDays = new Date(); //on prend la date d'aujourd'hui
  dateInFiveDays.setDate(dateInFiveDays.getDate() + 5); //on ajoute 5 jours
  
  if (session == null) { 
    return { props: { list_group: null }}
  }//si il n'y a pas de session on renvoie null

  const current_user = await prisma.user.findUnique({ 
    where: { email: session.user.email }, 
    include: { group: true }
  });//on recupere l'utilisateur avec ses groupes

  //on prend les rappel qui sont fini dans 5 jours
  const list_rappel = await prisma.rappel.findMany({
    where: {
      group: {
        users: {
          some: {
            email: session.user.email
          }
        }
      },
      date: {
        lte: dateInFiveDays
      }
    },
    });
  
  return { props: { list_group: current_user.group, rappels: JSON.parse(JSON.stringify(list_rappel)) }} //on renvoie les groupes de l'utilisateur
}


export default function Page({list_group, rappels}) {
  const { data: session } = useSession() //on recupere la session
  const router = useRouter(); //on recupere le router

  //input value for add group
  const [inputValueName, setInputValueName] = useState(''); 
  const [inputValueDesc, setInputValueDesc] = useState('');
  
  //handle set name group
  const handleInputChangeName = (event) => {
    setInputValueName(event.target.value);
  };

  //handle set desc group
  const handleInputChangeDesc = (event) => {
    setInputValueDesc(event.target.value);
  };

  //handle add group
  const handleButtonAdd_group = async () => {

    const res = await fetch('/api/group/add_group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name : inputValueName, desc : inputValueDesc}),
    }); //on ajoute le groupe

    router.reload(); //on recharge la page
  };

  
  //si il y a une session on affiche la page
  if (session) {
    
    return (
      <>
            <head>
              <title>ReminDR</title>
            </head>
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
                  <h2>Créer un nouveau groupe</h2>
                  <form method="post">
                    <input type="text" value={inputValueName} onChange={handleInputChangeName} placeholder="Nom du groupe" />
                    <input type="text" value={inputValueDesc} onChange={handleInputChangeDesc} placeholder="Description" />
                    <button onClick={handleButtonAdd_group}>+</button>
                  </form>

                </div>

              </div>

              <div id="tableau_de_bord">

                <div id="rappel_list">
                  <h2>Rappel qui arrive a échéance</h2>
                  {
                    rappels.map((item) => {
                      return (
                        <a href={"/group/"+item.id_group}>
                          <div class="group_card">
                            <h1>{item.name}</h1>
                            <p>{item.desc}</p>
                            <p>{( new Date(item.date)).toLocaleDateString()}</p>
                          </div>
                        </a>
                      )})
                  }
                </div>


                <div id="group_list">
                  <h2>Liste de vos groupes : </h2>
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

            </div>
          </>
        )
      }
      //si il n'y a pas de session on affiche la page de connexion
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
    
    
    



