import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { Icon, Header } from 'semantic-ui-react'

const  DropzoneInput =({setFiles}) => {
  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles.map(file => Object.assign(file,{ //though only one file gets passed, its stored in array. Target object is file it self. Preview property is added to file
        preview : URL.createObjectURL(file)             //creates an object in local memory and exists until revoked manually (which is done in PhotoPage)
    })))
  }, [setFiles])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
      onDrop,
    multiple:false,
    accept:'image/*'
    })

  return (
    <div {...getRootProps()} className={'dropzone ' + (isDragActive && 'dropzone--isActive')}>
      <input {...getInputProps()} />
      <Icon name='upload' size='huge'  />
      <Header content="Drop image here" />
    </div>
  )
}

export default DropzoneInput