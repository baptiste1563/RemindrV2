import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react"
import React, { useEffect } from 'react'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]"
const { PrismaClient } = require('@prisma/client')
import { useState } from 'react';
import { redirect } from 'next/dist/server/api-utils';

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions); //on recupere la session
    const idRemind = context.params.id; //on recupere l'id du groupe

    if (session == null) {
      return { props: { group: null }}
    }//si il n'y a pas de session on renvoie null

    const current_remind = await prisma.rappel.findUnique({ 
      where: { id: idRemind },
      include : {
        group: true
      }
    }); //on recupere le groupe avec l'id

    const current_group = await prisma.group.findUnique({ 
      where: { id: current_remind.id_group },
    }); //on recupere le groupe avec l'id

    return { props: { group: current_group, remind: JSON.parse(JSON.stringify(current_remind))}} //on renvoie le groupe
}

export default function Page({group, remind}) {
    const { data: session } = useSession()
    const router = useRouter();

    //input value for add rappel
    const [inputValueName, setInputValueName] = useState('');
    const [inputValueDate, setInputValueDate] = useState('');
    const [inputValueDesc, setInputValueDesc] = useState('');
    const [inputValueColor, setInputValueColor] = useState('');  

    
    //handle set title rappel
    const handleInputChangeName = (event) => {
        setInputValueName(event.target.value);
      };
  
      //handle set date rappel
      const handleInputChangeDate = (event) => {
        setInputValueDate(event.target.valueAsDate);
      };
  
      //handle set desc rappel
      const handleInputChangeDesc = (event) => {
        setInputValueDesc(event.target.value);
      };
  
      //handle set color rappel
      const handleInputChangeColor = (event) => {
        setInputValueColor(event.target.value);
      };
      
      //handle update rappel
      const handleButtonUpdate_rappel = async () => {
        const res = await fetch('/api/remind/update_remind', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id: remind.id, name: inputValueName, date: inputValueDate, desc: inputValueDesc, color: inputValueColor, id_group: group.id}),
        });
        router.reload();
      };

      //handle delete rappel
      const handleButtonDelete_rappel = async () => {
        const res = await fetch('/api/remind/delete_remind', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id: remind.id, id_group: group.id}),
        });

        var urlGroup = '/group/' + group.id;
        router.push(urlGroup);
      };

    
    //si il y a une session on affiche la page
    if (session) {
        return (
            <>
            <head>
              <title>ReminDR - {group.name}</title>
            </head>


            <header>
              <a href="../">ReminDR</a>
              <a href={'../group/' + group.id}><h1>{group.name}</h1></a>
              <div id="connect">
                <button onClick={() => signOut()}>Sign out</button>
                <img id='pp' src={session.user.image} title={session.user.name}></img>
              </div>
            </header>

            <div id='content'>

                <a href={'../group/' + group.id}><button>Retour au groupe </button></a>

                <div class="remind" style={{backgroundColor:remind.color}}>
                    <h1>{remind.name}</h1>
                    <p>{remind.desc}</p>
                    <p>{( new Date(remind.date)).toLocaleDateString()}</p>
                </div>

                <div id='add_rappel'>
                    <h2>Modifier un rappel :</h2>
                    <input type="text" value={inputValueName} onChange={handleInputChangeName} placeholder='Titre'/>
                    <input type="date" onChange={handleInputChangeDate} />
                    <input type="text" value={inputValueDesc} onChange={handleInputChangeDesc} placeholder='Description'/>
                    <input type="color" value={inputValueColor} onChange={handleInputChangeColor} />
                    <button onClick={handleButtonUpdate_rappel}>Mettre a jour le rappel</button>
                </div>

                <button id='delete' onClick={handleButtonDelete_rappel}>Supprimer le rappel</button>

                <a href={'../group/' + group.id}><button>Retour au groupe </button></a>

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