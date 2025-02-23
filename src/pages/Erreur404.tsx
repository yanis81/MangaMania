import React from 'react'
import { Link } from "react-router-dom";

export function Erreur404() {
  return (
    <div className=''>
      <p className="">404</p>
      <p className="">
        Oups! La page que vous demandez n'existe pas.
      </p>
      <Link to="/" className="">
        Retourner sur la page d'accueil
      </Link>
    </div>
  )
}