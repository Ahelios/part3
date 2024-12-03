import React from 'react'

function Notification({isError, message}) {
  if(!message){
    return null
  }

  const messageClassName = isError ? 'isError' : 'isNotError'

  return (
    <div className={messageClassName}>{message}</div>
  )
}

export default Notification