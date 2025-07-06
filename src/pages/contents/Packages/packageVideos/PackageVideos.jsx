import React from 'react'
import { useSingleVideoPackage } from '../../../../api/api'
import { useParams } from 'react-router-dom'

function PackageVideos() {

  const {contentID} = useParams()
  const {singleVideoPackage, isLoading, isError, error, refetch } = useSingleVideoPackage(contentID)

  console.log("singleVideoPackage", singleVideoPackage);


  



  return (
    <div>PackageVideos</div>
  )
}

export default PackageVideos