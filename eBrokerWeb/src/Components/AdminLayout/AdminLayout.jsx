"use client"
import React from 'react'
import VerticleLayout from "./VerticleLayout";


const AdminLayout = (props) => {


  const { children } = props
  return (


    <VerticleLayout>
      {children}
    </VerticleLayout>
  )
}

export default AdminLayout
