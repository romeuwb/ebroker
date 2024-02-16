"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../Breadcrumb/Breadcrumb'
import Layout from '../Layout/Layout'
import PropertiesOnLocationMap from '../Location/PropertiesOnLocationMap'
import { getNearbyPropertiesApi } from '@/store/actions/campaign'

const PropertiesOnMap = () => {


  const GoogleMapApi = process.env.NEXT_PUBLIC_GOOGLE_API;
  const [selectedLocationAddress, setSelectedLocationAddress] = useState("");
  const [nearbyProperties, setNearbyProperties] = useState([])
  const [activeTab, setActiveTab] = useState(0);

  const fetchAllData = () => {
    getNearbyPropertiesApi(
      {
        city: "",
        state: "",
        type: "",
        onSuccess: (res) => {
          setNearbyProperties(res.data)
        },
        onError: (err) => {
          console.log(err)
        }
      }
    )
  }


  useEffect(() => {
    fetchAllData()
  }, [])

  const handleLocationSelect = (address) => {
    // Update the form field with the selected address
    setSelectedLocationAddress(address);
    getNearbyPropertiesApi(
      {
        city: address.city,
        state: address.state,
        type: activeTab,
        onSuccess: (res) => {
          setNearbyProperties(res.data)
        },
        onError: (err) => {
          console.log(err)
        }
      }
    )

  };

  useEffect(() => {

  }, [nearbyProperties, activeTab])

  return (
    <Layout>
      <Breadcrumb />
      <section id='properties_on_map'>
        <PropertiesOnLocationMap apiKey={GoogleMapApi} onSelectLocation={handleLocationSelect} data={nearbyProperties} setActiveTab={setActiveTab} activeTab={activeTab} fetchAllData={fetchAllData} />
    
      </section>
    </Layout>
  )
}

export default PropertiesOnMap
