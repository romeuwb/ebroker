import { AppBar, IconButton, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { settingsData } from '@/store/reducer/settingsSlice';
import { translate } from '@/utils';

const AdminFooter = () => {

const systemsettings =  useSelector(settingsData)   

const currentYear = new Date().getFullYear();
  return (
    <>
           <div className="admindash_footer">
            <span>
            {translate("Copyright")} {currentYear} {systemsettings?.company_name} {translate("All Rights Reserved")}
            </span>
           </div>
    </>
  )
}

export default AdminFooter
