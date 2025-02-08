import React from 'react'
import { MdBorderColor } from 'react-icons/md'
import ClipLoader from 'react-spinners/ClipLoader'


const override = {
  display: "block",
  BorderColor: "purple",
  margin: "0 auto"

}
const Spinner = ({ loading }) => {
  return (
    <ClipLoader
      loading={loading}
      cssOverride={override}
      size={450}
      aria-label='Loading Spinner'
      data-testid='loader'
    />
  )
}

export default Spinner